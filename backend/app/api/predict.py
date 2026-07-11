"""
HashPilot AI Prediction API

Provides:
  POST /predict/   — get the ML model's strategy recommendation
  POST /predict/retrain — retrain the Random Forest on stored DB samples
"""

import psutil
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.logger import logger
from app.ml.predictor import StrategyPredictor

router = APIRouter(
    prefix="/predict",
    tags=["Predict"],
)


class PredictRequest(BaseModel):
    difficulty: int
    threads: int
    processes: int


# Lazy-initialise the predictor once at startup.
try:
    predictor = StrategyPredictor()
    logger.info("ML Predictor loaded successfully.")
except Exception as exc:
    logger.warning("ML Predictor failed to load: %s", exc)
    predictor = None


@router.post("/")
def predict_strategy(request: PredictRequest):
    """
    Return the ML model's recommended strategy and confidence score.

    Response includes:
      - recommended_strategy: strategy name
      - confidence: 0–100 float
      - model_accuracy: reported training accuracy of the loaded model
    """
    if not predictor:
        logger.warning("Prediction requested but model is not loaded.")
        return {
            "recommended_strategy": "Model not loaded",
            "confidence": 0.0,
            "model_accuracy": 0.0,
        }

    try:
        cpu_cores = psutil.cpu_count(logical=False)
        logical_threads = psutil.cpu_count(logical=True)
        ram_gb = round(psutil.virtual_memory().total / (1024**3), 2)

        prediction = predictor.predict(
            cpu_cores=cpu_cores,
            logical_threads=logical_threads,
            ram_gb=ram_gb,
            difficulty=request.difficulty,
            threads=request.threads,
            processes=request.processes,
        )

        logger.info(
            "Prediction: %s (confidence=%.1f%%)",
            prediction.get("recommended_strategy"),
            prediction.get("confidence", 0),
        )
        return prediction

    except Exception as exc:
        logger.error("Prediction failed: %s", exc)
        return {
            "recommended_strategy": "Error",
            "confidence": 0.0,
            "model_accuracy": 0.0,
        }


@router.post("/retrain")
def retrain_model():
    """
    Retrain the Random Forest model on all samples stored in the database.

    Returns the new model accuracy so the frontend can display it.
    """
    try:
        from app.ml.train_model import retrain_from_db

        accuracy = retrain_from_db()

        # Reload the predictor with the newly trained model.
        global predictor
        predictor = StrategyPredictor()

        logger.info("Model retrained successfully. New accuracy: %.2f%%", accuracy * 100)
        return {
            "success": True,
            "accuracy": round(accuracy * 100, 2),
            "message": f"Model retrained successfully. Accuracy: {accuracy * 100:.1f}%",
        }

    except Exception as exc:
        logger.error("Retrain failed: %s", exc)
        raise HTTPException(status_code=500, detail=f"Retrain failed: {exc}")

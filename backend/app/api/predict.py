from fastapi import APIRouter
from pydantic import BaseModel
import psutil

from app.ml.predictor import StrategyPredictor

router = APIRouter(
    prefix="/predict",
    tags=["Predict"],
)

class PredictRequest(BaseModel):
    difficulty: int
    threads: int
    processes: int

try:
    predictor = StrategyPredictor()
except Exception as e:
    print(f"Warning: ML Predictor failed to load: {e}")
    predictor = None

@router.post("/")
def predict_strategy(request: PredictRequest):
    if not predictor:
        return {
            "recommended_strategy": "Model not loaded",
            "confidence": 0.0
        }

    try:
        cpu_cores = psutil.cpu_count(logical=False)
        logical_threads = psutil.cpu_count(logical=True)
        ram_gb = round(psutil.virtual_memory().total / (1024 ** 3), 2)

        return predictor.predict(
            cpu_cores=cpu_cores,
            logical_threads=logical_threads,
            ram_gb=ram_gb,
            difficulty=request.difficulty,
            threads=request.threads,
            processes=request.processes,
        )
    except Exception as e:
        print(f"Prediction failed: {e}")
        return {
            "recommended_strategy": "Error",
            "confidence": 0.0
        }

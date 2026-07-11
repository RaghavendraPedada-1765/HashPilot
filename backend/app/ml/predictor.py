"""
HashPilot Machine Learning Predictor

Loads the trained Random Forest model and label encoder from disk and
provides a single predict() method that the API layer calls.
"""

import os

import joblib
import numpy as np
import pandas as pd

# Resolve model paths relative to this file so the predictor works
# regardless of the working directory the server is started from.
_ML_DIR = os.path.dirname(__file__)
_MODEL_PATH = os.path.join(_ML_DIR, "strategy_model.pkl")
_ENCODER_PATH = os.path.join(_ML_DIR, "label_encoder.pkl")


class StrategyPredictor:
    """Wraps the trained Random Forest for single-sample inference."""

    def __init__(self) -> None:
        self.model = joblib.load(_MODEL_PATH)
        self.encoder = joblib.load(_ENCODER_PATH)

        # Compute and cache the OOB score if available, otherwise use NaN.
        self._model_accuracy: float = getattr(self.model, "oob_score_", float("nan"))

    @property
    def model_accuracy(self) -> float:
        """Cached OOB accuracy (0–100). Falls back to 0 if unavailable."""
        if np.isnan(self._model_accuracy):
            return 0.0
        return round(self._model_accuracy * 100, 2)

    def predict(
        self,
        cpu_cores: int,
        logical_threads: int,
        ram_gb: float,
        difficulty: int,
        threads: int,
        processes: int,
    ) -> dict:
        """
        Predict the best hash strategy for the given system / workload profile.

        Returns
        -------
        dict with keys:
          - recommended_strategy (str)
          - confidence (float, 0–100)
          - model_accuracy (float, 0–100)
        """
        features = pd.DataFrame(
            [
                {
                    "cpu_cores": cpu_cores,
                    "logical_threads": logical_threads,
                    "ram_gb": ram_gb,
                    "difficulty": difficulty,
                    "threads": threads,
                    "processes": processes,
                }
            ]
        )

        prediction = self.model.predict(features)[0]
        probabilities = self.model.predict_proba(features)[0]
        confidence = float(probabilities.max() * 100)
        strategy = self.encoder.inverse_transform([prediction])[0]

        return {
            "recommended_strategy": strategy,
            "confidence": round(confidence, 2),
            "model_accuracy": self.model_accuracy,
        }
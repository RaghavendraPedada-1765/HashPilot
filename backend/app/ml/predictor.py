"""
HashPilot Machine Learning Predictor

Loads the trained Random Forest model and label encoder from disk and
provides a single predict() method that the API layer calls.

Model file load priority:
  1. %APPDATA%\\HashPilot\\ml\\  — retrained models saved by the user
  2. Bundled seed models shipped with the installer (read-only fallback)
"""

import os

import joblib
import numpy as np
import pandas as pd

from app.ml.paths import (
    get_bundled_encoder_path,
    get_bundled_model_path,
    get_encoder_path,
    get_model_path,
)


def _load_artifact(primary: str, fallback: str):
    """Load a joblib artifact from *primary*; fall back to *fallback*."""
    if os.path.exists(primary):
        return joblib.load(primary)
    if os.path.exists(fallback):
        return joblib.load(fallback)
    raise FileNotFoundError(
        f"ML model not found at '{primary}' or '{fallback}'. "
        "Run a benchmark first, then click 'Retrain AI Model'."
    )


class StrategyPredictor:
    """Wraps the trained Random Forest for single-sample inference."""

    def __init__(self) -> None:
        self.model = _load_artifact(get_model_path(), get_bundled_model_path())
        self.encoder = _load_artifact(get_encoder_path(), get_bundled_encoder_path())

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

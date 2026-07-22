"""
HashPilot Machine Learning Model Trainer

Trains (or retrains) the Random Forest classifier from samples stored in the
database. Exposes two entry points:
  - train()           — called from the command line
  - retrain_from_db() — called from the /predict/retrain API endpoint

The trained artefacts are saved to app/ml/ so the StrategyPredictor can
pick them up immediately.
"""

import os

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from app.core.logger import logger
from app.database.db import SessionLocal
from app.ml.paths import get_encoder_path, get_model_path
from app.models.ml_training_model import MLTrainingData

# Resolve writable model paths via the central path resolver.
# In desktop (PyInstaller) mode these point to %APPDATA%\HashPilot\ml\.
# In dev/server mode they point to the source app/ml/ directory.
MODEL_PATH = get_model_path()
ENCODER_PATH = get_encoder_path()


# Minimum number of DB rows required before training is attempted.
_MIN_SAMPLES = 10


def load_dataset() -> pd.DataFrame:
    """Load all ML training samples from the database."""
    db = SessionLocal()
    try:
        rows = db.query(MLTrainingData).all()
        data = [
            {
                "cpu_cores": row.cpu_cores,
                "logical_threads": row.logical_threads,
                "ram_gb": row.ram_gb,
                "difficulty": row.difficulty,
                "threads": row.threads,
                "processes": row.processes,
                "winner_strategy": row.winner_strategy,
            }
            for row in rows
        ]
        return pd.DataFrame(data)
    finally:
        db.close()


def _fit_and_save(df: pd.DataFrame) -> float:
    """
    Train a Random Forest on *df* and persist the model artefacts.

    Returns
    -------
    float
        Test-set accuracy (0.0–1.0).
    """
    feature_cols = [
        "cpu_cores",
        "logical_threads",
        "ram_gb",
        "difficulty",
        "threads",
        "processes",
    ]
    X = df[feature_cols]
    y = df["winner_strategy"]

    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    accuracy = accuracy_score(y_test, model.predict(X_test))

    joblib.dump(model, MODEL_PATH)
    joblib.dump(encoder, ENCODER_PATH)

    logger.info("Model saved → %s (accuracy=%.2f%%)", MODEL_PATH, accuracy * 100)
    return accuracy


def train() -> None:
    """CLI entry point: load data from DB and train the model."""
    logger.info("Loading dataset from database…")
    df = load_dataset()

    if len(df) < _MIN_SAMPLES:
        logger.warning(
            "Not enough training samples (%d < %d). Run more benchmarks first.",
            len(df),
            _MIN_SAMPLES,
        )
        return

    logger.info("Training on %d samples…", len(df))
    accuracy = _fit_and_save(df)
    logger.info("Training complete. Accuracy: %.2f%%", accuracy * 100)


def retrain_from_db() -> float:
    """
    API entry point: retrain from all stored DB samples and return accuracy.

    Raises
    ------
    ValueError
        If there are not enough samples to train.
    """
    df = load_dataset()

    if len(df) < _MIN_SAMPLES:
        raise ValueError(
            f"Not enough training samples ({len(df)} < {_MIN_SAMPLES}). "
            "Run more benchmarks to collect data."
        )

    logger.info("Retraining on %d samples…", len(df))
    return _fit_and_save(df)


if __name__ == "__main__":
    train()

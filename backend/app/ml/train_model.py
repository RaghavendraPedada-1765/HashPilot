"""
HashPilot

Machine Learning Model Trainer
"""

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from app.database.db import SessionLocal
from app.models.ml_training_model import MLTrainingData


def load_dataset():

    db = SessionLocal()

    try:

        rows = db.query(MLTrainingData).all()

        data = []

        for row in rows:

            data.append({

                "cpu_cores": row.cpu_cores,

                "logical_threads": row.logical_threads,

                "ram_gb": row.ram_gb,

                "difficulty": row.difficulty,

                "threads": row.threads,

                "processes": row.processes,

                "winner_strategy": row.winner_strategy,

            })

        return pd.DataFrame(data)

    finally:

        db.close()


def train():

    print("Loading dataset...")

    df = load_dataset()

    if len(df) < 20:

        print("Not enough training data.")

        return

    X = df[[
        "cpu_cores",
        "logical_threads",
        "ram_gb",
        "difficulty",
        "threads",
        "processes",
    ]]

    y = df["winner_strategy"]

    encoder = LabelEncoder()

    y = encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(

        X,

        y,

        test_size=0.2,

        random_state=42,

    )

    model = RandomForestClassifier(

        n_estimators=200,

        random_state=42,

    )

    print("Training...")

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(

        y_test,

        predictions,

    )

    print(f"\nAccuracy: {accuracy * 100:.2f}%")

    joblib.dump(

        model,

        "app/ml/strategy_model.pkl",

    )

    joblib.dump(

        encoder,

        "app/ml/label_encoder.pkl",

    )

    print("\nModel saved successfully.")


if __name__ == "__main__":

    train()
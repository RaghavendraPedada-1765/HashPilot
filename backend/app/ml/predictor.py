"""
HashPilot

Machine Learning Predictor
"""

import joblib
import numpy as np


class StrategyPredictor:

    def __init__(self):

        self.model = joblib.load("app/ml/strategy_model.pkl")

        self.encoder = joblib.load("app/ml/label_encoder.pkl")

    def predict(

        self,

        cpu_cores,

        logical_threads,

        ram_gb,

        difficulty,

        threads,

        processes,

    ):

        import pandas as pd

        features = pd.DataFrame([{
            "cpu_cores": cpu_cores,
            "logical_threads": logical_threads,
            "ram_gb": ram_gb,
            "difficulty": difficulty,
            "threads": threads,
            "processes": processes,
        }])

        prediction = self.model.predict(features)[0]

        probabilities = self.model.predict_proba(features)[0]

        confidence = float(probabilities.max() * 100)
        
        strategy = self.encoder.inverse_transform([prediction])[0]

        return {

            "recommended_strategy": strategy,

            "confidence": round(confidence, 2),

        }
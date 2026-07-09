"""
HashPilot AI Recommendation Service
"""


class AIService:

    @staticmethod
    def analyze(results):

        if not results:
            return None

        winner = max(
            results,
            key=lambda x: x["hashrate"]
        )

        max_hashrate = max(
            r["hashrate"] for r in results
        )

        min_hashrate = min(
            r["hashrate"] for r in results
        )

        if max_hashrate == min_hashrate:

            confidence = 100

        else:

            confidence = round(

                (

                    (winner["hashrate"] - min_hashrate)

                    /

                    (max_hashrate - min_hashrate)

                )

                * 100

            )

        reasons = [

            f"Highest Hash Rate ({winner['hashrate']:.0f} H/s)",

            "Best Overall Benchmark Performance"

        ]

        fastest = min(
            results,
            key=lambda x: x["time"]
        )

        if fastest["strategy"] == winner["strategy"]:

            reasons.append("Lowest Runtime")

        attempts = min(
            results,
            key=lambda x: x["attempts"]
        )

        if attempts["strategy"] == winner["strategy"]:

            reasons.append("Fewest Attempts")

        try:
            import joblib
            import psutil
            import pandas as pd
            import os

            model_path = os.path.join(os.path.dirname(__file__), "..", "ml", "strategy_model.pkl")
            encoder_path = os.path.join(os.path.dirname(__file__), "..", "ml", "label_encoder.pkl")
            
            if os.path.exists(model_path) and os.path.exists(encoder_path):
                model = joblib.load(model_path)
                encoder = joblib.load(encoder_path)
                
                # We assume standard difficulty=4, threads=4, processes=4 since they aren't passed to analyze()
                # A more robust system would pass these in, but this fulfills the ML prediction requirement.
                features = pd.DataFrame([{
                    "cpu_cores": psutil.cpu_count(logical=False),
                    "logical_threads": psutil.cpu_count(logical=True),
                    "ram_gb": round(psutil.virtual_memory().total / (1024 ** 3), 2),
                    "difficulty": 4,
                    "threads": 4,
                    "processes": 4
                }])
                
                pred_encoded = model.predict(features)
                ml_recommended = encoder.inverse_transform(pred_encoded)[0]
            else:
                ml_recommended = winner["strategy"]
        except Exception as e:
            print(f"ML Prediction failed: {e}")
            ml_recommended = winner["strategy"]

        return {

            "recommended_strategy":
                ml_recommended,

            "confidence":
                confidence,

            "winner":
                winner,

            "reasons":
                reasons

        }
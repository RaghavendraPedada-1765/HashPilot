"""
HashPilot AI Recommendation Service

Analyses raw benchmark results and produces a human-readable recommendation
with confidence score, winner breakdown, and supporting reasons.

The optional ML model is loaded lazily — if it is not available, the service
falls back to a rule-based recommendation (best hashrate wins).
"""

import os

from app.core.logger import logger


class AIService:

    @staticmethod
    def analyze(
        results: list,
        difficulty: int = 4,
        threads: int = 4,
        processes: int = 4,
    ) -> dict | None:
        """
        Analyse *results* and return a recommendation dict.

        Parameters
        ----------
        results:
            List of dicts produced by the benchmark engine
            (strategy, hashrate, attempts, time, nonce).
        difficulty / threads / processes:
            The benchmark parameters used for this run — forwarded to the
            ML model so that predictions reflect the actual workload.
        """
        if not results:
            return None

        winner = max(results, key=lambda x: x["hashrate"])
        max_hashrate = max(r["hashrate"] for r in results)
        min_hashrate = min(r["hashrate"] for r in results)

        if max_hashrate == min_hashrate:
            confidence = 100
        else:
            confidence = round(
                (winner["hashrate"] - min_hashrate) / (max_hashrate - min_hashrate) * 100
            )

        reasons = [
            f"Highest Hash Rate ({winner['hashrate']:.0f} H/s)",
            "Best Overall Benchmark Performance",
        ]

        fastest = min(results, key=lambda x: x["time"])
        if fastest["strategy"] == winner["strategy"]:
            reasons.append("Lowest Runtime")

        fewest_attempts = min(results, key=lambda x: x["attempts"])
        if fewest_attempts["strategy"] == winner["strategy"]:
            reasons.append("Fewest Attempts")

        # -------------------------------------------------------------------
        # Optional ML override — use the stored Random Forest model if available.
        # Falls back to rule-based winner if the model cannot be loaded.
        # -------------------------------------------------------------------
        ml_recommended = winner["strategy"]
        try:
            import joblib
            import pandas as pd
            import psutil

            from app.ml.paths import (
                get_bundled_encoder_path,
                get_bundled_model_path,
                get_encoder_path,
                get_model_path,
            )

            # Prefer the user-retrained model in AppData; fall back to bundle
            model_path = get_model_path() if os.path.exists(get_model_path()) else get_bundled_model_path()
            encoder_path = get_encoder_path() if os.path.exists(get_encoder_path()) else get_bundled_encoder_path()

            if os.path.exists(model_path) and os.path.exists(encoder_path):
                model = joblib.load(model_path)
                encoder = joblib.load(encoder_path)

                features = pd.DataFrame(
                    [
                        {
                            "cpu_cores": psutil.cpu_count(logical=False),
                            "logical_threads": psutil.cpu_count(logical=True),
                            "ram_gb": round(psutil.virtual_memory().total / (1024**3), 2),
                            "difficulty": difficulty,
                            "threads": threads,
                            "processes": processes,
                        }
                    ]
                )

                pred_encoded = model.predict(features)
                ml_recommended = encoder.inverse_transform(pred_encoded)[0]
                logger.info("ML recommendation: %s", ml_recommended)
            else:
                logger.warning("ML model not found — using rule-based recommendation.")
        except Exception as exc:
            logger.warning("ML prediction failed (%s) — using rule-based fallback.", exc)

        return {
            "recommended_strategy": ml_recommended,
            "confidence": confidence,
            "winner": winner,
            "reasons": reasons,
        }

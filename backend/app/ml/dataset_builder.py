"""
HashPilot

Dataset Builder

Creates a machine learning dataset
from benchmark history.
"""

import pandas as pd

from app.database.db import SessionLocal
from app.models.ml_training_model import MLTrainingData


class DatasetBuilder:

    @staticmethod
    def build_dataset():

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

                    "strategy": row.winner_strategy,

                })

            return pd.DataFrame(data)

        finally:

            db.close()
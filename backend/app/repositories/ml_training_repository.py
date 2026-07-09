"""
HashPilot

Machine Learning Training Repository
"""

from sqlalchemy.orm import Session

from app.models.ml_training_model import MLTrainingData


class MLTrainingRepository:

    def save_training_sample(
        self,
        db: Session,
        cpu_cores: int,
        logical_threads: int,
        ram_gb: float,
        difficulty: int,
        threads: int,
        processes: int,
        winner_strategy: str,
    ):

        sample = MLTrainingData(

            cpu_cores=cpu_cores,

            logical_threads=logical_threads,

            ram_gb=ram_gb,

            difficulty=difficulty,

            threads=threads,

            processes=processes,

            winner_strategy=winner_strategy,

        )

        db.add(sample)

        db.commit()
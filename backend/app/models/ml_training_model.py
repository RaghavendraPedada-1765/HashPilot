"""
HashPilot

Machine Learning Training Dataset Model
"""

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Float
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.sql import func

from app.database.db import Base


class MLTrainingData(Base):

    __tablename__ = "ml_training_data"

    id = Column(Integer, primary_key=True, index=True)

    cpu_cores = Column(Integer, nullable=False)

    logical_threads = Column(Integer, nullable=False)

    ram_gb = Column(Float, nullable=False)

    difficulty = Column(Integer, nullable=False)

    threads = Column(Integer, nullable=False)

    processes = Column(Integer, nullable=False)

    winner_strategy = Column(String, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
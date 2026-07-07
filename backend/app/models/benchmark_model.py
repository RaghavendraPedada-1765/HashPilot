"""
HashPilot Benchmark Database Model
"""

from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import Float
from sqlalchemy import Integer
from sqlalchemy import String

from app.database.db import Base


class Benchmark(Base):

    __tablename__ = "benchmarks"

    id = Column(Integer, primary_key=True, index=True)

    strategy = Column(String, nullable=False)

    difficulty = Column(Integer, nullable=False)

    attempts = Column(Integer, nullable=False)

    hashrate = Column(Float, nullable=False)

    runtime = Column(Float, nullable=False)

    winner = Column(Boolean, default=False)
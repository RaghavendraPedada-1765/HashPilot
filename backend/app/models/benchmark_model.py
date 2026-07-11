"""
HashPilot Benchmark Database Model
"""

from sqlalchemy import Boolean, Column, Float, Integer, String

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

    # ---------- ML Features ----------

    cpu_cores = Column(Integer)

    logical_threads = Column(Integer)

    ram_gb = Column(Float)

    os = Column(String)

    user_threads = Column(Integer)

    user_processes = Column(Integer)

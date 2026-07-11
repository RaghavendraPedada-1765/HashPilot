"""
HashPilot Database Configuration
"""

import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = Path(__file__).resolve().parent.parent.parent

default_db = BASE_DIR / "hashpilot.db"

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{default_db}"
)

if DATABASE_URL.startswith("sqlite:///"):

    db_path = DATABASE_URL.replace("sqlite:///", "")

    os.makedirs(os.path.dirname(db_path), exist_ok=True)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
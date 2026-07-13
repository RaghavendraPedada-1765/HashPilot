"""
HashPilot Database Configuration

Supports SQLite (default for development / Render free tier) and PostgreSQL.
The DATABASE_URL environment variable selects the backend:
  - SQLite:     sqlite:///./hashpilot.db  (default)
  - PostgreSQL: postgresql+psycopg2://user:pass@host/dbname
"""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hashpilot.db")

# SQLite needs check_same_thread=False so that FastAPI's threadpool can reuse
# the same connection across threads.  Other databases don't need this flag.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency that yields a DB session and ensures it is always closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

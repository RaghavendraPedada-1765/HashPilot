"""
HashPilot Database Configuration

Supports SQLite (default for development / Render free tier) and PostgreSQL.
The DATABASE_URL environment variable selects the backend:
  - SQLite:     sqlite:///./hashpilot.db  (default)
  - PostgreSQL: postgresql+psycopg2://user:pass@host/dbname

Desktop mode (PyInstaller):
  When running as a bundled .exe the database is stored in the user's
  %APPDATA%\\HashPilot directory so it persists across application updates.
"""

import os
import sys

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


def _resolve_database_url() -> str:
    """Return the effective DATABASE_URL for the current runtime context."""
    env_url = os.getenv("DATABASE_URL", "")

    # Desktop / PyInstaller bundle — always use SQLite in AppData
    if getattr(sys, "frozen", False) and not env_url:
        app_data = os.environ.get("APPDATA") or os.path.expanduser("~")
        data_dir = os.path.join(app_data, "HashPilot")
        os.makedirs(data_dir, exist_ok=True)
        db_path = os.path.join(data_dir, "hashpilot.db")
        return f"sqlite:///{db_path}"

    # Normal server / dev mode
    url = env_url or "sqlite:///./hashpilot.db"

    # Render / Heroku provide `postgres://` but SQLAlchemy 2.x requires
    # `postgresql://`.  Fix the scheme transparently.
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    return url


DATABASE_URL = _resolve_database_url()

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


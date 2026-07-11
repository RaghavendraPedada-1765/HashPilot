"""
HashPilot FastAPI Application Entry Point

Configuration is read from environment variables (see .env.example).
CORS origins default to localhost in development and can be overridden
via ALLOWED_ORIGINS for staging/production deployments.
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analytics import router as analytics_router
from app.api.benchmark import router as benchmark_router
from app.api.history import router as history_router
from app.api.predict import router as predict_router
from app.api.report import router as report_router
from app.api.system import router as system_router
from app.api.websocket import router as websocket_router
from app.core.logger import logger
from app.database.db import Base, engine
from app.models import benchmark_model  # noqa: F401 – registers ORM model
from app.models import ml_training_model  # noqa: F401 – registers ORM model

# ---------------------------------------------------------------------------
# Database bootstrap
# ---------------------------------------------------------------------------
Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown logging)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("HashPilot API starting up…")
    yield
    logger.info("HashPilot API shutting down.")


# ---------------------------------------------------------------------------
# Application factory
# ---------------------------------------------------------------------------
app = FastAPI(
    title="HashPilot API",
    version="1.0.0",
    description=(
        "AI-Powered Computational Benchmarking Platform. "
        "Compare hash strategies, analyse performance, and get intelligent recommendations."
    ),
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# Read ALLOWED_ORIGINS from env so the same image works in dev and prod.
# Format: comma-separated list of origins, e.g.
#   ALLOWED_ORIGINS=http://localhost:5173,https://hashpilot.vercel.app
# ---------------------------------------------------------------------------
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("CORS allowed origins: %s", _allowed_origins)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(benchmark_router)
app.include_router(history_router)
app.include_router(analytics_router)
app.include_router(websocket_router)
app.include_router(system_router)
app.include_router(report_router)
app.include_router(predict_router)


@app.get("/", tags=["Health"])
def root():
    """Health check endpoint."""
    return {
        "project": "HashPilot",
        "status": "running",
        "version": "1.0.0",
    }

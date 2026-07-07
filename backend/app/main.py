from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analytics import router as analytics_router
from app.api.benchmark import router as benchmark_router
from app.api.history import router as history_router

from app.database.db import Base
from app.database.db import engine

import app.models.benchmark_model

Base.metadata.create_all(bind=engine)

app = FastAPI(

    title="HashPilot API",

    version="0.6.0",

    description="AI Powered Computational Benchmark Platform"

)

app.add_middleware(

    CORSMiddleware,

    allow_origins=["http://localhost:5173"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)

app.include_router(benchmark_router)
app.include_router(history_router)
app.include_router(analytics_router)


@app.get("/")
def root():

    return {

        "project": "HashPilot",

        "status": "running",

        "version": "0.6.0",

    }
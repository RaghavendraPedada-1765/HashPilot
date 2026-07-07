from fastapi import FastAPI

from app.api.benchmark import router as benchmark_router

app = FastAPI(
    title="HashPilot API",
    version="0.3.0",
    description="AI-Powered Computational Puzzle & Benchmarking Platform",
)

app.include_router(benchmark_router)


@app.get("/")
def root():
    return {
        "project": "HashPilot",
        "status": "running",
        "version": "0.3.0",
    }
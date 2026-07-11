"""
HashPilot Benchmark API

Runs all four hash strategies sequentially and returns results + AI analysis.
"""

from fastapi import APIRouter

from app.core.logger import logger
from app.services.benchmark_service import BenchmarkService
from app.services.ai_service import AIService

router = APIRouter(
    prefix="/benchmark",
    tags=["Benchmark"],
)

service = BenchmarkService()


@router.get("/")
def run_benchmark(
    difficulty: int = 4,
    threads: int = 4,
    processes: int = 4,
):
    """
    Run a full benchmark across all four strategies and return:
      - results: per-strategy telemetry
      - analysis: AI recommendation with confidence and reasons
    """
    logger.info(
        "Benchmark requested | difficulty=%d threads=%d processes=%d",
        difficulty, threads, processes,
    )

    results = service.run(
        difficulty=difficulty,
        threads=threads,
        processes=processes,
    )

    # Forward the actual benchmark params to AIService so the ML prediction
    # uses the real workload configuration rather than hardcoded defaults.
    analysis = AIService.analyze(
        results,
        difficulty=difficulty,
        threads=threads,
        processes=processes,
    )

    return {
        "results": results,
        "analysis": analysis,
    }
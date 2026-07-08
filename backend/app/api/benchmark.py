"""
HashPilot Benchmark API
"""

from fastapi import APIRouter

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

    results = service.run(

        difficulty=difficulty,

        threads=threads,

        processes=processes,

    )

    analysis = AIService.analyze(results)

    return {

        "results": results,

        "analysis": analysis,

    }
"""
HashPilot Benchmark API
"""

from fastapi import APIRouter

from app.services.benchmark_service import BenchmarkService

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

    return service.run(
        difficulty=difficulty,
        threads=threads,
        processes=processes,
    )
"""
HashPilot Benchmark API
"""

from fastapi import APIRouter

from app.core.config import Config

from app.engine.pow_puzzle import ProofOfWorkPuzzle
from app.engine.benchmark import BenchmarkEngine

from app.strategies.sequential import SequentialStrategy
from app.strategies.random_strategy import RandomStrategy
from app.strategies.multithread_strategy import MultiThreadStrategy
from app.strategies.multiprocess_strategy import MultiProcessStrategy

router = APIRouter(
    prefix="/benchmark",
    tags=["Benchmark"],
)


@router.get("/")
def run_benchmark():

    config = Config()

    puzzle = ProofOfWorkPuzzle(
        data=config.puzzle["data"],
        difficulty=config.puzzle["difficulty"],
    )

    benchmark = BenchmarkEngine(puzzle)

    benchmark.add_strategy(SequentialStrategy())
    benchmark.add_strategy(RandomStrategy())
    benchmark.add_strategy(
        MultiThreadStrategy(
            threads=config.benchmark["threads"]
        )
    )
    benchmark.add_strategy(
        MultiProcessStrategy(
            processes=config.benchmark["processes"]
        )
    )

    return benchmark.run()
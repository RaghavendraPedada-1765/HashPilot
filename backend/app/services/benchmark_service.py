"""
HashPilot Benchmark Service
"""

from app.core.logger import logger

from app.database.db import SessionLocal

from app.engine.benchmark import BenchmarkEngine
from app.engine.pow_puzzle import ProofOfWorkPuzzle

from app.repositories.benchmark_repository import BenchmarkRepository

from app.strategies.sequential import SequentialStrategy
from app.strategies.random_strategy import RandomStrategy
from app.strategies.multithread_strategy import MultiThreadStrategy
from app.strategies.multiprocess_strategy import MultiProcessStrategy


class BenchmarkService:

    def __init__(self):

        self.repository = BenchmarkRepository()

    def run(

        self,

        difficulty,

        threads,

        processes,

    ):

        logger.info("Benchmark started")

        puzzle = ProofOfWorkPuzzle(

            data="HashPilot",

            difficulty=difficulty,

        )

        engine = BenchmarkEngine(puzzle)

        engine.add_strategy(

            SequentialStrategy()

        )

        engine.add_strategy(

            RandomStrategy()

        )

        engine.add_strategy(

            MultiThreadStrategy(

                threads=threads

            )

        )

        engine.add_strategy(

            MultiProcessStrategy(

                processes=processes

            )

        )

        results = engine.run()

        logger.info("Benchmark finished")

        db = SessionLocal()

        try:

            self.repository.save_results(

                db,

                results,

                difficulty,

            )

            logger.info("Results saved to SQLite")

        finally:

            db.close()

        return results
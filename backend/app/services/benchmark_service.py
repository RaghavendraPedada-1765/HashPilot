"""
HashPilot Benchmark Service
"""

import asyncio

from app.core.logger import logger
from app.core.websocket_manager import manager

from app.core.progress_reporter import ProgressReporter

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
    def progress_callback(self, message):

        """
        Broadcast benchmark progress over WebSocket.
        """

        try:

            loop = asyncio.get_running_loop()

            loop.create_task(
                manager.broadcast(message)
            )

        except RuntimeError:

            # No running event loop
            asyncio.run(
                manager.broadcast(message)
            )

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

        reporter = ProgressReporter()
        reporter.add_callback(self.progress_callback)

        engine = BenchmarkEngine(

            puzzle,

            reporter=reporter,

        )

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
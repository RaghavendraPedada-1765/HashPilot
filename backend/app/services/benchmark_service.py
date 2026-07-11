"""
HashPilot Benchmark Service
"""

import asyncio

import psutil

from app.core.logger import logger
from app.core.progress_reporter import ProgressReporter
from app.core.websocket_manager import manager
from app.database.db import SessionLocal
from app.engine.benchmark import BenchmarkEngine
from app.engine.pow_puzzle import ProofOfWorkPuzzle
from app.repositories.benchmark_repository import BenchmarkRepository
from app.repositories.ml_training_repository import MLTrainingRepository
from app.strategies.multiprocess_strategy import MultiProcessStrategy
from app.strategies.multithread_strategy import MultiThreadStrategy
from app.strategies.random_strategy import RandomStrategy
from app.strategies.sequential import SequentialStrategy


class BenchmarkService:

    def __init__(self):

        self.repository = BenchmarkRepository()

        self.ml_repository = MLTrainingRepository()

    def progress_callback(self, message):
        """
        Broadcast benchmark progress over WebSocket.
        """
        if not manager.connections or manager.loop is None:
            return

        try:
            loop = asyncio.get_running_loop()
            if loop == manager.loop:
                loop.create_task(manager.broadcast(message))
            else:
                asyncio.run_coroutine_threadsafe(manager.broadcast(message), manager.loop)
        except RuntimeError:
            # No running event loop in this thread
            asyncio.run_coroutine_threadsafe(manager.broadcast(message), manager.loop)

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

        engine.add_strategy(SequentialStrategy())

        engine.add_strategy(RandomStrategy())

        engine.add_strategy(MultiThreadStrategy(threads=threads))

        engine.add_strategy(MultiProcessStrategy(processes=processes))

        results = engine.run()

        logger.info("Benchmark finished")

        db = SessionLocal()

        try:

            self.repository.save_results(
                db,
                results,
                difficulty,
            )
            winner = max(results, key=lambda r: r["hashrate"])

            memory = psutil.virtual_memory()

            self.ml_repository.save_training_sample(
                db=db,
                cpu_cores=psutil.cpu_count(logical=False),
                logical_threads=psutil.cpu_count(logical=True),
                ram_gb=round(memory.total / (1024**3), 2),
                difficulty=difficulty,
                threads=threads,
                processes=processes,
                winner_strategy=winner["strategy"],
            )

            logger.info("Results saved to SQLite")

        finally:

            db.close()

        return results

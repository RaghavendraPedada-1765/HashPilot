"""
HashPilot

Benchmark Engine
"""

from app.engine.solver import Solver


class BenchmarkEngine:

    def __init__(
        self,
        puzzle,
        reporter=None,
    ):
        self.puzzle = puzzle
        self.strategies = []
        self.reporter = reporter

    def add_strategy(self, strategy):
        self.strategies.append(strategy)

    def run(self):

        results = []

        total = len(self.strategies)

        for index, strategy in enumerate(self.strategies):

            #
            # Strategy Started
            #
            if self.reporter:

                self.reporter.emit(
                    {
                        "event": "strategy_started",
                        "strategy": strategy.__class__.__name__,
                        "current": index + 1,
                        "total": total,
                        "progress": int(index / total * 100),
                    }
                )

            solver = Solver(strategy)

            result = solver.solve(
                self.puzzle,
                progress_callback=self.reporter.emit if self.reporter else None,
            )

            result["strategy"] = strategy.__class__.__name__

            results.append(result)

            #
            # Strategy Completed
            #
            if self.reporter:

                self.reporter.emit(
                    {
                        "event": "strategy_completed",
                        "strategy": strategy.__class__.__name__,
                        "current": index + 1,
                        "total": total,
                        "progress": int((index + 1) / total * 100),
                        "result": result,
                    }
                )

        return results

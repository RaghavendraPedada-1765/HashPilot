"""
HashPilot

Benchmark Engine
"""

from app.engine.solver import Solver


class BenchmarkEngine:

    def __init__(self, puzzle):
        self.puzzle = puzzle
        self.strategies = []

    def add_strategy(self, strategy):
        self.strategies.append(strategy)

    def run(self):

        results = []

        for strategy in self.strategies:

            solver = Solver(strategy)

            result = solver.solve(self.puzzle)

            result["strategy"] = strategy.__class__.__name__

            results.append(result)

        return results
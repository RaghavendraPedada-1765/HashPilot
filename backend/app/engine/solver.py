"""
HashPilot

Puzzle Solver
"""

import time


class Solver:

    def __init__(self, strategy):
        self.strategy = strategy

    def solve(
        self,
        puzzle,
        progress_callback=None,
    ):

        start = time.perf_counter()

        nonce, hash_value, attempts = self.strategy.solve(
            puzzle,
            progress_callback=progress_callback,
        )

        end = time.perf_counter()

        elapsed = end - start

        return {
            "nonce": nonce,
            "hash": hash_value,
            "attempts": attempts,
            "time": elapsed,
            "hashrate": attempts / elapsed if elapsed > 0 else 0,
        }

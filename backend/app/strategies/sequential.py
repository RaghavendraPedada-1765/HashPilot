"""
HashPilot

Sequential Search Strategy

Author: Raghavendra Pedada
License: MIT
"""

import time

from app.strategies.base_strategy import Strategy
from app.utils.hashing import sha256


class SequentialStrategy(Strategy):
    """Sequential brute-force search strategy."""

    def solve(
        self,
        puzzle,
        progress_callback=None,
    ):

        nonce = 0
        attempts = 0

        start = time.perf_counter()

        while True:

            candidate = f"{puzzle.data}{nonce}"

            hash_value = sha256(candidate)

            attempts += 1

            # Send live update every 10,000 attempts
            if progress_callback and attempts % 10000 == 0:

                elapsed = time.perf_counter() - start

                hashrate = attempts / elapsed if elapsed > 0 else 0

                progress_callback(
                    {
                        "event": "progress",
                        "strategy": "SequentialStrategy",
                        "attempts": attempts,
                        "nonce": nonce,
                        "hashrate": round(hashrate, 2),
                        "elapsed": round(elapsed, 3),
                    }
                )

            if hash_value.startswith("0" * puzzle.difficulty()):

                return (
                    nonce,
                    hash_value,
                    attempts,
                )

            nonce += 1

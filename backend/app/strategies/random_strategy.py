"""
HashPilot

Random Search Strategy
"""

import random
import time

from app.utils.hashing import sha256
from app.strategies.base_strategy import Strategy


class RandomStrategy(Strategy):
    """
    Random brute-force search.
    """

    def solve(self, puzzle, progress_callback=None):

        attempts = 0
        visited = set()

        start = time.perf_counter()

        while True:

            nonce = random.randint(0, 10_000_000)

            if nonce in visited:
                continue

            visited.add(nonce)

            candidate = f"{puzzle.data}{nonce}"

            hash_value = sha256(candidate)

            attempts += 1

            if progress_callback and attempts % 10000 == 0:
                elapsed = time.perf_counter() - start
                hashrate = attempts / elapsed if elapsed > 0 else 0
                progress_callback({
                    "event": "progress",
                    "strategy": "RandomStrategy",
                    "attempts": attempts,
                    "nonce": nonce,
                    "hashrate": round(hashrate, 2),
                    "elapsed": round(elapsed, 3),
                })

            if hash_value.startswith("0" * puzzle.difficulty()):
                return nonce, hash_value, attempts
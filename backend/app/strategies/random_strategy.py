"""
HashPilot

Random Search Strategy
"""

import random

from app.utils.hashing import sha256
from app.strategies.base_strategy import Strategy


class RandomStrategy(Strategy):
    """
    Random brute-force search.
    """

    def solve(self, puzzle):

        attempts = 0
        visited = set()

        while True:

            nonce = random.randint(0, 10_000_000)

            if nonce in visited:
                continue

            visited.add(nonce)

            candidate = f"{puzzle.data}{nonce}"

            hash_value = sha256(candidate)

            attempts += 1

            if hash_value.startswith("0" * puzzle.difficulty()):
                return nonce, hash_value, attempts
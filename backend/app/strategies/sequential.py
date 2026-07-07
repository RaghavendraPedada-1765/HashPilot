"""
HashPilot

Sequential Search Strategy

Author: Raghavendra Pedada
License: MIT
"""

from app.utils.hashing import sha256
from app.strategies.base_strategy import Strategy


class SequentialStrategy(Strategy):
    """Sequential brute-force search strategy."""

    def solve(self, puzzle):
        nonce = 0
        attempts = 0

        while True:
            candidate = f"{puzzle.data}{nonce}"
            hash_value = sha256(candidate)

            attempts += 1

            if hash_value.startswith("0" * puzzle.difficulty()):
                return nonce, hash_value, attempts

            nonce += 1
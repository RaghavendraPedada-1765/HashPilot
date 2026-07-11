"""
HashPilot

Proof-of-Work Puzzle

Author: Raghavendra Pedada
License: MIT
"""

from app.engine.puzzle import Puzzle
from app.utils.hashing import sha256


class ProofOfWorkPuzzle(Puzzle):
    """
    Simple Proof-of-Work puzzle.
    """

    def __init__(self, data: str, difficulty: int = 4):
        self.data = data
        self._difficulty = difficulty

    def generate(self):
        return self.data

    def validate(self, nonce: int) -> bool:
        candidate = f"{self.data}{nonce}"
        hash_value = sha256(candidate)
        return hash_value.startswith("0" * self._difficulty)

    def difficulty(self) -> int:
        return self._difficulty

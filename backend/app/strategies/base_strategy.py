"""
HashPilot

Base Strategy Interface
"""

from abc import ABC, abstractmethod


class Strategy(ABC):
    """Abstract base class for all solving strategies."""

    @abstractmethod
    def solve(self, puzzle):
        """
        Solve the given puzzle.

        Returns:
            tuple: (nonce, hash_value, attempts)
        """
        pass
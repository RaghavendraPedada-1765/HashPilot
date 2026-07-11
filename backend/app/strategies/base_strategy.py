"""
HashPilot

Base Strategy Interface
"""

from abc import ABC, abstractmethod


class Strategy(ABC):
    """Abstract base class for all solving strategies."""

    @abstractmethod
    def solve(
        self,
        puzzle,
        progress_callback=None,
    ):
        """
        Solve the given puzzle.

        Args:
            puzzle: Proof-of-Work puzzle.
            progress_callback: Optional callback used to report
                live benchmark progress.

        Returns:
            tuple:
                (nonce, hash_value, attempts)
        """
        raise NotImplementedError

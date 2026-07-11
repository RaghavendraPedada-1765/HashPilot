"""
HashPilot

Abstract Puzzle Interface

Author: Raghavendra Pedada
License: MIT
"""

from abc import ABC, abstractmethod


class Puzzle(ABC):
    """Base class for all computational puzzles."""

    @abstractmethod
    def generate(self):
        """Generate puzzle data."""
        raise NotImplementedError

    @abstractmethod
    def validate(self, solution) -> bool:
        """Validate a proposed solution."""
        raise NotImplementedError

    @abstractmethod
    def difficulty(self) -> int:
        """Return puzzle difficulty."""
        raise NotImplementedError

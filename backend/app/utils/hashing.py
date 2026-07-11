"""
HashPilot

Hashing Utilities

Author: Raghavendra Pedada
License: MIT
"""

import hashlib


def sha256(data: str) -> str:
    """
    Compute the SHA-256 hash of a string.
    """
    return hashlib.sha256(data.encode("utf-8")).hexdigest()

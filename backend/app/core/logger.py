"""
HashPilot Logger

Centralised logging configuration. Log level is read from the LOG_LEVEL
environment variable (default: INFO). Logs are written to stdout so that
container orchestrators (Docker, Railway, Render) can capture them.
"""

import logging
import os

_level_name: str = os.getenv("LOG_LEVEL", "INFO").upper()
_level: int = getattr(logging, _level_name, logging.INFO)

logging.basicConfig(
    level=_level,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger("hashpilot")

"""
HashPilot ML Path Resolver
--------------------------
Centralises the logic for finding ML model files so both predictor.py and
train_model.py use the same writable location.

Priority:
  1. %APPDATA%\\HashPilot\\ml\\  — always used for SAVING (writable)
  2. <bundle>/_internal/app/ml/ — used for LOADING if AppData copy absent
                                  (bundled seed models shipped with the installer)
"""

import os
import sys


def get_ml_dir() -> str:
    """
    Return the directory where ML model files should be read/written.

    In desktop (PyInstaller) mode this is the user-writable AppData folder so
    that the installer's read-only bundle directory is never written to.
    In dev/server mode it falls back to the source app/ml/ directory.
    """
    if getattr(sys, "frozen", False):
        # Desktop build — always use AppData so we can write
        app_data = os.environ.get("APPDATA") or os.path.expanduser("~")
        ml_dir = os.path.join(app_data, "HashPilot", "ml")
        os.makedirs(ml_dir, exist_ok=True)
        return ml_dir

    # Dev / server mode — use the source tree directory
    return os.path.dirname(__file__)


def get_model_path() -> str:
    return os.path.join(get_ml_dir(), "strategy_model.pkl")


def get_encoder_path() -> str:
    return os.path.join(get_ml_dir(), "label_encoder.pkl")


def get_bundled_model_path() -> str:
    """
    Return the path to the *read-only* bundled model that ships with the
    installer.  Used as a fallback when the writable AppData copy doesn't
    exist yet.
    """
    return os.path.join(os.path.dirname(__file__), "strategy_model.pkl")


def get_bundled_encoder_path() -> str:
    return os.path.join(os.path.dirname(__file__), "label_encoder.pkl")

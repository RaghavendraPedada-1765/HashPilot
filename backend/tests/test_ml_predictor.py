"""
Tests for the ML Predictor.

Uses the pre-trained model artefacts in app/ml/.
Skips gracefully if the model files are not present.
"""

import pytest

# Skip entire module if model files are missing.
try:
    from app.ml.predictor import StrategyPredictor
    predictor = StrategyPredictor()
    MODEL_AVAILABLE = True
except Exception:
    MODEL_AVAILABLE = False

pytestmark = pytest.mark.skipif(
    not MODEL_AVAILABLE,
    reason="ML model artefacts not found — run train_model.py first",
)


VALID_STRATEGIES = {
    "SequentialStrategy",
    "RandomStrategy",
    "MultiThreadStrategy",
    "MultiProcessStrategy",
}

SAMPLE_INPUT = {
    "cpu_cores": 4,
    "logical_threads": 8,
    "ram_gb": 16.0,
    "difficulty": 4,
    "threads": 4,
    "processes": 4,
}


def test_predictor_returns_dict():
    result = predictor.predict(**SAMPLE_INPUT)
    assert isinstance(result, dict)


def test_predictor_returns_valid_strategy():
    result = predictor.predict(**SAMPLE_INPUT)
    assert result["recommended_strategy"] in VALID_STRATEGIES


def test_predictor_confidence_in_range():
    result = predictor.predict(**SAMPLE_INPUT)
    assert 0.0 <= result["confidence"] <= 100.0


def test_predictor_model_accuracy_field():
    result = predictor.predict(**SAMPLE_INPUT)
    assert "model_accuracy" in result
    assert isinstance(result["model_accuracy"], float)


def test_predictor_different_difficulties():
    """Higher difficulty should not crash the predictor."""
    for diff in [1, 3, 5, 7]:
        result = predictor.predict(
            cpu_cores=4, logical_threads=8, ram_gb=16.0,
            difficulty=diff, threads=4, processes=4,
        )
        assert result["recommended_strategy"] in VALID_STRATEGIES

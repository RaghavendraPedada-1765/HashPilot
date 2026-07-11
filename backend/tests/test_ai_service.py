"""
Tests for the AI recommendation service.

Verifies that AIService.analyze() returns correct structure and values
without requiring a real ML model to be present.
"""

import pytest

from app.services.ai_service import AIService

MOCK_RESULTS = [
    {
        "strategy": "SequentialStrategy",
        "hashrate": 1000,
        "attempts": 500,
        "time": 2.0,
        "nonce": 123,
    },
    {"strategy": "RandomStrategy", "hashrate": 800, "attempts": 700, "time": 3.5, "nonce": 456},
    {
        "strategy": "MultiThreadStrategy",
        "hashrate": 3000,
        "attempts": 200,
        "time": 1.0,
        "nonce": 789,
    },
    {
        "strategy": "MultiProcessStrategy",
        "hashrate": 2500,
        "attempts": 250,
        "time": 1.2,
        "nonce": 101,
    },
]


def test_analyze_returns_dict():
    result = AIService.analyze(MOCK_RESULTS, difficulty=4, threads=4, processes=4)
    assert isinstance(result, dict)


def test_analyze_has_required_keys():
    result = AIService.analyze(MOCK_RESULTS, difficulty=4, threads=4, processes=4)
    assert "recommended_strategy" in result
    assert "confidence" in result
    assert "winner" in result
    assert "reasons" in result


def test_analyze_winner_has_highest_hashrate():
    result = AIService.analyze(MOCK_RESULTS, difficulty=4, threads=4, processes=4)
    # The winner in the result dict should be the row with hashrate=3000
    winner = result["winner"]
    assert winner["strategy"] == "MultiThreadStrategy"
    assert winner["hashrate"] == 3000


def test_analyze_confidence_in_range():
    result = AIService.analyze(MOCK_RESULTS, difficulty=4, threads=4, processes=4)
    confidence = result["confidence"]
    assert 0 <= confidence <= 100


def test_analyze_returns_none_for_empty_results():
    result = AIService.analyze([], difficulty=4, threads=4, processes=4)
    assert result is None


def test_analyze_reasons_is_list():
    result = AIService.analyze(MOCK_RESULTS, difficulty=4, threads=4, processes=4)
    assert isinstance(result["reasons"], list)
    assert len(result["reasons"]) >= 1


def test_analyze_equal_hashrates_gives_100_confidence():
    equal_results = [
        {
            "strategy": "SequentialStrategy",
            "hashrate": 500,
            "attempts": 100,
            "time": 1.0,
            "nonce": 1,
        },
        {"strategy": "RandomStrategy", "hashrate": 500, "attempts": 100, "time": 1.0, "nonce": 2},
    ]
    result = AIService.analyze(equal_results, difficulty=4, threads=4, processes=4)
    assert result["confidence"] == 100

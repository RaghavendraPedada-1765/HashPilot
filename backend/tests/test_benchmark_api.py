"""
Tests for the core API endpoints.

Runs against an in-memory SQLite database so no persistent data is affected.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


# ─── Health ────────────────────────────────────────────────────────────────────


def test_root_returns_project_name():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["project"] == "HashPilot"


def test_root_returns_running_status():
    response = client.get("/")
    assert response.json()["status"] == "running"


# ─── History ───────────────────────────────────────────────────────────────────


def test_history_returns_list():
    response = client.get("/history/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


# ─── Analytics ─────────────────────────────────────────────────────────────────


def test_analytics_returns_200():
    response = client.get("/analytics/")
    assert response.status_code == 200


# ─── System ────────────────────────────────────────────────────────────────────


def test_system_has_cpu_field():
    response = client.get("/system/")
    assert response.status_code == 200
    data = response.json()
    assert "cpu" in data
    assert "ram_gb" in data


# ─── Predict ───────────────────────────────────────────────────────────────────


def test_predict_returns_strategy():
    """Predict endpoint must always return a recommended_strategy field."""
    response = client.post(
        "/predict/",
        json={"difficulty": 4, "threads": 4, "processes": 4},
    )
    assert response.status_code == 200
    data = response.json()
    assert "recommended_strategy" in data
    assert "confidence" in data
    assert "model_accuracy" in data


def test_predict_confidence_in_range():
    response = client.post(
        "/predict/",
        json={"difficulty": 3, "threads": 2, "processes": 2},
    )
    assert response.status_code == 200
    confidence = response.json()["confidence"]
    assert 0.0 <= confidence <= 100.0


# ─── Benchmark (slow — skipped in fast mode) ──────────────────────────────────


@pytest.mark.slow
def test_benchmark_returns_results():
    """Full benchmark run (skipped unless -m slow is passed)."""
    response = client.get("/benchmark/?difficulty=1&threads=2&processes=2")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) == 4  # 4 strategies
    assert "analysis" in data

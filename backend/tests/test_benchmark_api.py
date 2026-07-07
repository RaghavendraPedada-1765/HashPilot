from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root():

    response = client.get("/")

    assert response.status_code == 200

    body = response.json()

    assert body["project"] == "HashPilot"


def test_benchmark():

    response = client.get("/benchmark/")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    assert len(data) > 0


def test_history():

    response = client.get("/history/")

    assert response.status_code == 200


def test_analytics():

    response = client.get("/analytics/")

    assert response.status_code == 200
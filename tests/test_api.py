"""
HTTP-level tests for POST /predict using FastAPI's TestClient.
Supabase logging is replaced with an in-memory stub, so no network
calls are made and no rows are written.
"""
import math

import pytest
from fastapi.testclient import TestClient

from known_cases import CASE_IDS, KNOWN_CASES

PLANS = {"High", "Low", "Medium"}


@pytest.fixture
def client(monkeypatch):
    from app import routes
    from app.main import app

    logged = []
    monkeypatch.setattr(routes, "log_prediction", lambda record: logged.append(record))
    test_client = TestClient(app)
    test_client.logged = logged
    return test_client


def test_root_responds(client):
    assert client.get("/").status_code == 200


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_warnings_are_returned_for_out_of_range_input(client):
    _, _, customer = KNOWN_CASES[0]
    body = client.post("/predict", json={**customer, "age": 95}).json()
    assert any("age" in w.lower() for w in body["warnings"])


def test_no_warnings_for_in_range_input(client):
    _, _, customer = KNOWN_CASES[0]
    assert client.post("/predict", json=customer).json()["warnings"] == []


def test_cors_rejects_unknown_origin(client):
    response = client.options(
        "/predict",
        headers={
            "Origin": "https://evil.example.com",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert response.headers.get("access-control-allow-origin") != "*"
    assert "evil.example.com" not in response.headers.get("access-control-allow-origin", "")


def test_cors_allows_local_frontend(client):
    response = client.options(
        "/predict",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"


@pytest.mark.parametrize("name,expected,customer", KNOWN_CASES, ids=CASE_IDS)
def test_predict_returns_expected_plan(client, name, expected, customer):
    response = client.post("/predict", json=customer)
    assert response.status_code == 200

    body = response.json()
    pred = body["prediction"]
    assert body["status"] == "success"
    assert pred["recommended_plan"] == expected

    probs = pred["probabilities"]
    assert set(probs) == PLANS
    assert math.isclose(sum(probs.values()), 100.0, abs_tol=0.1)
    assert max(probs, key=probs.get) == expected
    assert math.isclose(pred["confidence"], max(probs.values()), abs_tol=0.01)
    assert set(body["metadata"]) == {"model_name", "model_version"}
    assert body["warnings"] == []


def test_predict_logs_one_record(client):
    _, expected, customer = KNOWN_CASES[0]
    client.post("/predict", json=customer)
    assert len(client.logged) == 1
    assert client.logged[0]["predicted_plan"] == expected


@pytest.mark.parametrize("field,bad_value", [
    ("gender", "Other-Invalid"),
    ("state_tier", "Tier-9"),
    ("occupation_class", "Professional"),
    ("salary_bracket", "50K-1L"),
    ("family_members", 0),
    ("age", 10),
    ("is_smoker", 2),
    ("total_income_inr", 0),
])
def test_invalid_input_is_rejected(client, field, bad_value):
    _, _, customer = KNOWN_CASES[0]
    response = client.post("/predict", json={**customer, field: bad_value})
    assert response.status_code == 422


def test_missing_field_is_rejected(client):
    _, _, customer = KNOWN_CASES[0]
    incomplete = {k: v for k, v in customer.items() if k != "age"}
    assert client.post("/predict", json=incomplete).status_code == 422

from fastapi.testclient import TestClient


def test_initial_setup_creates_the_first_administrator_and_authenticates(client: TestClient):
    status_response = client.get("/api/auth/setup/status")
    assert status_response.status_code == 200
    assert status_response.json() == {"setup_required": True}

    response = client.post(
        "/api/auth/setup/administrator",
        json={
            "email": "admin@example.com",
            "nombres": "Admin",
            "apellidos": "Inicial",
            "telefono": "999999999",
            "password": "ClaveSegura2026",
        },
    )
    assert response.status_code == 201
    token = response.json()["access_token"]

    profile_response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert profile_response.status_code == 200
    assert profile_response.json()["rol"] == "administrador"

    completed_status_response = client.get("/api/auth/setup/status")
    assert completed_status_response.json() == {"setup_required": False}

    duplicate_response = client.post(
        "/api/auth/setup/administrator",
        json={
            "email": "otro@example.com",
            "nombres": "Otro",
            "apellidos": "Administrador",
            "password": "ClaveSegura2026",
        },
    )
    assert duplicate_response.status_code == 409

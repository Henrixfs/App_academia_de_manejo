"""
Tests para endpoints de Alumnos (integración).
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_crear_alumno_endpoint():
    """Test POST /api/alumnos."""
    response = client.post(
        "/api/alumnos/",
        json={
            "nombres": "Juan Pérez",
            "apellidos": "García",
            "documento_identidad": "12345678",
            "telefono": "987654321",
            "email": "juan@example.com"
        }
    )

    assert response.status_code == 201
    data = response.json()
    assert data["nombres"] == "Juan Pérez"
    assert data["apellidos"] == "García"
    assert data["documento_identidad"] == "12345678"
    assert data["email"] == "juan@example.com"
    assert data["id"] is not None


def test_obtener_alumno_endpoint():
    """Test GET /api/alumnos/{alumno_id}."""
    # Primero crear uno
    response_create = client.post(
        "/api/alumnos/",
        json={
            "nombres": "Juan Pérez",
            "apellidos": "García",
            "documento_identidad": "12345678",
            "telefono": "987654321"
        }
    )
    alumno_id = response_create.json()["id"]

    # Obtenerlo
    response = client.get(f"/api/alumnos/{alumno_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == alumno_id
    assert data["nombres"] == "Juan Pérez"


def test_listar_alumnos_endpoint():
    """Test GET /api/alumnos/."""
    response = client.get("/api/alumnos/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_obtener_alumno_no_existe():
    """Test GET /api/alumnos/{id} con ID inexistente."""
    response = client.get("/api/alumnos/9999")
    assert response.status_code == 404
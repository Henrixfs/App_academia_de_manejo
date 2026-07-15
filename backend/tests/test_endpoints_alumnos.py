"""
Tests para endpoints de Alumnos (integración).
"""

import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_crear_alumno_endpoint():
    """Test POST /api/alumnos."""
    response = client.post(
        "/api/admin/alumnos/",
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
        "/api/admin/alumnos/",
        json={
            "nombres": "Juan Pérez",
            "apellidos": "García",
            "documento_identidad": "12345678",
            "telefono": "987654321"
        }
    )
    alumno_id = response_create.json()["id"]

    # Obtenerlo
    response = client.get(f"/api/admin/alumnos/{alumno_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == alumno_id
    assert data["nombres"] == "Juan Pérez"


def test_listar_alumnos_endpoint():
    """Test GET /api/alumnos/."""
    response = client.get("/api/admin/alumnos/")
    assert response.status_code == 200
    data = response.json()
    assert data == {"items": [], "total": 0, "page": 1, "page_size": 25}


def test_obtener_alumno_no_existe():
    """Test GET /api/alumnos/{id} con ID inexistente."""
    response = client.get(f"/api/admin/alumnos/{uuid.uuid4()}")
    assert response.status_code == 404

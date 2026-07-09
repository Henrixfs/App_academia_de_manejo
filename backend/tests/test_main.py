"""
Tests para la aplicación principal.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Test del endpoint de health check."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data


def test_root_path():
    """Test del path raíz (debería dar 404 ya que no está definido)."""
    response = client.get("/")
    # Como no definimos un endpoint raíz, debería dar 404
    assert response.status_code == 404
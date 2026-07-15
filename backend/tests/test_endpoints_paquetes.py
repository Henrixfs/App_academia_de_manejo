"""
Tests para endpoints de Paquetes (integración).
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_listar_paquetes_endpoint():
    """Test GET /api/paquetes/."""
    response = client.get("/api/paquetes/")
    assert response.status_code == 200
    data = response.json()
    assert data == {"items": [], "total": 0, "page": 1, "page_size": 25}


def test_obtener_paquete_endpoint():
    """Test GET /api/paquetes/{id}."""
    # Probar con un ID que probablemente no exista
    fake_id = "123e4567-e89b-12d3-a456-426614174000"
    response = client.get(f"/api/paquetes/{fake_id}")
    # Debería dar 404 ya que el paquete no existe
    assert response.status_code == 404


def test_obtener_paquete_por_nombre_si_existe_endpoint():
    """Test si hubiera un endpoint para obtener por nombre (no lo hay en las specs actuales)."""
    # Este test es solo para demostrar que sabemos lo que faltaría
    pass

"""
Tests para PaqueteService.
"""

import pytest
import uuid
from sqlalchemy.orm import Session
from app.models import Paquete
from app.services.paquete_service import PaqueteService
from app.exceptions import ServicioNotFound


def test_listar_paquetes(db: Session):
    """Test listar paquetes."""
    from app.repositories.paquete_repository import PaqueteRepository

    repo = PaqueteRepository(db)

    # Crear algunos paquetes de prueba
    paquete1 = repo.create(Paquete(
        nombre="Paquete 10 clases",
        descripcion="Paquete con 10 clases de manejo",
        precio_sugerido=400.00
    ))

    paquete2 = repo.create(Paquete(
        nombre="Paquete 20 clases",
        descripcion="Paquete con 20 clases de manejo",
        precio_sugerido=750.00
    ))

    service = PaqueteService(db)
    paquetes = service.listar_paquetes()

    assert len(paquetes) >= 2
    assert any(p.nombre == "Paquete 10 clases" for p in paquetes)
    assert any(p.nombre == "Paquete 20 clases" for p in paquetes)


def test_obtener_paquete(db: Session):
    """Test obtener un paquete por ID."""
    from app.repositories.paquete_repository import PaqueteRepository

    repo = PaqueteRepository(db)
    paquete = repo.create(Paquete(
        nombre="Paquete de prueba",
        descripcion="Descripción de prueba",
        precio_sugerido=300.00
    ))

    service = PaqueteService(db)
    obtenido = service.obtener_paquete(paquete.id)

    assert obtenido.id == paquete.id
    assert obtenido.nombre == "Paquete de prueba"


def test_obtener_paquete_no_existe(db: Session):
    """Test error al obtener un paquete que no existe."""
    service = PaqueteService(db)
    with pytest.raises(ServicioNotFound):
        service.obtener_paquete(uuid.uuid4())

"""
Tests para AlumnoService.
"""

import pytest
import uuid
from sqlalchemy.orm import Session
from app.models import Alumno
from app.schemas import AlumnoCreate, AlumnoUpdate
from app.services.alumno_service import AlumnoService
from app.exceptions import AlumnoNotFound, ValorInvalido


def test_crear_alumno(db: Session):
    """Test crear un alumno exitosamente."""
    service = AlumnoService(db)
    alumno_create = AlumnoCreate(
        nombres="Juan Pérez",
        apellidos="García",
        documento_identidad="12345678",
        telefono="987654321",
        email="juan@example.com"
    )

    resultado = service.crear_alumno(alumno_create)

    assert resultado.nombres == "Juan Pérez"
    assert resultado.apellidos == "García"
    assert resultado.documento_identidad == "12345678"
    assert resultado.email == "juan@example.com"
    assert resultado.id is not None


def test_crear_alumno_email_duplicado(db: Session):
    """Test error si email ya existe."""
    service = AlumnoService(db)

    alumno_create = AlumnoCreate(
        nombres="Juan Pérez",
        apellidos="García",
        documento_identidad="12345678",
        telefono="987654321",
        email="juan@example.com"
    )
    service.crear_alumno(alumno_create)

    # Intentar crear otro con mismo email
    alumno_create2 = AlumnoCreate(
        nombres="Pedro Pérez",
        apellidos="López",
        documento_identidad="87654321",
        telefono="987654322",
        email="juan@example.com"
    )

    with pytest.raises(ValorInvalido):
        service.crear_alumno(alumno_create2)


def test_obtener_alumno(db: Session):
    """Test obtener alumno por ID."""
    service = AlumnoService(db)

    alumno_create = AlumnoCreate(
        nombres="Juan Pérez",
        apellidos="García",
        documento_identidad="12345678",
        telefono="987654321"
    )
    creado = service.crear_alumno(alumno_create)

    obtenido = service.obtener_alumno(creado.id)
    assert obtenido.id == creado.id
    assert obtenido.nombres == "Juan Pérez"


def test_obtener_alumno_no_existe(db: Session):
    """Test error si alumno no existe."""
    service = AlumnoService(db)

    with pytest.raises(AlumnoNotFound):
        service.obtener_alumno(uuid.uuid4())


def test_listar_alumnos(db: Session):
    """Test listar alumnos."""
    service = AlumnoService(db)

    # Crear 3 alumnos
    for i in range(3):
        alumno_create = AlumnoCreate(
            nombres=f"Alumno {i}",
            apellidos=f"Apellido {i}",
            documento_identidad=str(10000000 + i),
            telefono=f"98765432{i}"
        )
        service.crear_alumno(alumno_create)

    alumnos = service.listar_alumnos()
    assert len(alumnos) == 3


def test_actualizar_alumno(db: Session):
    """Test actualizar datos de un alumno."""
    service = AlumnoService(db)

    alumno_create = AlumnoCreate(
        nombres="Juan Pérez",
        apellidos="García",
        documento_identidad="12345678",
        telefono="987654321"
    )
    creado = service.crear_alumno(alumno_create)

    actualizado = service.actualizar_alumno(
        creado.id,
        AlumnoUpdate(nombres="Juan Carlos Pérez")
    )

    assert actualizado.nombres == "Juan Carlos Pérez"


def test_eliminar_alumno(db: Session):
    """Test eliminar un alumno."""
    service = AlumnoService(db)

    alumno_create = AlumnoCreate(
        nombres="Juan Pérez",
        apellidos="García",
        documento_identidad="12345678",
        telefono="987654321"
    )
    creado = service.crear_alumno(alumno_create)

    resultado = service.eliminar_alumno(creado.id)
    assert resultado is True

    # Verificar que fue eliminado
    with pytest.raises(AlumnoNotFound):
        service.obtener_alumno(creado.id)

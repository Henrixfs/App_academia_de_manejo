"""
Tests para ReservaService.
"""

import pytest
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models import Alumno, Servicio
from app.schemas import ReservaCreate
from app.services.reserva_service import ReservaService
from app.exceptions import AlumnoNotFound, ServicioNotFound, ValorInvalido


def test_crear_reserva(db: Session):
    """Test crear una reserva exitosamente."""
    # Primero crear alumno y servicio
    alumno_service = AlumnoService(db)
    servicio_service = ServicioService(db)  # We'll need to create this or use repository directly

    # For now, let's create the alumno and servicio directly using repositories
    from app.repositories.alumno_repository import AlumnoRepository
    from app.repositories.servicio_repository import ServicioRepository

    alumno_repo = AlumnoRepository(db)
    servicio_repo = ServicioRepository(db)

    alumno = alumno_repo.create(Alumno(
        nombres="Juan Pérez",
        apellidos="García",
        documento_identidad="12345678",
        telefono="987654321",
        email="juan@example.com"
    ))

    servicio = servicio_repo.create(Servicio(
        nombre="Clase práctica",
        descripcion="Clase de manejo práctico",
        tarifa=50.00,
        tiempo_minimo_horas=2
    ))

    # Ahora crear la reserva
    service = ReservaService(db)
    reserva_create = ReservaCreate(
        alumno_id=alumno.id,
        servicio_id=servicio.id,
        fecha_hora_inicio=datetime.now() + timedelta(days=1),
        fecha_hora_fin=datetime.now() + timedelta(days=1, hours=2)
    )

    resultado = service.crear_reserva(reserva_create)

    assert resultado.alumno_id == alumno.id
    assert resultado.servicio_id == servicio.id
    assert resultado.id is not None
    assert resultado.estado == "confirmada"


def test_obtener_reserva(db: Session):
    """Test obtener una reserva por ID."""
    # Setup similar to above
    from app.repositories.alumno_repository import AlumnoRepository
    from app.repositories.servicio_repository import ServicioRepository
    from app.repositories.reserva_repository import ReservaRepository

    alumno_repo = AlumnoRepository(db)
    servicio_repo = ServicioRepository(db)
    reserva_repo = ReservaRepository(db)

    alumno = alumno_repo.create(Alumno(
        nombres="Juan Pérez",
        apellidos="García",
        documento_identidad="12345678",
        telefono="987654321",
        email="juan@example.com"
    ))

    servicio = servicio_repo.create(Servicio(
        nombre="Clase práctica",
        descripcion="Clase de manejo práctico",
        tarifa=50.00,
        tiempo_minimo_horas=2
    ))

    reserva = reserva_repo.create(Reserva(
        alumno_id=alumno.id,
        servicio_id=servicio.id,
        fecha_hora_inicio=datetime.now() + timedelta(days=1),
        fecha_hora_fin=datetime.now() + timedelta(days=1, hours=2),
        estado="confirmada"
    ))

    service = ReservaService(db)
    obtenido = service.obtener_reserva(reserva.id)

    assert obtenido.id == reserva.id
    assert obtenido.alumno_id == alumno.id


def test_listar_reservas(db: Session):
    """Test listar reservas."""
    service = ReservaService(db)
    reservas = service.listar_reservas()
    assert isinstance(reservas, list)


def test_cancelar_reserva_no_permitida(db: Session):
    """Test que no se pueda cancelar una reserva con menos de 2 horas de anticipación."""
    from app.repositories.alumno_repository import AlumnoRepository
    from app.repositories.servicio_repository import ServicioRepository
    from app.repositories.reserva_repository import ReservaRepository

    alumno_repo = AlumnoRepository(db)
    servicio_repo = ServicioRepository(db)
    reserva_repo = ReservaRepository(db)

    alumno = alumno_repo.create(Alumno(
        nombres="Juan Pérez",
        apellidos="García",
        documento_identidad="12345678",
        telefono="987654321",
        email="juan@example.com"
    ))

    servicio = servicio_repo.create(Servicio(
        nombre="Clase práctica",
        descripcion="Clase de manejo práctico",
        tarifa=50.00,
        tiempo_minimo_horas=2
    ))

    # Crear una reserva que empieza en 1 hora (menos de 2 horas de anticipación)
    reserva = reserva_repo.create(Reserva(
        alumno_id=alumno.id,
        servicio_id=servicio.id,
        fecha_hora_inicio=datetime.now() + timedelta(hours=1),
        fecha_hora_fin=datetime.now() + timedelta(hours=3),
        estado="confirmada"
    ))

    service = ReservaService(db)
    with pytest.raises(Exception):  # Should raise CancelacionNoPermitida
        service.cancelar_reserva(reserva.id)
"""
Tests para FaltaService.
"""

import pytest
from sqlalchemy.orm import Session
from app.models import Alumno, Servicio, Reserva
from app.schemas import FaltaCreate
from app.services.falta_service import FaltaService
from app.exceptions import ReservaNotFound, ValorInvalido


def test_registrar_falta(db: Session):
    """Test registrar una falta exitosamente."""
    from app.repositories.alumno_repository import AlumnoRepository
    from app.repositories.servicio_repository import ServicioRepository
    from app.repositories.reserva_repository import ReservaRepository

    alumno_repo = AlumnoRepository(db)
    servicio_repo = ServicioRepository(db)
    reserva_repo = ReservaRepository(db)

    # Crear alumno
    alumno = alumno_repo.create(Alumno(
        nombres="Juan Pérez",
        apellidos="García",
        documento_identidad="12345678",
        telefono="987654321",
        email="juan@example.com"
    ))

    # Crear servicio
    servicio = servicio_repo.create(Servicio(
        nombre="Simulacro",
        descripcion="Simulacro de examen",
        tarifa=75.00,
        tiempo_minimo_horas=3
    ))

    # Crear reserva
    reserva = reserva_repo.create(Reserva(
        alumno_id=alumno.id,
        servicio_id=servicio.id,
        fecha_hora_inicio=datetime.now() + timedelta(days=1),
        fecha_hora_fin=datetime.now() + timedelta(days=1, hours=3),
        estado="confirmada"
    ))

    # Registrar falta
    service = FaltaService(db)
    falta_create = FaltaCreate(
        reserva_id=reserva.id,
        tipo="Leve",
        descripcion="No usó el espejo al cambiar de carril"
    )

    resultado = service.registrar_falta(falta_create)

    assert resultado.reserva_id == reserva.id
    assert resultado.tipo == "Leve"
    assert resultado.id is not None


def test_listar_faltas_por_reserva(db: Session):
    """Test listar faltas por reserva."""
    from app.repositories.alumno_repository import AlumnoRepository
    from app.repositories.servicio_repository import ServicioRepository
    from app.repositories.reserva_repository import ReservaRepository
    from app.repositories.falta_repository import FaltaRepository

    alumno_repo = AlumnoRepository(db)
    servicio_repo = ServicioRepository(db)
    reserva_repo = ReservaRepository(db)
    falta_repo = FaltaRepository(db)

    # Crear alumno, servicio y reserva
    alumno = alumno_repo.create(Alumno(
        nombres="Juan Pérez",
        apellidos="García",
        documento_identidad="12345678",
        telefono="987654321",
        email="juan@example.com"
    ))

    servicio = servicio_repo.create(Servicio(
        nombre="Simulacro",
        descripcion="Simulacro de examen",
        tarifa=75.00,
        tiempo_minimo_horas=3
    ))

    reserva = reserva_repo.create(Reserva(
        alumno_id=alumno.id,
        servicio_id=servicio.id,
        fecha_hora_inicio=datetime.now() + timedelta(days=1),
        fecha_hora_fin=datetime.now() + timedelta(days=1, hours=3),
        estado="confirmada"
    ))

    # Crear algunas faltas
    falta_repo.create(Falta(
        reserva_id=reserva.id,
        tipo="Leve",
        descripcion="No usó el espejo al cambiar de carril"
    ))

    falta_repo.create(Falta(
        reserva_id=reserva.id,
        tipo="Grave",
        descripcion="No respetó la señal de pare"
    ))

    # Listar faltas
    service = FaltaService(db)
    faltas = service.listar_faltas_por_reserva(reserva.id)

    assert len(faltas) == 2
    assert any(f.tipo == "Leve" for f in faltas)
    assert any(f.tipo == "Grave" for f in faltas)


def test_registrar_falta_tipo_invalido(db: Session):
    """Test error al registrar una falta con tipo inválido."""
    from app.repositories.alumno_repository import AlumnoRepository
    from app.repositories.servicio_repository import ServicioRepository
    from app.repositories.reserva_repository import ReservaRepository

    alumno_repo = AlumnoRepository(db)
    servicio_repo = ServicioRepository(db)
    reserva_repo = ReservaRepository(db)

    # Crear alumno, servicio y reserva
    alumno = alumno_repo.create(Alumno(
        nombres="Juan Pérez",
        apellidos="García",
        documento_identidad="12345678",
        telefono="987654321",
        email="juan@example.com"
    ))

    servicio = servicio_repo.create(Servicio(
        nombre="Simulacro",
        descripcion="Simulacro de examen",
        tarifa=75.00,
        tiempo_minimo_horas=3
    ))

    reserva = reserva_repo.create(Reserva(
        alumno_id=alumno.id,
        servicio_id=servicio.id,
        fecha_hora_inicio=datetime.now() + timedelta(days=1),
        fecha_hora_fin=datetime.now() + timedelta(days=1, hours=3),
        estado="confirmada"
    ))

    # Intentar registrar falta con tipo inválido
    service = FaltaService(db)
    falta_create = FaltaCreate(
        reserva_id=reserva.id,
        tipo="Muy Grave",  # Tipo inválido
        descripcion="Algunas observaciones"
    )

    with pytest.raises(ValueError):  # Should raise ValorInvalido
        service.registrar_falta(falta_create)


def test_registrar_falta_reserva_no_existe(db: Session):
    """Test error al registrar una falta para una reserva que no existe."""
    service = FaltaService(db)
    falta_create = FaltaCreate(
        reserva_id=uuid.uuid4(),  # ID que no existe
        tipo="Leve",
        descripcion="Algunas observaciones"
    )

    with pytest.raises(Exception):  # Should raise ReservaNotFound
        service.registrar_falta(falta_create)
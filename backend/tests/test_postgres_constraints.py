from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
import os
from threading import Barrier

import pytest
from sqlalchemy.exc import DBAPIError

from app.models import Alumno, Reserva, Servicio
pytestmark = pytest.mark.skipif(
    os.getenv("TEST_DATABASE_URL", "sqlite:///:memory:").startswith("sqlite"),
    reason="Requiere las constraints transaccionales de PostgreSQL",
)


def insertar_reserva(session_factory, barrier: Barrier, alumno_id: object, servicio_id: object, inicio: datetime) -> bool:
    db = session_factory()
    try:
        db.add(Reserva(
            alumno_id=alumno_id,
            servicio_id=servicio_id,
            fecha_hora_inicio=inicio,
            fecha_hora_fin=inicio + timedelta(hours=2),
            estado="confirmada",
        ))
        barrier.wait()
        db.commit()
        return True
    except DBAPIError:
        db.rollback()
        return False
    finally:
        db.close()


def test_postgres_impide_reservas_concurrentes(db, testing_session_factory):
    alumno = Alumno(
        nombres="Ana",
        apellidos="Concurrente",
        documento_identidad="75555555",
        telefono="955555555",
        email="concurrente@example.com",
    )
    servicio = Servicio(
        nombre="Clase concurrente",
        descripcion="Prueba de exclusión PostgreSQL",
        tarifa=70,
        tiempo_minimo_horas=2,
    )
    db.add_all([alumno, servicio])
    db.commit()
    inicio = datetime.now(timezone.utc) + timedelta(days=2)
    barrier = Barrier(2)
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = [
            executor.submit(insertar_reserva, testing_session_factory, barrier, alumno.id, servicio.id, inicio)
            for _ in range(2)
        ]
    assert sorted(future.result() for future in futures) == [False, True]

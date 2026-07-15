import uuid
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

import pytest
from sqlalchemy.orm import Session

from app.exceptions import (
    AdminYaExiste,
    AdministradorNotFound,
    AlumnoNotFound,
    CancelacionNoPermitida,
    ConflictoDatos,
    LimitReprogramacionesExcedido,
    ReservaNotFound,
    ReservaYaExiste,
    ServicioNotFound,
    TransicionReservaInvalida,
    ValorInvalido,
)
from app.models import Administrador, Alumno, Reserva, Servicio
from app.schemas import AdminCreate, AdminUpdate, ReservaCreate, ReservaUpdate, ServicioCreate, ServicioUpdate
from app.services.administrador_service import AdministradorService
from app.services.reserva_service import ReservaService
from app.services.servicio_service import ServicioService


LIMA = ZoneInfo("America/Lima")


def horario(days: int = 2, hour: int = 10, duration: int = 2) -> tuple[datetime, datetime]:
    base = datetime.now(LIMA) + timedelta(days=days)
    inicio = base.replace(hour=hour, minute=0, second=0, microsecond=0)
    return inicio, inicio + timedelta(hours=duration)


def alumno_servicio(db: Session) -> tuple[Alumno, Servicio]:
    alumno = Alumno(
        nombres="Ana",
        apellidos="Torres",
        documento_identidad="71111111",
        telefono="911111111",
        email="ana@example.com",
    )
    servicio = Servicio(
        nombre="Clase práctica",
        descripcion="Práctica controlada",
        tarifa=60,
        tiempo_minimo_horas=2,
    )
    db.add_all([alumno, servicio])
    db.commit()
    return alumno, servicio


def reserva_modelo(db: Session, estado: str = "confirmada", days: int = 2) -> tuple[Alumno, Servicio, Reserva]:
    alumno, servicio = alumno_servicio(db)
    inicio, fin = horario(days=days)
    reserva = Reserva(
        alumno_id=alumno.id,
        servicio_id=servicio.id,
        fecha_hora_inicio=inicio.astimezone(timezone.utc),
        fecha_hora_fin=fin.astimezone(timezone.utc),
        estado=estado,
    )
    db.add(reserva)
    db.commit()
    return alumno, servicio, reserva


def test_ciclo_administrador(db: Session, monkeypatch: pytest.MonkeyPatch):
    service = AdministradorService(db)
    data = AdminCreate(
        email="admin@example.com",
        password="Clave-admin-2026",
        nombres="Ada",
        apellidos="Min",
    )
    created = service.crear_admin(data, "hash")
    assert service.obtener_admin(created.id).email == "admin@example.com"
    assert len(service.listar_admins()) == 1
    assert service.get_by_email("admin@example.com") is not None
    assert service.get_by_email("none@example.com") is None
    monkeypatch.setattr("app.services.administrador_service.verify_password", lambda plain, hashed: plain == "correcta")
    assert service.autenticar("admin@example.com", "correcta") is not None
    assert service.autenticar("admin@example.com", "incorrecta") is None
    assert service.autenticar("none@example.com", "correcta") is None
    updated = service.actualizar_admin(created.id, AdminUpdate(nombres="Administradora"))
    assert updated.nombres == "Administradora"
    assert service.eliminar_admin(created.id) is True
    assert service.autenticar("admin@example.com", "correcta") is None
    with pytest.raises(AdministradorNotFound):
        service.obtener_admin(created.id)


def test_errores_administrador(db: Session):
    service = AdministradorService(db)
    first = AdminCreate(email="one@example.com", password="Password-2026", nombres="One", apellidos="Admin")
    second = AdminCreate(email="two@example.com", password="Password-2026", nombres="Two", apellidos="Admin")
    first_id = service.crear_admin(first, "hash").id
    service.crear_admin(second, "hash")
    with pytest.raises(AdminYaExiste):
        service.crear_admin(first, "hash")
    with pytest.raises(AdminYaExiste):
        service.actualizar_admin(first_id, AdminUpdate(email="two@example.com"))
    unknown = uuid.uuid4()
    with pytest.raises(AdministradorNotFound):
        service.actualizar_admin(unknown, AdminUpdate(nombres="Nada"))
    with pytest.raises(AdministradorNotFound):
        service.eliminar_admin(unknown)


def test_ciclo_servicio(db: Session):
    service = ServicioService(db)
    created = service.crear_servicio(ServicioCreate(
        nombre="Simulacro",
        descripcion="Evaluación práctica",
        tarifa=75,
        tiempo_minimo_horas=3,
    ))
    assert service.obtener_servicio(created.id).nombre == "Simulacro"
    assert len(service.listar_servicios()) == 1
    assert service.contar_servicios() == 1
    updated = service.actualizar_servicio(created.id, ServicioUpdate(tarifa=80))
    assert float(updated.tarifa) == 80
    assert service.eliminar_servicio(created.id) is True
    with pytest.raises(ServicioNotFound):
        service.obtener_servicio(created.id)
    with pytest.raises(ServicioNotFound):
        service.actualizar_servicio(created.id, ServicioUpdate(nombre="No existe"))
    with pytest.raises(ServicioNotFound):
        service.eliminar_servicio(created.id)


def test_servicio_permite_tarifa_cero(db: Session):
    service = ServicioService(db)
    created = service.crear_servicio(ServicioCreate(
        nombre="Asesoria",
        descripcion="Orientacion sin costo",
        tarifa=0,
        tiempo_minimo_horas=1,
    ))
    assert float(created.tarifa) == 0


def test_no_elimina_servicio_con_reservas(db: Session):
    _, servicio, _ = reserva_modelo(db)
    service = ServicioService(db)
    with pytest.raises(ConflictoDatos):
        service.eliminar_servicio(servicio.id)


def test_validaciones_horario(db: Session):
    service = ReservaService(db)
    inicio, fin = horario()
    with pytest.raises(ValorInvalido):
        service.validar_horario(fin, inicio, 2)
    with pytest.raises(ValorInvalido):
        service.validar_horario(datetime.now(LIMA) - timedelta(hours=2), datetime.now(LIMA) - timedelta(hours=1), 1)
    with pytest.raises(ValorInvalido):
        service.validar_horario(inicio, inicio + timedelta(days=1), 2)
    temprano = inicio.replace(hour=7)
    with pytest.raises(ValorInvalido):
        service.validar_horario(temprano, temprano + timedelta(hours=2), 2)
    with pytest.raises(ValorInvalido):
        service.validar_horario(inicio, inicio + timedelta(hours=1), 2)


def test_creacion_y_consultas_reserva(db: Session):
    alumno, servicio = alumno_servicio(db)
    inicio, fin = horario()
    service = ReservaService(db)
    created = service.crear_reserva(ReservaCreate(
        alumno_id=alumno.id,
        servicio_id=servicio.id,
        fecha_hora_inicio=inicio,
        fecha_hora_fin=fin,
    ))
    assert service.obtener_reserva(created.id).id == created.id
    assert service.obtener_reserva_de_alumno(created.id, alumno.id).id == created.id
    assert len(service.listar_reservas()) == 1
    assert len(service.listar_por_alumno(alumno.id)) == 1
    assert service.contar_reservas() == 1
    with pytest.raises(ReservaNotFound):
        service.obtener_reserva(uuid.uuid4())
    with pytest.raises(ReservaNotFound):
        service.obtener_reserva_de_alumno(created.id, uuid.uuid4())
    with pytest.raises(AlumnoNotFound):
        service.listar_por_alumno(uuid.uuid4())
    with pytest.raises(ReservaYaExiste):
        service.crear_reserva(ReservaCreate(
            alumno_id=alumno.id,
            servicio_id=servicio.id,
            fecha_hora_inicio=inicio + timedelta(minutes=30),
            fecha_hora_fin=fin + timedelta(minutes=30),
        ))


def test_errores_creacion_reserva(db: Session):
    alumno, servicio = alumno_servicio(db)
    inicio, fin = horario()
    service = ReservaService(db)
    with pytest.raises(AlumnoNotFound):
        service.crear_reserva(ReservaCreate(
            alumno_id=uuid.uuid4(), servicio_id=servicio.id, fecha_hora_inicio=inicio, fecha_hora_fin=fin,
        ))
    with pytest.raises(ServicioNotFound):
        service.crear_reserva(ReservaCreate(
            alumno_id=alumno.id, servicio_id=uuid.uuid4(), fecha_hora_inicio=inicio, fecha_hora_fin=fin,
        ))
    with pytest.raises(ValorInvalido):
        service.crear_reserva(ReservaCreate(
            alumno_id=alumno.id,
            servicio_id=servicio.id,
            matricula_paquete_id=uuid.uuid4(),
            fecha_hora_inicio=inicio,
            fecha_hora_fin=fin,
        ))


def test_cancelacion_y_transiciones(db: Session):
    alumno, _, reserva = reserva_modelo(db)
    service = ReservaService(db)
    cancelled = service.cancelar_reserva(reserva.id, alumno.id)
    assert cancelled.estado.value == "cancelada"
    with pytest.raises(TransicionReservaInvalida):
        service.cancelar_reserva(reserva.id)


def test_cancelacion_restringida(db: Session):
    alumno, _, reserva = reserva_modelo(db, days=0)
    reserva.fecha_hora_inicio = datetime.now(timezone.utc) + timedelta(hours=1)
    reserva.fecha_hora_fin = datetime.now(timezone.utc) + timedelta(hours=3)
    db.commit()
    service = ReservaService(db)
    with pytest.raises(ReservaNotFound):
        service.cancelar_reserva(reserva.id, uuid.uuid4())
    with pytest.raises(CancelacionNoPermitida):
        service.cancelar_reserva(reserva.id, alumno.id)


def test_reprogramacion_confirmacion_y_actualizacion(db: Session):
    alumno, _, reserva = reserva_modelo(db)
    service = ReservaService(db)
    inicio, fin = horario(days=3)
    changed = service.reprogramar_reserva(reserva.id, inicio, fin, alumno.id)
    assert changed.reprogramaciones_usadas == 1
    assert changed.estado.value == "reprogramada"
    confirmed = service.confirmar_reserva(reserva.id)
    assert confirmed.estado.value == "confirmada"
    nuevo_inicio, nuevo_fin = horario(days=4)
    updated = service.actualizar_reserva(reserva.id, ReservaUpdate(
        fecha_hora_inicio=nuevo_inicio,
        fecha_hora_fin=nuevo_fin,
    ))
    assert updated.fecha_hora_inicio is not None
    service.reprogramar_reserva(reserva.id, *horario(days=5))
    reserva.reprogramaciones_usadas = 2
    db.commit()
    with pytest.raises(LimitReprogramacionesExcedido):
        service.reprogramar_reserva(reserva.id, *horario(days=6))
    reserva.estado = "asistida"
    db.commit()
    with pytest.raises(TransicionReservaInvalida):
        service.confirmar_reserva(reserva.id)
    with pytest.raises(TransicionReservaInvalida):
        service.actualizar_reserva(reserva.id, ReservaUpdate(fecha_hora_inicio=nuevo_inicio))

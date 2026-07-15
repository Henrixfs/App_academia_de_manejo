from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin
from app.main import app
from app.models import Administrador, Alumno, Reserva, Servicio
from app.utils.auth import create_access_token


def auth_header(user_id: object, role: str, expires: timedelta | None = None) -> dict[str, str]:
    token = create_access_token({"sub": str(user_id), "rol": role}, expires_delta=expires)
    return {"Authorization": f"Bearer {token}"}


def create_security_data(db: Session) -> tuple[Alumno, Alumno, Administrador, Servicio, Reserva]:
    alumno = Alumno(
        nombres="Ana",
        apellidos="Propietaria",
        documento_identidad="70000001",
        telefono="900000001",
        email="ana@example.com",
        password_hash="unused",
    )
    otro = Alumno(
        nombres="Luis",
        apellidos="Otro",
        documento_identidad="70000002",
        telefono="900000002",
        email="luis@example.com",
        password_hash="unused",
    )
    admin_inactivo = Administrador(
        nombres="Admin",
        apellidos="Inactivo",
        email="inactivo@example.com",
        password_hash="unused",
        activo=False,
    )
    servicio = Servicio(
        nombre="Práctica segura",
        descripcion="Servicio para pruebas de autorización",
        tarifa=50,
        tiempo_minimo_horas=2,
    )
    db.add_all([alumno, otro, admin_inactivo, servicio])
    db.flush()
    inicio = datetime.now(timezone.utc) + timedelta(days=2)
    reserva = Reserva(
        alumno_id=otro.id,
        servicio_id=servicio.id,
        fecha_hora_inicio=inicio,
        fecha_hora_fin=inicio + timedelta(hours=2),
        estado="confirmada",
    )
    db.add(reserva)
    db.commit()
    return alumno, otro, admin_inactivo, servicio, reserva


def test_alumno_no_puede_usar_endpoints_administrativos(db: Session):
    alumno, otro, _, _, _ = create_security_data(db)
    previous_override = app.dependency_overrides.pop(get_current_admin, None)
    try:
        response = TestClient(app).get(f"/api/admin/alumnos/{otro.id}", headers=auth_header(alumno.id, "alumno"))
        assert response.status_code == 403
        assert response.json()["code"] == "FORBIDDEN"
    finally:
        if previous_override:
            app.dependency_overrides[get_current_admin] = previous_override


def test_alumno_no_puede_leer_reserva_ajena(db: Session):
    alumno, _, _, _, reserva = create_security_data(db)
    response = TestClient(app).get(
        f"/api/me/reservas/{reserva.id}",
        headers=auth_header(alumno.id, "alumno"),
    )
    assert response.status_code == 404


def test_token_con_rol_alterado_es_rechazado(db: Session):
    alumno, _, _, _, _ = create_security_data(db)
    previous_override = app.dependency_overrides.pop(get_current_admin, None)
    try:
        response = TestClient(app).get("/api/admin/alumnos/", headers=auth_header(alumno.id, "administrador"))
        assert response.status_code == 401
    finally:
        if previous_override:
            app.dependency_overrides[get_current_admin] = previous_override


def test_administrador_inactivo_es_rechazado(db: Session):
    _, _, admin, _, _ = create_security_data(db)
    previous_override = app.dependency_overrides.pop(get_current_admin, None)
    try:
        response = TestClient(app).get("/api/admin/alumnos/", headers=auth_header(admin.id, "administrador"))
        assert response.status_code == 401
    finally:
        if previous_override:
            app.dependency_overrides[get_current_admin] = previous_override


def test_jwt_expirado_es_rechazado(db: Session):
    alumno, _, _, _, _ = create_security_data(db)
    response = TestClient(app).get(
        "/api/me",
        headers=auth_header(alumno.id, "alumno", timedelta(seconds=-1)),
    )
    assert response.status_code == 401


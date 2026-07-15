import uuid
from datetime import datetime, time, timedelta, timezone
from typing import List
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from sqlalchemy.exc import DBAPIError
from sqlalchemy.orm import Session

from app.exceptions import (
    AlumnoNotFound,
    CancelacionNoPermitida,
    LimitReprogramacionesExcedido,
    ReservaNotFound,
    ReservaYaExiste,
    ServicioNotFound,
    TransicionReservaInvalida,
    ValorInvalido,
)
from app.models import EstadoReserva, MatriculaPaquete, Reserva
from app.repositories.alumno_repository import AlumnoRepository
from app.repositories.reserva_repository import ReservaRepository
from app.repositories.servicio_repository import ServicioRepository
from app.schemas import ReservaCreate, ReservaResponse, ReservaUpdate


try:
    LIMA = ZoneInfo("America/Lima")
except ZoneInfoNotFoundError:
    LIMA = timezone(timedelta(hours=-5), name="America/Lima")
ESTADOS_EDITABLES = {
    EstadoReserva.PENDIENTE_CONFIRMACION.value,
    EstadoReserva.CONFIRMADA.value,
    EstadoReserva.REPROGRAMADA.value,
}


class ReservaService:
    def __init__(self, db: Session):
        self.db = db
        self.repo_reserva = ReservaRepository(db)
        self.repo_alumno = AlumnoRepository(db)
        self.repo_servicio = ServicioRepository(db)

    @staticmethod
    def obtener_sqlstate(exc: DBAPIError) -> str | None:
        orig = exc.orig
        code = getattr(orig, "pgcode", None) or getattr(orig, "sqlstate", None)
        if code:
            return str(code)
        if isinstance(orig, dict):
            value = orig.get("C")
            return str(value) if value else None
        args = getattr(orig, "args", ())
        for arg in args:
            if isinstance(arg, dict):
                value = arg.get("C")
                return str(value) if value else None
        return None

    @staticmethod
    def manejar_error_persistencia(exc: DBAPIError) -> None:
        code = ReservaService.obtener_sqlstate(exc)
        if code in {"23P01", "23505", "40P01"}:
            raise ReservaYaExiste() from exc
        if code == "23503":
            raise ValorInvalido("referencia", "El alumno, servicio o paquete seleccionado no existe") from exc
        if isinstance(exc.orig, Exception) and "constraint" in str(exc.orig).lower():
            raise ReservaYaExiste() from exc
        raise exc

    @staticmethod
    def normalizar_fecha(value: datetime) -> datetime:
        aware = value.replace(tzinfo=LIMA) if value.tzinfo is None else value
        return aware.astimezone(timezone.utc)

    @staticmethod
    def fecha_aware(value: datetime) -> datetime:
        return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value

    def validar_horario(self, inicio: datetime, fin: datetime, minimo_horas: int) -> tuple[datetime, datetime]:
        inicio_utc = self.normalizar_fecha(inicio)
        fin_utc = self.normalizar_fecha(fin)
        if fin_utc <= inicio_utc:
            raise ValorInvalido("fecha_hora_fin", "Debe ser posterior a la hora de inicio")
        if inicio_utc <= datetime.now(timezone.utc):
            raise ValorInvalido("fecha_hora_inicio", "La fecha debe estar en el futuro")
        inicio_lima = inicio_utc.astimezone(LIMA)
        fin_lima = fin_utc.astimezone(LIMA)
        if inicio_lima.date() != fin_lima.date():
            raise ValorInvalido("fecha_hora_fin", "La reserva debe iniciar y terminar el mismo día")
        if inicio_lima.time() < time(8, 0) or fin_lima.time() > time(18, 0):
            raise ValorInvalido("fecha_hora_inicio", "El horario de atención es de 08:00 a 18:00")
        duracion_horas = (fin_utc - inicio_utc).total_seconds() / 3600
        if duracion_horas < minimo_horas:
            raise ValorInvalido("fecha_hora_fin", f"La duración mínima es de {minimo_horas} hora(s)")
        return inicio_utc, fin_utc

    def crear_reserva(self, reserva_create: ReservaCreate) -> ReservaResponse:
        alumno = self.repo_alumno.get_by_id(reserva_create.alumno_id)
        if not alumno:
            raise AlumnoNotFound()
        servicio = self.repo_servicio.get_by_id(reserva_create.servicio_id)
        if not servicio:
            raise ServicioNotFound()
        if reserva_create.matricula_paquete_id:
            matricula = self.db.query(MatriculaPaquete).filter(
                MatriculaPaquete.id == reserva_create.matricula_paquete_id,
                MatriculaPaquete.alumno_id == reserva_create.alumno_id,
                MatriculaPaquete.estado == "activo",
            ).first()
            if not matricula:
                raise ValorInvalido("matricula_paquete_id", "La matrícula no pertenece al alumno o no está activa")
        inicio, fin = self.validar_horario(
            reserva_create.fecha_hora_inicio,
            reserva_create.fecha_hora_fin,
            servicio.tiempo_minimo_horas,
        )
        if self.repo_reserva.existe_conflicto(inicio, fin, reserva_create.servicio_id):
            raise ReservaYaExiste()
        reserva = Reserva(
            alumno_id=reserva_create.alumno_id,
            servicio_id=reserva_create.servicio_id,
            matricula_paquete_id=reserva_create.matricula_paquete_id,
            fecha_hora_inicio=inicio,
            fecha_hora_fin=fin,
            estado=EstadoReserva.CONFIRMADA.value,
        )
        try:
            self.repo_reserva.create(reserva)
            self.db.commit()
            self.db.refresh(reserva)
        except DBAPIError as exc:
            self.db.rollback()
            self.manejar_error_persistencia(exc)
        return ReservaResponse.model_validate(reserva)

    def obtener_reserva(self, reserva_id: uuid.UUID) -> ReservaResponse:
        reserva = self.repo_reserva.get_by_id(reserva_id)
        if not reserva:
            raise ReservaNotFound()
        return ReservaResponse.model_validate(reserva)

    def obtener_reserva_modelo(self, reserva_id: uuid.UUID) -> Reserva:
        reserva = self.repo_reserva.get_by_id(reserva_id)
        if not reserva:
            raise ReservaNotFound()
        return reserva

    def obtener_reserva_de_alumno(self, reserva_id: uuid.UUID, alumno_id: uuid.UUID) -> ReservaResponse:
        reserva = self.obtener_reserva_modelo(reserva_id)
        if reserva.alumno_id != alumno_id:
            raise ReservaNotFound()
        return ReservaResponse.model_validate(reserva)

    def listar_reservas(self, skip: int = 0, limit: int = 100) -> List[ReservaResponse]:
        return [ReservaResponse.model_validate(item) for item in self.repo_reserva.get_all(skip, limit)]

    def contar_reservas(self) -> int:
        return self.repo_reserva.count()

    def listar_por_alumno(self, alumno_id: uuid.UUID) -> List[ReservaResponse]:
        if not self.repo_alumno.get_by_id(alumno_id):
            raise AlumnoNotFound()
        return [ReservaResponse.model_validate(item) for item in self.repo_reserva.get_by_alumno(alumno_id)]

    def cancelar_reserva(self, reserva_id: uuid.UUID, alumno_id: uuid.UUID | None = None) -> ReservaResponse:
        reserva = self.obtener_reserva_modelo(reserva_id)
        if alumno_id and reserva.alumno_id != alumno_id:
            raise ReservaNotFound()
        if reserva.estado not in ESTADOS_EDITABLES:
            raise TransicionReservaInvalida(str(reserva.estado))
        inicio = self.fecha_aware(reserva.fecha_hora_inicio)
        if (inicio - datetime.now(timezone.utc)).total_seconds() < 7200:
            raise CancelacionNoPermitida()
        reserva.estado = EstadoReserva.CANCELADA.value
        self.db.commit()
        self.db.refresh(reserva)
        return ReservaResponse.model_validate(reserva)

    def reprogramar_reserva(
        self,
        reserva_id: uuid.UUID,
        nueva_fecha_hora_inicio: datetime,
        nueva_fecha_hora_fin: datetime,
        alumno_id: uuid.UUID | None = None,
    ) -> ReservaResponse:
        reserva = self.obtener_reserva_modelo(reserva_id)
        if alumno_id and reserva.alumno_id != alumno_id:
            raise ReservaNotFound()
        if reserva.estado not in ESTADOS_EDITABLES:
            raise TransicionReservaInvalida(str(reserva.estado))
        if reserva.reprogramaciones_usadas >= 2:
            raise LimitReprogramacionesExcedido()
        servicio = self.repo_servicio.get_by_id(reserva.servicio_id)
        inicio, fin = self.validar_horario(
            nueva_fecha_hora_inicio,
            nueva_fecha_hora_fin,
            servicio.tiempo_minimo_horas,
        )
        if self.repo_reserva.existe_conflicto(inicio, fin, reserva.servicio_id, reserva.id):
            raise ReservaYaExiste()
        reserva.fecha_hora_inicio = inicio
        reserva.fecha_hora_fin = fin
        reserva.estado = EstadoReserva.REPROGRAMADA.value
        reserva.reprogramaciones_usadas += 1
        try:
            self.db.commit()
            self.db.refresh(reserva)
        except DBAPIError as exc:
            self.db.rollback()
            self.manejar_error_persistencia(exc)
        return ReservaResponse.model_validate(reserva)

    def confirmar_reserva(self, reserva_id: uuid.UUID) -> ReservaResponse:
        reserva = self.obtener_reserva_modelo(reserva_id)
        if reserva.estado not in {
            EstadoReserva.PENDIENTE_CONFIRMACION.value,
            EstadoReserva.REPROGRAMADA.value,
        }:
            raise TransicionReservaInvalida(str(reserva.estado))
        reserva.estado = EstadoReserva.CONFIRMADA.value
        self.db.commit()
        self.db.refresh(reserva)
        return ReservaResponse.model_validate(reserva)

    def actualizar_reserva(self, reserva_id: uuid.UUID, reserva_update: ReservaUpdate) -> ReservaResponse:
        reserva = self.obtener_reserva_modelo(reserva_id)
        if reserva.estado not in ESTADOS_EDITABLES:
            raise TransicionReservaInvalida(str(reserva.estado))
        inicio = reserva_update.fecha_hora_inicio or reserva.fecha_hora_inicio
        fin = reserva_update.fecha_hora_fin or reserva.fecha_hora_fin
        servicio = self.repo_servicio.get_by_id(reserva.servicio_id)
        inicio_normalizado, fin_normalizado = self.validar_horario(inicio, fin, servicio.tiempo_minimo_horas)
        if self.repo_reserva.existe_conflicto(inicio_normalizado, fin_normalizado, reserva.servicio_id, reserva.id):
            raise ReservaYaExiste()
        reserva.fecha_hora_inicio = inicio_normalizado
        reserva.fecha_hora_fin = fin_normalizado
        try:
            self.db.commit()
            self.db.refresh(reserva)
        except DBAPIError as exc:
            self.db.rollback()
            self.manejar_error_persistencia(exc)
        return ReservaResponse.model_validate(reserva)

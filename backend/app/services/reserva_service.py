"""
Servicio de lógica de negocio para Reservas.
Implementa reglas de negocio: cancelación 2h antes, máx 2 reprogramaciones gratis, etc.
"""

from datetime import datetime, timedelta
from typing import List
from sqlalchemy.orm import Session
from app.models import Reserva, EstadoReserva
from app.schemas import ReservaCreate, ReservaUpdate, ReservaResponse
from app.repositories.reserva_repository import ReservaRepository
from app.repositories.alumno_repository import AlumnoRepository
from app.repositories.servicio_repository import ServicioRepository
from app.exceptions import (
    ReservaNotFound, AlumnoNotFound, ServicioNotFound,
    ReservaYaExiste, CancelacionNoPermitida, LimitReprogramacionesExcedido,
    ValorInvalido
)


class ReservaService:
    """Servicio para Reservas."""

    def __init__(self, db: Session):
        self.db = db
        self.repo_reserva = ReservaRepository(db)
        self.repo_alumno = AlumnoRepository(db)
        self.repo_servicio = ServicioRepository(db)

    def crear_reserva(self, reserva_create: ReservaCreate) -> ReservaResponse:
        """Crear una nueva reserva con validaciones de negocio."""
        # Validar que alumno existe
        if not self.repo_alumno.get_by_id(reserva_create.alumno_id):
            raise AlumnoNotFound()

        # Validar que servicio existe
        if not self.repo_servicio.get_by_id(reserva_create.servicio_id):
            raise ServicioNotFound()

        # Validar fecha y hora en el futuro
        ahora = datetime.now(reserva_create.fecha.tzinfo)
        if reserva_create.fecha < ahora:
            raise ValorInvalido("fecha", "La fecha no puede ser en el pasado")

        # Validar horario 8am-6pm
        hora_inicio = reserva_create.fecha.replace(hour=8, minute=0)
        hora_fin = reserva_create.fecha.replace(hour=18, minute=0)
        if not (hora_inicio <= reserva_create.fecha < hora_fin):
            raise ValorInvalido("fecha", "Debe ser entre 8:00 AM y 6:00 PM")

        # Validar no existe conflicto (misma fecha/hora/servicio)
        if self.repo_reserva.existe_conflicto(
            reserva_create.fecha.date(),
            reserva_create.fecha.time(),
            reserva_create.servicio_id
        ):
            raise ReservaYaExiste()

        # Crear
        reserva = Reserva(
            alumno_id=reserva_create.alumno_id,
            servicio_id=reserva_create.servicio_id,
            fecha=reserva_create.fecha,
            duracion_minutos=reserva_create.duracion_minutos,
            estado=EstadoReserva.CONFIRMADA,
            notas=reserva_create.notas,
        )

        reserva = self.repo_reserva.create(reserva)
        return ReservaResponse.from_orm(reserva)

    def obtener_reserva(self, reserva_id: int) -> ReservaResponse:
        """Obtener una reserva."""
        reserva = self.repo_reserva.get_by_id(reserva_id)
        if not reserva:
            raise ReservaNotFound()
        return ReservaResponse.from_orm(reserva)

    def listar_reservas(self, skip: int = 0, limit: int = 100) -> List[ReservaResponse]:
        """Listar todas las reservas."""
        reservas = self.repo_reserva.get_all(skip, limit)
        return [ReservaResponse.from_orm(r) for r in reservas]

    def listar_por_alumno(self, alumno_id: int) -> List[ReservaResponse]:
        """Listar reservas de un alumno específico."""
        if not self.repo_alumno.get_by_id(alumno_id):
            raise AlumnoNotFound()
        reservas = self.repo_reserva.get_by_alumno(alumno_id)
        return [ReservaResponse.from_orm(r) for r in reservas]

    def cancelar_reserva(self, reserva_id: int) -> ReservaResponse:
        """Cancelar una reserva (validar 2 horas de anticipación)."""
        reserva = self.repo_reserva.get_by_id(reserva_id)
        if not reserva:
            raise ReservaNotFound()

        # Regla: debe ser 2 horas antes de la reserva
        if not self.repo_reserva.puede_cancelar(reserva_id):
            raise CancelacionNoPermitida()

        # Cambiar estado
        reserva.estado = EstadoReserva.CANCELADA
        self.db.commit()
        self.db.refresh(reserva)

        return ReservaResponse.from_orm(reserva)

    def reprogramar_reserva(self, reserva_id: int, nueva_fecha: datetime) -> ReservaResponse:
        """Reprogramar una reserva (máximo 2 veces gratis)."""
        reserva = self.repo_reserva.get_by_id(reserva_id)
        if not reserva:
            raise ReservaNotFound()

        # Regla: máximo 2 reprogramaciones gratis
        reprogramaciones = self.repo_reserva.contar_reprogramaciones(reserva.alumno_id)
        if reprogramaciones >= 2:
            raise LimitReprogramacionesExcedido()

        # Validar nueva fecha
        if nueva_fecha < datetime.now(nueva_fecha.tzinfo):
            raise ValorInvalido("nueva_fecha", "La fecha no puede ser en el pasado")

        # Validar no existe conflicto
        if self.repo_reserva.existe_conflicto(
            nueva_fecha.date(),
            nueva_fecha.time(),
            reserva.servicio_id
        ):
            raise ReservaYaExiste()

        # Actualizar
        reserva.fecha = nueva_fecha
        reserva.estado = EstadoReserva.REPROGRAMADA
        self.db.commit()
        self.db.refresh(reserva)

        return ReservaResponse.from_orm(reserva)

    def actualizar_reserva(self, reserva_id: int, reserva_update: ReservaUpdate) -> ReservaResponse:
        """Actualizar notas u otros campos (no fecha/estado)."""
        reserva = self.repo_reserva.get_by_id(reserva_id)
        if not reserva:
            raise ReservaNotFound()

        actualizado = self.repo_reserva.update(
            reserva_id,
            reserva_update.dict(exclude_unset=True)
        )
        return ReservaResponse.from_orm(actualizado)
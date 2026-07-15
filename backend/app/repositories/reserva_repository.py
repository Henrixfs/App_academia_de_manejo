"""
Repository para Reservas.
"""

import uuid
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models import Reserva, EstadoReserva
from app.repositories.base_repository import BaseRepository


class ReservaRepository(BaseRepository[Reserva]):
    """Repository para Reserva."""

    def __init__(self, db: Session):
        super().__init__(db, Reserva)

    def get_by_alumno(self, alumno_id: uuid.UUID) -> List[Reserva]:
        """Obtener todas las reservas de un alumno."""
        return self.db.query(Reserva).filter(Reserva.alumno_id == alumno_id).all()

    def get_proximas(self, alumno_id: uuid.UUID) -> List[Reserva]:
        """Obtener reservas próximas (no completadas/canceladas)."""
        return self.db.query(Reserva).filter(
            Reserva.alumno_id == alumno_id,
            Reserva.estado.in_([EstadoReserva.CONFIRMADA, EstadoReserva.REPROGRAMADA])
        ).all()

    def existe_conflicto(self, inicio: datetime, fin: datetime, servicio_id: uuid.UUID, excluir_id: uuid.UUID | None = None) -> bool:
        """Verificar si ya existe una reserva activa que se solape con este rango de tiempo para el mismo servicio."""
        query = self.db.query(Reserva).filter(
            and_(
                Reserva.servicio_id == servicio_id,
                Reserva.estado.in_([EstadoReserva.CONFIRMADA, EstadoReserva.REPROGRAMADA]),
                Reserva.fecha_hora_inicio < fin,
                Reserva.fecha_hora_fin > inicio
            )
        )
        if excluir_id:
            query = query.filter(Reserva.id != excluir_id)
        return query.first() is not None

    def contar_reprogramaciones(self, alumno_id: uuid.UUID) -> int:
        """Contar cuántas reprogramaciones ha usado el alumno."""
        values = self.db.query(Reserva.reprogramaciones_usadas).filter(
            Reserva.alumno_id == alumno_id
        ).all()
        return sum(value for (value,) in values)

    def puede_cancelar(self, reserva_id: uuid.UUID) -> bool:
        """Verificar si una reserva puede ser cancelada (> 2 horas antes)."""
        reserva = self.get_by_id(reserva_id)
        if not reserva:
            return False

        ahora = datetime.now(reserva.fecha_hora_inicio.tzinfo)
        diferencia_horas = (reserva.fecha_hora_inicio - ahora).total_seconds() / 3600

        return diferencia_horas >= 2

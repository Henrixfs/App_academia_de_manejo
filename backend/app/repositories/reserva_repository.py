"""
Repository para Reservas.
"""

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

    def get_by_alumno(self, alumno_id: int) -> List[Reserva]:
        """Obtener todas las reservas de un alumno."""
        return self.db.query(Reserva).filter(Reserva.alumno_id == alumno_id).all()

    def get_proximas(self, alumno_id: int) -> List[Reserva]:
        """Obtener reservas próximas (no completadas/canceladas)."""
        return self.db.query(Reserva).filter(
            Reserva.alumno_id == alumno_id,
            Reserva.estado.in_([EstadoReserva.CONFIRMADA, EstadoReserva.REPROGRAMADA])
        ).all()

    def existe_conflicto(self, fecha: datetime, hora: datetime, servicio_id: int) -> bool:
        """Verificar si ya existe una reserva en esa fecha/hora/servicio."""
        return self.db.query(Reserva).filter(
            Reserva.fecha == fecha,
            Reserva.hora == hora,
            Reserva.servicio_id == servicio_id,
            Reserva.estado.in_([EstadoReserva.CONFIRMADA, EstadoReserva.REPROGRAMADA])
        ).first() is not None

    def contar_reprogramaciones(self, alumno_id: int) -> int:
        """Contar cuántas reprogramaciones ha usado el alumno."""
        return self.db.query(Reserva).filter(
            Reserva.alumno_id == alumno_id,
            Reserva.estado == EstadoReserva.REPROGRAMADA
        ).count()

    def puede_cancelar(self, reserva_id: int) -> bool:
        """Verificar si una reserva puede ser cancelada (> 2 horas antes)."""
        reserva = self.get_by_id(reserva_id)
        if not reserva:
            return False

        # Calcular diferencia en horas
        ahora = datetime.now(reserva.fecha.tzinfo)
        diferencia_horas = (reserva.fecha - ahora).total_seconds() / 3600

        return diferencia_horas >= 2
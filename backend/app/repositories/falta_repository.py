"""
Repository para Faltas.
"""

import uuid
from typing import List
from sqlalchemy.orm import Session
from app.models import Falta
from app.repositories.base_repository import BaseRepository


class FaltaRepository(BaseRepository[Falta]):
    """Repository para Falta."""

    def __init__(self, db: Session):
        super().__init__(db, Falta)

    def get_por_reserva(self, reserva_id: uuid.UUID) -> List[Falta]:
        """Obtener todas las faltas de una reserva."""
        return self.db.query(Falta).filter(Falta.reserva_id == reserva_id).all()
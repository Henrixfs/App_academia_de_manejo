"""
Repository para Servicios.
"""

from sqlalchemy.orm import Session
from app.models import Servicio
from app.repositories.base_repository import BaseRepository


class ServicioRepository(BaseRepository[Servicio]):
    """Repository para Servicio."""

    def __init__(self, db: Session):
        super().__init__(db, Servicio)

    def get_por_nombre(self, nombre: str):
        """Obtener servicio por nombre (exacto)."""
        return self.db.query(Servicio).filter(Servicio.nombre == nombre).first()
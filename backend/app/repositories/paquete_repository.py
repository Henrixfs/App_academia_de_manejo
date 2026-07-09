"""
Repository para Paquetes.
"""

from sqlalchemy.orm import Session
from app.models import Paquete
from app.repositories.base_repository import BaseRepository


class PaqueteRepository(BaseRepository[Paquete]):
    """Repository para Paquete."""

    def __init__(self, db: Session):
        super().__init__(db, Paquete)

    def get_by_nombre(self, nombre: str):
        """Obtener paquete por nombre."""
        return self.db.query(Paquete).filter(Paquete.nombre == nombre).first()
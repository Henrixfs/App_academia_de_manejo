"""
Servicio para Paquetes de formación.
"""

from typing import List
from sqlalchemy.orm import Session
from app.models import Paquete
from app.schemas import PaqueteResponse
from app.repositories.paquete_repository import PaqueteRepository
from app.exceptions import ServicioNotFound


class PaqueteService:
    """Servicio para Paquetes."""

    def __init__(self, db: Session):
        self.db = db
        self.repo = PaqueteRepository(db)

    def listar_paquetes(self) -> List[PaqueteResponse]:
        """Listar todos los paquetes disponibles."""
        paquetes = self.repo.get_all()
        return [PaqueteResponse.from_orm(p) for p in paquetes]

    def obtener_paquete(self, paquete_id: int) -> PaqueteResponse:
        """Obtener un paquete."""
        paquete = self.repo.get_by_id(paquete_id)
        if not paquete:
            raise ServicioNotFound()
        return PaqueteResponse.from_orm(paquete)
import uuid
from typing import List

from sqlalchemy.orm import Session

from app.exceptions import ServicioNotFound
from app.repositories.paquete_repository import PaqueteRepository
from app.schemas import PaqueteResponse


class PaqueteService:
    def __init__(self, db: Session):
        self.repo = PaqueteRepository(db)

    def listar_paquetes(self, skip: int = 0, limit: int = 100) -> List[PaqueteResponse]:
        return [PaqueteResponse.model_validate(item) for item in self.repo.get_all(skip, limit)]

    def contar_paquetes(self) -> int:
        return self.repo.count()

    def obtener_paquete(self, paquete_id: uuid.UUID) -> PaqueteResponse:
        paquete = self.repo.get_by_id(paquete_id)
        if not paquete:
            raise ServicioNotFound()
        return PaqueteResponse.model_validate(paquete)

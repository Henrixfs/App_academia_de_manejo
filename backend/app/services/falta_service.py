"""
Servicio para registro de Faltas en simulacros.
"""

import uuid
from typing import List
from sqlalchemy.orm import Session
from app.models import Falta, TipoFalta
from app.schemas import FaltaCreate, FaltaResponse
from app.repositories.falta_repository import FaltaRepository
from app.repositories.reserva_repository import ReservaRepository
from app.exceptions import ReservaNotFound, ValorInvalido


class FaltaService:
    """Servicio para Faltas."""

    def __init__(self, db: Session):
        self.db = db
        self.repo_falta = FaltaRepository(db)
        self.repo_reserva = ReservaRepository(db)

    def registrar_falta(self, falta_create: FaltaCreate) -> FaltaResponse:
        """Registrar una falta en una reserva."""
        # Validar que reserva existe
        if not self.repo_reserva.get_by_id(falta_create.reserva_id):
            raise ReservaNotFound()

        # Validar tipo de falta válido
        if falta_create.tipo_falta not in [TipoFalta.LEVE, TipoFalta.GRAVE, TipoFalta.ELIMINATORIA]:
            raise ValorInvalido("tipo_falta", "Tipo de falta inválido")

        # Crear falta
        falta = Falta(
            reserva_id=falta_create.reserva_id,
            tipo_falta=falta_create.tipo_falta,
            descripcion=falta_create.descripcion,
            minuto_ocurrencia=falta_create.minuto_ocurrencia,
            observaciones=falta_create.observaciones,
        )

        falta = self.repo_falta.create(falta)
        return FaltaResponse.from_orm(falta)

    def listar_faltas_por_reserva(self, reserva_id: uuid.UUID) -> List[FaltaResponse]:
        """Listar todas las faltas de una reserva."""
        if not self.repo_reserva.get_by_id(reserva_id):
            raise ReservaNotFound()
        faltas = self.repo_falta.get_por_reserva(reserva_id)
        return [FaltaResponse.from_orm(f) for f in faltas]
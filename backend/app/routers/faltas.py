"""
Rutas para Faltas (registro en simulacros).
"""

import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import FaltaCreate, FaltaResponse
from app.services.falta_service import FaltaService
from app.exceptions import ReservaNotFound, ValorInvalido
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/faltas", tags=["Faltas"])


@router.post("/", response_model=FaltaResponse, status_code=status.HTTP_201_CREATED)
def registrar_falta(
    falta_create: FaltaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Registrar una falta en una reserva. Requiere autenticación."""
    try:
        service = FaltaService(db)
        return service.registrar_falta(falta_create)
    except (ReservaNotFound, ValorInvalido) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/reserva/{reserva_id}", response_model=List[FaltaResponse])
def obtener_faltas_reserva(
    reserva_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Obtener todas las faltas de una reserva. Requiere autenticación."""
    try:
        service = FaltaService(db)
        return service.listar_faltas_por_reserva(reserva_id)
    except ReservaNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
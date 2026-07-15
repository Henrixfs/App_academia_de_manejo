import uuid
from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import CurrentUser, get_current_admin
from app.schemas import FaltaCreate, FaltaResponse
from app.services.falta_service import FaltaService


router = APIRouter(prefix="/api/admin/faltas", tags=["Administración de faltas"])


@router.post("/", response_model=FaltaResponse, status_code=status.HTTP_201_CREATED)
def registrar_falta(
    falta_create: FaltaCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> FaltaResponse:
    return FaltaService(db).registrar_falta(falta_create)


@router.get("/reserva/{reserva_id}", response_model=List[FaltaResponse])
def obtener_faltas_reserva(
    reserva_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> List[FaltaResponse]:
    return FaltaService(db).listar_faltas_por_reserva(reserva_id)

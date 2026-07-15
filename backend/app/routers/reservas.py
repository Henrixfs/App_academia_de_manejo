import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, model_validator
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import CurrentUser, get_current_admin
from app.schemas import ReservaCreate, ReservaPage, ReservaResponse, ReservaUpdate
from app.services.reserva_service import ReservaService


router = APIRouter(prefix="/api/admin/reservas", tags=["Administración de reservas"])


class ReprogramarRequest(BaseModel):
    nueva_fecha_hora_inicio: datetime
    nueva_fecha_hora_fin: datetime

    @model_validator(mode="after")
    def validar_rango(self) -> "ReprogramarRequest":
        if self.nueva_fecha_hora_fin <= self.nueva_fecha_hora_inicio:
            raise ValueError("La fecha final debe ser posterior a la inicial")
        return self


@router.post("/", response_model=ReservaResponse, status_code=status.HTTP_201_CREATED)
def crear_reserva(
    reserva_create: ReservaCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> ReservaResponse:
    return ReservaService(db).crear_reserva(reserva_create)


@router.get("/", response_model=ReservaPage)
def listar_reservas(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> ReservaPage:
    service = ReservaService(db)
    return ReservaPage(
        items=service.listar_reservas((page - 1) * page_size, page_size),
        total=service.contar_reservas(),
        page=page,
        page_size=page_size,
    )


@router.get("/alumno/{alumno_id}", response_model=ReservaPage)
def obtener_reservas_alumno(
    alumno_id: uuid.UUID,
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> ReservaPage:
    items = ReservaService(db).listar_por_alumno(alumno_id)
    start = (page - 1) * page_size
    return ReservaPage(items=items[start:start + page_size], total=len(items), page=page, page_size=page_size)


@router.get("/{reserva_id}", response_model=ReservaResponse)
def obtener_reserva(
    reserva_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> ReservaResponse:
    return ReservaService(db).obtener_reserva(reserva_id)


@router.post("/{reserva_id}/cancelar", response_model=ReservaResponse)
def cancelar_reserva(
    reserva_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> ReservaResponse:
    return ReservaService(db).cancelar_reserva(reserva_id)


@router.post("/{reserva_id}/reprogramar", response_model=ReservaResponse)
def reprogramar_reserva(
    reserva_id: uuid.UUID,
    data: ReprogramarRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> ReservaResponse:
    return ReservaService(db).reprogramar_reserva(
        reserva_id,
        data.nueva_fecha_hora_inicio,
        data.nueva_fecha_hora_fin,
    )


@router.post("/{reserva_id}/confirmar", response_model=ReservaResponse)
def confirmar_reserva(
    reserva_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> ReservaResponse:
    return ReservaService(db).confirmar_reserva(reserva_id)


@router.put("/{reserva_id}", response_model=ReservaResponse)
def actualizar_reserva(
    reserva_id: uuid.UUID,
    reserva_update: ReservaUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> ReservaResponse:
    return ReservaService(db).actualizar_reserva(reserva_id, reserva_update)

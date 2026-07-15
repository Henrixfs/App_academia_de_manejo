import uuid
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, model_validator
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import CurrentUser, get_current_alumno
from app.schemas import AlumnoResponse, AlumnoUpdate, FaltaResponse, ReservaPage, ReservaResponse
from app.services.alumno_service import AlumnoService
from app.services.falta_service import FaltaService
from app.services.reserva_service import ReservaService


router = APIRouter(prefix="/api/me", tags=["Mi cuenta"])


class ReprogramarMiReservaRequest(BaseModel):
    nueva_fecha_hora_inicio: datetime
    nueva_fecha_hora_fin: datetime

    @model_validator(mode="after")
    def validar_rango(self) -> "ReprogramarMiReservaRequest":
        if self.nueva_fecha_hora_fin <= self.nueva_fecha_hora_inicio:
            raise ValueError("La fecha final debe ser posterior a la inicial")
        return self


@router.get("", response_model=AlumnoResponse)
def obtener_mi_perfil(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_alumno),
) -> AlumnoResponse:
    return AlumnoService(db).obtener_alumno(current_user["id"])


@router.put("", response_model=AlumnoResponse)
def actualizar_mi_perfil(
    alumno_update: AlumnoUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_alumno),
) -> AlumnoResponse:
    return AlumnoService(db).actualizar_alumno(current_user["id"], alumno_update)


@router.get("/reservas", response_model=ReservaPage)
def listar_mis_reservas(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_alumno),
) -> ReservaPage:
    items = ReservaService(db).listar_por_alumno(current_user["id"])
    start = (page - 1) * page_size
    return ReservaPage(items=items[start:start + page_size], total=len(items), page=page, page_size=page_size)


@router.get("/reservas/{reserva_id}", response_model=ReservaResponse)
def obtener_mi_reserva(
    reserva_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_alumno),
) -> ReservaResponse:
    return ReservaService(db).obtener_reserva_de_alumno(reserva_id, current_user["id"])


@router.post("/reservas/{reserva_id}/cancelar", response_model=ReservaResponse)
def cancelar_mi_reserva(
    reserva_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_alumno),
) -> ReservaResponse:
    return ReservaService(db).cancelar_reserva(reserva_id, current_user["id"])


@router.post("/reservas/{reserva_id}/reprogramar", response_model=ReservaResponse)
def reprogramar_mi_reserva(
    reserva_id: uuid.UUID,
    data: ReprogramarMiReservaRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_alumno),
) -> ReservaResponse:
    return ReservaService(db).reprogramar_reserva(
        reserva_id,
        data.nueva_fecha_hora_inicio,
        data.nueva_fecha_hora_fin,
        current_user["id"],
    )


@router.get("/reservas/{reserva_id}/faltas", response_model=List[FaltaResponse])
def obtener_mis_faltas(
    reserva_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_alumno),
) -> List[FaltaResponse]:
    ReservaService(db).obtener_reserva_de_alumno(reserva_id, current_user["id"])
    return FaltaService(db).listar_faltas_por_reserva(reserva_id)

"""
Rutas para gestión de Reservas.
"""

import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.schemas import ReservaCreate, ReservaUpdate, ReservaResponse
from app.services.reserva_service import ReservaService
from app.exceptions import (
    ReservaNotFound, AlumnoNotFound, ServicioNotFound,
    ReservaYaExiste, CancelacionNoPermitida, LimitReprogramacionesExcedido, ValorInvalido
)
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/reservas", tags=["Reservas"])


class ReprogramarRequest(BaseModel):
    """Cuerpo del request para reprogramar una reserva."""
    nueva_fecha_hora_inicio: datetime
    nueva_fecha_hora_fin: datetime


@router.post("/", response_model=ReservaResponse, status_code=status.HTTP_201_CREATED)
def crear_reserva(
    reserva_create: ReservaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Crear una nueva reserva. Requiere autenticación."""
    try:
        service = ReservaService(db)
        return service.crear_reserva(reserva_create)
    except (AlumnoNotFound, ServicioNotFound, ReservaYaExiste, ValorInvalido) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/", response_model=List[ReservaResponse])
def listar_reservas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Listar todas las reservas. Requiere autenticación."""
    service = ReservaService(db)
    return service.listar_reservas(skip, limit)


@router.get("/alumno/{alumno_id}", response_model=List[ReservaResponse])
def obtener_reservas_alumno(
    alumno_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Obtener todas las reservas de un alumno. Requiere autenticación."""
    try:
        service = ReservaService(db)
        return service.listar_por_alumno(alumno_id)
    except AlumnoNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{reserva_id}", response_model=ReservaResponse)
def obtener_reserva(
    reserva_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Obtener una reserva por ID. Requiere autenticación."""
    try:
        service = ReservaService(db)
        return service.obtener_reserva(reserva_id)
    except ReservaNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/{reserva_id}/cancelar", response_model=ReservaResponse)
def cancelar_reserva(
    reserva_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Cancelar una reserva. Requiere autenticación."""
    try:
        service = ReservaService(db)
        return service.cancelar_reserva(reserva_id)
    except (ReservaNotFound, CancelacionNoPermitida) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/{reserva_id}/reprogramar", response_model=ReservaResponse)
def reprogramar_reserva(
    reserva_id: uuid.UUID,
    data: ReprogramarRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Reprogramar una reserva con nueva fecha/hora. Requiere autenticación."""
    try:
        service = ReservaService(db)
        return service.reprogramar_reserva(
            reserva_id,
            data.nueva_fecha_hora_inicio,
            data.nueva_fecha_hora_fin,
        )
    except (ReservaNotFound, LimitReprogramacionesExcedido, ReservaYaExiste, ValorInvalido) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/{reserva_id}", response_model=ReservaResponse)
def actualizar_reserva(
    reserva_id: uuid.UUID,
    reserva_update: ReservaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Actualizar una reserva. Requiere autenticación."""
    try:
        service = ReservaService(db)
        return service.actualizar_reserva(reserva_id, reserva_update)
    except ReservaNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
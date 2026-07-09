"""
Rutas para gestión de Reservas.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.schemas import ReservaCreate, ReservaUpdate, ReservaResponse
from app.services.reserva_service import ReservaService
from app.exceptions import (
    ReservaNotFound, AlumnoNotFound, ServicioNotFound,
    ReservaYaExiste, CancelacionNoPermitida, LimitReprogramacionesExcedido, ValorInvalido
)

router = APIRouter(prefix="/api/reservas", tags=["Reservas"])


@router.post("/", response_model=ReservaResponse, status_code=status.HTTP_201_CREATED)
def crear_reserva(reserva_create: ReservaCreate, db: Session = Depends(get_db)):
    """Crear una nueva reserva."""
    try:
        service = ReservaService(db)
        return service.crear_reserva(reserva_create)
    except (AlumnoNotFound, ServicioNotFound, ReservaYaExiste, ValorInvalido) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/", response_model=List[ReservaResponse])
def listar_reservas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Listar todas las reservas."""
    service = ReservaService(db)
    return service.listar_reservas(skip, limit)


@router.get("/{reserva_id}", response_model=ReservaResponse)
def obtener_reserva(reserva_id: int, db: Session = Depends(get_db)):
    """Obtener una reserva por ID."""
    try:
        service = ReservaService(db)
        return service.obtener_reserva(reserva_id)
    except ReservaNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/alumno/{alumno_id}", response_model=List[ReservaResponse])
def obtener_reservas_alumno(alumno_id: int, db: Session = Depends(get_db)):
    """Obtener todas las reservas de un alumno."""
    try:
        service = ReservaService(db)
        return service.listar_por_alumno(alumno_id)
    except AlumnoNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/{reserva_id}/cancelar", response_model=ReservaResponse)
def cancelar_reserva(reserva_id: int, db: Session = Depends(get_db)):
    """Cancelar una reserva."""
    try:
        service = ReservaService(db)
        return service.cancelar_reserva(reserva_id)
    except (ReservaNotFound, CancelacionNoPermitida) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/{reserva_id}/reprogramar", response_model=ReservaResponse)
def reprogramar_reserva(reserva_id: int, nueva_fecha: datetime, db: Session = Depends(get_db)):
    """Reprogramar una reserva."""
    try:
        service = ReservaService(db)
        return service.reprogramar_reserva(reserva_id, nueva_fecha)
    except (ReservaNotFound, LimitReprogramacionesExcedido, ReservaYaExiste, ValorInvalido) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/{reserva_id}", response_model=ReservaResponse)
def actualizar_reserva(reserva_id: int, reserva_update: ReservaUpdate, db: Session = Depends(get_db)):
    """Actualizar una reserva."""
    try:
        service = ReservaService(db)
        return service.actualizar_reserva(reserva_id, reserva_update)
    except ReservaNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
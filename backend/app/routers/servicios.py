"""
Rutas para gestión de Servicios.
"""

from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import ServicioCreate, ServicioUpdate, ServicioResponse
from app.services.servicio_service import ServicioService
from app.exceptions import ServicioNotFound, ValorInvalido
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/servicios", tags=["Servicios"])


@router.post("/", response_model=ServicioResponse, status_code=status.HTTP_201_CREATED)
def crear_servicio(
    servicio_create: ServicioCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Crear un nuevo servicio. Requiere autenticación de administrador."""
    try:
        service = ServicioService(db)
        return service.crear_servicio(servicio_create)
    except ValorInvalido as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/", response_model=List[ServicioResponse])
def listar_servicios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Listar todos los servicios. Público."""
    service = ServicioService(db)
    return service.listar_servicios(skip, limit)


@router.get("/{servicio_id}", response_model=ServicioResponse)
def obtener_servicio(servicio_id: uuid.UUID, db: Session = Depends(get_db)):
    """Obtener un servicio por ID. Público."""
    try:
        service = ServicioService(db)
        return service.obtener_servicio(servicio_id)
    except ServicioNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")


@router.put("/{servicio_id}", response_model=ServicioResponse)
def actualizar_servicio(
    servicio_id: uuid.UUID,
    servicio_update: ServicioUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Actualizar un servicio existente. Requiere autenticación."""
    try:
        service = ServicioService(db)
        return service.actualizar_servicio(servicio_id, servicio_update)
    except ServicioNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")
    except ValorInvalido as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{servicio_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_servicio(
    servicio_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Eliminar un servicio. Requiere autenticación."""
    try:
        service = ServicioService(db)
        service.eliminar_servicio(servicio_id)
    except ServicioNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")
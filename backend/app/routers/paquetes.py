"""
Rutas para Paquetes.
"""

import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import PaqueteResponse
from app.services.paquete_service import PaqueteService
from app.exceptions import ServicioNotFound

router = APIRouter(prefix="/api/paquetes", tags=["Paquetes"])


@router.get("/", response_model=List[PaqueteResponse])
def listar_paquetes(db: Session = Depends(get_db)):
    """Listar todos los paquetes disponibles."""
    service = PaqueteService(db)
    return service.listar_paquetes()


@router.get("/{paquete_id}", response_model=PaqueteResponse)
def obtener_paquete(paquete_id: uuid.UUID, db: Session = Depends(get_db)):
    """Obtener un paquete por ID."""
    try:
        service = PaqueteService(db)
        return service.obtener_paquete(paquete_id)
    except ServicioNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
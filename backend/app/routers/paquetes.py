import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import PaquetePage, PaqueteResponse
from app.services.paquete_service import PaqueteService


router = APIRouter(prefix="/api/paquetes", tags=["Paquetes"])


@router.get("/", response_model=PaquetePage)
def listar_paquetes(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
) -> PaquetePage:
    service = PaqueteService(db)
    return PaquetePage(
        items=service.listar_paquetes((page - 1) * page_size, page_size),
        total=service.contar_paquetes(),
        page=page,
        page_size=page_size,
    )


@router.get("/{paquete_id}", response_model=PaqueteResponse)
def obtener_paquete(paquete_id: uuid.UUID, db: Session = Depends(get_db)) -> PaqueteResponse:
    return PaqueteService(db).obtener_paquete(paquete_id)

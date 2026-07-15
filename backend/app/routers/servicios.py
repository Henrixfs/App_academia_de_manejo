import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import CurrentUser, get_current_admin
from app.schemas import ServicioCreate, ServicioPage, ServicioResponse, ServicioUpdate
from app.services.servicio_service import ServicioService


router = APIRouter(prefix="/api/servicios", tags=["Servicios"])
admin_router = APIRouter(prefix="/api/admin/servicios", tags=["Administración de servicios"])


@admin_router.post("/", response_model=ServicioResponse, status_code=status.HTTP_201_CREATED)
def crear_servicio(
    servicio_create: ServicioCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> ServicioResponse:
    return ServicioService(db).crear_servicio(servicio_create)


@router.get("/", response_model=ServicioPage)
def listar_servicios(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
) -> ServicioPage:
    service = ServicioService(db)
    return ServicioPage(
        items=service.listar_servicios((page - 1) * page_size, page_size),
        total=service.contar_servicios(),
        page=page,
        page_size=page_size,
    )


@router.get("/{servicio_id}", response_model=ServicioResponse)
def obtener_servicio(servicio_id: uuid.UUID, db: Session = Depends(get_db)) -> ServicioResponse:
    return ServicioService(db).obtener_servicio(servicio_id)


@admin_router.put("/{servicio_id}", response_model=ServicioResponse)
def actualizar_servicio(
    servicio_id: uuid.UUID,
    servicio_update: ServicioUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> ServicioResponse:
    return ServicioService(db).actualizar_servicio(servicio_id, servicio_update)


@admin_router.delete("/{servicio_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_servicio(
    servicio_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> None:
    ServicioService(db).eliminar_servicio(servicio_id)

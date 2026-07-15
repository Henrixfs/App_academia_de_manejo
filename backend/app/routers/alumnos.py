import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import CurrentUser, get_current_admin
from app.schemas import AlumnoCreate, AlumnoPage, AlumnoResponse, AlumnoUpdate
from app.services.alumno_service import AlumnoService


router = APIRouter(prefix="/api/admin/alumnos", tags=["Administración de alumnos"])


@router.post("/", response_model=AlumnoResponse, status_code=status.HTTP_201_CREATED)
def crear_alumno(
    alumno_create: AlumnoCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> AlumnoResponse:
    return AlumnoService(db).crear_alumno(alumno_create)


@router.get("/", response_model=AlumnoPage)
def listar_alumnos(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> AlumnoPage:
    service = AlumnoService(db)
    return AlumnoPage(
        items=service.listar_alumnos((page - 1) * page_size, page_size),
        total=service.contar_alumnos(),
        page=page,
        page_size=page_size,
    )


@router.get("/{alumno_id}", response_model=AlumnoResponse)
def obtener_alumno(
    alumno_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> AlumnoResponse:
    return AlumnoService(db).obtener_alumno(alumno_id)


@router.put("/{alumno_id}", response_model=AlumnoResponse)
def actualizar_alumno(
    alumno_id: uuid.UUID,
    alumno_update: AlumnoUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> AlumnoResponse:
    return AlumnoService(db).actualizar_alumno(alumno_id, alumno_update)


@router.delete("/{alumno_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_alumno(
    alumno_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_admin),
) -> None:
    AlumnoService(db).eliminar_alumno(alumno_id)

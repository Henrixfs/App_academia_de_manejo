"""
Rutas para gestion de Alumnos.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import AlumnoCreate, AlumnoUpdate, AlumnoResponse
from app.services.alumno_service import AlumnoService
from app.exceptions import AlumnoNotFound, ValorInvalido

router = APIRouter(prefix="/api/alumnos", tags=["Alumnos"])

@router.get("/test")
def test():
    return {"test": "ok"}


@router.post("/", response_model=AlumnoResponse, status_code=status.HTTP_201_CREATED)
def crear_alumno(alumno_create: AlumnoCreate, db: Session = Depends(get_db)):
    """Crear un nuevo alumno."""
    print("DEBUG: crear_alumno called")
    try:
        service = AlumnoService(db)
        return service.crear_alumno(alumno_create)
    except ValorInvalido as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/", response_model=List[AlumnoResponse])
def listar_alumnos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Listar todos los alumnos."""
    service = AlumnoService(db)
    return service.listar_alumnos(skip, limit)


@router.get("/{alumno_id}", response_model=AlumnoResponse)
def obtener_alumno(alumno_id: int, db: Session = Depends(get_db)):
    """Obtener un alumno por ID."""
    try:
        service = AlumnoService(db)
        return service.obtener_alumno(alumno_id)
    except AlumnoNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/{alumno_id}", response_model=AlumnoResponse)
def actualizar_alumno(alumno_id: int, alumno_update: AlumnoUpdate, db: Session = Depends(get_db)):
    """Actualizar un alumno."""
    try:
        service = AlumnoService(db)
        return service.actualizar_alumno(alumno_id, alumno_update)
    except (AlumnoNotFound, ValorInvalido) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{alumno_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_alumno(alumno_id: int, db: Session = Depends(get_db)):
    """Eliminar un alumno."""
    try:
        service = AlumnoService(db)
        service.eliminar_alumno(alumno_id)
    except AlumnoNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
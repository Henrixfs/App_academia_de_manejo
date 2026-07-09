"""
Repository para operaciones con Alumnos.
"""

from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models import Alumno
from app.repositories.base_repository import BaseRepository


class AlumnoRepository(BaseRepository[Alumno]):
    """Repository para Alumno."""

    def __init__(self, db: Session):
        super().__init__(db, Alumno)

    def get_by_email(self, email: str) -> Optional[Alumno]:
        """Obtener alumno por email."""
        return self.db.query(Alumno).filter(Alumno.email == email).first()

    def get_by_telefono(self, telefono: str) -> Optional[Alumno]:
        """Obtener alumno por teléfono."""
        return self.db.query(Alumno).filter(Alumno.telefono == telefono).first()

    def exists_email(self, email: str) -> bool:
        """Verificar si email ya existe."""
        return self.db.query(Alumno).filter(Alumno.email == email).first() is not None
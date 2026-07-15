"""
Repository para operaciones con Alumnos.
"""

from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from app.models import Alumno
from app.repositories.base_repository import BaseRepository


class AlumnoRepository(BaseRepository[Alumno]):
    """Repository para Alumno."""

    def __init__(self, db: Session):
        super().__init__(db, Alumno)

    def get_by_email(self, email: str) -> Optional[Alumno]:
        """Obtener alumno por email."""
        return self.db.query(Alumno).filter(Alumno.email == email).first()

    def get_by_documento_identidad(self, documento: str) -> Optional[Alumno]:
        """Obtener alumno por documento de identidad."""
        return self.db.query(Alumno).filter(Alumno.documento_identidad == documento).first()

    def get_by_email_or_documento(self, username: str) -> Optional[Alumno]:
        """Obtener alumno por email o documento de identidad."""
        return self.db.query(Alumno).filter(
            or_(
                Alumno.email == username,
                Alumno.documento_identidad == username
            )
        ).first()

    def get_by_telefono(self, telefono: str) -> Optional[Alumno]:
        """Obtener alumno por teléfono."""
        return self.db.query(Alumno).filter(Alumno.telefono == telefono).first()

    def exists_email(self, email: Optional[str]) -> bool:
        """Verificar si email ya existe."""
        return self.db.query(Alumno).filter(Alumno.email == email).first() is not None

    def update_password_hash(self, alumno_id, password_hash: str) -> bool:
        """Actualiza el password hash de un alumno."""
        alumno = self.get_by_id(alumno_id)
        if not alumno:
            return False
        alumno.password_hash = password_hash
        self.db.flush()
        return True

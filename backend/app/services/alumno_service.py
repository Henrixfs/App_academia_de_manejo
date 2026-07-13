"""
Servicio de lógica de negocio para Alumnos.
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from app.models import Alumno
from app.schemas import AlumnoCreate, AlumnoUpdate, AlumnoResponse
from app.repositories.alumno_repository import AlumnoRepository
from app.exceptions import AlumnoNotFound, ValorInvalido


class AlumnoService:
    """Servicio para operaciones con Alumnos."""

    def __init__(self, db: Session):
        self.db = db
        self.repo = AlumnoRepository(db)

    def crear_alumno(self, alumno_create: AlumnoCreate) -> AlumnoResponse:
        """Crear un nuevo alumno con validaciones."""
        # Validar email único
        if self.repo.exists_email(alumno_create.email):
            raise ValorInvalido("email", "Ya existe un alumno con este email")

        # Crear instancia
        alumno = Alumno(
            nombres=alumno_create.nombres,
            apellidos=alumno_create.apellidos,
            documento_identidad=alumno_create.documento_identidad,
            telefono=alumno_create.telefono,
            email=alumno_create.email,
        )

        # Guardar
        alumno = self.repo.create(alumno)
        return AlumnoResponse.from_orm(alumno)

    def obtener_alumno(self, alumno_id: int) -> AlumnoResponse:
        """Obtener un alumno por ID."""
        alumno = self.repo.get_by_id(alumno_id)
        if not alumno:
            raise AlumnoNotFound()
        return AlumnoResponse.from_orm(alumno)

    def listar_alumnos(self, skip: int = 0, limit: int = 100) -> List[AlumnoResponse]:
        """Listar todos los alumnos."""
        alumnos = self.repo.get_all(skip, limit)
        return [AlumnoResponse.from_orm(a) for a in alumnos]

    def actualizar_alumno(self, alumno_id: int, alumno_update: AlumnoUpdate) -> AlumnoResponse:
        """Actualizar datos de un alumno."""
        alumno = self.repo.get_by_id(alumno_id)
        if not alumno:
            raise AlumnoNotFound()

        # Validar email si se intenta cambiar
        if alumno_update.email and alumno_update.email != alumno.email:
            if self.repo.exists_email(alumno_update.email):
                raise ValorInvalido("email", "Ya existe un alumno con este email")

        # Actualizar
        actualizado = self.repo.update(
            alumno_id,
            alumno_update.dict(exclude_unset=True)
        )
        return AlumnoResponse.from_orm(actualizado)

    def eliminar_alumno(self, alumno_id: int) -> bool:
        """Eliminar un alumno."""
        if not self.repo.get_by_id(alumno_id):
            raise AlumnoNotFound()
        return self.repo.delete(alumno_id)

    def obtener_por_email(self, email: str) -> Optional[AlumnoResponse]:
        """Obtener alumno por email."""
        alumno = self.repo.get_by_email(email)
        if not alumno:
            return None
        return AlumnoResponse.from_orm(alumno)

    def obtener_por_email_o_documento(self, username: str) -> Optional[Alumno]:
        """Obtener alumno por email o documento de identidad."""
        return self.repo.get_by_email_or_documento(username)

    def update_password_hash(self, alumno_id, password_hash: str) -> bool:
        """Actualiza el password hash de un alumno."""
        return self.repo.update_password_hash(alumno_id, password_hash)
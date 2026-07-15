import uuid
from typing import List, Optional

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.exceptions import AcademiaException, AlumnoNotFound, ValorInvalido
from app.models import Alumno
from app.repositories.alumno_repository import AlumnoRepository
from app.schemas import AlumnoCreate, AlumnoResponse, AlumnoUpdate


class AlumnoService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = AlumnoRepository(db)

    def crear_alumno(self, alumno_create: AlumnoCreate, password_hash: str | None = None) -> AlumnoResponse:
        if alumno_create.email and self.repo.exists_email(alumno_create.email):
            raise ValorInvalido("email", "Ya existe un alumno con este email")
        if self.repo.get_by_documento_identidad(alumno_create.documento_identidad):
            raise ValorInvalido("documento_identidad", "Ya existe un alumno con este documento")
        alumno = Alumno(
            nombres=alumno_create.nombres.strip(),
            apellidos=alumno_create.apellidos.strip(),
            documento_identidad=alumno_create.documento_identidad.strip(),
            telefono=alumno_create.telefono.strip(),
            email=str(alumno_create.email).lower() if alumno_create.email else None,
            password_hash=password_hash,
        )
        try:
            self.repo.create(alumno)
            self.db.commit()
            self.db.refresh(alumno)
        except IntegrityError as exc:
            self.db.rollback()
            raise ValorInvalido("alumno", "Email o documento duplicado") from exc
        return AlumnoResponse.model_validate(alumno)

    def obtener_alumno(self, alumno_id: uuid.UUID) -> AlumnoResponse:
        alumno = self.repo.get_by_id(alumno_id)
        if not alumno:
            raise AlumnoNotFound()
        return AlumnoResponse.model_validate(alumno)

    def listar_alumnos(self, skip: int = 0, limit: int = 100) -> List[AlumnoResponse]:
        return [AlumnoResponse.model_validate(item) for item in self.repo.get_all(skip, limit)]

    def contar_alumnos(self) -> int:
        return self.repo.count()

    def actualizar_alumno(self, alumno_id: uuid.UUID, alumno_update: AlumnoUpdate) -> AlumnoResponse:
        alumno = self.repo.get_by_id(alumno_id)
        if not alumno:
            raise AlumnoNotFound()
        if alumno_update.email and str(alumno_update.email).lower() != alumno.email:
            if self.repo.exists_email(str(alumno_update.email).lower()):
                raise ValorInvalido("email", "Ya existe un alumno con este email")
        data = alumno_update.model_dump(exclude_unset=True)
        if data.get("email"):
            data["email"] = str(data["email"]).lower()
        try:
            actualizado = self.repo.update(alumno_id, data)
            self.db.commit()
            self.db.refresh(actualizado)
        except IntegrityError as exc:
            self.db.rollback()
            raise ValorInvalido("alumno", "Los datos entran en conflicto con otro alumno") from exc
        return AlumnoResponse.model_validate(actualizado)

    def eliminar_alumno(self, alumno_id: uuid.UUID) -> bool:
        if not self.repo.get_by_id(alumno_id):
            raise AlumnoNotFound()
        try:
            resultado = self.repo.delete(alumno_id)
            self.db.commit()
            return resultado
        except IntegrityError as exc:
            self.db.rollback()
            raise AcademiaException("No se puede eliminar un alumno con registros asociados", 409, "ALUMNO_EN_USO") from exc

    def obtener_por_email(self, email: str) -> Optional[AlumnoResponse]:
        alumno = self.repo.get_by_email(email.lower())
        return AlumnoResponse.model_validate(alumno) if alumno else None

    def obtener_por_email_o_documento(self, username: str) -> Optional[Alumno]:
        return self.repo.get_by_email_or_documento(username.strip())

"""
Servicio de lógica de negocio para Administradores.
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from app.models import Administrador
from app.schemas import AdminCreate, AdminUpdate, AdminResponse
from app.repositories.administrador_repository import AdministradorRepository
from app.exceptions import AdministradorNotFound, CredencialesIncorrectas, AdminYaExiste, ValorInvalido
from app.utils.auth import verify_password, get_password_hash


class AdministradorService:
    """Servicio para operaciones con Administradores."""

    def __init__(self, db: Session):
        self.db = db
        self.repo = AdministradorRepository(db)

    def autenticar(self, email: str, password: str) -> Optional[Administrador]:
        """Autenticar un administrador por email y password."""
        admin = self.repo.get_by_email(email)
        if not admin:
            return None
        if not verify_password(password, admin.password_hash):
            return None
        if not admin.activo:
            return None
        return admin

    def crear_admin(self, admin_create: AdminCreate, password_hash: str) -> AdminResponse:
        """Crear un nuevo administrador."""
        if self.repo.exists_email(admin_create.email):
            raise AdminYaExiste()

        admin = Administrador(
            email=admin_create.email,
            nombres=admin_create.nombres,
            apellidos=admin_create.apellidos,
            telefono=admin_create.telefono,
            password_hash=password_hash,
        )

        admin = self.repo.create(admin)
        return AdminResponse.model_validate(admin)

    def obtener_admin(self, admin_id) -> AdminResponse:
        """Obtener un administrador por ID."""
        admin = self.repo.get_by_id(admin_id)
        if not admin:
            raise AdministradorNotFound()
        return AdminResponse.model_validate(admin)

    def listar_admins(self, skip: int = 0, limit: int = 100) -> List[AdminResponse]:
        """Listar todos los administradores activos."""
        admins = self.repo.get_all_activos(skip, limit)
        return [AdminResponse.model_validate(a) for a in admins]

    def actualizar_admin(self, admin_id, admin_update: AdminUpdate) -> AdminResponse:
        """Actualizar datos de un administrador."""
        admin = self.repo.get_by_id(admin_id)
        if not admin:
            raise AdministradorNotFound()

        if admin_update.email and admin_update.email != admin.email:
            if self.repo.exists_email(admin_update.email):
                raise AdminYaExiste()

        update_data = admin_update.model_dump(exclude_unset=True)
        if update_data:
            updated = self.repo.update(admin_id, update_data)
            return AdminResponse.model_validate(updated)
        return AdminResponse.model_validate(admin)

    def eliminar_admin(self, admin_id) -> bool:
        """Eliminar un administrador (soft delete - desactivar)."""
        admin = self.repo.get_by_id(admin_id)
        if not admin:
            raise AdministradorNotFound()
        admin.activo = False
        self.db.commit()
        return True

    def get_by_email(self, email: str) -> Optional[AdminResponse]:
        """Obtener administrador por email."""
        admin = self.repo.get_by_email(email)
        if not admin:
            return None
        return AdminResponse.model_validate(admin)

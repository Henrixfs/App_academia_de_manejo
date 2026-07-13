"""
Repository para operaciones con Administradores.
"""

from typing import Optional
from sqlalchemy.orm import Session
from app.models import Administrador
from app.repositories.base_repository import BaseRepository


class AdministradorRepository(BaseRepository[Administrador]):
    """Repository para Administrador."""

    def __init__(self, db: Session):
        super().__init__(db, Administrador)

    def get_by_email(self, email: str) -> Optional[Administrador]:
        """Obtener administrador por email."""
        return self.db.query(Administrador).filter(Administrador.email == email).first()

    def exists_email(self, email: str) -> bool:
        """Verificar si email ya existe."""
        return self.db.query(Administrador).filter(Administrador.email == email).first() is not None

    def get_all_activos(self, skip: int = 0, limit: int = 100):
        """Listar solo administradores activos."""
        return self.db.query(Administrador).filter(
            Administrador.activo == True
        ).offset(skip).limit(limit).all()

    def update_password_hash(self, admin_id, password_hash: str) -> bool:
        """Actualiza el password hash de un administrador."""
        admin = self.get_by_id(admin_id)
        if not admin:
            return False
        admin.password_hash = password_hash
        self.db.commit()
        return True

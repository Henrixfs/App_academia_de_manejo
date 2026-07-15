"""
Servicio de lógica de negocio para Servicios.
"""

from typing import Optional, List
import uuid
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import Servicio
from app.schemas import ServicioCreate, ServicioUpdate, ServicioResponse
from app.repositories.servicio_repository import ServicioRepository
from app.exceptions import ConflictoDatos, ServicioNotFound


class ServicioService:
    """Servicio para operaciones con Servicios."""

    def __init__(self, db: Session):
        self.db = db
        self.repo = ServicioRepository(db)

    def crear_servicio(self, servicio_create: ServicioCreate) -> ServicioResponse:
        """Crear un nuevo servicio con validaciones."""
        servicio = Servicio(
            nombre=servicio_create.nombre,
            descripcion=servicio_create.descripcion,
            tarifa=servicio_create.tarifa,
            tiempo_minimo_horas=servicio_create.tiempo_minimo_horas,
        )
        try:
            servicio = self.repo.create(servicio)
            self.db.commit()
            self.db.refresh(servicio)
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictoDatos("Ya existe un servicio con ese nombre") from exc
        return ServicioResponse.model_validate(servicio)

    def obtener_servicio(self, servicio_id: uuid.UUID) -> ServicioResponse:
        """Obtener un servicio por ID."""
        servicio = self.repo.get_by_id(servicio_id)
        if not servicio:
            raise ServicioNotFound()
        return ServicioResponse.model_validate(servicio)

    def listar_servicios(self, skip: int = 0, limit: int = 100) -> List[ServicioResponse]:
        """Listar servicios."""
        servicios = self.repo.get_all(skip, limit)
        return [ServicioResponse.model_validate(s) for s in servicios]

    def actualizar_servicio(self, servicio_id: uuid.UUID, servicio_update: ServicioUpdate) -> ServicioResponse:
        """Actualizar un servicio existente."""
        servicio = self.repo.get_by_id(servicio_id)
        if not servicio:
            raise ServicioNotFound()
        update_data = servicio_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(servicio, field, value)
        try:
            servicio = self.repo.update(servicio_id, update_data)
            self.db.commit()
            self.db.refresh(servicio)
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictoDatos("El nombre del servicio ya está en uso") from exc
        return ServicioResponse.model_validate(servicio)

    def eliminar_servicio(self, servicio_id: uuid.UUID) -> bool:
        """Eliminar un servicio."""
        if not self.repo.get_by_id(servicio_id):
            raise ServicioNotFound()
        try:
            resultado = self.repo.delete(servicio_id)
            self.db.commit()
            return resultado
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictoDatos("No se puede eliminar un servicio con reservas relacionadas") from exc
        except Exception:
            self.db.rollback()
            raise

    def contar_servicios(self) -> int:
        return self.repo.count()

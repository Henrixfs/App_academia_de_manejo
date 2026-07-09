"""
Base repository con operaciones CRUD genéricas.
"""

from typing import TypeVar, Generic, Type, List, Optional, Any
from sqlalchemy.orm import Session
from sqlalchemy import select

T = TypeVar('T')


class BaseRepository(Generic[T]):
    """Repository genérico para modelos."""

    def __init__(self, db: Session, model_class: Type[T]):
        self.db = db
        self.model_class = model_class

    def create(self, obj: T) -> T:
        """Crear un nuevo objeto."""
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def get_by_id(self, id: Any) -> Optional[T]:
        """Obtener por ID."""
        return self.db.query(self.model_class).filter(self.model_class.id == id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        """Listar todos (con paginación)."""
        return self.db.query(self.model_class).offset(skip).limit(limit).all()

    def update(self, id: Any, obj_in: dict) -> Optional[T]:
        """Actualizar."""
        obj = self.get_by_id(id)
        if not obj:
            return None
        for key, value in obj_in.items():
            setattr(obj, key, value)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def delete(self, id: Any) -> bool:
        """Eliminar."""
        obj = self.get_by_id(id)
        if not obj:
            return False
        self.db.delete(obj)
        self.db.commit()
        return True
"""
Dependencias FastAPI para inyección de dependencias.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from app.database import get_db
from app.utils.auth import decode_access_token
from app.services.alumno_service import AlumnoService
from app.services.administrador_service import AdministradorService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> dict:
    """
    Dependency que obtiene el usuario actual desde el token JWT.

    Args:
        token: Token JWT del header Authorization: Bearer <token>
        db: Sesión de base de datos

    Returns:
        Dict con información del usuario (id, email, nombres, apellidos, rol)

    Raises:
        HTTPException: Si el token es inválido o el usuario no existe
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_exception

    payload = decode_access_token(token)

    if payload is None:
        raise credentials_exception

    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise credentials_exception

    rol = payload.get("rol", "alumno")

    if rol == "administrador":
        admin_service = AdministradorService(db)
        admin = admin_service.obtener_admin(user_uuid)
        return {
            "id": admin.id,
            "email": admin.email,
            "nombres": admin.nombres,
            "apellidos": admin.apellidos,
            "telefono": admin.telefono,
            "fecha_creacion": admin.fecha_creacion,
            "rol": "administrador",
        }
    else:
        service = AlumnoService(db)
        alumno = service.obtener_alumno(user_uuid)
        return {
            "id": alumno.id,
            "email": alumno.email or "",
            "nombres": alumno.nombres,
            "apellidos": alumno.apellidos,
            "rol": rol,
        }


async def get_current_admin(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> dict:
    """
    Dependency que obtiene el administrador actual desde el token JWT.

    Args:
        token: Token JWT del header Authorization: Bearer <token>
        db: Sesión de base de datos

    Returns:
        Dict con información del administrador (id, email, nombres, apellidos, rol)

    Raises:
        HTTPException: Si el token es inválido o el administrador no existe
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_exception

    payload = decode_access_token(token)

    if payload is None:
        raise credentials_exception

    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise credentials_exception

    service = AdministradorService(db)
    admin = service.obtener_admin(user_uuid)

    return {
        "id": admin.id,
        "email": admin.email,
        "nombres": admin.nombres,
        "apellidos": admin.apellidos,
        "telefono": admin.telefono,
        "fecha_creacion": admin.fecha_creacion,
        "rol": "administrador",
    }

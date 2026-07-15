import uuid
from typing import Literal, Optional, TypedDict

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.administrador_repository import AdministradorRepository
from app.repositories.alumno_repository import AlumnoRepository
from app.utils.auth import decode_access_token


class CurrentUser(TypedDict):
    id: uuid.UUID
    email: str
    nombres: str
    apellidos: str
    rol: Literal["alumno", "administrador"]


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)


def credentials_exception() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> CurrentUser:
    if not token:
        raise credentials_exception()
    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception()
    subject = payload.get("sub")
    role = payload.get("rol")
    if role not in {"alumno", "administrador"} or not subject:
        raise credentials_exception()
    try:
        user_id = uuid.UUID(subject)
    except (TypeError, ValueError) as exc:
        raise credentials_exception() from exc
    if role == "administrador":
        admin = AdministradorRepository(db).get_by_id(user_id)
        if not admin or not admin.activo:
            raise credentials_exception()
        return CurrentUser(
            id=admin.id,
            email=admin.email,
            nombres=admin.nombres,
            apellidos=admin.apellidos,
            rol="administrador",
        )
    alumno = AlumnoRepository(db).get_by_id(user_id)
    if not alumno:
        raise credentials_exception()
    return CurrentUser(
        id=alumno.id,
        email=alumno.email or "",
        nombres=alumno.nombres,
        apellidos=alumno.apellidos,
        rol="alumno",
    )


async def get_current_admin(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if current_user["rol"] != "administrador":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Se requiere rol administrador")
    return current_user


async def get_current_alumno(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if current_user["rol"] != "alumno":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Se requiere rol alumno")
    return current_user

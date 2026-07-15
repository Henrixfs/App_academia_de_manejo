import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.dependencies import CurrentUser, get_current_admin
from app.schemas import AdminCreate, AdminLoginRequest, AdminResponse, AdminUpdate, TokenResponse
from app.security.rate_limit import InMemoryRateLimiter
from app.services.administrador_service import AdministradorService
from app.utils.auth import create_access_token, get_password_hash


router = APIRouter(prefix="/api/admin", tags=["Administradores"])
admin_login_limiter = InMemoryRateLimiter(settings.LOGIN_RATE_LIMIT)


@router.post("/login", response_model=TokenResponse, dependencies=[Depends(admin_login_limiter)])
async def login(login_data: AdminLoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    admin = AdministradorService(db).autenticar(str(login_data.email).lower(), login_data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return TokenResponse(
        access_token=create_access_token({"sub": str(admin.id), "rol": "administrador"}),
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.get("/me", response_model=AdminResponse)
async def get_current_admin_info(
    db: Session = Depends(get_db),
    current_admin: CurrentUser = Depends(get_current_admin),
) -> AdminResponse:
    return AdministradorService(db).obtener_admin(current_admin["id"])


@router.get("/administradores", response_model=List[AdminResponse])
def listar_administradores(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: CurrentUser = Depends(get_current_admin),
) -> List[AdminResponse]:
    return AdministradorService(db).listar_admins(skip, min(limit, 100))


@router.post("/administradores", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
def crear_administrador(
    admin_create: AdminCreate,
    db: Session = Depends(get_db),
    current_admin: CurrentUser = Depends(get_current_admin),
) -> AdminResponse:
    return AdministradorService(db).crear_admin(admin_create, get_password_hash(admin_create.password))


@router.get("/administradores/{admin_id}", response_model=AdminResponse)
def obtener_administrador(
    admin_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_admin: CurrentUser = Depends(get_current_admin),
) -> AdminResponse:
    return AdministradorService(db).obtener_admin(admin_id)


@router.put("/administradores/{admin_id}", response_model=AdminResponse)
def actualizar_administrador(
    admin_id: uuid.UUID,
    admin_update: AdminUpdate,
    db: Session = Depends(get_db),
    current_admin: CurrentUser = Depends(get_current_admin),
) -> AdminResponse:
    return AdministradorService(db).actualizar_admin(admin_id, admin_update)


@router.delete("/administradores/{admin_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_administrador(
    admin_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_admin: CurrentUser = Depends(get_current_admin),
) -> None:
    if admin_id == current_admin["id"]:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="No puedes desactivar tu propia cuenta")
    AdministradorService(db).eliminar_admin(admin_id)

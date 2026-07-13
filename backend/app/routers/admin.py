"""
Router para gestión de Administradores.
"""

import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import AdminCreate, AdminUpdate, AdminResponse, AdminLoginRequest, TokenResponse
from app.services.administrador_service import AdministradorService
from app.exceptions import AdministradorNotFound, CredencialesIncorrectas, AdminYaExiste
from app.utils.auth import create_access_token, get_password_hash
from app.dependencies import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Administradores"])


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: AdminLoginRequest,
    db: Session = Depends(get_db)
):
    """Autenticar un administrador y retornar un token JWT."""
    service = AdministradorService(db)

    admin = service.autenticar(login_data.email, login_data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={
            "sub": str(admin.id),
            "email": admin.email,
            "nombres": admin.nombres,
            "apellidos": admin.apellidos,
            "rol": "administrador",
        }
    )

    return TokenResponse(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=AdminResponse)
async def get_current_admin_info(
    current_admin: dict = Depends(get_current_admin)
):
    """Obtiene la información del administrador actual."""
    return AdminResponse(
        id=current_admin["id"],
        email=current_admin["email"],
        nombres=current_admin["nombres"],
        apellidos=current_admin["apellidos"],
        telefono=current_admin.get("telefono"),
        activo=True,
        fecha_creacion=current_admin.get("fecha_creacion"),
    )


@router.get("/administradores", response_model=List[AdminResponse])
def listar_administradores(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Listar todos los administradores. Requiere autenticación."""
    service = AdministradorService(db)
    return service.listar_admins(skip, limit)


@router.post("/administradores", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
def crear_administrador(
    admin_create: AdminCreate,
    password: str,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Crear un nuevo administrador. Requiere autenticación."""
    try:
        service = AdministradorService(db)
        password_hash = get_password_hash(password)
        return service.crear_admin(admin_create, password_hash)
    except AdminYaExiste as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/administradores/{admin_id}", response_model=AdminResponse)
def obtener_administrador(
    admin_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Obtener un administrador por ID. Requiere autenticación."""
    try:
        service = AdministradorService(db)
        return service.obtener_admin(admin_id)
    except AdministradorNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/administradores/{admin_id}", response_model=AdminResponse)
def actualizar_administrador(
    admin_id: uuid.UUID,
    admin_update: AdminUpdate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Actualizar un administrador. Requiere autenticación."""
    try:
        service = AdministradorService(db)
        return service.actualizar_admin(admin_id, admin_update)
    except (AdministradorNotFound, AdminYaExiste) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/administradores/{admin_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_administrador(
    admin_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Eliminar (desactivar) un administrador. Requiere autenticación."""
    try:
        service = AdministradorService(db)
        service.eliminar_admin(admin_id)
    except AdministradorNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

"""
Router para autenticación.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import LoginRequest, TokenResponse, UserResponse, RegisterRequest, AlumnoResponse
from app.services.alumno_service import AlumnoService
from app.services.administrador_service import AdministradorService
from app.utils.auth import verify_password, create_access_token, get_password_hash
from app.dependencies import get_current_user
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Autentica un usuario y retorna un token JWT.

    Primero busca en la tabla de administradores, si no encuentra,
    busca en la tabla de alumnos por email o documento de identidad.
    """
    admin_service = AdministradorService(db)
    alumno_service = AlumnoService(db)

    admin = admin_service.autenticar(login_data.username, login_data.password)
    if admin:
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

    alumno = alumno_service.obtener_por_email_o_documento(login_data.username)
    if alumno:
        if not alumno.password_hash:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Este usuario no tiene contraseña configurada",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not verify_password(login_data.password, alumno.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(
            data={
                "sub": str(alumno.id),
                "email": alumno.email or "",
                "nombres": alumno.nombres,
                "apellidos": alumno.apellidos,
                "rol": "alumno",
            }
        )
        return TokenResponse(access_token=access_token, token_type="bearer")

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales incorrectas",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Registra un nuevo usuario y retorna un token JWT.
    """
    service = AlumnoService(db)

    # Verificar si el email ya existe
    if service.obtener_por_email(register_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con este email"
        )

    # Verificar si el documento ya existe
    existing = service.obtener_por_email_o_documento(register_data.documento_identidad)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con este documento de identidad"
        )

    # Hash password
    password_hash = get_password_hash(register_data.password)

    # Crear alumno con password usando el repository directamente
    from app.models import Alumno
    from app.schemas import AlumnoCreate

    alumno_create = AlumnoCreate(
        nombres=register_data.nombres,
        apellidos=register_data.apellidos,
        documento_identidad=register_data.documento_identidad,
        telefono=register_data.telefono,
        email=register_data.email,
    )

    try:
        # Crear el alumno
        nuevo_alumno = service.crear_alumno(alumno_create)

        # Actualizar el password hash
        service.repo.update_password_hash(nuevo_alumno.id, password_hash)

        # Crear token JWT
        access_token = create_access_token(
            data={
                "sub": str(nuevo_alumno.id),
                "email": register_data.email,
                "nombres": register_data.nombres,
                "apellidos": register_data.apellidos,
                "rol": "alumno",
            }
        )

        return TokenResponse(access_token=access_token, token_type="bearer")

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear usuario: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user)
):
    """Obtiene la información del usuario actual."""
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        nombres=current_user["nombres"],
        apellidos=current_user["apellidos"],
        rol=current_user["rol"]
    )

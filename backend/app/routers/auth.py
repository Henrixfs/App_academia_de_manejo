from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.dependencies import CurrentUser, get_current_user
from app.repositories.administrador_repository import AdministradorRepository
from app.schemas import AdminCreate, AlumnoCreate, InitialSetupStatus, LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.security.rate_limit import InMemoryRateLimiter
from app.services.administrador_service import AdministradorService
from app.services.alumno_service import AlumnoService
from app.utils.auth import create_access_token, get_password_hash, verify_password


router = APIRouter(prefix="/api/auth", tags=["Autenticación"])
login_limiter = InMemoryRateLimiter(settings.LOGIN_RATE_LIMIT)
register_limiter = InMemoryRateLimiter(settings.REGISTER_RATE_LIMIT)
setup_limiter = InMemoryRateLimiter(settings.REGISTER_RATE_LIMIT)


def require_development_setup() -> None:
    if settings.ENVIRONMENT.lower() != "development":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No encontrado")


@router.get("/setup/status", response_model=InitialSetupStatus)
async def initial_setup_status(db: Session = Depends(get_db)) -> InitialSetupStatus:
    require_development_setup()
    return InitialSetupStatus(setup_required=AdministradorRepository(db).count() == 0)


@router.post("/setup/administrator", response_model=TokenResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(setup_limiter)])
async def setup_initial_administrator(
    admin_create: AdminCreate,
    db: Session = Depends(get_db),
) -> TokenResponse:
    require_development_setup()
    if AdministradorRepository(db).count() > 0:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="La configuración inicial ya fue completada")
    admin = AdministradorService(db).crear_admin(admin_create, get_password_hash(admin_create.password))
    token = create_access_token({"sub": str(admin.id), "rol": "administrador"})
    return TokenResponse(access_token=token, expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)


@router.post("/login", response_model=TokenResponse, dependencies=[Depends(login_limiter)])
async def login(login_data: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    username = login_data.username.strip()
    admin = AdministradorService(db).autenticar(username, login_data.password)
    if admin:
        token = create_access_token({"sub": str(admin.id), "rol": "administrador"})
        return TokenResponse(access_token=token, expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    alumno = AlumnoService(db).obtener_por_email_o_documento(username)
    if alumno and alumno.password_hash and verify_password(login_data.password, alumno.password_hash):
        token = create_access_token({"sub": str(alumno.id), "rol": "alumno"})
        return TokenResponse(access_token=token, expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales incorrectas",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(register_limiter)])
async def register(register_data: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    alumno_data = AlumnoCreate(
        nombres=register_data.nombres,
        apellidos=register_data.apellidos,
        documento_identidad=register_data.documento_identidad,
        telefono=register_data.telefono,
        email=register_data.email,
    )
    password_hash = get_password_hash(register_data.password)
    alumno = AlumnoService(db).crear_alumno(alumno_data, password_hash=password_hash)
    token = create_access_token({"sub": str(alumno.id), "rol": "alumno"})
    return TokenResponse(access_token=token, expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: CurrentUser = Depends(get_current_user)) -> UserResponse:
    return UserResponse(**current_user)

"""
Esquemas Pydantic para request/response.
"""

from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
import uuid
from enum import Enum

from app.models import TipoFalta, EstadoReserva


# ====== ALUMNO ======

class AlumnoCreate(BaseModel):
    """Schema para crear un alumno."""
    nombres: str = Field(..., min_length=1, max_length=100)
    apellidos: str = Field(..., min_length=1, max_length=100)
    documento_identidad: str = Field(..., min_length=1, max_length=20)
    telefono: str = Field(..., min_length=1, max_length=20)
    email: Optional[EmailStr] = None


class AlumnoUpdate(BaseModel):
    """Schema para actualizar un alumno."""
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[EmailStr] = None


class AlumnoResponse(BaseModel):
    """Schema para devolver datos de un alumno."""
    id: uuid.UUID
    nombres: str
    apellidos: str
    documento_identidad: str
    telefono: str
    email: Optional[EmailStr]
    fecha_registro: datetime

    class Config:
        from_attributes = True


# ====== RESERVA ======

class ReservaCreate(BaseModel):
    """Schema para crear una reserva."""
    alumno_id: uuid.UUID
    servicio_id: uuid.UUID
    matricula_paquete_id: Optional[uuid.UUID] = None
    fecha_hora_inicio: datetime
    fecha_hora_fin: datetime
    notas: Optional[str] = None

    @field_validator("fecha_hora_fin")
    @classmethod
    def validar_fecha_hora_fin(cls, v, info):
        if hasattr(info, 'data') and 'fecha_hora_inicio' in info.data:
            if v <= info.data['fecha_hora_inicio']:
                raise ValueError("La fecha/hora de fin debe ser posterior a la de inicio")
        return v


class ReservaUpdate(BaseModel):
    """Schema para actualizar una reserva."""
    fecha_hora_inicio: Optional[datetime] = None
    fecha_hora_fin: Optional[datetime] = None
    notas: Optional[str] = None

    @field_validator("fecha_hora_fin")
    @classmethod
    def validar_fecha_hora_fin(cls, v, info):
        if v is not None and hasattr(info, 'data') and info.data.get('fecha_hora_inicio') is not None:
            if v <= info.data['fecha_hora_inicio']:
                raise ValueError("La fecha/hora de fin debe ser posterior a la de inicio")
        return v


class ReservaResponse(BaseModel):
    """Schema para devolver una reserva."""
    id: uuid.UUID
    alumno_id: uuid.UUID
    servicio_id: uuid.UUID
    matricula_paquete_id: Optional[uuid.UUID]
    fecha_hora_inicio: datetime
    fecha_hora_fin: datetime
    estado: EstadoReserva
    estado_pago: str
    fecha_creacion: datetime

    class Config:
        from_attributes = True


# ====== PAQUETE ======

class PaqueteResponse(BaseModel):
    """Schema para devolver un paquete."""
    id: uuid.UUID
    nombre: str
    descripcion: str
    precio_sugerido: Optional[Decimal]

    class Config:
        from_attributes = True


# ====== FALTA ======

class FaltaCreate(BaseModel):
    """Schema para registrar una falta."""
    reserva_id: uuid.UUID
    tipo_falta: TipoFalta
    descripcion: str = Field(..., min_length=5, max_length=500)
    minuto_ocurrencia: Optional[int] = None
    observaciones: Optional[str] = None


class FaltaResponse(BaseModel):
    """Schema para devolver una falta."""
    id: uuid.UUID
    reserva_id: uuid.UUID
    tipo_falta: str
    descripcion: str
    minuto_ocurrencia: Optional[int]
    observaciones: Optional[str]
    fecha_creacion: datetime

    class Config:
        from_attributes = True


# ====== SERVICIO ======

class ServicioCreate(BaseModel):
    """Schema para crear un servicio."""
    nombre: str = Field(..., min_length=1, max_length=100)
    descripcion: str = Field(..., min_length=1)
    tarifa: float = Field(..., gt=0)
    tiempo_minimo_horas: int = Field(..., gt=0)

    @field_validator("tarifa")
    def tarifa_no_negativa(cls, v):
        if v <= 0:
            raise ValueError("La tarifa debe ser mayor a cero")
        return v

    @field_validator("tiempo_minimo_horas")
    def tiempo_positivo(cls, v):
        if v <= 0:
            raise ValueError("El tiempo mínimo debe ser mayor a cero")
        return v


class ServicioUpdate(BaseModel):
    """Schema para actualizar un servicio."""
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    tarifa: Optional[float] = None
    tiempo_minimo_horas: Optional[int] = None

    @field_validator("tarifa")
    def tarifa_no_negativa(cls, v):
        if v is not None and v <= 0:
            raise ValueError("La tarifa debe ser mayor a cero")
        return v

    @field_validator("tiempo_minimo_horas")
    def tiempo_positivo(cls, v):
        if v is not None and v <= 0:
            raise ValueError("El tiempo mínimo debe ser mayor a cero")
        return v


class ServicioResponse(BaseModel):
    """Schema para devolver un servicio."""
    id: uuid.UUID
    nombre: str
    descripcion: str
    tarifa: float
    tiempo_minimo_horas: int

    class Config:
        from_attributes = True


# ====== AUTH ======

class LoginRequest(BaseModel):
    """Schema para solicitud de login."""
    username: str = Field(..., description="Email o documento de identidad del usuario")
    password: str = Field(..., min_length=1, description="Contraseña del usuario")


class RegisterRequest(BaseModel):
    """Schema para registro de nuevo usuario con password."""
    nombres: str = Field(..., min_length=1, max_length=100)
    apellidos: str = Field(..., min_length=1, max_length=100)
    documento_identidad: str = Field(..., min_length=1, max_length=20)
    telefono: str = Field(..., min_length=1, max_length=20)
    email: str = Field(..., description="Email del usuario")
    password: str = Field(..., min_length=6, description="Contraseña (mínimo 6 caracteres)")


class TokenResponse(BaseModel):
    """Schema para respuesta de token JWT."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Datos decodificados del token JWT."""
    user_id: Optional[uuid.UUID] = None
    email: Optional[str] = None
    rol: Optional[str] = None


class UserResponse(BaseModel):
    """Schema para datos del usuario en respuesta."""
    id: uuid.UUID
    email: str
    nombres: str
    apellidos: str
    rol: str

    class Config:
        from_attributes = True


# ====== ADMINISTRADOR ======

class AdminCreate(BaseModel):
    """Schema para crear un administrador."""
    email: EmailStr
    nombres: str = Field(..., min_length=1, max_length=100)
    apellidos: str = Field(..., min_length=1, max_length=100)
    telefono: Optional[str] = Field(None, max_length=20)


class AdminUpdate(BaseModel):
    """Schema para actualizar un administrador."""
    email: Optional[EmailStr] = None
    nombres: Optional[str] = Field(None, min_length=1, max_length=100)
    apellidos: Optional[str] = Field(None, min_length=1, max_length=100)
    telefono: Optional[str] = Field(None, max_length=20)
    activo: Optional[bool] = None


class AdminResponse(BaseModel):
    """Schema para devolver datos de un administrador."""
    id: uuid.UUID
    email: str
    nombres: str
    apellidos: str
    telefono: Optional[str]
    activo: bool
    fecha_creacion: datetime

    class Config:
        from_attributes = True


class AdminLoginRequest(BaseModel):
    """Schema para solicitud de login de administrador."""
    email: EmailStr
    password: str = Field(..., min_length=1)

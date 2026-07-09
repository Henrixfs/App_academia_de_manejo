"""
Modelos ORM SQLAlchemy — Academia de Manejo San Cristóbal VIP.

Cada clase mapea exactamente a una tabla definida en 03-esquema-base-datos.md.
Nota: No existen entidades de vehículos, flota ni doble mando en esta versión.
"""

import uuid
from enum import Enum
from sqlalchemy import (
    Column,
    String,
    Text,
    Numeric,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    CheckConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .database import Base


class EstadoReserva(str, Enum):
    PENDIENTE_CONFIRMACION = "pendiente_confirmacion"
    CONFIRMADA = "confirmada"
    ASISTIDA = "asistida"
    NO_ASISTIO = "no_asistio"
    CANCELADA = "cancelada"
    REPROGRAMADA = "reprogramada"


class TipoFalta(str, Enum):
    LEVE = "Leve"
    GRAVE = "Grave"
    ELIMINATORIA = "Eliminatoria"


# ---------------------------------------------------------------------------
# 1. Alumno
# ---------------------------------------------------------------------------

class Alumno(Base):
    """Registro de un alumno inscrito en la academia."""

    __tablename__ = "alumnos"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    documento_identidad = Column(String(20), nullable=False, unique=True, index=True)
    telefono = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    fecha_registro = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relaciones
    matriculas = relationship(
        "MatriculaPaquete", back_populates="alumno", cascade="save-update, merge"
    )
    reservas = relationship(
        "Reserva", back_populates="alumno", cascade="save-update, merge"
    )
    progresos = relationship(
        "ProgresoNivel", back_populates="alumno", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Alumno(id={self.id}, nombres={self.nombres} {self.apellidos})>"


# ---------------------------------------------------------------------------
# 2. Servicio
# ---------------------------------------------------------------------------

class Servicio(Base):
    """Catálogo de servicios individuales ofrecidos por la academia."""

    __tablename__ = "servicios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    descripcion = Column(Text, nullable=False)
    tarifa = Column(Numeric(10, 2), nullable=False)
    tiempo_minimo_horas = Column(Integer, nullable=False)

    __table_args__ = (
        CheckConstraint("tarifa >= 0.00", name="chk_tarifa_positiva"),
        CheckConstraint("tiempo_minimo_horas >= 1", name="chk_duracion_minima"),
    )

    # Relaciones
    reservas = relationship("Reserva", back_populates="servicio")

    def __repr__(self) -> str:
        return f"<Servicio(id={self.id}, nombre={self.nombre}, tarifa={self.tarifa})>"


# ---------------------------------------------------------------------------
# 3. Paquete
# ---------------------------------------------------------------------------

class Paquete(Base):
    """Programa de formación estructurado que agrupa múltiples clases y niveles."""

    __tablename__ = "paquetes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    descripcion = Column(Text, nullable=False)
    precio_sugerido = Column(Numeric(10, 2), nullable=True)

    __table_args__ = (
        CheckConstraint("precio_sugerido >= 0.00", name="chk_precio_sug"),
    )

    # Relaciones
    matriculas = relationship("MatriculaPaquete", back_populates="paquete")

    def __repr__(self) -> str:
        return f"<Paquete(id={self.id}, nombre={self.nombre})>"


# ---------------------------------------------------------------------------
# 4. MatriculaPaquete
# ---------------------------------------------------------------------------

class MatriculaPaquete(Base):
    """Registro de inscripción de un alumno a un paquete específico."""

    __tablename__ = "matricula_paquetes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    alumno_id = Column(
        UUID(as_uuid=True),
        ForeignKey("alumnos.id", ondelete="RESTRICT"),
        nullable=False,
    )
    paquete_id = Column(
        UUID(as_uuid=True),
        ForeignKey("paquetes.id", ondelete="RESTRICT"),
        nullable=False,
    )
    fecha_matricula = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    precio_acordado = Column(Numeric(10, 2), nullable=False)
    estado_pago = Column(String(30), nullable=False, default="pendiente")
    reprogramaciones_usadas = Column(Integer, nullable=False, default=0)
    estado = Column(String(20), nullable=False, default="activo")

    __table_args__ = (
        CheckConstraint("precio_acordado >= 0.00", name="chk_precio_acordado"),
        CheckConstraint(
            "estado_pago IN ('pendiente', 'pagado_presencial')",
            name="chk_mat_estado_pago",
        ),
        CheckConstraint(
            "reprogramaciones_usadas >= 0 AND reprogramaciones_usadas <= 2",
            name="chk_reprogs",
        ),
        CheckConstraint(
            "estado IN ('activo', 'completado', 'cancelado')",
            name="chk_mat_estado",
        ),
        # Índice compuesto para recuperar matrícula activa de un alumno (idx_matricula_alumno)
        Index("idx_matricula_alumno", "alumno_id", "estado"),
    )

    # Relaciones
    alumno = relationship("Alumno", back_populates="matriculas")
    paquete = relationship("Paquete", back_populates="matriculas")
    reservas = relationship("Reserva", back_populates="matricula_paquete")

    def __repr__(self) -> str:
        return (
            f"<MatriculaPaquete(id={self.id}, alumno_id={self.alumno_id}, "
            f"estado={self.estado})>"
        )


# ---------------------------------------------------------------------------
# 5. Reserva
# ---------------------------------------------------------------------------

class Reserva(Base):
    """Reserva horaria de una sesión práctica de un servicio específico."""

    __tablename__ = "reservas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    alumno_id = Column(
        UUID(as_uuid=True),
        ForeignKey("alumnos.id", ondelete="RESTRICT"),
        nullable=False,
    )
    servicio_id = Column(
        UUID(as_uuid=True),
        ForeignKey("servicios.id", ondelete="RESTRICT"),
        nullable=False,
    )
    matricula_paquete_id = Column(
        UUID(as_uuid=True),
        ForeignKey("matricula_paquetes.id", ondelete="SET NULL"),
        nullable=True,
    )
    fecha_hora_inicio = Column(DateTime(timezone=True), nullable=False)
    fecha_hora_fin = Column(DateTime(timezone=True), nullable=False)
    estado = Column(String(30), nullable=False, default="pendiente_confirmacion")
    estado_pago = Column(String(30), nullable=False, default="pendiente")
    fecha_creacion = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    __table_args__ = (
        CheckConstraint(
            "fecha_hora_fin > fecha_hora_inicio", name="chk_duracion_reserva"
        ),
        CheckConstraint(
            "estado IN ('pendiente_confirmacion', 'confirmada', 'asistida', "
            "'no_asistio', 'cancelada', 'reprogramada')",
            name="chk_res_estado",
        ),
        CheckConstraint(
            "estado_pago IN ('pendiente', 'pagado_presencial')",
            name="chk_res_estado_pago",
        ),
        # Índice para verificación de disponibilidad y agenda diaria (idx_reservas_fechas)
        Index("idx_reservas_fechas", "fecha_hora_inicio", "fecha_hora_fin"),
        # Índice para historial de clases por alumno (idx_reservas_alumno_fecha)
        Index("idx_reservas_alumno_fecha", "alumno_id", "fecha_hora_inicio"),
    )

    # Relaciones
    alumno = relationship("Alumno", back_populates="reservas")
    servicio = relationship("Servicio", back_populates="reservas")
    matricula_paquete = relationship("MatriculaPaquete", back_populates="reservas")
    faltas = relationship("Falta", back_populates="reserva", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return (
            f"<Reserva(id={self.id}, alumno_id={self.alumno_id}, "
            f"estado={self.estado}, inicio={self.fecha_hora_inicio})>"
        )


# ---------------------------------------------------------------------------
# 6. ProgresoNivel
# ---------------------------------------------------------------------------

class ProgresoNivel(Base):
    """Seguimiento de la evolución pedagógica del alumno por nivel curricular."""

    __tablename__ = "progreso_niveles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    alumno_id = Column(
        UUID(as_uuid=True),
        ForeignKey("alumnos.id", ondelete="CASCADE"),
        nullable=False,
    )
    nivel = Column(String(20), nullable=False)
    fecha_inicio = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    fecha_fin = Column(DateTime(timezone=True), nullable=True)
    estado = Column(String(20), nullable=False, default="en_progreso")

    __table_args__ = (
        CheckConstraint(
            "nivel IN ('Básico', 'Intermedio', 'Pre-examen')", name="chk_nivel"
        ),
        CheckConstraint(
            "estado IN ('en_progreso', 'completado')", name="chk_estado_prog"
        ),
        # Índice para consultar progreso curricular de un alumno (idx_progreso_alumno)
        Index("idx_progreso_alumno", "alumno_id", "nivel"),
    )

    # Relaciones
    alumno = relationship("Alumno", back_populates="progresos")

    def __repr__(self) -> str:
        return (
            f"<ProgresoNivel(id={self.id}, alumno_id={self.alumno_id}, "
            f"nivel={self.nivel}, estado={self.estado})>"
        )


# ---------------------------------------------------------------------------
# 7. Falta
# ---------------------------------------------------------------------------

class Falta(Base):
    """Infracción cometida por un alumno durante un simulacro práctico."""

    __tablename__ = "faltas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    reserva_id = Column(
        UUID(as_uuid=True),
        ForeignKey("reservas.id", ondelete="CASCADE"),
        nullable=False,
        index=True,  # idx_faltas_reserva
    )
    tipo_falta = Column(String(20), nullable=False)
    descripcion = Column(Text, nullable=False)
    minuto_ocurrencia = Column(Integer, nullable=True)
    observaciones = Column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint(
            "tipo_falta IN ('Leve', 'Grave', 'Eliminatoria')", name="chk_tipo_falta"
        ),
        CheckConstraint("minuto_ocurrencia >= 0", name="chk_minuto"),
    )

    # Relaciones
    reserva = relationship("Reserva", back_populates="faltas")

    def __repr__(self) -> str:
        return (
            f"<Falta(id={self.id}, reserva_id={self.reserva_id}, "
            f"tipo_falta={self.tipo_falta})>"
        )
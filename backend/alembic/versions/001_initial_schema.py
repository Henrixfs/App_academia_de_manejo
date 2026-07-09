"""
Initial schema — Crea todas las tablas del MVP Academia de Manejo San Cristóbal VIP.

Este archivo documenta la migración inicial. En producción, se genera con:
    cd backend
    alembic revision --autogenerate -m "Initial schema"
    alembic upgrade head

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000
"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from alembic import op


# Identifiers usados por Alembic
revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Crear todas las tablas del esquema inicial."""

    # Habilitar extensión uuid-ossp para uuid_generate_v4()
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    # ------------------------------------------------------------------
    # 1. alumnos
    # ------------------------------------------------------------------
    op.create_table(
        "alumnos",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("nombres", sa.String(100), nullable=False),
        sa.Column("apellidos", sa.String(100), nullable=False),
        sa.Column("documento_identidad", sa.String(20), nullable=False),
        sa.Column("telefono", sa.String(20), nullable=False),
        sa.Column("email", sa.String(100), nullable=True),
        sa.Column(
            "fecha_registro",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.UniqueConstraint("documento_identidad", name="uq_alumnos_doc_id"),
    )
    op.create_index("idx_alumnos_doc_id", "alumnos", ["documento_identidad"], unique=True)

    # ------------------------------------------------------------------
    # 2. servicios
    # ------------------------------------------------------------------
    op.create_table(
        "servicios",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("nombre", sa.String(100), nullable=False),
        sa.Column("descripcion", sa.Text, nullable=False),
        sa.Column("tarifa", sa.Numeric(10, 2), nullable=False),
        sa.Column("tiempo_minimo_horas", sa.Integer, nullable=False),
        sa.UniqueConstraint("nombre", name="uq_servicios_nombre"),
        sa.CheckConstraint("tarifa >= 0.00", name="chk_tarifa_positiva"),
        sa.CheckConstraint("tiempo_minimo_horas >= 1", name="chk_duracion_minima"),
    )

    # ------------------------------------------------------------------
    # 3. paquetes
    # ------------------------------------------------------------------
    op.create_table(
        "paquetes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("nombre", sa.String(100), nullable=False),
        sa.Column("descripcion", sa.Text, nullable=False),
        sa.Column("precio_sugerido", sa.Numeric(10, 2), nullable=True),
        sa.UniqueConstraint("nombre", name="uq_paquetes_nombre"),
        sa.CheckConstraint("precio_sugerido >= 0.00", name="chk_precio_sug"),
    )

    # ------------------------------------------------------------------
    # 4. matricula_paquetes
    # ------------------------------------------------------------------
    op.create_table(
        "matricula_paquetes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("alumno_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("paquete_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "fecha_matricula",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column("precio_acordado", sa.Numeric(10, 2), nullable=False),
        sa.Column("estado_pago", sa.String(30), nullable=False, server_default="pendiente"),
        sa.Column("reprogramaciones_usadas", sa.Integer, nullable=False, server_default="0"),
        sa.Column("estado", sa.String(20), nullable=False, server_default="activo"),
        sa.ForeignKeyConstraint(["alumno_id"], ["alumnos.id"], ondelete="RESTRICT", name="fk_matricula_alumno"),
        sa.ForeignKeyConstraint(["paquete_id"], ["paquetes.id"], ondelete="RESTRICT", name="fk_matricula_paquete"),
        sa.CheckConstraint("precio_acordado >= 0.00", name="chk_precio_acordado"),
        sa.CheckConstraint("estado_pago IN ('pendiente', 'pagado_presencial')", name="chk_mat_estado_pago"),
        sa.CheckConstraint(
            "reprogramaciones_usadas >= 0 AND reprogramaciones_usadas <= 2",
            name="chk_reprogs",
        ),
        sa.CheckConstraint("estado IN ('activo', 'completado', 'cancelado')", name="chk_mat_estado"),
    )
    op.create_index("idx_matricula_alumno", "matricula_paquetes", ["alumno_id", "estado"])

    # ------------------------------------------------------------------
    # 5. reservas
    # ------------------------------------------------------------------
    op.create_table(
        "reservas",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("alumno_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("servicio_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("matricula_paquete_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("fecha_hora_inicio", sa.DateTime(timezone=True), nullable=False),
        sa.Column("fecha_hora_fin", sa.DateTime(timezone=True), nullable=False),
        sa.Column("estado", sa.String(30), nullable=False, server_default="pendiente_confirmacion"),
        sa.Column("estado_pago", sa.String(30), nullable=False, server_default="pendiente"),
        sa.Column(
            "fecha_creacion",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["alumno_id"], ["alumnos.id"], ondelete="RESTRICT", name="fk_reserva_alumno"),
        sa.ForeignKeyConstraint(["servicio_id"], ["servicios.id"], ondelete="RESTRICT", name="fk_reserva_servicio"),
        sa.ForeignKeyConstraint(
            ["matricula_paquete_id"], ["matricula_paquetes.id"],
            ondelete="SET NULL", name="fk_reserva_matricula",
        ),
        sa.CheckConstraint("fecha_hora_fin > fecha_hora_inicio", name="chk_duracion_reserva"),
        sa.CheckConstraint(
            "estado IN ('pendiente_confirmacion', 'confirmada', 'asistida', "
            "'no_asistio', 'cancelada', 'reprogramada')",
            name="chk_res_estado",
        ),
        sa.CheckConstraint("estado_pago IN ('pendiente', 'pagado_presencial')", name="chk_res_estado_pago"),
    )
    op.create_index("idx_reservas_fechas", "reservas", ["fecha_hora_inicio", "fecha_hora_fin"])
    op.create_index("idx_reservas_alumno_fecha", "reservas", ["alumno_id", "fecha_hora_inicio"])

    # ------------------------------------------------------------------
    # 6. progreso_niveles
    # ------------------------------------------------------------------
    op.create_table(
        "progreso_niveles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("alumno_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("nivel", sa.String(20), nullable=False),
        sa.Column(
            "fecha_inicio",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column("fecha_fin", sa.DateTime(timezone=True), nullable=True),
        sa.Column("estado", sa.String(20), nullable=False, server_default="en_progreso"),
        sa.ForeignKeyConstraint(["alumno_id"], ["alumnos.id"], ondelete="CASCADE", name="fk_progreso_alumno"),
        sa.CheckConstraint("nivel IN ('Básico', 'Intermedio', 'Pre-examen')", name="chk_nivel"),
        sa.CheckConstraint("estado IN ('en_progreso', 'completado')", name="chk_estado_prog"),
    )
    op.create_index("idx_progreso_alumno", "progreso_niveles", ["alumno_id", "nivel"])

    # ------------------------------------------------------------------
    # 7. faltas
    # ------------------------------------------------------------------
    op.create_table(
        "faltas",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("reserva_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tipo_falta", sa.String(20), nullable=False),
        sa.Column("descripcion", sa.Text, nullable=False),
        sa.Column("minuto_ocurrencia", sa.Integer, nullable=True),
        sa.Column("observaciones", sa.Text, nullable=True),
        sa.ForeignKeyConstraint(["reserva_id"], ["reservas.id"], ondelete="CASCADE", name="fk_falta_reserva"),
        sa.CheckConstraint("tipo_falta IN ('Leve', 'Grave', 'Eliminatoria')", name="chk_tipo_falta"),
        sa.CheckConstraint("minuto_ocurrencia >= 0", name="chk_minuto"),
    )
    op.create_index("idx_faltas_reserva", "faltas", ["reserva_id"])


def downgrade() -> None:
    """Eliminar todas las tablas (para rollback en desarrollo)."""
    # Eliminar en orden inverso para respetar FK constraints
    op.drop_index("idx_faltas_reserva", table_name="faltas")
    op.drop_table("faltas")

    op.drop_index("idx_progreso_alumno", table_name="progreso_niveles")
    op.drop_table("progreso_niveles")

    op.drop_index("idx_reservas_alumno_fecha", table_name="reservas")
    op.drop_index("idx_reservas_fechas", table_name="reservas")
    op.drop_table("reservas")

    op.drop_index("idx_matricula_alumno", table_name="matricula_paquetes")
    op.drop_table("matricula_paquetes")

    op.drop_table("paquetes")
    op.drop_table("servicios")

    op.drop_index("idx_alumnos_doc_id", table_name="alumnos")
    op.drop_table("alumnos")

"""
Create administradores table

Revision ID: 003
Revises: 002
Create Date: 2024-01-03 00:00:00.000000
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
import uuid


revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create administradores table."""
    op.create_table(
        "administradores",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("email", sa.String(length=100), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("nombres", sa.String(length=100), nullable=False),
        sa.Column("apellidos", sa.String(length=100), nullable=False),
        sa.Column("telefono", sa.String(length=20), nullable=True),
        sa.Column("activo", sa.Boolean(), nullable=True, default=True),
        sa.Column("fecha_creacion", sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email")
    )
    op.create_index(op.f("ix_administradores_email"), "administradores", ["email"], unique=True)
    op.create_index(op.f("ix_administradores_id"), "administradores", ["id"], unique=False)


def downgrade() -> None:
    """Drop administradores table."""
    op.drop_index(op.f("ix_administradores_id"), table_name="administradores")
    op.drop_index(op.f("ix_administradores_email"), table_name="administradores")
    op.drop_table("administradores")

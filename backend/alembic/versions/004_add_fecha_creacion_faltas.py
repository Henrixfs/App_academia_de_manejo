"""
Agrega columna fecha_creacion a la tabla faltas.

Revision ID: 004
Revises: 003
Create Date: 2026-07-11 16:00:00.000000
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Agregar fecha_creacion a faltas."""
    op.add_column(
        "faltas",
        sa.Column(
            "fecha_creacion",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    """Eliminar fecha_creacion de faltas."""
    op.drop_column("faltas", "fecha_creacion")

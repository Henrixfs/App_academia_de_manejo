"""
Add password_hash column to alumnos table

Revision ID: 002
Revises: 001
Create Date: 2024-01-02 00:00:00.000000
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add password_hash column to alumnos table."""
    op.add_column(
        "alumnos",
        sa.Column("password_hash", sa.String(255), nullable=True)
    )


def downgrade() -> None:
    """Remove password_hash column from alumnos table."""
    op.drop_column("alumnos", "password_hash")

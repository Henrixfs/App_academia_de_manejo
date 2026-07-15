from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "reservas",
        sa.Column("reprogramaciones_usadas", sa.Integer(), server_default="0", nullable=False),
    )
    op.create_check_constraint(
        "chk_res_reprogramaciones",
        "reservas",
        "reprogramaciones_usadas >= 0 AND reprogramaciones_usadas <= 2",
    )
    op.execute("UPDATE administradores SET activo = true WHERE activo IS NULL")
    op.alter_column("administradores", "activo", existing_type=sa.Boolean(), nullable=False, server_default=sa.true())
    op.create_unique_constraint("uq_alumnos_email", "alumnos", ["email"])
    op.execute('CREATE EXTENSION IF NOT EXISTS "btree_gist"')
    op.execute(
        """
        ALTER TABLE reservas
        ADD CONSTRAINT ex_reservas_servicio_horario
        EXCLUDE USING gist (
            servicio_id WITH =,
            tstzrange(fecha_hora_inicio, fecha_hora_fin, '[)') WITH &&
        )
        WHERE (estado IN ('pendiente_confirmacion', 'confirmada', 'reprogramada'))
        """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE reservas DROP CONSTRAINT IF EXISTS ex_reservas_servicio_horario")
    op.drop_constraint("uq_alumnos_email", "alumnos", type_="unique")
    op.alter_column("administradores", "activo", existing_type=sa.Boolean(), nullable=True, server_default=None)
    op.drop_constraint("chk_res_reprogramaciones", "reservas", type_="check")
    op.drop_column("reservas", "reprogramaciones_usadas")

"""create usuarios table and migrate data from alumnos

Revision ID: create_usuarios_table_20260701
Revises:
Create Date: 2026-07-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'create_usuarios_table_20260701'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Create usuarios table
    op.create_table(
        'usuarios',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False,
                  server_default=sa.text('uuid_generate_v4()')),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.Text(), nullable=False),
        sa.Column('rol', sa.String(length=20), nullable=False),
        sa.Column('nombres', sa.String(length=100), nullable=False),
        sa.Column('apellidos', sa.String(length=100), nullable=False),
        sa.Column('documento_identidad', sa.String(length=20), nullable=False),
        sa.Column('telefono', sa.String(length=20), nullable=False),
        sa.Column('fecha_registro', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id', name='pk_usuarios'),
        sa.UniqueConstraint('email', name='uq_usuarios_email'),
        sa.UniqueConstraint('documento_identidad', name='uq_usuarios_documento_identidad'),
        sa.CheckConstraint("rol IN ('alumno','administrador')", name='ck_usuarios_rol')
    )
    op.create_index('ix_usuarios_documento', 'usuarios', ['documento_identidad'])
    op.create_index('ix_usuarios_rol', 'usuarios', ['rol'])

    # 2. Copy data from alumnos to usuarios (temporary email & password)
    op.execute(
        """
        INSERT INTO usuarios (
            email, password_hash, rol, nombres, apellidos, documento_identidad, telefono, fecha_registro
        )
        SELECT
            documento_identidad || '@ejemplo.com',
            crypt('TempPass123!', gen_salt('bf')),
            'alumno',
            nombres,
            apellidos,
            documento_identidad,
            telefono,
            fecha_registro
        FROM alumnos
        """
    )

    # 3. Update foreign keys in matricula_paquetes
    op.add_column('matricula_paquetes', sa.Column('alumno_id_new', postgresql.UUID(as_uuid=True)))
    op.execute(
        """
        UPDATE matricula_paquetes mp
        SET alumno_id_new = u.id
        FROM usuarios u
        JOIN alumnos a ON a.documento_identidad = u.documento_identidad
        WHERE mp.alumno_id = a.id
        """
    )
    op.drop_constraint('matricula_paquetes_alumno_id_fkey', 'matricula_paquetes', type_='foreignkey')
    op.alter_column('matricula_paquetes', 'alumno_id', new_column_name='alumno_id_old')
    op.alter_column('matricula_paquetes', 'alumno_id_new', new_column_name='alumno_id')
    op.create_foreign_key(
        'matricula_paquetes_alumno_id_fkey',
        'matricula_paquetes', 'usuarios',
        ['alumno_id'], ['id'],
        ondelete='RESTRICT'
    )
    op.drop_column('matricula_paquetes', 'alumno_id_old')

    # 4. Update foreign keys in reservas
    op.add_column('reservas', sa.Column('alumno_id_new', postgresql.UUID(as_uuid=True)))
    op.execute(
        """
        UPDATE reservas r
        SET alumno_id_new = u.id
        FROM usuarios u
        JOIN alumnos a ON a.documento_identidad = u.documento_identidad
        WHERE r.alumno_id = a.id
        """
    )
    op.drop_constraint('reservas_alumno_id_fkey', 'reservas', type_='foreignkey')
    op.alter_column('reservas', 'alumno_id', new_column_name='alumno_id_old')
    op.alter_column('reservas', 'alumno_id_new', new_column_name='alumno_id')
    op.create_foreign_key(
        'reservas_alumno_id_fkey',
        'reservas', 'usuarios',
        ['alumno_id'], ['id'],
        ondelete='RESTRICT'
    )
    op.drop_column('reservas', 'alumno_id_old')

    # 5. Update foreign keys in progreso_niveles
    op.add_column('progreso_niveles', sa.Column('alumno_id_new', postgresql.UUID(as_uuid=True)))
    op.execute(
        """
        UPDATE progreso_niveles pn
        SET alumno_id_new = u.id
        FROM usuarios u
        JOIN alumnos a ON a.documento_identidad = u.documento_identidad
        WHERE pn.alumno_id = a.id
        """
    )
    op.drop_constraint('progreso_niveles_alumno_id_fkey', 'progreso_niveles', type_='foreignkey')
    op.alter_column('progreso_niveles', 'alumno_id', new_column_name='alumno_id_old')
    op.alter_column('progreso_niveles', 'alumno_id_new', new_column_name='alumno_id')
    op.create_foreign_key(
        'progreso_niveles_alumno_id_fkey',
        'progreso_niveles', 'usuarios',
        ['alumno_id'], ['id'],
        ondelete='CASCADE'
    )
    op.drop_column('progreso_niveles', 'alumno_id_old')

    # 6. Drop the old alumnos table (after verifying data)
    op.drop_table('alumnos')


def downgrade() -> None:
    # Reverting this migration is complex and not supported automatically.
    # To downgrade, you would need to recreate the alumnos table from usuarios,
    # restore the old foreign keys, and drop the usuarios table.
    raise NotImplementedError(
        "Downgrade is not implemented for this migration. "
        "To revert, manually recreate the alumnos table and restore foreign keys."
    )
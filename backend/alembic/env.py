"""
Script de entorno de Alembic — Academia de Manejo San Cristóbal VIP.

Configura cómo Alembic genera y ejecuta migraciones contra PostgreSQL.
La URL de la base de datos se lee desde DATABASE_URL (app.database), no del alembic.ini.
"""

import os
import sys
from logging.config import fileConfig
from pathlib import Path

from sqlalchemy import engine_from_config, pool
from sqlalchemy.sql.sqltypes import Uuid
from alembic import context

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

# Importar Base y DATABASE_URL desde la aplicación
from app.database import Base, DATABASE_URL

# Importar todos los modelos para que Alembic los detecte en autogenerate
import app.models  # noqa: F401  — side-effect import intencional

# ---------------------------------------------------------------------------
# Configuración de Alembic
# ---------------------------------------------------------------------------
config = context.config

# Inyectar la URL real desde el entorno (sobrescribe el placeholder del .ini)
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Configurar logging si existe el archivo .ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata objetivo para autogenerate
target_metadata = Base.metadata


def compare_server_default(
    context,
    inspected_column,
    metadata_column,
    inspected_default,
    metadata_default,
    rendered_metadata_default,
):
    if isinstance(metadata_column.type, Uuid) and inspected_default and "uuid_generate_v4" in inspected_default:
        return False
    return None


# ---------------------------------------------------------------------------
# Modo Offline
# ---------------------------------------------------------------------------
def run_migrations_offline() -> None:
    """
    Ejecutar migraciones en modo 'offline' (sin conexión activa a la BD).

    Útil para generar scripts SQL sin necesidad de que la BD esté levantada.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


# ---------------------------------------------------------------------------
# Modo Online
# ---------------------------------------------------------------------------
def run_migrations_online() -> None:
    """
    Ejecutar migraciones en modo 'online' (con conexión activa a la BD).

    Modo habitual para `alembic upgrade head` y `alembic downgrade`.
    """
    # Construir la sección de configuración manualmente para evitar
    # KeyError cuando sqlalchemy.url ya fue seteado por set_main_option.
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = DATABASE_URL

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,  # NullPool es preferido en migraciones (una sola conexión)
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,       # Detecta cambios de tipo en columnas
            compare_server_default=compare_server_default,
        )

        with context.begin_transaction():
            context.run_migrations()


# ---------------------------------------------------------------------------
# Punto de entrada
# ---------------------------------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

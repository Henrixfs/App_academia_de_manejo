"""
Configuración de la base de datos y sesiones SQLAlchemy.
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Cargar .env antes de leer cualquier variable de entorno
load_dotenv()

# Lee la URL de BD del .env
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/academia_manejo",
)

# ---------------------------------------------------------------------------
# En Windows, psycopg2 usa libpq (C library) que devuelve mensajes de error
# en el idioma del sistema (español → Latin-1). Python intenta decodificarlos
# como UTF-8 y falla con UnicodeDecodeError.
# Solución: usar pg8000 (driver 100% Python) en Windows.
# ---------------------------------------------------------------------------
if sys.platform == "win32":
    # Reemplazar el driver en la URL: postgresql:// → postgresql+pg8000://
    _db_url = DATABASE_URL
    if _db_url.startswith("postgresql://"):
        _db_url = "postgresql+pg8000://" + _db_url[len("postgresql://"):]
    elif _db_url.startswith("postgres://"):
        _db_url = "postgresql+pg8000://" + _db_url[len("postgres://"):]
    ENGINE_URL = _db_url
else:
    ENGINE_URL = DATABASE_URL

# Crear engine
engine = create_engine(
    ENGINE_URL,
    echo=False,  # Cambia a True si necesitas ver las queries SQL en consola
    pool_size=10,
    max_overflow=20,
)

# Fábrica de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base declarativa para todos los modelos ORM
Base = declarative_base()


def get_db():
    """Dependency injection para obtener una sesión de BD en los endpoints FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

"""
Script para crear todas las tablas en PostgreSQL sin usar Alembic.

Limpia variables de entorno PG* para evitar conflictos con otras
instancias de PostgreSQL en el sistema (ej: Evolution API).
Esto previene el UnicodeDecodeError de libpq en Windows con rutas en español.
"""
import os

# Fuerza a libpq / PostgreSQL a retornar mensajes en inglés/ASCII,
# evitando así que se produzca el UnicodeDecodeError al recibir un error en español.
os.environ["LC_ALL"] = "C"
os.environ["LC_MESSAGES"] = "C"
os.environ["LANG"] = "C"

# -------------------------------------------------------------------
# PASO 1: Limpiar TODAS las variables PG* antes de importar psycopg2
# libpq las lee del entorno y puede encontrar archivos con tildes/ñ
# de otras instancias Postgres (Evolution API, etc.)
# -------------------------------------------------------------------
_PG_VARS = [
    "PGPASSWORD", "PGPASSFILE", "PGSERVICE", "PGSERVICEFILE",
    "PGDATABASE", "PGHOST", "PGPORT", "PGUSER", "PGSSLMODE",
    "PGREQUIRESSL", "PGSSLCERT", "PGSSLKEY", "PGSSLROOTCERT",
    "PGCONNECT_TIMEOUT", "PGOPTIONS", "PGTZ", "PGCLIENTENCODING",
    "PGAPPNAME", "PGGSSENCMODE", "PGCHANNELBINDING",
]
for _var in _PG_VARS:
    os.environ.pop(_var, None)

# Apuntar PGPASSFILE a ruta inexistente para bloquear lectura del pgpass.conf del sistema
os.environ["PGPASSFILE"] = "/nonexistent/pgpass"

# -------------------------------------------------------------------
# PASO 2: Cargar .env y construir URL limpia (solo ASCII)
# -------------------------------------------------------------------
from dotenv import load_dotenv  # noqa: E402

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/academia_manejo",
)
# Forzar encoding ASCII puro para eliminar cualquier carácter raro
DATABASE_URL = DATABASE_URL.encode("ascii", errors="ignore").decode("ascii")

# Sobreescribir en el entorno para que database.py lo recoja
os.environ["DATABASE_URL"] = DATABASE_URL

# -------------------------------------------------------------------
# PASO 3: Ahora sí importar SQLAlchemy y los modelos
# -------------------------------------------------------------------
from sqlalchemy import text                  # noqa: E402
from app.database import Base, engine        # noqa: E402
import app.models                           # noqa: F401, E402

print(f"[INFO] Conectando a: {engine.url}")

# Verificar conexión antes de crear tablas
try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version()"))
        print(f"[OK] Conexion exitosa: {result.fetchone()[0][:40]}...")
except Exception as e:
    print(f"[ERROR] Error de conexion: {e}")
    raise

# Crear todas las tablas
Base.metadata.create_all(bind=engine)
print("[OK] Tablas creadas correctamente en PostgreSQL.")
print("\nTablas disponibles:")
for table in Base.metadata.sorted_tables:
    print(f"   - {table.name}")

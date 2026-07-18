import os
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "sqlite:///:memory:")
os.environ["DATABASE_URL"] = TEST_DATABASE_URL

from app.database import Base, get_db
from app.dependencies import get_current_admin
from app.main import app

# Configuración específica para SQLite en memoria
engine_options: dict[str, object] = {}
if TEST_DATABASE_URL.startswith("sqlite"):
    engine_options = {
        "connect_args": {"check_same_thread": False},  # Necesario para SQLite concurrente
        "poolclass": StaticPool,  # Pool simple para pruebas
    }

engine = create_engine(TEST_DATABASE_URL, **engine_options)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency override para obtener una sesión de base de datos de prueba
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Dependency override para obtener un admin de prueba
async def override_current_admin():
    return {
        "id": uuid.UUID("00000000-0000-0000-0000-000000000001"),
        "email": "admin@test.local",
        "nombres": "Admin",
        "apellidos": "Pruebas",
        "rol": "administrador",
    }


app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_admin] = override_current_admin


@pytest.fixture(autouse=True)
def reset_database():
    if TEST_DATABASE_URL.startswith("sqlite"):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    else:
        table_names = ", ".join(f'"{table.name}"' for table in reversed(Base.metadata.sorted_tables))
        with engine.begin() as connection:
            connection.execute(text(f"TRUNCATE TABLE {table_names} RESTART IDENTITY CASCADE"))
    yield


@pytest.fixture
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()


@pytest.fixture
def db_session(db):
    return db


@pytest.fixture
def testing_session_factory():
    return TestingSessionLocal


@pytest.fixture
def client():
    return TestClient(app)

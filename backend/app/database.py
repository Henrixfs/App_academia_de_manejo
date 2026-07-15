import sys
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from app.config import settings


DATABASE_URL = settings.DATABASE_URL


def build_engine_url(database_url: str) -> str:
    if sys.platform != "win32":
        return database_url
    if database_url.startswith("postgresql://"):
        return "postgresql+pg8000://" + database_url[len("postgresql://"):]
    if database_url.startswith("postgres://"):
        return "postgresql+pg8000://" + database_url[len("postgres://"):]
    return database_url


ENGINE_URL = build_engine_url(DATABASE_URL)
engine_options: dict[str, object] = {"pool_pre_ping": True}
if not ENGINE_URL.startswith("sqlite"):
    engine_options.update({"pool_size": 10, "max_overflow": 20})

engine = create_engine(ENGINE_URL, **engine_options)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

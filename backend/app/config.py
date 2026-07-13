"""
Configuración centralizada de la aplicación.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Configuración desde variables de entorno."""
    
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/academia_manejo"
    DEBUG: bool = True
    
    # JWT Settings
    SECRET_KEY: str = "default-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 horas
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Retorna settings cacheados."""
    return Settings()


# Instancia global de settings
settings = get_settings()

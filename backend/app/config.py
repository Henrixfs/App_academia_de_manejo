from functools import lru_cache
from urllib.parse import urlparse

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/academia_manejo"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    SECRET_KEY: str = "development-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    APP_URL: str = "http://localhost:3000"
    LOGIN_RATE_LIMIT: int = 10
    REGISTER_RATE_LIMIT: int = 5

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, value: object) -> bool:
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"1", "true", "yes", "on", "debug", "development"}:
                return True
            if normalized in {"0", "false", "no", "off", "release", "production", ""}:
                return False
        return bool(value)

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        if self.ENVIRONMENT.lower() == "production":
            insecure = "change-in-production" in self.SECRET_KEY or len(self.SECRET_KEY) < 32
            if insecure:
                raise ValueError("SECRET_KEY debe tener al menos 32 caracteres seguros en producción")
            if self.DEBUG:
                raise ValueError("DEBUG debe estar desactivado en producción")
            app_url = urlparse(self.APP_URL)
            if (
                app_url.scheme != "https"
                or not app_url.hostname
                or app_url.path
                or app_url.params
                or app_url.query
                or app_url.fragment
            ):
                raise ValueError("APP_URL debe ser un origen HTTPS válido en producción")
        return self

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

import pytest
from pydantic import ValidationError

from app.config import Settings


def build_production_settings(**overrides: object) -> Settings:
    values: dict[str, object] = {
        "DATABASE_URL": "postgresql://academia:password@postgres:5432/academia_manejo",
        "ENVIRONMENT": "production",
        "DEBUG": False,
        "SECRET_KEY": "a-secure-production-secret-with-32-chars",
        "CORS_ORIGINS": "https://app.example.com",
        "APP_URL": "https://app.example.com",
    }
    values.update(overrides)
    return Settings(**values)


def test_production_settings_accept_secure_app_url():
    settings = build_production_settings()
    assert settings.APP_URL == "https://app.example.com"


@pytest.mark.parametrize("app_url", ["http://app.example.com", "https://app.example.com/", "https://app.example.com/path", "https://app.example.com?query=true"])
def test_production_settings_reject_non_origin_https_url(app_url: str):
    with pytest.raises(ValidationError, match="APP_URL debe ser un origen HTTPS válido en producción"):
        build_production_settings(APP_URL=app_url)

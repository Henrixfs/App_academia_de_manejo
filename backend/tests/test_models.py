"""
Tests básicos para verificar que los modelos SQLAlchemy se crean correctamente.

Estos tests validan la estructura del ORM sin necesidad de lógica de negocio.
Los tests de reglas de negocio (RN01, RN02, RN03) van en archivos separados.
"""

import uuid
from decimal import Decimal
from datetime import datetime, timezone

import pytest

from app.models import (
    Alumno,
    Servicio,
    Paquete,
    MatriculaPaquete,
    Reserva,
    ProgresoNivel,
    Falta,
)


class TestAlumnoModel:
    """Tests para el modelo Alumno."""

    def test_crear_alumno(self, db_session):
        """Verifica que se puede crear y persistir un Alumno."""
        alumno = Alumno(
            nombres="Juan Carlos",
            apellidos="García López",
            documento_identidad="12345678",
            telefono="987654321",
            email="juan@example.com",
        )
        db_session.add(alumno)
        db_session.flush()

        assert alumno.id is not None
        assert alumno.nombres == "Juan Carlos"
        assert alumno.documento_identidad == "12345678"

    def test_repr_alumno(self, db_session):
        """Verifica que __repr__ retorna el formato esperado."""
        alumno = Alumno(
            nombres="Ana",
            apellidos="Ríos",
            documento_identidad="87654321",
            telefono="912345678",
        )
        db_session.add(alumno)
        db_session.flush()

        assert "Ana" in repr(alumno)


class TestServicioModel:
    """Tests para el modelo Servicio."""

    def test_crear_servicio(self, db_session):
        """Verifica que se puede crear un Servicio con tarifa válida."""
        servicio = Servicio(
            nombre="Circuito Libre",
            descripcion="Práctica libre en circuito cerrado.",
            tarifa=Decimal("40.00"),
            tiempo_minimo_horas=1,
        )
        db_session.add(servicio)
        db_session.flush()

        assert servicio.id is not None
        assert servicio.tarifa == Decimal("40.00")


class TestHealthEndpoint:
    """Tests para el endpoint /health."""

    def test_health_check_retorna_ok(self, client):
        """Verifica que el endpoint /health retorna status ok."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "Academia" in data["service"]

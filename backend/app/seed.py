"""
Script de seed para crear el usuario administrador inicial.

Uso:
    python -m app.seed

Este script crea:
- Un usuario admin con las credenciales especificadas en .env
- Los servicios base del catálogo
- Los paquetes base
"""

import sys
import os
import uuid
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

import bcrypt
from app.database import SessionLocal, engine, Base
from app.models import Alumno, Servicio, Paquete, Administrador


ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@academia.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
ADMIN_NOMBRES = os.getenv("ADMIN_NOMBRES", "Administrador")
ADMIN_APELLIDOS = os.getenv("ADMIN_APELLIDOS", "Sistema")
ADMIN_TELEFONO = os.getenv("ADMIN_TELEFONO", "000000000")


def get_password_hash(password: str) -> str:
    """Genera un hash bcrypt de la contraseña."""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def create_admin(db):
    existing = db.query(Administrador).filter(Administrador.email == ADMIN_EMAIL).first()
    if existing:
        print(f"Admin {ADMIN_EMAIL} ya existe, omitiendo...")
        return existing

    password_hash = get_password_hash(ADMIN_PASSWORD)

    admin = Administrador(
        id=uuid.uuid4(),
        email=ADMIN_EMAIL,
        nombres=ADMIN_NOMBRES,
        apellidos=ADMIN_APELLIDOS,
        telefono=ADMIN_TELEFONO,
        password_hash=password_hash,
        activo=True,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    print(f"Admin creado: {ADMIN_EMAIL}")
    return admin


def create_servicios(db):
    servicios_data = [
        {
            "nombre": "Simulacro Tipo Examen",
            "descripcion": "Evaluación práctica con los mismos criterios del centro oficial de emisión de licencias. Clasifica las infracciones en faltas leves, graves y eliminatorias.",
            "tarifa": 40.00,
            "tiempo_minimo_horas": 1,
        },
        {
            "nombre": "Circuito Libre",
            "descripcion": "Alquiler de pista para práctica de maniobras específicas: estacionamiento en paralelo, marcha atrás y curvas cerradas.",
            "tarifa": 40.00,
            "tiempo_minimo_horas": 1,
        },
        {
            "nombre": "Asesoría en Trámites",
            "descripcion": "Guía personalizada paso a paso para la programación de citas ante la autoridad competente.",
            "tarifa": 0.00,
            "tiempo_minimo_horas": 1,
        },
    ]

    for data in servicios_data:
        existing = db.query(Servicio).filter(Servicio.nombre == data["nombre"]).first()
        if existing:
            print(f"Servicio '{data['nombre']}' ya existe, omitiendo...")
            continue
        servicio = Servicio(**data)
        db.add(servicio)
        print(f"Servicio creado: {data['nombre']}")
    db.commit()


def create_paquetes(db):
    paquetes_data = [
        {
            "nombre": "Paquete San Cristóbal",
            "descripcion": "Programa completo desde nivel básico hasta nivel intermedio con acompañamiento constante del instructor. Incluye evaluación diagnóstica inicial, sesiones progresivas por niveles y simulacro de cierre previo al examen oficial.",
            "precio_sugerido": 350.00,
        },
    ]

    for data in paquetes_data:
        existing = db.query(Paquete).filter(Paquete.nombre == data["nombre"]).first()
        if existing:
            print(f"Paquete '{data['nombre']}' ya existe, omitiendo...")
            continue
        paquete = Paquete(**data)
        db.add(paquete)
        print(f"Paquete creado: {data['nombre']}")
    db.commit()


def main():
    print("Iniciando seed de datos...")
    db = SessionLocal()
    try:
        create_admin(db)
        create_servicios(db)
        create_paquetes(db)
        print("Seed completado exitosamente!")
    finally:
        db.close()


if __name__ == "__main__":
    main()

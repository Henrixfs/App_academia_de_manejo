"""
Utilidades generales de la aplicación.
"""

import re
from typing import Optional


def validar_email(email: str) -> bool:
    """Valida el formato de un email."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validar_telefono(telefono: str) -> bool:
    """Valida un número de teléfono peruano (simple)."""
    # Remover espacios y guiones
    telefono_limpio = re.sub(r'[\s\-]', '', telefono)
    # Verificar que tenga entre 9 y 12 dígitos y solo contenga números
    return telefono_limpio.isdigit() and 9 <= len(telefono_limpio) <= 12


def formatear_monto(monto: float) -> str:
    """Formatea un monto como moneda peruana (S/)."""
    return f"S/ {monto:,.2f}"
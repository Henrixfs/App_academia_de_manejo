"""
Excepciones custom de la aplicación.
"""


class AcademiaException(Exception):
    """Base exception para la aplicación."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class AlumnoNotFound(AcademiaException):
    """Alumno no encontrado."""
    def __init__(self):
        super().__init__("Alumno no encontrado", 404)


class ReservaNotFound(AcademiaException):
    """Reserva no encontrada."""
    def __init__(self):
        super().__init__("Reserva no encontrada", 404)


class ServicioNotFound(AcademiaException):
    """Servicio no encontrado."""
    def __init__(self):
        super().__init__("Servicio no encontrado", 404)


class ReservaYaExiste(AcademiaException):
    """Conflicto: ya existe una reserva en esa fecha/hora."""
    def __init__(self):
        super().__init__("Ya existe una reserva en esa fecha y hora", 409)


class CancelacionNoPermitida(AcademiaException):
    """Cancelación no permitida (menos de 2 horas)."""
    def __init__(self):
        super().__init__("No puedes cancelar con menos de 2 horas de anticipación", 400)


class LimitReprogramacionesExcedido(AcademiaException):
    """Excedió el máximo de reprogramaciones gratuitas."""
    def __init__(self):
        super().__init__("Has excedido el máximo de 2 reprogramaciones gratuitas", 400)


class ValorInvalido(AcademiaException):
    """Valor inválido en validación de negocio."""
    def __init__(self, field: str, reason: str):
        super().__init__(f"Valor inválido en {field}: {reason}", 400)


class AdministradorNotFound(AcademiaException):
    """Administrador no encontrado."""
    def __init__(self):
        super().__init__("Administrador no encontrado", 404)


class CredencialesIncorrectas(AcademiaException):
    """Credenciales de autenticación incorrectas."""
    def __init__(self):
        super().__init__("Credenciales incorrectas", 401)


class AdminYaExiste(AcademiaException):
    """Ya existe un administrador con ese email."""
    def __init__(self):
        super().__init__("Ya existe un administrador con este email", 409)
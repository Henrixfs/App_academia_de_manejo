"""
Excepciones custom de la aplicación.
"""


class AcademiaException(Exception):
    """Base exception para la aplicación."""
    def __init__(self, message: str, status_code: int = 400, code: str = "ACADEMIA_ERROR", field: str | None = None):
        self.message = message
        self.status_code = status_code
        self.code = code
        self.field = field
        super().__init__(self.message)


class AlumnoNotFound(AcademiaException):
    """Alumno no encontrado."""
    def __init__(self):
        super().__init__("Alumno no encontrado", 404, "ALUMNO_NOT_FOUND")


class ReservaNotFound(AcademiaException):
    """Reserva no encontrada."""
    def __init__(self):
        super().__init__("Reserva no encontrada", 404, "RESERVA_NOT_FOUND")


class ServicioNotFound(AcademiaException):
    """Servicio no encontrado."""
    def __init__(self):
        super().__init__("Servicio no encontrado", 404, "SERVICIO_NOT_FOUND")


class ReservaYaExiste(AcademiaException):
    """Conflicto: ya existe una reserva en esa fecha/hora."""
    def __init__(self):
        super().__init__("Ya existe una reserva en esa fecha y hora", 409, "RESERVA_CONFLICT")


class CancelacionNoPermitida(AcademiaException):
    """Cancelación no permitida (menos de 2 horas)."""
    def __init__(self):
        super().__init__("No puedes cancelar con menos de 2 horas de anticipación", 400, "CANCELACION_NO_PERMITIDA")


class LimitReprogramacionesExcedido(AcademiaException):
    """Excedió el máximo de reprogramaciones gratuitas."""
    def __init__(self):
        super().__init__("Has excedido el máximo de 2 reprogramaciones gratuitas", 400, "LIMITE_REPROGRAMACIONES")


class ValorInvalido(AcademiaException):
    """Valor inválido en validación de negocio."""
    def __init__(self, field: str, reason: str):
        super().__init__(f"Valor inválido en {field}: {reason}", 422, "VALOR_INVALIDO", field)


class AdministradorNotFound(AcademiaException):
    """Administrador no encontrado."""
    def __init__(self):
        super().__init__("Administrador no encontrado", 404, "ADMIN_NOT_FOUND")


class CredencialesIncorrectas(AcademiaException):
    """Credenciales de autenticación incorrectas."""
    def __init__(self):
        super().__init__("Credenciales incorrectas", 401, "CREDENCIALES_INCORRECTAS")


class AdminYaExiste(AcademiaException):
    """Ya existe un administrador con ese email."""
    def __init__(self):
        super().__init__("Ya existe un administrador con este email", 409, "ADMIN_DUPLICADO")


class AccesoProhibido(AcademiaException):
    def __init__(self):
        super().__init__("No tienes permiso para realizar esta operación", 403, "FORBIDDEN")


class TransicionReservaInvalida(AcademiaException):
    def __init__(self, estado: str):
        super().__init__(f"La reserva no admite esta operación desde el estado {estado}", 409, "TRANSICION_RESERVA_INVALIDA")


class ConflictoDatos(AcademiaException):
    def __init__(self, message: str = "El registro entra en conflicto con datos existentes"):
        super().__init__(message, 409, "DATA_CONFLICT")

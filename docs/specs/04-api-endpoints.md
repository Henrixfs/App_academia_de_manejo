# Especificación Técnica: Endpoints de la API (REST)
**Propósito**: Documentar los contratos de los servicios Web REST expuestos por el backend en FastAPI, detallando los recursos, métodos, parámetros de entrada, respuestas, roles requeridos y códigos de estado HTTP.

---

## 1. Políticas de Autenticación y Autorización

Todas las rutas privadas (a excepción del catálogo de servicios y la recepción de webhooks) requieren el envío de un token JWT en la cabecera `Authorization: Bearer <TOKEN>`. Los roles del sistema se gestionan mediante el atributo `rol` inyectado en el payload del JWT:
- **`administrador`**: Acceso total de lectura y escritura.
- **`alumno`**: Acceso limitado exclusivamente a sus datos personales, sus reservas y su progreso.
- **Anónimo (`anon`)**: Acceso público sin credenciales.

---

## 2. Catálogo de Recursos y Endpoints

### 2.1 Autenticación
* **Base Path**: `/api/v1/auth`

| Método | Endpoint | Rol Requerido | Descripción / Criterio de Aceptación | Códigos de Estado |
|---|---|---|---|---|
| **POST** | `/token` | `anon` | Intercambia DNI/Usuario y Contraseña por un token JWT. <br> *Schema: AuthLoginRequest* | `200 OK` (retorna Token) <br>`401 Unauthorized` (credenciales incorrectas) |

### 2.2 Servicios y Paquetes
* **Base Path**: `/api/v1/catalogos`

| Método | Endpoint | Rol Requerido | Descripción / Criterio de Aceptación | Códigos de Estado |
|---|---|---|---|---|
| **GET** | `/servicios` | `anon` | Obtiene la lista completa de servicios individuales (Simulacro, Circuito Libre) y tarifas fijas. | `200 OK` |
| **GET** | `/paquetes` | `anon` | Obtiene el catálogo de programas cerrados (ej. Paquete San Cristóbal). | `200 OK` |

### 2.3 Alumnos y Progreso
* **Base Path**: `/api/v1/alumnos`

| Método | Endpoint | Rol Requerido | Descripción / Criterio de Aceptación | Códigos de Estado |
|---|---|---|---|---|
| **GET** | `/` | `administrador` | Lista alumnos registrados. Permite buscar por documento o nombres mediante Query string. | `200 OK` <br>`401` / `403` (No admin) |
| **POST** | `/` | `administrador` | Registra una nueva ficha de alumno. <br> *Schema: AlumnoCreateRequest* | `201 Created` <br>`400 Bad Request` (DNI ya existe) |
| **GET** | `/{id}` | `administrador`, `alumno` | Obtiene el perfil de un alumno, incluyendo su nivel curricular actual y progreso detallado. <br> *Validación: El alumno solo puede consultar su propio `id`.* | `200 OK` <br>`404 Not Found` |
| **POST** | `/{id}/niveles` | `administrador` | Registra el avance de nivel del alumno (Básico → Intermedio → Pre-examen). <br> *Schema: ProgresoNivelRequest* | `200 OK` <br>`400` (progreso inválido) |

### 2.4 Reservas
* **Base Path**: `/api/v1/reservas`

| Método | Endpoint | Rol Requerido | Descripción / Criterio de Aceptación | Códigos de Estado |
|---|---|---|---|---|
| **GET** | `/` | `administrador`, `alumno` | Lista reservas agendadas. Parámetros query: `fecha_inicio`, `fecha_fin`. <br> *Filtro: Si es alumno, se filtra por su ID automáticamente.* | `200 OK` |
| **POST** | `/` | `administrador`, `alumno` | Crea una reserva de práctica. <br> *Schema: ReservaCreateRequest* <br> **Regla Enforzada**: Verifica **RN01** (mínimo 2 horas de anticipación para Circuito Libre) y traslape de horarios. | `201 Created` <br>`400 Bad Request` (No cumple RN01 o traslape) <br>`401 Unauthorized` |
| **POST** | `/{id}/reprogramar`| `administrador`, `alumno` | Solicita reprogramación de fecha/hora de la reserva. <br> *Schema: ReprogramarRequest* <br> **Reglas Enforzadas**: **RN02** (mínimo 2 horas de anticipación) y **RN03** (límite de 2 reprogramaciones gratuitas si es paquete). | `200 OK` <br>`400 Bad Request` (Fuera de plazo o límite de reprogramaciones superado) |
| **POST** | `/{id}/cancelar` | `administrador`, `alumno` | Cancela la reserva. <br> **Regla Enforzada**: **RN02** (si cancela con < 2 horas de anticipación, la clase se consume o cobra). | `200 OK` <br>`400 Bad Request` (Intento de cancelación tardía no permitida) |

### 2.5 Evaluaciones (Faltas)
* **Base Path**: `/api/v1/reservas/{reserva_id}/faltas`

| Método | Endpoint | Rol Requerido | Descripción / Criterio de Aceptación | Códigos de Estado |
|---|---|---|---|---|
| **POST** | `/` | `administrador` | Registra una infracción cometida durante una reserva (solo Simulacros o sesiones evaluadas). <br> *Schema: FaltaCreateRequest* | `201 Created` <br>`400 Bad Request` (Reserva no completada o no evaluable) |
| **GET** | `/` | `administrador`, `alumno` | Obtiene el reporte detallado de las faltas cometidas por el alumno en esa sesión. <br> *Validación: Alumno solo puede ver sus propios simulacros.* | `200 OK` <br>`404 Not Found` |

### 2.6 Webhooks de Integración de Canales
* **Base Path**: `/api/v1/channels/meta`

| Método | Endpoint | Rol Requerido | Descripción / Criterio de Aceptación | Códigos de Estado |
|---|---|---|---|---|
| **GET** | `/webhook` | `anon` | Validación del token de verificación por parte de los servidores de Meta (WhatsApp y Facebook). <br> Parámetros query: `hub.mode`, `hub.challenge`, `hub.verify_token`. | `200 OK` (retorna el challenge en texto plano si coincide el token) |
| **POST** | `/webhook` | `anon` | Recepción de eventos en tiempo real de Meta (mensajes nuevos). Valida firma SHA256 en cabeceras. <br> *Payload: Estructura JSON de Meta.* | `200 OK` |

---

## 3. Esquemas de Validación (Pydantic Referencias)

Para evitar duplicidad, los datos de entrada/salida de los endpoints se validan contra los siguientes esquemas conceptuales mapeados directamente del modelo de dominio:

* **`AuthLoginRequest`**: `documento_identidad: str`, `password: str`.
* **`AlumnoCreateRequest`**: `nombres: str`, `apellidos: str`, `documento_identidad: str`, `telefono: str`, `email: Optional[str]`.
* **`ProgresoNivelRequest`**: `nivel: str` (Básico | Intermedio | Pre-examen).
* **`ReservaCreateRequest`**: `alumno_id: UUID`, `servicio_id: UUID`, `matricula_paquete_id: Optional[UUID]`, `fecha_hora_inicio: datetime`, `fecha_hora_fin: datetime`.
* **`ReprogramarRequest`**: `nueva_fecha_hora_inicio: datetime`, `nueva_fecha_hora_fin: datetime`.
* **`FaltaCreateRequest`**: `tipo_falta: str` (Leve | Grave | Eliminatoria), `descripcion: str`, `minuto_ocurrencia: Optional[int]`, `observaciones: Optional[str]`.

---

## 4. Referencias Cruzadas

- [01-modelo-dominio.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/01-modelo-dominio.md): Reglas de negocio (RN01, RN02, RN03) y estados que validan estos endpoints.
- [02-arquitectura.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/02-arquitectura.md): Estructura de controladores (`routers/`) donde se implementan estas rutas.
- [06-integracion-canales.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/06-integracion-canales.md): Formato detallado de entrada y salida del endpoint `/channels/meta/webhook`.
- [09-requisitos-no-funcionales.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/09-requisitos-no-funcionales.md): Detalles de seguridad sobre la autenticación JWT y HTTPS.

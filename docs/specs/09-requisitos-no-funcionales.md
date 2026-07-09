# Especificación Técnica: Requisitos No Funcionales
**Propósito**: Definir las restricciones técnicas globales, estándares de seguridad, metas de rendimiento, niveles de disponibilidad y políticas de observabilidad aplicadas al MVP.

---

## 1. Seguridad y Protección de Datos

### 1.1 Autenticación y Autorización
- **Estándar**: Firma criptográfica de tokens JWT usando el algoritmo HMAC-SHA256.
- **Caducidad**: El token JWT expira automáticamente transcurridos 15 minutos de su emisión, obligando a una renovación mediante token de refresco o login activo.
- **Resguardo de Contraseñas**: Queda prohibido almacenar contraseñas en texto plano. Se debe aplicar un hash criptográfico adaptativo mediante `bcrypt` (con factor de trabajo >= 12) antes de persistirlas en la tabla `alumnos` o tabla de administradores.

### 1.2 Seguridad en Comunicaciones
- **Tránsito de Datos**: Todo canal de comunicación (web y APIs) exige el cifrado obligatorio TLS 1.3 (HTTPS).
- **Meta Compliance**: La API de Meta requiere un certificado SSL válido firmado por una autoridad de certificación (CA) autorizada para el funcionamiento del webhook en producción.
- **Protección de Datos Personales**: Cumplimiento con la **Ley N° 29733 (Ley de Protección de Datos Personales en Perú)**. Se requerirá un checkbox explícito de aceptación de políticas de privacidad durante el registro de nuevos alumnos, y la base de datos debe resguardarse contra accesos no autorizados.

---

## 2. Rendimiento y Latencia

### 2.1 Tiempos de Respuesta
- **Endpoints REST Estándar**: El 95% de las peticiones CRUD y lecturas del panel administrativo deben responder en un tiempo inferior a **200ms**.
- **Agente de IA Conversacional**: El tiempo acumulado de respuesta del chatbot (procesamiento de webhook + generación de embeddings + consulta RAG + llamada de LLM + envío de mensaje de retorno) debe ser menor a **5.0 segundos** (objetivo deseado de promedio: < 3.5s).
- **Límite de Espera (Timeout)**: Si una llamada al LLM tarda más de 8.0 segundos, se aborta y se gatilla la respuesta de respaldo (fallback).

### 2.2 Desempeño del Frontend
- **Core Web Vitals**: La SPA debe cargar su recurso inicial en menos de 2.0 segundos en conexiones móviles estándar 4G (Largest Contentful Paint < 2.5s).

---

## 3. Disponibilidad

- **Uptime Objetivo**: El sistema mantendrá una disponibilidad mínima de **99.5%** mensual.
- **Ventanas de Mantenimiento**: Las actividades programadas de mantenimiento y migración de base de datos se programarán exclusivamente entre las **10:00 p.m. y las 4:00 a.m.** (Hora de Perú) en días hábiles de baja transaccionalidad.

---

## 4. Logging, Observabilidad y Telemetría

### 4.1 Registro de Logs
- **Estructura**: El backend en FastAPI utilizará logs estructurados en formato **JSON** en la salida estándar (`stdout`/`stderr`), facilitando el análisis directo sin sobrecarga.
- **Nivel de Severidad**:
  - `INFO`: Registro de eventos del ciclo de vida (arranque, migraciones aplicadas).
  - `WARNING`: Validaciones fallidas de negocio (reprogramación tardía, DNI duplicado).
  - `ERROR` / `CRITICAL`: Fallos de base de datos, caídas de LLM externa y fallas de verificación de webhooks.

### 4.2 Telemetría de Webhooks (Meta SLA)
Meta exige que los servidores receptores de webhooks respondan con un código `200 OK` en menos de **3.0 segundos** tras recibir un mensaje.
- **Estrategia**: Si el procesamiento del agente de IA RAG supera los 2.0 segundos, el webhook responderá de inmediato `200 OK` en segundo plano (asíncronamente) y enviará la respuesta del LLM de forma diferida mediante una tarea en background (ej. FastAPI BackgroundTasks). Esto evita que Meta reenvíe repetidamente el mismo mensaje por considerar caída la API del webhook.

### 4.3 Monitoreo de Errores
- **Herramienta MVP**: Integración del SDK de **Sentry** en el backend para captura automática de trazas de error no controladas en producción, permitiendo alertar al equipo de desarrollo en tiempo real.

---

## 5. Referencias Cruzadas

- [00-vision-general.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/00-vision-general.md): Requisitos de acceso según roles de usuario.
- [04-api-endpoints.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/04-api-endpoints.md): Uso de JWT y seguridad en endpoints REST.
- [05-agente-ia-rag.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/05-agente-ia-rag.md): Tolerancia a fallos y timeouts del proveedor LLM.
- [06-integracion-canales.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/06-integracion-canales.md): Reglas de validación de webhook de Meta.

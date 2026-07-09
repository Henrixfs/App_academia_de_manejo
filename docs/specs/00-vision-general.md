# Especificación Técnica: Visión General del MVP
**Propósito**: Describir la visión general del producto, objetivos del MVP, alcance detallado y los roles de usuario para la plataforma de la Academia de Manejo San Cristóbal VIP.

---

## 1. Resumen Ejecutivo

La **Academia de Manejo San Cristóbal VIP**, ubicada en Ayacucho, Perú, es un centro de entrenamiento especializado en la formación de conductores. Con el fin de modernizar su operación y mejorar la captación de clientes, se requiere digitalizar sus procesos de negocio principales y proveer un canal de atención automatizado mediante Inteligencia Artificial (RAG).

El sistema propuesto es un MVP (Producto Mínimo Viable) estructurado en un solo servicio monolítico que integra un backend en FastAPI, una base de datos PostgreSQL, un panel administrativo web en TypeScript, y un agente de IA accesible desde tres canales: Web, WhatsApp y Facebook Messenger.

---

## 2. Objetivos del MVP

1. **Automatizar la atención de consultas**: Implementar un agente de IA con RAG (Retrieval-Augmented Generation) entrenado con la base de conocimiento oficial de la academia para responder preguntas frecuentes en tiempo real 24/7.
2. **Digitalizar las Reservas y el Progreso**: Permitir la creación, visualización y gestión de reservas de sesiones prácticas, y llevar el registro digital de progreso de los alumnos.
3. **Controlar el Historial de Evaluaciones**: Facilitar al instructor el registro de faltas (leves, graves, eliminatorias) cometidas durante los simulacros tipo examen.
4. **Respetar las Políticas del Negocio**: Implementar la verificación automatizada de políticas de cancelación y reprogramación de la academia.

---

## 3. Alcance del MVP

### 3.1 Funcionalidades Incluidas

El MVP comprende las siguientes capacidades funcionales:
- **Catálogo de Servicios y Tarifas**: Consulta de lectura de tarifas vigentes (Simulacro Tipo Examen, Circuito Libre, Paquete San Cristóbal, Asesoría en Trámites).
- **Gestión de Reservas**: Creación, consulta y cancelación/reprogramación de reservas de sesiones de práctica (Circuito Libre y Simulacro Tipo Examen), validando reglas de anticipación.
- **Registro de Alumnos y Progreso**: Ficha de alumno con su nivel actual de progresión dentro del Paquete San Cristóbal (Básico, Intermedio, Pre-examen).
- **Registro de Faltas**: Registro sistemático de faltas por sesión/simulacro clasificado por tipo (Leve, Grave, Eliminatoria).
- **Agente de IA Conversacional (RAG)**: Agente que responde consultas a partir de la base de conocimiento en tres puntos de entrada: Chat Web, WhatsApp Business y Facebook Messenger.
- **Panel Administrativo Mínimo**: Interfaz web para que el administrador/instructor visualice reservas, registre faltas y gestione alumnos.

### 3.2 Funcionalidades Excluidas

Las siguientes características quedan explícitamente **fuera del alcance** para el MVP (ver detalles y notas de diseño en los documentos de arquitectura y modelo de dominio correspondientes):
- **Gestión de Vehículos y Flota Vehicular**: No se modelan vehículos, mantenimientos, doble mando o anomalías físicas del vehículo en la base de datos ni en el backend.
  <!-- Fuera de alcance MVP: La gestión de vehículos/flota física se delega a procesos manuales externos por ahora. -->
- **Pasarela de Pagos en Línea**: Las transacciones financieras se realizan de manera presencial. El sistema solo almacena el estado del pago.
  <!-- Fuera de alcance MVP: Integración con pasarelas de pago (Visa, Culqi, Yape, etc.). Se pospone para fases posteriores. -->
- **Multi-sede / Multi-tenant**: El sistema está configurado exclusivamente para la sede única de Ayacucho.
- **Aplicación Móvil Nativa**: Toda interacción de usuarios se realiza mediante el chat web responsive, WhatsApp, Facebook Messenger o el panel web.

---

## 4. Roles y Usuarios del Sistema

| Rol | Descripción | Permisos Clave | Canales de Acceso |
|---|---|---|---|
| **Prospecto** | Persona interesada en los servicios de la academia. | Consulta de catálogo, tarifas, ubicación y preguntas frecuentes vía agente de IA. | Chat Web, WhatsApp, Messenger |
| **Alumno** | Cliente registrado en un paquete o servicio individual. | Consulta de sus propias reservas, nivel de progreso y registro de faltas obtenidas en simulacros. | Chat Web (autenticado), WhatsApp, Messenger |
| **Administrador / Instructor** | Personal encargado de impartir clases y gestionar el negocio. | Creación/modificación de alumnos, aprobación de reservas, registro de faltas en simulacros, actualización de progreso. | Panel Administrativo Web |

---

## 5. Referencias Cruzadas

Este documento se conecta con las siguientes especificaciones técnicas detalladas:
- [01-modelo-dominio.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/01-modelo-dominio.md): Definición detallada de entidades y reglas de negocio.
- [02-arquitectura.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/02-arquitectura.md): Estructura física y lógica del software.
- [03-esquema-base-datos.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/03-esquema-base-datos.md): Estructura SQL de almacenamiento.
- [04-api-endpoints.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/04-api-endpoints.md): Contratos de servicio REST.
- [05-agente-ia-rag.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/05-agente-ia-rag.md): Diseño de IA y RAG.
- [06-integracion-canales.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/06-integracion-canales.md): Conectividad con Meta (WhatsApp/Facebook).
- [07-estrategia-pruebas.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/07-estrategia-pruebas.md): Aseguramiento de calidad.
- [08-devops-cicd.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/08-devops-cicd.md): Despliegue e infraestructura.
- [09-requisitos-no-funcionales.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/09-requisitos-no-funcionales.md): Seguridad, rendimiento y observabilidad.

# Especificación Técnica: Esquema de Base de Datos
**Propósito**: Definir la estructura física de la base de datos relacional PostgreSQL, detallando las tablas, columnas, tipos de datos, restricciones de integridad e índices.

---

## 1. Sentencias DDL de Creación (PostgreSQL)

```sql
-- Habilitar extensión para generación de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla: alumnos
CREATE TABLE alumnos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    documento_identidad VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Tabla: servicios
CREATE TABLE servicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT NOT NULL,
    tarifa NUMERIC(10, 2) NOT NULL CONSTRAINT chk_tarifa_positiva CHECK (tarifa >= 0.00),
    tiempo_minimo_horas INTEGER NOT NULL CONSTRAINT chk_duracion_minima CHECK (tiempo_minimo_horas >= 1)
);

-- 3. Tabla: paquetes
CREATE TABLE paquetes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT NOT NULL,
    precio_sugerido NUMERIC(10, 2) CONSTRAINT chk_precio_sug CHECK (precio_sugerido >= 0.00)
);

-- 4. Tabla: matricula_paquetes
CREATE TABLE matricula_paquetes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE RESTRICT,
    paquete_id UUID NOT NULL REFERENCES paquetes(id) ON DELETE RESTRICT,
    fecha_matricula TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    precio_acordado NUMERIC(10, 2) NOT NULL CONSTRAINT chk_precio_acordado CHECK (precio_acordado >= 0.00),
    estado_pago VARCHAR(30) NOT NULL DEFAULT 'pendiente' CONSTRAINT chk_mat_estado_pago CHECK (estado_pago IN ('pendiente', 'pagado_presencial')),
    reprogramaciones_usadas INTEGER NOT NULL DEFAULT 0 CONSTRAINT chk_reprogs CHECK (reprogramaciones_usadas >= 0 AND reprogramaciones_usadas <= 2),
    estado VARCHAR(20) NOT NULL DEFAULT 'activo' CONSTRAINT chk_mat_estado CHECK (estado IN ('activo', 'completado', 'cancelado'))
);

-- 5. Tabla: reservas
CREATE TABLE reservas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE RESTRICT,
    servicio_id UUID NOT NULL REFERENCES servicios(id) ON DELETE RESTRICT,
    matricula_paquete_id UUID REFERENCES matricula_paquetes(id) ON DELETE SET NULL,
    fecha_hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_hora_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente_confirmacion' CONSTRAINT chk_res_estado CHECK (estado IN ('pendiente_confirmacion', 'confirmada', 'asistida', 'no_asistio', 'cancelada', 'reprogramada')),
    estado_pago VARCHAR(30) NOT NULL DEFAULT 'pendiente' CONSTRAINT chk_res_estado_pago CHECK (estado_pago IN ('pendiente', 'pagado_presencial')),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_duracion_reserva CHECK (fecha_hora_fin > fecha_hora_inicio)
);

-- 6. Tabla: progreso_niveles
CREATE TABLE progreso_niveles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
    nivel VARCHAR(20) NOT NULL CONSTRAINT chk_nivel CHECK (nivel IN ('Básico', 'Intermedio', 'Pre-examen')),
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(20) NOT NULL DEFAULT 'en_progreso' CONSTRAINT chk_estado_prog CHECK (estado IN ('en_progreso', 'completado'))
);

-- 7. Tabla: faltas
CREATE TABLE faltas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reserva_id UUID NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    tipo_falta VARCHAR(20) NOT NULL CONSTRAINT chk_tipo_falta CHECK (tipo_falta IN ('Leve', 'Grave', 'Eliminatoria')),
    descripcion TEXT NOT NULL,
    minuto_ocurrencia INTEGER CONSTRAINT chk_minuto CHECK (minuto_ocurrencia >= 0),
    observaciones TEXT
);
```

---

## 2. Índices de Rendimiento y Búsqueda

Para optimizar las consultas recurrentes realizadas por el panel administrativo y los servicios del backend, se definen los siguientes índices:

| Tabla | Nombre del Índice | Columnas Indexadas | Propósito / Tipo de Consulta |
|---|---|---|---|
| `alumnos` | `idx_alumnos_doc_id` | `documento_identidad` | Búsqueda rápida de la ficha de alumno durante registros de reservas. (Índice Único B-Tree implicado). |
| `reservas` | `idx_reservas_fechas` | `fecha_hora_inicio`, `fecha_hora_fin` | Optimizar la verificación de disponibilidad horaria y visualización de la agenda diaria. |
| `reservas` | `idx_reservas_alumno_fecha`| `alumno_id`, `fecha_hora_inicio` | Acelerar la recuperación del historial de clases de un alumno en orden cronológico. |
| `matricula_paquetes`| `idx_matricula_alumno` | `alumno_id`, `estado` | Recuperar rápidamente la matrícula de paquete activa de un alumno para validar límites de reprogramación. |
| `progreso_niveles`| `idx_progreso_alumno` | `alumno_id`, `nivel` | Consultar el estado de progresión curricular actual de un estudiante. |
| `faltas` | `idx_faltas_reserva` | `reserva_id` | Obtener las faltas acumuladas en un simulacro tipo examen específico para la generación del reporte final. |

---

## 3. Consideración de Extensibilidad para Pasarela de Pagos
Para evitar la alteración estructural de la base de datos al implementar pagos en línea en el futuro, las tablas `matricula_paquetes` y `reservas` incorporan la columna `estado_pago` con valores iniciales `'pendiente'` y `'pagado_presencial'`.

* **Estrategia Futura**: Cuando se integre una pasarela de pago (ej. Stripe o Culqi), únicamente se requerirá expandir la restricción `CHECK` del dominio de `estado_pago` para admitir estados transicionales (ej. `'procesando'`, `'reembolsado'`) e incorporar una tabla satélite `transacciones` (`id`, `reserva_id/matricula_id`, `transaction_token`, `metodo_pago`, `monto`, `fecha_pago`) sin necesidad de reescribir ni migrar las entidades base del negocio.

---

## 4. Referencias Cruzadas

- [01-modelo-dominio.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/01-modelo-dominio.md): Mapeo directo de relaciones conceptuales a tablas y llaves foráneas.
- [04-api-endpoints.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/04-api-endpoints.md): Consultas y escrituras ejecutadas por el backend sobre estas tablas.
- [08-devops-cicd.md](file:///C:/Users/HENRY/Desktop/PROYECTO_FINAL/Spec/docs/specs/08-devops-cicd.md): Manejo de las migraciones de este esquema mediante Alembic.

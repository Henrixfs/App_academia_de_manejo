# Academia de Manejo San Cristóbal VIP

Aplicación web para administrar alumnos, servicios y reservas. El backend usa FastAPI, SQLAlchemy, Alembic y PostgreSQL; el frontend usa Next.js 16, React 19 y una sesión cifrada del lado del servidor.

## Arquitectura y seguridad

- FastAPI aplica RBAC en dependencias independientes para administradores y alumnos.
- Los catálogos `GET /api/servicios/` y `GET /api/paquetes/` son públicos.
- Los CRUD bajo `/api/admin/alumnos`, `/api/admin/reservas`, `/api/admin/servicios` y `/api/admin/faltas` son exclusivos de administradores.
- Los alumnos usan `/api/me`, `/api/me/reservas` y acciones sobre reservas propias. Una reserva ajena responde como no encontrada.
- El navegador recibe únicamente la cookie cifrada `session`, con `httpOnly`, `sameSite=lax` y `secure` en producción. El JWT se conserva entre el servidor Next.js y FastAPI.
- El login y registro tienen límites por IP. En una instalación distribuida se debe sustituir el almacenamiento en memoria por Redis o el limitador del gateway.
- Las reservas se almacenan en UTC y se validan con horario comercial `America/Lima` de 08:00 a 18:00.
- PostgreSQL impide reservas solapadas mediante una restricción de exclusión. SQLite se usa solo para pruebas unitarias rápidas.

Para desplegar en AWS EC2 con Application Load Balancer, HTTPS, migraciones, bootstrap del administrador y respaldo de PostgreSQL, siga la guÃ­a de [despliegue en AWS](docs/deployment/aws-ec2.md).

## Requisitos

- Python 3.12
- PostgreSQL 16
- Bun 1.3 o Node.js 24
- Docker Compose, opcional

## Configuración local

Copie `.env.example` como `.env`, `backend/.env.example` como `backend/.env` y `frontend/.env.example` como `frontend/.env`. Reemplace todos los secretos de ejemplo. En producción, `SECRET_KEY` y `SESSION_SECRET` deben ser distintos, aleatorios y tener al menos 32 caracteres.

Backend:

```bash
python -m venv .venv
.venv/Scripts/activate
pip install -r backend/requirements.txt
cd backend
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend, en otra terminal:

```bash
cd frontend
bun install --frozen-lockfile
bun run dev
```

La web queda en `http://localhost:3000`, la API en `http://localhost:8000` y la documentación OpenAPI en `http://localhost:8000/docs` fuera de producción.

## Migraciones

Alembic es la única fuente de esquema. La cadena activa es `001 → 002 → 003 → 004 → 005`.

```bash
cd backend
alembic current
alembic upgrade head
alembic check
```

Para generar una migración nueva:

```bash
alembic revision --autogenerate -m "descripcion"
```

Revise siempre el archivo generado, en especial constraints, defaults y operaciones PostgreSQL.

## Pruebas y calidad

Backend:

```bash
cd backend
pytest -q
pytest -q --cov=app.services --cov-report=term --cov-fail-under=85
pytest -q --cov=app.routers --cov-report=term --cov-fail-under=75
```

Para integración PostgreSQL defina `TEST_DATABASE_URL`. Las pruebas recrean las tablas y nunca deben apuntar a una base con datos reales.

Frontend:

```bash
cd frontend
bun run lint
bun run typecheck
bun run test:coverage
bun run build
bunx playwright install chromium
bun run test:e2e
```

Vitest y Testing Library cubren componentes y estados accesibles. Playwright y axe validan landing y login en escritorio y móvil. El workflow `.github/workflows/ci.yml` ejecuta lint, tipos, cobertura, build, pruebas E2E, migraciones contra PostgreSQL y auditorías de dependencias.

## Contenedores

Complete un `.env` en la raíz y ejecute:

```bash
docker compose up --build
```

El servicio `migrate` aplica Alembic una sola vez antes de iniciar la API. Backend y frontend ejecutan con usuarios sin privilegios y tienen health checks. Para actualizar el esquema de producción, construya y pruebe primero la misma imagen, respalde la base y ejecute el servicio de migración de forma controlada.

## Operación

- `GET /health` comprueba el proceso de API.
- `GET /health/ready` comprueba conectividad con la base de datos.
- Cada respuesta incluye `X-Request-ID`; los errores usan `{code, message, field?, request_id}`.
- Los logs incluyen método, ruta, estado, duración e identificador de petición.
- Las métricas, trazas, alertas y captura centralizada de errores deben conectarse en la plataforma de despliegue.

## Datos iniciales

No existe una contraseña administrativa predeterminada. En desarrollo, antes de que exista un administrador, abra `http://localhost:3000/setup` y cree la primera cuenta con una contraseña propia de al menos 10 caracteres, letras y números. La pantalla se deshabilita automáticamente después de crearla y no existe en producción.

Para despliegues y automatización, defina `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el entorno y ejecute `python -m app.seed` desde `backend`. Nunca almacene contraseñas planas ni las incluya en el repositorio.

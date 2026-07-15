# Despliegue de producción en AWS EC2

## Arquitectura

La aplicación se ejecuta en una instancia EC2 mediante Docker Compose. PostgreSQL, FastAPI y Next.js no publican puertos al exterior. El contenedor `gateway` es la única entrada de la instancia y escucha el puerto 80 solo para recibir tráfico del Application Load Balancer (ALB). El ALB termina TLS con un certificado de ACM y reenvía las solicitudes al `gateway`.

```
Internet -> ALB HTTPS:443 -> EC2 gateway:80 -> Next.js:3000 -> FastAPI:8000 -> PostgreSQL:5432
```

## Recursos de AWS obligatorios

1. Registra o delega el dominio que usará la aplicación.
2. Solicita un certificado público de ACM para ese dominio en la misma región del ALB y valida el DNS.
3. Crea un ALB público con listener HTTPS en 443 y redirección de 80 a 443.
4. Crea un target group HTTP hacia el puerto 80 de la instancia y configura la comprobación de estado en `/health/ready`.
5. En el grupo de seguridad del ALB permite TCP 80 y 443 desde Internet.
6. En el grupo de seguridad de la EC2 permite TCP 80 únicamente desde el grupo de seguridad del ALB. Para administrar la instancia usa Session Manager o limita SSH a tu IP.
7. No abras los puertos 3000, 5432 ni 8000 en ningún grupo de seguridad.

## Preparación de la instancia

En Amazon Linux 2023 instala Docker, inicia el servicio y vuelve a conectarte después de añadir `ec2-user` al grupo `docker`.

```bash
sudo yum update -y
sudo yum install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
```

Instala Docker Compose v2 si `docker compose version` no devuelve una versión.

Clona el repositorio en la instancia y crea el archivo `.env` desde `.env.example`. No copies el `.env` de desarrollo y no subas este archivo al repositorio.

```env
POSTGRES_PASSWORD=valor-unico-de-al-menos-32-caracteres
SECRET_KEY=valor-unico-distinto-de-al-menos-32-caracteres
SESSION_SECRET=valor-unico-distinto-de-al-menos-32-caracteres
APP_URL=https://app.tudominio.com
ADMIN_EMAIL=admin@tudominio.com
ADMIN_PASSWORD=contrasena-inicial-con-letras-y-numeros
```

Evita el carácter `$` en las claves si las escribes directamente en el archivo `.env`, porque Docker Compose interpreta referencias a variables.

## Primer despliegue

Comprueba la configuración antes de crear contenedores. Ejecuta el bootstrap una sola vez para crear el administrador inicial y los catálogos. El seed es idempotente: no reemplaza los datos que ya existen.

```bash
docker compose config --quiet
docker compose --profile bootstrap up bootstrap-admin
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 gateway frontend backend migrate
```

La comprobación del ALB debe responder `200` en `http://IP_PRIVADA_EC2/health/ready`. El acceso real de usuarios debe ser exclusivamente mediante `https://app.tudominio.com`.

## Actualización

Antes de actualizar, realiza un snapshot del volumen EBS de la instancia o un respaldo lógico de PostgreSQL. Luego ejecuta:

```bash
git pull
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 migrate backend frontend gateway
```

El servicio `migrate` aplica Alembic antes de iniciar la API. Si falla, `backend`, `frontend` y `gateway` no deben iniciar.

## Respaldo y restauración de PostgreSQL

Guarda los respaldos fuera de la instancia, por ejemplo en un bucket S3 privado con cifrado. Para crear un respaldo lógico:

```bash
docker compose exec -T postgres pg_dump -U academia -d academia_manejo -Fc > academia-$(date +%F).dump
```

Para restaurar en una base de datos vacía:

```bash
docker compose exec -T postgres pg_restore -U academia -d academia_manejo --clean --if-exists < academia-AAAA-MM-DD.dump
```

Prueba periódicamente una restauración en una instancia no productiva antes de depender de un respaldo.

## Diagnóstico

```bash
docker compose ps
docker compose logs --tail=200 gateway frontend backend migrate postgres
docker compose exec backend python -m alembic current
docker compose exec backend python -m alembic check
```

Si el ALB marca el destino como no saludable, verifica primero `docker compose logs gateway backend postgres` y que el grupo de seguridad de EC2 permita el puerto 80 desde el ALB.

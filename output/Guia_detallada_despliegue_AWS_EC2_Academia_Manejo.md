## GUÍA DETALLADA DESPLIEGUE EN AWS

## Academia de Manejo San Cristóbal VIP

Procedimiento visual y operativo para levantar el sistema completo: dominio, certificado HTTPS, Application Load Balancer, EC2 Amazon Linux 2023, Docker, base de datos, administrador inicial y validación final.

## Resultado esperado

Al terminar, los usuarios abrirán https://app.tudominio.com. El ALB manejará HTTPS; la instancia solo expondrá el gateway por el puerto 80 y la base de datos permanecerá privada.

Versión: 15 de julio de 2026

Usa esta guía con una cuenta AWS donde puedas crear EC2, grupos de seguridad, ACM, ELB y Route 53. Los nombres propuestos pueden copiarse tal como aparecen.


## 1. Antes de abrir AWS

Esta guía prepara una instalación productiva de una sola instancia EC2 con Docker Compose. El diseño coincide con el repositorio: el contenedor gateway es la única entrada de la instancia; Next.js llama a FastAPI dentro de Docker; PostgreSQL no tiene puerto público.

## No continúes si falta un dominio

Necesitas un dominio público, por ejemplo tudominio.com, y elegirás el subdominio app.tudominio.com. El certificado TLS no se puede emitir para una IP pública de EC2.

Completa esta tabla antes de empezar. Sustituye los valores entre corchetes cuando trabajes en AWS.

| Elemento | Valor que usarás | Dónde se escribe |
| --- | --- | --- |
| Región | [REGION_AWS], por ejemplo us-east-1 | Selector superior derecho de la consola |
| Dominio de la aplicación | app.tudominio.com | ACM, Route 53 y APP_URL |
| Nombre EC2 | academia-manejo-prod-ec2 | EC2 > Name and tags |
| Grupo de seguridad ALB sg-academia-alb-prod |   | EC2 > Security Groups |
| Grupo de seguridad EC2 sg-academia-ec2-prod |   | EC2 > Security Groups |
| Target group | tg-academia-web-prod | EC2 > Target Groups |
| Load balancer | alb-academia-manejo-prod | EC2 > Load Balancers |

Costos: EC2, Elastic Load Balancing, Route 53, almacenamiento EBS y transferencia pueden generar cargos. Revisa el estimador de precios de AWS antes de crear recursos.

## 2. Arquitectura que vas a construir

Solo el ALB es público. El ALB termina TLS y la instancia recibe HTTP por el puerto 80.

## Regla de seguridad

No abras 3000, 5432 ni 8000 en AWS. El ALB se comunica con la EC2 por el puerto 80. Dentro de Docker, gateway se comunica con frontend, backend y PostgreSQL por redes privadas.

El ALB termina HTTPS con ACM. Por eso APP_URL será https://app.tudominio.com y el navegador podrá guardar correctamente la cookie segura de sesión.

## 3. Seleccionar región y crear grupos de seguridad


## Paso 1 - Abre Amazon EC2

En la consola de AWS, usa la barra de búsqueda superior, escribe EC2 y abre el servicio EC2.

## Paso 2 - Elige una región

En la esquina superior derecha abre el selector de región. Usa una sola región para EC2, ALB, ACM y Route 53. Anota el nombre exacto que aparece en pantalla.

## Paso 3 - Crea el grupo del ALB

Menú izquierdo Network & Security > Security Groups > Create security group. Security group name: sg-academia-alb-prod. Description: ALB público Academia Manejo. VPC: selecciona la VPC Default de la región.

| Inboun | Type | Port | Source | Description |
| --- | --- | --- | --- | --- |
| d rule |   |   |   |   |
| 1 | HTTP | 80 | Anywhere-IPv4 0.0.0.0/0 | Redirección a HTTPS |
| 2 | HTTPS | 443 | Anywhere-IPv4 0.0.0.0/0 | Aplicación pública |

Deja la regla de salida predeterminada All traffic. Pulsa Create security group.

## Paso 4 - Crea el grupo de la EC2

Vuelve a Security Groups > Create security group. Security group name: sg-academia-ec2-prod. Description: EC2 privada detrás de ALB. VPC: la misma VPC Default.

| Inboun | Type | Port | Source | Description |
| --- | --- | --- | --- | --- |
| d rule |   |   |   |   |
| 1 | Custom TCP | 80 | Security group: | Solo ALB al gateway |
|   |   |   | sg-academia-alb-prod |   |
| 2 | SSH | 22 | My IP | Administración temporal desde tu red |

## Importante

En Source de la regla 1 no escribas una IP. Selecciona el grupo sg-academia-alb-prod. AWS permitirá tráfico desde las interfaces privadas del ALB aunque cambien sus IP.


## 4. Lanzar la instancia EC2

## Paso 1 - Pulsa Launch instances

Desde EC2 Dashboard, pulsa el botón naranja Launch instances.

| Bloque de la pantalla | Valor exacto recomendado |
| --- | --- |
| Name and tags > Name | academia-manejo-prod-ec2 |
| Application and OS Images | Quick Start > Amazon Linux > Amazon Linux 2023 AMI |
| Instance type | t3.medium para 4 GiB de memoria y compilación Docker estable |
| Key pair | Create new key pair: kp-academia-manejo-prod, RSA, .pem. Descárgala y guárdala |
|   | fuera del repositorio. |
| Network settings | Edit > VPC Default, subnet pública, Auto-assign public IP Enable, Select existing |
|   | security group: sg-academia-ec2-prod |
| Configure storage | 1 volume, 30 GiB, gp3, Encrypted marcado |

En Summary revisa el nombre, AMI, tipo, key pair, security group y volumen. Pulsa Launch instance. En la página de confirmación, pulsa el enlace del Instance ID.

## Por qué t3.medium

El sistema corre PostgreSQL, FastAPI, Next.js y el proceso de build. Un tamaño con 4 GiB reduce el riesgo de que Docker se quede sin memoria al construir el frontend.

## Paso 2 - Espera el estado correcto

En la pestaña Instances, selecciona academia-manejo-prod-ec2. Espera Instance state: Running y Status check: 2/2 checks passed.

## Paso 3 - Obtén la dirección para conectarte

En el panel Details copia Public IPv4 DNS o Public IPv4 address. Esta dirección solo es para administrar temporalmente la instancia; los usuarios finales usarán el dominio del ALB.

## 5. Conectarse desde Windows y preparar Amazon Linux

Abre PowerShell en Windows. Sustituye la ruta y DNS por los tuyos. Si Windows muestra un error de permisos de la llave, usa la alternativa EC2 Instance Connect o limita los permisos del archivo .pem.

```
ssh -i "C:\Ruta\kp-academia-manejo-prod.pem" ec2-user@EC2_PUBLIC_DNS
```

Dentro de la instancia ejecuta cada línea. La salida de docker compose version debe mostrar una versión; si no existe, instala el plugin Docker Compose antes de continuar.

```
sudo yum update -y
sudo yum install -y docker git
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
exit
```

Cierra PowerShell, vuelve a abrirlo y conéctate otra vez. Después verifica:

```
docker --version
docker compose version
git --version
```


## Si falta Docker Compose

Instala el plugin Compose v2 siguiendo el procedimiento oficial de Docker para Linux RPM y vuelve a ejecutar docker compose version. No uses el binario legado docker-compose si docker compose ya está disponible.

## 6. Certificado HTTPS en ACM

## Paso 1 - Abre Certificate Manager

En la misma región de la EC2 y del futuro ALB, busca Certificate Manager en la barra superior de AWS.

## Paso 2 - Solicita certificado

Pulsa Request a certificate > Request a public certificate > Next.

## Paso 3 - Escribe el dominio

En Fully qualified domain name escribe app.tudominio.com. No escribas http:// ni https://. Mantén DNS validation. Pulsa Request.

## Paso 4 - Crea el CNAME de validación

Abre el Certificate ID con estado Pending validation. Si Route 53 administra el DNS, pulsa Create records in Route 53 y luego Create records. Si usas otro proveedor, copia Name y Value del CNAME y créalo allí exactamente.

## Espera

El certificado debe cambiar a Issued antes de crear el listener HTTPS. Si sigue Pending validation, revisa que el CNAME sea público, exacto y no esté bloqueado por una regla CAA.


## 7. Target group y Application Load Balancer

Paso 1 - Crea el target group

EC2 > Load Balancing > Target Groups > Create target group.

| Campo | Detalle |
| --- | --- |
| Choose a target type | Instances |
| Target group name | tg-academia-web-prod |
| Protocol | HTTP |
| Port | 80 |
| VPC | La misma VPC Default de la EC2 |
| Health check protocol | HTTP |
| Health check path | /health/ready |
| Success codes | 200 |

Pulsa Next. Marca la instancia academia-manejo-prod-ec2, conserva Port 80, pulsa Include as pending below y finalmente Create target group. Antes de levantar Docker es normal que aparezca Unhealthy.

## Paso 2 - Crea el ALB

EC2 > Load Balancing > Load Balancers > Create load balancer > Application Load Balancer > Create.

| Bloque | Valor |
| --- | --- |
| Load balancer name | alb-academia-manejo-prod |
| Scheme | Internet-facing |
| IP address type | IPv4 |
| Network mapping | VPC Default y dos subnets públicas de dos Availability Zones distintas |
| Security groups | Quita default y selecciona sg-academia-alb-prod |
| Listeners and routing | HTTP :80, Forward to tg-academia-web-prod temporalmente |

Pulsa Create load balancer. Espera State: Active.

## Paso 3 - Añade HTTPS 443

Selecciona el ALB > Listeners and rules > Add listener. Protocol HTTPS, Port 443, Default action Forward to tg-academia-web-prod. En Secure listener settings elige From ACM y selecciona el certificado Issued de app.tudominio.com. Pulsa Add listener.

## Paso 4 - Redirige HTTP a HTTPS

En Listeners and rules selecciona HTTP :80. Edita la regla predeterminada. Cambia Action a Redirect to URL: Protocol HTTPS, Port 443, Host #{host}, Path /#{path}, Query #{query}, Status code HTTP_301. Guarda la regla.

## No cambies el target group a HTTPS

El ALB termina TLS en 443 y reenvía HTTP al gateway de la EC2 por el puerto 80. Esta es la configuración esperada por el compose.yml del proyecto.

## 8. Apuntar el dominio al ALB


## Paso 1 - Abre Route 53

Busca Route 53 en AWS. En Hosted zones abre la zona de tudominio.com.

## Paso 2 - Crea el registro

Pulsa Create record y usa Simple routing.

| Campo | Valor exacto |
| --- | --- |
| Record name | app |
| Record type | A - Routes traffic to an IPv4 address and some AWS resources |
| Alias | On |
| Route traffic to | Alias to Application and Classic Load Balancer |
| Region | La misma [REGION_AWS] del ALB |
| Load balancer | alb-academia-manejo-prod |
| Evaluate target health | Yes |

Pulsa Create records. La propagación del alias suele ser rápida, pero no pruebes el sitio hasta que el target group quede Healthy y Docker esté levantado.

## 9. Copiar el proyecto y completar .env

Vuelve a conectarte por SSH. Reemplaza la URL por la de tu repositorio. Si el repositorio es privado, configura una deploy key o un método de acceso seguro antes de clonar; no pegues un token en el historial de la terminal.

```
sudo mkdir -p /opt/academia-manejo
sudo chown ec2-user:ec2-user /opt/academia-manejo
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git /opt/academia-manejo
cd /opt/academia-manejo
cp .env.example .env
chmod 600 .env
nano .env
```

Dentro de nano, completa cada variable. Genera tres secretos con openssl rand -hex 32 en otra línea de terminal y copia cada resultado. No reutilices valores.

| Variable .env | Qué escribir |
| --- | --- |
| POSTGRES_PASSWORD | Un secreto generado. Ejemplo de origen: openssl rand -hex 32 |
| SECRET_KEY | Un segundo secreto diferente: openssl rand -hex 32 |
| SESSION_SECRET | Un tercer secreto diferente: openssl rand -hex 32 |
| APP_URL | https://app.tudominio.com sin slash final |
| ADMIN_EMAIL | Tu correo real de administrador |
| ADMIN_PASSWORD | Contraseña inicial de 10 o más caracteres, con letras y números |
| ADMIN_NOMBRES | Tu nombre o Administrador |
| ADMIN_APELLIDOS | Tu apellido o Sistema |
| ADMIN_TELEFONO | Tu teléfono o 000000000 |

En nano guarda con Ctrl+O, Enter y sal con Ctrl+X. Nunca ejecutes git add .env.


## 10. Primer arranque de la aplicación

Desde /opt/academia-manejo ejecuta los comandos en este orden. El primero no imprime secretos; solo confirma que Docker Compose puede interpretar la configuración.

```
docker compose config --quiet
docker compose --profile bootstrap up bootstrap-admin
docker compose up -d --build
docker compose ps
```

Resultado esperado del bootstrap: mensajes de administrador creado y catálogos creados u omitidos. Resultado esperado de docker compose ps: postgres, backend, frontend y gateway con estado running o healthy; migrate puede aparecer exited (0), porque solo ejecuta Alembic.

Comprueba primero desde la propia EC2:

```
curl -i http://127.0.0.1/health/ready
curl -I http://127.0.0.1/
docker compose logs --tail=100 gateway frontend backend migrate
```

## Si config --quiet falla

No continúes. Revisa .env: POSTGRES_PASSWORD, SECRET_KEY, SESSION_SECRET y APP_URL deben tener valor; APP_URL debe empezar con https:// y no terminar en /.

## 11. Comprobación final en AWS y navegador

## Paso 1 - Comprueba la salud del target

EC2 > Target Groups > tg-academia-web-prod > pestaña Targets. Espera Health status: Healthy. Si muestra Initial, espera algunos ciclos de health check.

## Paso 2 - Comprueba el certificado

EC2 > Load Balancers > alb-academia-manejo-prod > Listeners and rules. Debes ver HTTPS :443 con Forward to tg-academia-web-prod y HTTP :80 con Redirect to HTTPS.

## Paso 3 - Abre el dominio

En una ventana incógnito visita https://app.tudominio.com. Debe aparecer el candado del navegador. Prueba iniciar sesión con ADMIN_EMAIL y ADMIN_PASSWORD.

## Paso 4 - Verifica funcionalidades

Comprueba landing, login, panel administrador, alumnos, servicios y reservas. Después de confirmar, cambia la contraseña inicial y guarda los secretos en un gestor de contraseñas.

## Criterio de éxito

El ALB está Active, el target está Healthy, https://app.tudominio.com responde, el navegador muestra certificado válido y el administrador puede iniciar sesión sin redirecciones repetidas.

## 12. Diagnóstico rápido

| Síntoma | Dónde mirar | Acción segura |
| --- | --- | --- |
| Target Unhealthy | Target Groups > Targets y docker | Comprueba regla EC2 puerto 80 desde sg-academia-alb-prod y |
|   | compose logs gateway backend | ruta /health/ready |
|   | postgres |   |


| Síntoma | Dónde mirar | Acción segura |
| --- | --- | --- |
| Certificado Pending | ACM > Certificate ID > Domains | Revisa o recrea el CNAME de validación. Si DNS externo, copia |
| validation |   | Name y Value sin alterarlos |
| HTTPS abre pero login | Archivo .env y logs frontend | Confirma APP_URL exactamente https://app.tudominio.com y |
| vuelve a login |   | SESSION_SECRET de 32+ caracteres |
| docker compose no | Terminal EC2 | Ejecuta docker compose config --quiet y corrige la primera |
| inicia |   | variable indicada |
| Migración falla | docker compose logs migrate | No borres el volumen. Corrige el error y ejecuta docker compose |
|   |   | up -d --build otra vez |

## Comandos de diagnóstico que no modifican datos:

```
cd /opt/academia-manejo
docker compose ps
docker compose logs --tail=200 gateway frontend backend migrate postgres
docker compose exec backend python -m alembic current
docker compose exec backend python -m alembic check
```

## 13. Actualizaciones, respaldo y seguridad posterior

Para actualizar el código, primero realiza un snapshot EBS o un respaldo PostgreSQL. En EC2 > Elastic Block Store > Volumes, selecciona el volumen adjunto a academia-manejo-prod-ec2 > Actions > Create snapshot. Nombre sugerido: snap-academia-AAAA-MM-DD.

```
cd /opt/academia-manejo
git pull
docker compose config --quiet
docker compose up -d --build
docker compose ps
```

Respaldo lógico de PostgreSQL. Descarga el archivo resultante a una ubicación protegida o súbelo a un bucket S3 privado con cifrado.

```
docker compose exec -T postgres pg_dump -U academia -d academia_manejo -Fc > academia-\$(date +%F).dump
```

## Después del despliegue

Elimina la regla SSH 22 si usarás Systems Manager. Mantén la EC2 accesible por el puerto 80 solo desde el grupo de seguridad del ALB. Programa respaldos y revisa costos de ALB, EC2, EBS, Route 53 y transferencia.

## 14. Referencias oficiales

Estas referencias respaldan los nombres y flujos de la consola usados en esta guía. Las pantallas pueden variar levemente según la región y la evolución de AWS.

Amazon EC2: Get started with Amazon EC2 - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html

Amazon Linux 2023 on EC2 - https://docs.aws.amazon.com/linux/al2023/ug/ec2.html

AWS: Install Docker on Amazon Linux 2023 - https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-docker.html

AWS: Create security groups - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-security-group.html

AWS: Create an Application Load Balancer - https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-application-load-balancer.html

AWS: ALB target group health checks - https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html

AWS ACM: DNS validation - https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html

AWS Route 53: Route traffic to an ELB - https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer.html

Docker: Install Compose plugin - https://docs.docker.com/compose/install/linux/


## Fin de la guía

Cuando todos los criterios de éxito de la sección 11 estén cumplidos, la aplicación está levantada correctamente en AWS. Conserva esta guía junto con los nombres reales de tus recursos y los procedimientos de respaldo.

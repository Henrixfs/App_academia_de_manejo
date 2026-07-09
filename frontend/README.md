# Academia de Manejo San Cristóbal VIP - Frontend

Esta es la aplicación frontend para la Academia de Manejo San Cristóbal VIP, construida con React, TypeScript y Vite.

## Requisitos previos

- Node.js (v16 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio
2. Navegar al directorio `frontend`
3. Instalar dependencias:

```bash
npm install
# o
yarn install
```

## Configuración

Crear un archivo `.env` en la raíz del frontend basado en el ejemplo `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=10000
VITE_APP_NAME=Academia de Manejo San Cristóbal VIP
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
```

## Ejecutar en desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

## Construir para producción

```bash
npm run build
# o
yarn build
```

## Vista previa de la build

```bash
npm run preview
# o
yarn preview
```

## Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables
│   ├── Auth/       # Componentes de autenticación
│   ├── Common/     # Componentes UI compartidos
│   ├── Dashboard/  # Componentes de dashboard
│   ├── Layouts/    # Componentes de layout (Header, Sidebar, Footer)
│   └── ... 
├── pages/          # Páginas de la aplicación
├── services/       - Servicio para consumir la API
├── hooks/          - Hooks personalizados
├── context/        - Contextos de React (Auth)
├── types/          - Interfaces y tipos TypeScript
├── utils/          - Utilidades y helpers
├── styles/         - Estilos globales y variables
├── App.tsx         - Enrutador principal
└── main.tsx        - Punto de entrada
```

## Tecnologías utilizadas

- React 18
- TypeScript
- Vite
- React Router DOM
- Axios (para peticiones HTTP)
- Tailwind CSS (para estilos)

## Licencia

Este proyecto está bajo la licencia MIT.
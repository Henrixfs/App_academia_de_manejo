"""
Aplicación FastAPI principal.
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Crear app
app = FastAPI(
    title="Academia de Manejo San Cristóbal VIP",
    description="API para gestión de reservas, alumnos y agente de IA conversacional.",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios reales
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Importar routers
from app.routers import alumnos, reservas, paquetes, faltas, servicios
from app.exceptions import AcademiaException

# Registrar routers
app.include_router(alumnos.router)
app.include_router(reservas.router)
app.include_router(paquetes.router)
app.include_router(faltas.router)
app.include_router(servicios.router)

# Manejo global de excepciones
@app.exception_handler(AcademiaException)
async def academia_exception_handler(request: Request, exc: AcademiaException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={"detail": "Validación fallida", "errors": exc.errors()},
    )

# Health check
@app.get("/health")
async def health_check():
    """Verificar que el servicio está activo."""
    return {"status": "ok", "service": "Academia de Manejo"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
import logging
import time
import uuid

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.config import settings
from app.database import SessionLocal
from app.exceptions import AcademiaException
from app.routers import admin, alumnos, auth, faltas, me, paquetes, reservas, servicios


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("academia")

app = FastAPI(
    title="Academia de Manejo San Cristóbal VIP",
    description="API para gestión de reservas, alumnos y administración.",
    version="1.1.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    openapi_url="/openapi.json" if settings.ENVIRONMENT != "production" else None,
)
app.router.redirect_slashes = False
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)

app.include_router(auth.router)
app.include_router(me.router)
app.include_router(alumnos.router)
app.include_router(reservas.router)
app.include_router(paquetes.router)
app.include_router(faltas.router)
app.include_router(servicios.router)
app.include_router(servicios.admin_router)
app.include_router(admin.router)


@app.middleware("http")
async def request_context(request: Request, call_next):
    request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    request.state.request_id = request_id
    started = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    elapsed_ms = round((time.perf_counter() - started) * 1000, 2)
    logger.info(
        "request method=%s path=%s status=%s duration_ms=%s request_id=%s",
        request.method,
        request.url.path,
        response.status_code,
        elapsed_ms,
        request_id,
    )
    return response


def error_payload(request: Request, code: str, message: str, field: str | None = None) -> dict[str, object]:
    payload: dict[str, object] = {
        "code": code,
        "message": message,
        "request_id": getattr(request.state, "request_id", None),
    }
    if field:
        payload["field"] = field
    return payload


@app.exception_handler(AcademiaException)
async def academia_exception_handler(request: Request, exc: AcademiaException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=error_payload(request, exc.code, exc.message, exc.field),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    code = "HTTP_ERROR"
    if exc.status_code == status.HTTP_401_UNAUTHORIZED:
        code = "UNAUTHORIZED"
    elif exc.status_code == status.HTTP_403_FORBIDDEN:
        code = "FORBIDDEN"
    elif exc.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
        code = "RATE_LIMITED"
    return JSONResponse(
        status_code=exc.status_code,
        headers=exc.headers,
        content=error_payload(request, code, str(exc.detail)),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({
            **error_payload(request, "VALIDATION_ERROR", "Validación fallida"),
            "errors": exc.errors(),
        }),
    )


@app.exception_handler(Exception)
async def unexpected_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception(
        "unexpected_error path=%s request_id=%s",
        request.url.path,
        getattr(request.state, "request_id", None),
        exc_info=exc,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_payload(request, "INTERNAL_ERROR", "Ocurrió un error interno"),
    )


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "Academia de Manejo"}


@app.get("/health/ready")
async def readiness_check() -> JSONResponse:
    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
        return JSONResponse({"status": "ready"})
    except Exception:
        return JSONResponse({"status": "unavailable"}, status_code=status.HTTP_503_SERVICE_UNAVAILABLE)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=settings.DEBUG)

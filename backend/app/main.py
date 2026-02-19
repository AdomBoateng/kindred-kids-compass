from fastapi import FastAPI

from .config import settings
from .logging import RequestLoggingMiddleware, configure_logging
from .routers import admin, auth, common, storage, teacher

configure_logging()
app = FastAPI(title=settings.app_name)
app.add_middleware(RequestLoggingMiddleware)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(common.router, prefix=settings.api_prefix)
app.include_router(admin.router, prefix=settings.api_prefix)
app.include_router(teacher.router, prefix=settings.api_prefix)
app.include_router(storage.router, prefix=settings.api_prefix)

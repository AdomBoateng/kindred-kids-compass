from fastapi import FastAPI

from .config import settings
from .routers import admin, common, storage, teacher

app = FastAPI(title=settings.app_name)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


app.include_router(common.router, prefix=settings.api_prefix)
app.include_router(admin.router, prefix=settings.api_prefix)
app.include_router(teacher.router, prefix=settings.api_prefix)
app.include_router(storage.router, prefix=settings.api_prefix)

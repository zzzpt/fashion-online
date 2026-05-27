from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.routes import auth, users, clothing, looks, ai

app = FastAPI(
    title=settings.app_name,
    docs_url="/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静态资源：上传的图片
import os
uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(clothing.router)
app.include_router(looks.router)
app.include_router(ai.router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "app": settings.app_name}
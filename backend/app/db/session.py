from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

_engine = None
_SessionLocal = None


def _get_engine():
    global _engine
    if _engine is None:
        if not settings.database_url:
            raise RuntimeError("DATABASE_URL 未配置，请在 .env 中设置")
        _engine = create_engine(settings.database_url, pool_size=10, max_overflow=20)
    return _engine


def _get_session_local():
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_get_engine())
    return _SessionLocal


def get_db():
    """FastAPI 依赖：获取数据库会话"""
    db = _get_session_local()()
    try:
        yield db
    finally:
        db.close()
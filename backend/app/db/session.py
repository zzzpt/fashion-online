from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.memory_store import store as memory_store

_engine = None
_SessionLocal = None


def _get_engine():
    global _engine
    if _engine is None:
        if not settings.database_url:
            return None
        _engine = create_engine(settings.database_url, pool_size=10, max_overflow=20)
    return _engine


def _get_session_local():
    global _SessionLocal
    if _SessionLocal is None:
        engine = _get_engine()
        if engine is None:
            return None
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return _SessionLocal


def get_db():
    """FastAPI 依赖：获取数据库会话。无 DATABASE_URL 时返回 None。"""
    engine = _get_engine()
    if engine is None:
        yield None
        return
    db = _get_session_local()()
    try:
        yield db
    finally:
        db.close()


def get_store():
    """FastAPI 依赖：获取数据存储（数据库会话或内存存储）。"""
    engine = _get_engine()
    if engine is None:
        yield memory_store
        return
    db = _get_session_local()()
    try:
        yield db
    finally:
        db.close()
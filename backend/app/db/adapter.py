import uuid as _uuid

from sqlalchemy.orm import Session

from app.repositories import clothing_repo, user_repo, look_repo
from app.models.clothing import ClothingItem
from app.models.look import Look, LookItem
from app.models.user import Profile


def _model_to_dict(obj) -> dict:
    """将 SQLAlchemy 模型对象转换为普通 dict，datetime/UUID 转为字符串。"""
    result = {}
    for col in obj.__table__.columns:
        val = getattr(obj, col.name)
        if isinstance(val, _uuid.UUID):
            val = val.hex
        elif hasattr(val, "isoformat"):
            val = val.isoformat()
        result[col.name] = val
    return result


class DbAdapter:
    """将 SQLAlchemy Session 封装为与 MemoryStore 一致的 duck-typed 接口。"""

    def __init__(self, db: Session) -> None:
        self._db = db

    # ── Profile ──

    def get_profile(self, user_id: str) -> dict | None:
        p = user_repo.get_profile(self._db, _uuid.UUID(user_id))
        return _model_to_dict(p) if p else None

    def create_profile(self, user_id: str) -> dict:
        p = user_repo.create_profile(self._db, _uuid.UUID(user_id))
        return _model_to_dict(p)

    def update_profile(self, user_id: str, **fields) -> dict | None:
        p = user_repo.update_profile(self._db, _uuid.UUID(user_id), **fields)
        return _model_to_dict(p) if p else None

    def get_stats(self, user_id: str) -> dict:
        uid = _uuid.UUID(user_id)
        clothing_count = (
            self._db.query(ClothingItem)
            .filter(ClothingItem.user_id == uid)
            .count()
        )
        looks = (
            self._db.query(Look).filter(Look.user_id == uid).all()
        )
        return {
            "clothing_count": clothing_count,
            "look_count": len(looks),
            "total_likes": sum(l.like_count for l in looks),
        }

    # ── Clothing ──

    def create_clothing(self, user_id: str, image_url: str, **fields) -> dict:
        item = clothing_repo.create(
            self._db, _uuid.UUID(user_id), image_url, **fields
        )
        return _model_to_dict(item)

    def get_clothing(self, clothing_id: str) -> dict | None:
        item = clothing_repo.get_by_id(self._db, _uuid.UUID(clothing_id))
        return _model_to_dict(item) if item else None

    def list_clothing(
        self, user_id: str, category: str | None = None,
        offset: int = 0, limit: int = 50,
    ) -> list[dict]:
        items = clothing_repo.list_by_user(
            self._db, _uuid.UUID(user_id),
            category=category, offset=offset, limit=limit,
        )
        return [_model_to_dict(i) for i in items]

    def update_clothing(self, clothing_id: str, **fields) -> dict | None:
        item = clothing_repo.update(self._db, _uuid.UUID(clothing_id), **fields)
        return _model_to_dict(item) if item else None

    def delete_clothing(self, clothing_id: str) -> bool:
        return clothing_repo.delete(self._db, _uuid.UUID(clothing_id))

    def get_clothing_looks(self, clothing_id: str) -> list[dict]:
        items = (
            self._db.query(LookItem)
            .filter(LookItem.clothing_id == _uuid.UUID(clothing_id))
            .all()
        )
        look_ids = {i.look_id for i in items}
        looks = (
            self._db.query(Look).filter(Look.id.in_(look_ids)).all()
            if look_ids else []
        )
        return [_model_to_dict(l) for l in looks]

    # ── Look ──

    def create_look(self, user_id: str, **fields) -> dict:
        look = look_repo.create(self._db, _uuid.UUID(user_id), **fields)
        return _model_to_dict(look)

    def get_look(self, look_id: str) -> dict | None:
        look = look_repo.get_by_id(self._db, _uuid.UUID(look_id))
        return _model_to_dict(look) if look else None

    def list_looks(self, user_id: str, offset: int = 0, limit: int = 20) -> list[dict]:
        looks = look_repo.list_by_user(
            self._db, _uuid.UUID(user_id), offset=offset, limit=limit,
        )
        return [_model_to_dict(l) for l in looks]

    def update_look(self, look_id: str, **fields) -> dict | None:
        look = look_repo.update(self._db, _uuid.UUID(look_id), **fields)
        return _model_to_dict(look) if look else None

    def delete_look(self, look_id: str) -> bool:
        return look_repo.delete(self._db, _uuid.UUID(look_id))

    def like_look(self, look_id: str) -> dict | None:
        look = look_repo.toggle_like(self._db, _uuid.UUID(look_id))
        return _model_to_dict(look) if look else None

    def add_look_item(self, look_id: str, **fields) -> dict:
        clothing_id = _uuid.UUID(fields.pop("clothing_id", None) or _uuid.uuid4().hex)
        item = look_repo.add_item(
            self._db, _uuid.UUID(look_id), clothing_id, **fields,
        )
        return _model_to_dict(item)

    def get_look_items(self, look_id: str) -> list[dict]:
        items = look_repo.get_items(self._db, _uuid.UUID(look_id))
        return [_model_to_dict(i) for i in items]

    def clear_look_items(self, look_id: str) -> None:
        look_repo.clear_items(self._db, _uuid.UUID(look_id))
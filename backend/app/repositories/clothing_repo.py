import uuid

from sqlalchemy.orm import Session

from app.models.clothing import ClothingItem


def get_by_id(db: Session, clothing_id: uuid.UUID) -> ClothingItem | None:
    return db.query(ClothingItem).filter(ClothingItem.id == clothing_id).first()


def list_by_user(
    db: Session,
    user_id: uuid.UUID,
    *,
    category: str | None = None,
    is_favorite: bool | None = None,
    season: str | None = None,
    offset: int = 0,
    limit: int = 50,
) -> list[ClothingItem]:
    q = db.query(ClothingItem).filter(ClothingItem.user_id == user_id)
    if category:
        q = q.filter(ClothingItem.category == category)
    if is_favorite is not None:
        q = q.filter(ClothingItem.is_favorite == is_favorite)
    if season:
        q = q.filter(ClothingItem.season.any(season))
    return q.order_by(ClothingItem.created_at.desc()).offset(offset).limit(limit).all()


def create(db: Session, user_id: uuid.UUID, image_url: str, **fields) -> ClothingItem:
    item = ClothingItem(user_id=user_id, image_url=image_url, **fields)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update(db: Session, clothing_id: uuid.UUID, **fields) -> ClothingItem | None:
    item = get_by_id(db, clothing_id)
    if not item:
        return None
    for key, value in fields.items():
        if hasattr(item, key) and value is not None:
            setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


def delete(db: Session, clothing_id: uuid.UUID) -> bool:
    item = get_by_id(db, clothing_id)
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True


def get_by_ids(db: Session, ids: list[uuid.UUID]) -> list[ClothingItem]:
    return db.query(ClothingItem).filter(ClothingItem.id.in_(ids)).all()
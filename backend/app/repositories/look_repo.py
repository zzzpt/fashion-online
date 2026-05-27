import uuid

from sqlalchemy.orm import Session

from app.models.look import Look, LookItem


def get_by_id(db: Session, look_id: uuid.UUID) -> Look | None:
    return db.query(Look).filter(Look.id == look_id).first()


def list_by_user(
    db: Session,
    user_id: uuid.UUID,
    *,
    is_public: bool | None = None,
    offset: int = 0,
    limit: int = 20,
) -> list[Look]:
    q = db.query(Look).filter(Look.user_id == user_id)
    if is_public is not None:
        q = q.filter(Look.is_public == is_public)
    return q.order_by(Look.created_at.desc()).offset(offset).limit(limit).all()


def create(db: Session, user_id: uuid.UUID, **fields) -> Look:
    look = Look(user_id=user_id, **fields)
    db.add(look)
    db.commit()
    db.refresh(look)
    return look


def update(db: Session, look_id: uuid.UUID, **fields) -> Look | None:
    look = get_by_id(db, look_id)
    if not look:
        return None
    for key, value in fields.items():
        if hasattr(look, key) and value is not None:
            setattr(look, key, value)
    db.commit()
    db.refresh(look)
    return look


def delete(db: Session, look_id: uuid.UUID) -> bool:
    look = get_by_id(db, look_id)
    if not look:
        return False
    db.delete(look)
    db.commit()
    return True


def toggle_like(db: Session, look_id: uuid.UUID) -> Look | None:
    look = get_by_id(db, look_id)
    if not look:
        return None
    look.like_count += 1
    db.commit()
    db.refresh(look)
    return look


# LookItem helpers

def get_items(db: Session, look_id: uuid.UUID) -> list[LookItem]:
    return (
        db.query(LookItem)
        .filter(LookItem.look_id == look_id)
        .order_by(LookItem.z_index)
        .all()
    )


def add_item(db: Session, look_id: uuid.UUID, clothing_id: uuid.UUID, **fields) -> LookItem:
    item = LookItem(look_id=look_id, clothing_id=clothing_id, **fields)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def clear_items(db: Session, look_id: uuid.UUID) -> None:
    db.query(LookItem).filter(LookItem.look_id == look_id).delete()
    db.commit()
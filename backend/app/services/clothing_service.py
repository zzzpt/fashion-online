import uuid

from sqlalchemy.orm import Session

from app.repositories import clothing_repo


def upload_clothing(
    db: Session, user_id: uuid.UUID, image_url: str, category: str, **fields
) -> dict:
    item = clothing_repo.create(db, user_id, image_url, category=category, **fields)
    return _item_to_dict(item)


def list_clothing(
    db: Session,
    user_id: uuid.UUID,
    *,
    category: str | None = None,
    is_favorite: bool | None = None,
    season: str | None = None,
    offset: int = 0,
    limit: int = 50,
) -> dict:
    items = clothing_repo.list_by_user(
        db, user_id,
        category=category, is_favorite=is_favorite, season=season,
        offset=offset, limit=limit,
    )
    return {"items": [_item_to_dict(i) for i in items], "total": len(items)}


def get_clothing(db: Session, clothing_id: uuid.UUID) -> dict | None:
    item = clothing_repo.get_by_id(db, clothing_id)
    return _item_to_dict(item) if item else None


def update_clothing(db: Session, clothing_id: uuid.UUID, **fields) -> dict | None:
    item = clothing_repo.update(db, clothing_id, **fields)
    return _item_to_dict(item) if item else None


def delete_clothing(db: Session, clothing_id: uuid.UUID) -> bool:
    return clothing_repo.delete(db, clothing_id)


def get_clothing_looks(db: Session, clothing_id: uuid.UUID) -> dict:
    from app.models.look import LookItem, Look

    items = (
        db.query(LookItem)
        .filter(LookItem.clothing_id == clothing_id)
        .all()
    )
    look_ids = [i.look_id for i in items]
    looks = db.query(Look).filter(Look.id.in_(look_ids)).all() if look_ids else []

    return {
        "clothing_id": str(clothing_id),
        "looks": [
            {
                "id": str(l.id),
                "title": l.title,
                "cover_image_url": l.cover_image_url,
            }
            for l in looks
        ],
    }


def _item_to_dict(item) -> dict:
    return {
        "id": str(item.id),
        "user_id": str(item.user_id),
        "image_url": item.image_url,
        "image_no_bg_url": item.image_no_bg_url,
        "category": item.category,
        "sub_category": item.sub_category,
        "color": item.color,
        "color_palette": item.color_palette or [],
        "material": item.material,
        "brand": item.brand,
        "season": item.season or [],
        "style_tags": item.style_tags or [],
        "ai_description": item.ai_description,
        "is_favorite": item.is_favorite,
        "wear_count": item.wear_count,
        "created_at": item.created_at.isoformat(),
        "updated_at": item.updated_at.isoformat(),
    }
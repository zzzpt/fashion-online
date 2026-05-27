import uuid

from sqlalchemy.orm import Session

from app.repositories import look_repo


def create_look(db: Session, user_id: uuid.UUID, items: list[dict] | None = None, **fields) -> dict:
    look = look_repo.create(db, user_id, **fields)
    if items:
        for item_data in items:
            clothing_id = uuid.UUID(item_data["clothing_id"])
            look_repo.add_item(
                db,
                look_id=look.id,
                clothing_id=clothing_id,
                position_x=item_data.get("position_x"),
                position_y=item_data.get("position_y"),
                scale=item_data.get("scale", 1.0),
                rotation=item_data.get("rotation", 0),
                z_index=item_data.get("z_index", 0),
            )
        db.refresh(look)
    return _look_to_dict(db, look)


def list_looks(
    db: Session,
    user_id: uuid.UUID,
    *,
    is_public: bool | None = None,
    offset: int = 0,
    limit: int = 20,
) -> dict:
    looks = look_repo.list_by_user(db, user_id, is_public=is_public, offset=offset, limit=limit)
    return {"items": [_look_to_dict(db, l) for l in looks], "total": len(looks)}


def get_look(db: Session, look_id: uuid.UUID) -> dict | None:
    look = look_repo.get_by_id(db, look_id)
    return _look_to_dict(db, look) if look else None


def update_look(db: Session, look_id: uuid.UUID, items: list[dict] | None = None, **fields) -> dict | None:
    look = look_repo.update(db, look_id, **fields)
    if not look:
        return None
    if items is not None:
        look_repo.clear_items(db, look_id)
        for item_data in items:
            clothing_id = uuid.UUID(item_data["clothing_id"])
            look_repo.add_item(
                db,
                look_id=look_id,
                clothing_id=clothing_id,
                position_x=item_data.get("position_x"),
                position_y=item_data.get("position_y"),
                scale=item_data.get("scale", 1.0),
                rotation=item_data.get("rotation", 0),
                z_index=item_data.get("z_index", 0),
            )
        db.refresh(look)
    return _look_to_dict(db, look)


def delete_look(db: Session, look_id: uuid.UUID) -> bool:
    return look_repo.delete(db, look_id)


def like_look(db: Session, look_id: uuid.UUID) -> dict | None:
    look = look_repo.toggle_like(db, look_id)
    return _look_to_dict(db, look) if look else None


def _look_to_dict(db: Session, look) -> dict:
    items = look_repo.get_items(db, look.id)
    return {
        "id": str(look.id),
        "user_id": str(look.user_id),
        "title": look.title,
        "description": look.description,
        "cover_image_url": look.cover_image_url,
        "scene": look.scene,
        "season": look.season,
        "weather_condition": look.weather_condition,
        "temperature": look.temperature,
        "layout_data": look.layout_data,
        "is_ai_generated": look.is_ai_generated,
        "is_public": look.is_public,
        "like_count": look.like_count,
        "created_at": look.created_at.isoformat(),
        "updated_at": look.updated_at.isoformat(),
        "items": [
            {
                "id": str(i.id),
                "clothing_id": str(i.clothing_id),
                "position_x": i.position_x,
                "position_y": i.position_y,
                "scale": i.scale,
                "rotation": i.rotation,
                "z_index": i.z_index,
            }
            for i in items
        ],
    }
import uuid

from sqlalchemy.orm import Session

from app.repositories import user_repo


def get_or_create_profile(db: Session, user_id: uuid.UUID) -> dict:
    profile = user_repo.get_profile(db, user_id)
    if not profile:
        profile = user_repo.create_profile(db, user_id)
    return _profile_to_dict(profile)


def update_profile(db: Session, user_id: uuid.UUID, **fields) -> dict | None:
    profile = user_repo.update_profile(db, user_id, **fields)
    return _profile_to_dict(profile) if profile else None


def get_stats(db: Session, user_id: uuid.UUID) -> dict:
    from app.models.clothing import ClothingItem
    from app.models.look import Look

    clothing_count = db.query(ClothingItem).filter(
        ClothingItem.user_id == user_id
    ).count()
    look_count = db.query(Look).filter(Look.user_id == user_id).count()
    like_count = (
        db.query(Look.like_count)
        .filter(Look.user_id == user_id)
        .all()
    )
    total_likes = sum(row[0] for row in like_count)

    return {
        "clothing_count": clothing_count,
        "look_count": look_count,
        "total_likes": total_likes,
    }


def _profile_to_dict(profile) -> dict:
    return {
        "id": str(profile.id),
        "nickname": profile.nickname,
        "avatar_url": profile.avatar_url,
        "gender": profile.gender,
        "birth_date": profile.birth_date.isoformat() if profile.birth_date else None,
        "city": profile.city,
        "style_tags": profile.style_tags or [],
        "created_at": profile.created_at.isoformat(),
        "updated_at": profile.updated_at.isoformat(),
    }
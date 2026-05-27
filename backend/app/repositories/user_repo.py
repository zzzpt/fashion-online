import uuid

from sqlalchemy.orm import Session

from app.models.user import Profile


def get_profile(db: Session, user_id: uuid.UUID) -> Profile | None:
    return db.query(Profile).filter(Profile.id == user_id).first()


def create_profile(db: Session, user_id: uuid.UUID) -> Profile:
    profile = Profile(id=user_id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_profile(db: Session, user_id: uuid.UUID, **fields) -> Profile | None:
    profile = get_profile(db, user_id)
    if not profile:
        return None
    for key, value in fields.items():
        if hasattr(profile, key) and value is not None:
            setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile
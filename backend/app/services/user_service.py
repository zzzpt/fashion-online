import uuid

from app.db.memory_store import MemoryStore


def get_or_create_profile(store, user_id: uuid.UUID) -> dict:
    uid = str(user_id)
    profile = store.get_profile(uid)
    if not profile:
        profile = store.create_profile(uid)
    return dict(profile)


def update_profile(store, user_id: uuid.UUID, **fields) -> dict | None:
    profile = store.update_profile(str(user_id), **fields)
    return dict(profile) if profile else None


def get_stats(store, user_id: uuid.UUID) -> dict:
    return store.get_stats(str(user_id))
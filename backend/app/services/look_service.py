import uuid


def create_look(store, user_id: uuid.UUID, items: list[dict] | None = None, **fields) -> dict:
    look = store.create_look(str(user_id), **fields)
    if items:
        for item_data in items:
            store.add_look_item(look["id"], **item_data)
    look["items"] = store.get_look_items(look["id"])
    return dict(look)


def list_looks(store, user_id: uuid.UUID, *, offset: int = 0, limit: int = 20) -> dict:
    looks = store.list_looks(str(user_id), offset=offset, limit=limit)
    return {
        "items": [
            {
                "id": l["id"],
                "title": l.get("title"),
                "cover_image_url": l.get("cover_image_url"),
                "like_count": l.get("like_count", 0),
                "is_public": l.get("is_public", False),
                "created_at": l.get("created_at", ""),
            }
            for l in looks
        ],
        "total": len(looks),
    }


def get_look(store, look_id: uuid.UUID) -> dict | None:
    look = store.get_look(str(look_id))
    if not look:
        return None
    look["items"] = store.get_look_items(str(look_id))
    return dict(look)


def update_look(store, look_id: uuid.UUID, items: list[dict] | None = None, **fields) -> dict | None:
    look = store.update_look(str(look_id), **fields)
    if not look:
        return None
    if items is not None:
        store.clear_look_items(str(look_id))
        for item_data in items:
            store.add_look_item(str(look_id), **item_data)
    look["items"] = store.get_look_items(str(look_id))
    return dict(look)


def delete_look(store, look_id: uuid.UUID) -> bool:
    return store.delete_look(str(look_id))


def like_look(store, look_id: uuid.UUID) -> dict | None:
    look = store.like_look(str(look_id))
    if not look:
        return None
    look["items"] = store.get_look_items(str(look_id))
    return dict(look)
import uuid


def upload_clothing(store, user_id: uuid.UUID, image_url: str, category: str, **fields) -> dict:
    item = store.create_clothing(str(user_id), image_url, category=category, **fields)
    return dict(item)


def list_clothing(
    store, user_id: uuid.UUID,
    *, category: str | None = None, offset: int = 0, limit: int = 50,
) -> dict:
    items = store.list_clothing(str(user_id), category=category, offset=offset, limit=limit)
    return {"items": [dict(i) for i in items], "total": len(items)}


def get_clothing(store, clothing_id: uuid.UUID) -> dict | None:
    item = store.get_clothing(str(clothing_id))
    return dict(item) if item else None


def update_clothing(store, clothing_id: uuid.UUID, **fields) -> dict | None:
    item = store.update_clothing(str(clothing_id), **fields)
    return dict(item) if item else None


def delete_clothing(store, clothing_id: uuid.UUID) -> bool:
    return store.delete_clothing(str(clothing_id))


def get_clothing_looks(store, clothing_id: uuid.UUID) -> dict:
    looks = store.get_clothing_looks(str(clothing_id))
    return {
        "clothing_id": str(clothing_id),
        "looks": [
            {"id": l["id"], "title": l.get("title"), "cover_image_url": l.get("cover_image_url")}
            for l in looks
        ],
    }
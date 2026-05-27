import uuid
from datetime import datetime, timezone
from collections import defaultdict


class MemoryStore:
    """开发环境内存数据存储，模拟数据库 CRUD。"""

    def __init__(self):
        self.profiles: dict[str, dict] = {}
        self.clothing: dict[str, dict] = {}
        self.looks: dict[str, dict] = {}
        self.look_items: dict[str, list[dict]] = defaultdict(list)

    # ── Profile ──

    def get_profile(self, user_id: str) -> dict | None:
        return self.profiles.get(user_id)

    def create_profile(self, user_id: str) -> dict:
        now = datetime.now(timezone.utc).isoformat()
        profile = {
            "id": user_id,
            "nickname": None,
            "avatar_url": None,
            "gender": "female",
            "birth_date": None,
            "city": None,
            "style_tags": [],
            "created_at": now,
            "updated_at": now,
        }
        self.profiles[user_id] = profile
        return profile

    def update_profile(self, user_id: str, **fields) -> dict | None:
        p = self.profiles.get(user_id)
        if not p:
            return None
        for k, v in fields.items():
            if v is not None and k in p:
                p[k] = v
        p["updated_at"] = datetime.now(timezone.utc).isoformat()
        return p

    # ── Clothing ──

    def create_clothing(self, user_id: str, image_url: str, **fields) -> dict:
        now = datetime.now(timezone.utc).isoformat()
        item = {
            "id": uuid.uuid4().hex,
            "user_id": user_id,
            "image_url": image_url,
            "image_no_bg_url": fields.get("image_no_bg_url"),
            "category": fields.get("category", "top"),
            "sub_category": fields.get("sub_category"),
            "color": fields.get("color"),
            "color_palette": fields.get("color_palette", []),
            "material": fields.get("material"),
            "brand": fields.get("brand"),
            "season": fields.get("season", []),
            "style_tags": fields.get("style_tags", []),
            "ai_description": fields.get("ai_description"),
            "is_favorite": False,
            "wear_count": 0,
            "created_at": now,
            "updated_at": now,
        }
        self.clothing[item["id"]] = item
        return item

    def get_clothing(self, clothing_id: str) -> dict | None:
        return self.clothing.get(clothing_id)

    def list_clothing(self, user_id: str, category: str | None = None, offset: int = 0, limit: int = 50) -> list[dict]:
        items = [i for i in self.clothing.values() if i["user_id"] == user_id]
        if category:
            items = [i for i in items if i["category"] == category]
        items.sort(key=lambda i: i["created_at"], reverse=True)
        return items[offset : offset + limit]

    def update_clothing(self, clothing_id: str, **fields) -> dict | None:
        item = self.clothing.get(clothing_id)
        if not item:
            return None
        for k, v in fields.items():
            if v is not None and k in item:
                item[k] = v
        item["updated_at"] = datetime.now(timezone.utc).isoformat()
        return item

    def delete_clothing(self, clothing_id: str) -> bool:
        if clothing_id in self.clothing:
            del self.clothing[clothing_id]
            return True
        return False

    # ── Look ──

    def create_look(self, user_id: str, **fields) -> dict:
        now = datetime.now(timezone.utc).isoformat()
        look = {
            "id": uuid.uuid4().hex,
            "user_id": user_id,
            "title": fields.get("title"),
            "description": fields.get("description"),
            "cover_image_url": fields.get("cover_image_url"),
            "scene": fields.get("scene"),
            "season": fields.get("season"),
            "weather_condition": fields.get("weather_condition"),
            "temperature": fields.get("temperature"),
            "layout_data": fields.get("layout_data"),
            "is_ai_generated": False,
            "is_public": fields.get("is_public", False),
            "like_count": 0,
            "created_at": now,
            "updated_at": now,
        }
        self.looks[look["id"]] = look
        self.look_items[look["id"]] = []
        return look

    def get_look(self, look_id: str) -> dict | None:
        return self.looks.get(look_id)

    def list_looks(self, user_id: str, offset: int = 0, limit: int = 20) -> list[dict]:
        items = [l for l in self.looks.values() if l["user_id"] == user_id]
        items.sort(key=lambda l: l["created_at"], reverse=True)
        return items[offset : offset + limit]

    def update_look(self, look_id: str, **fields) -> dict | None:
        look = self.looks.get(look_id)
        if not look:
            return None
        for k, v in fields.items():
            if v is not None and k in look:
                look[k] = v
        look["updated_at"] = datetime.now(timezone.utc).isoformat()
        return look

    def delete_look(self, look_id: str) -> bool:
        if look_id in self.looks:
            del self.looks[look_id]
            self.look_items.pop(look_id, None)
            return True
        return False

    def like_look(self, look_id: str) -> dict | None:
        look = self.looks.get(look_id)
        if not look:
            return None
        look["like_count"] += 1
        return look

    def add_look_item(self, look_id: str, **fields) -> dict:
        item = {
            "id": uuid.uuid4().hex,
            "look_id": look_id,
            "clothing_id": fields.get("clothing_id", ""),
            "position_x": fields.get("position_x"),
            "position_y": fields.get("position_y"),
            "scale": fields.get("scale", 1.0),
            "rotation": fields.get("rotation", 0),
            "z_index": fields.get("z_index", 0),
        }
        self.look_items[look_id].append(item)
        return item

    def get_look_items(self, look_id: str) -> list[dict]:
        return sorted(self.look_items.get(look_id, []), key=lambda i: i.get("z_index", 0))

    def clear_look_items(self, look_id: str) -> None:
        self.look_items[look_id] = []

    def get_clothing_looks(self, clothing_id: str) -> list[dict]:
        look_ids = set()
        for lid, items in self.look_items.items():
            for item in items:
                if item["clothing_id"] == clothing_id:
                    look_ids.add(lid)
        return [self.looks[lid] for lid in look_ids if lid in self.looks]

    def get_stats(self, user_id: str) -> dict:
        clothing_count = len([i for i in self.clothing.values() if i["user_id"] == user_id])
        looks = [l for l in self.looks.values() if l["user_id"] == user_id]
        look_count = len(looks)
        total_likes = sum(l["like_count"] for l in looks)
        return {
            "clothing_count": clothing_count,
            "look_count": look_count,
            "total_likes": total_likes,
        }


# 全局单例
store = MemoryStore()
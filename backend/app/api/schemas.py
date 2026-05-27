import uuid
from datetime import datetime

from pydantic import BaseModel


# ── User ──

class ProfileUpdate(BaseModel):
    nickname: str | None = None
    avatar_url: str | None = None
    gender: str | None = None
    birth_date: datetime | None = None
    city: str | None = None
    style_tags: list[str] | None = None


# ── Clothing ──

class ClothingCreate(BaseModel):
    image_url: str
    category: str
    sub_category: str | None = None
    color: str | None = None
    color_palette: list[str] | None = None
    material: str | None = None
    brand: str | None = None
    season: list[str] | None = None
    style_tags: list[str] | None = None
    ai_description: str | None = None


class ClothingUpdate(BaseModel):
    category: str | None = None
    sub_category: str | None = None
    color: str | None = None
    color_palette: list[str] | None = None
    material: str | None = None
    brand: str | None = None
    season: list[str] | None = None
    style_tags: list[str] | None = None
    is_favorite: bool | None = None


# ── Look ──

class LookItemData(BaseModel):
    clothing_id: str
    position_x: float | None = None
    position_y: float | None = None
    scale: float = 1.0
    rotation: float = 0
    z_index: int = 0


class LookCreate(BaseModel):
    title: str | None = None
    description: str | None = None
    cover_image_url: str | None = None
    scene: str | None = None
    season: str | None = None
    weather_condition: str | None = None
    temperature: int | None = None
    layout_data: dict | None = None
    is_public: bool = False
    items: list[LookItemData] | None = None


class LookUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    cover_image_url: str | None = None
    scene: str | None = None
    season: str | None = None
    weather_condition: str | None = None
    temperature: int | None = None
    layout_data: dict | None = None
    is_public: bool | None = None
    items: list[LookItemData] | None = None
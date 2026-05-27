import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ClothingItem(Base):
    __tablename__ = "clothing_items"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True)
    image_url: Mapped[str] = mapped_column(String)
    image_no_bg_url: Mapped[str | None] = mapped_column(String, nullable=True)
    category: Mapped[str] = mapped_column(String(20))
    sub_category: Mapped[str | None] = mapped_column(String(30), nullable=True)
    color: Mapped[str | None] = mapped_column(String(20), nullable=True)
    color_palette: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    material: Mapped[str | None] = mapped_column(String(30), nullable=True)
    brand: Mapped[str | None] = mapped_column(String(50), nullable=True)
    season: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    style_tags: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    ai_description: Mapped[str | None] = mapped_column(String, nullable=True)
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False)
    wear_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
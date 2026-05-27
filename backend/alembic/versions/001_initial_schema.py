"""initial_schema

Revision ID: 001
Revises:
Create Date: 2026-05-27

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("nickname", sa.String(50), nullable=True),
        sa.Column("avatar_url", sa.String(), nullable=True),
        sa.Column("gender", sa.String(10), server_default="female"),
        sa.Column("birth_date", sa.DateTime(), nullable=True),
        sa.Column("city", sa.String(50), nullable=True),
        sa.Column("style_tags", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )

    op.create_table(
        "clothing_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), index=True),
        sa.Column("image_url", sa.String(), nullable=False),
        sa.Column("image_no_bg_url", sa.String(), nullable=True),
        sa.Column("category", sa.String(20), nullable=False),
        sa.Column("sub_category", sa.String(30), nullable=True),
        sa.Column("color", sa.String(20), nullable=True),
        sa.Column("color_palette", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("material", sa.String(30), nullable=True),
        sa.Column("brand", sa.String(50), nullable=True),
        sa.Column("season", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("style_tags", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("ai_description", sa.String(), nullable=True),
        sa.Column("is_favorite", sa.Boolean(), server_default=sa.text("false")),
        sa.Column("wear_count", sa.Integer(), server_default=sa.text("0")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )

    op.create_table(
        "looks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), index=True),
        sa.Column("title", sa.String(100), nullable=True),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("cover_image_url", sa.String(), nullable=True),
        sa.Column("scene", sa.String(30), nullable=True),
        sa.Column("season", sa.String(20), nullable=True),
        sa.Column("weather_condition", sa.String(30), nullable=True),
        sa.Column("temperature", sa.Integer(), nullable=True),
        sa.Column("layout_data", postgresql.JSONB(), nullable=True),
        sa.Column("is_ai_generated", sa.Boolean(), server_default=sa.text("false")),
        sa.Column("is_public", sa.Boolean(), server_default=sa.text("false")),
        sa.Column("like_count", sa.Integer(), server_default=sa.text("0")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )

    op.create_table(
        "look_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("look_id", postgresql.UUID(as_uuid=True), index=True),
        sa.Column("clothing_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("position_x", sa.Float(), nullable=True),
        sa.Column("position_y", sa.Float(), nullable=True),
        sa.Column("scale", sa.Float(), server_default=sa.text("1.0")),
        sa.Column("rotation", sa.Float(), server_default=sa.text("0")),
        sa.Column("z_index", sa.Integer(), server_default=sa.text("0")),
    )


def downgrade() -> None:
    op.drop_table("look_items")
    op.drop_table("looks")
    op.drop_table("clothing_items")
    op.drop_table("profiles")
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.schemas import ClothingCreate, ClothingUpdate
from app.core.security import get_current_user
from app.db.session import get_db
from app.services import clothing_service

router = APIRouter(prefix="/api/clothing", tags=["clothing"])


@router.post("/upload")
async def upload_clothing(
    body: ClothingCreate,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    fields = body.model_dump(exclude={"image_url", "category"})
    item = clothing_service.upload_clothing(
        db, uuid.UUID(user["id"]), body.image_url, body.category, **fields,
    )
    return item


@router.get("")
async def list_clothing(
    category: str | None = Query(None),
    is_favorite: bool | None = Query(None),
    season: str | None = Query(None),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return clothing_service.list_clothing(
        db, uuid.UUID(user["id"]),
        category=category, is_favorite=is_favorite, season=season,
        offset=offset, limit=limit,
    )


@router.get("/{clothing_id}")
async def get_clothing(
    clothing_id: str,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = clothing_service.get_clothing(db, uuid.UUID(clothing_id))
    if not item:
        raise HTTPException(status_code=404, detail="衣物不存在")
    return item


@router.patch("/{clothing_id}")
async def update_clothing(
    clothing_id: str,
    body: ClothingUpdate,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    fields = body.model_dump(exclude_none=True)
    if not fields:
        raise HTTPException(status_code=400, detail="没有要更新的字段")
    item = clothing_service.update_clothing(db, uuid.UUID(clothing_id), **fields)
    if not item:
        raise HTTPException(status_code=404, detail="衣物不存在")
    return item


@router.delete("/{clothing_id}")
async def delete_clothing(
    clothing_id: str,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ok = clothing_service.delete_clothing(db, uuid.UUID(clothing_id))
    if not ok:
        raise HTTPException(status_code=404, detail="衣物不存在")
    return {"ok": True}


@router.get("/{clothing_id}/looks")
async def get_clothing_looks(
    clothing_id: str,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return clothing_service.get_clothing_looks(db, uuid.UUID(clothing_id))
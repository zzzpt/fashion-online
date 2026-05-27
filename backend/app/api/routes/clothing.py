import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import UploadFile, File, Form

from app.api.schemas import ClothingCreate, ClothingUpdate
from app.core.security import get_current_user
from app.db.session import get_store
from app.services import clothing_service, storage_service, ai_service, bg_service

router = APIRouter(prefix="/api/clothing", tags=["clothing"])


@router.post("/upload")
async def upload_clothing(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    # 保存文件
    contents = await file.read()
    ext = file.filename.rsplit(".", 1)[-1] if file.filename and "." in file.filename else "jpg"
    url_path = storage_service.save_bytes(contents, user["id"], f".{ext}")

    # AI 分析 + 抠图（并行）
    ai_result = ai_service.analyze_clothing(url_path)
    no_bg_url = bg_service.remove_background(url_path, user["id"])

    item = clothing_service.upload_clothing(
        store, user["id"], url_path, ai_result["category"],
        image_no_bg_url=no_bg_url,
        sub_category=ai_result.get("sub_category"),
        color=ai_result.get("color"),
        color_palette=ai_result.get("color_palette", []),
        material=ai_result.get("material"),
        season=ai_result.get("season", []),
        style_tags=ai_result.get("style_tags", []),
        ai_description=ai_result.get("ai_description"),
    )
    return item


@router.get("")
async def list_clothing(
    category: str | None = Query(None),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    return clothing_service.list_clothing(
        store, user["id"],
        category=category, offset=offset, limit=limit,
    )


@router.get("/{clothing_id}")
async def get_clothing(
    clothing_id: str,
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    item = clothing_service.get_clothing(store, uuid.UUID(clothing_id))
    if not item:
        raise HTTPException(status_code=404, detail="衣物不存在")
    return item


@router.patch("/{clothing_id}")
async def update_clothing(
    clothing_id: str,
    body: ClothingUpdate,
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    fields = body.model_dump(exclude_none=True)
    if not fields:
        raise HTTPException(status_code=400, detail="没有要更新的字段")
    item = clothing_service.update_clothing(store, uuid.UUID(clothing_id), **fields)
    if not item:
        raise HTTPException(status_code=404, detail="衣物不存在")
    return item


@router.delete("/{clothing_id}")
async def delete_clothing(
    clothing_id: str,
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    ok = clothing_service.delete_clothing(store, uuid.UUID(clothing_id))
    if not ok:
        raise HTTPException(status_code=404, detail="衣物不存在")
    return {"ok": True}


@router.get("/{clothing_id}/looks")
async def get_clothing_looks(
    clothing_id: str,
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    return clothing_service.get_clothing_looks(store, uuid.UUID(clothing_id))
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.schemas import LookCreate, LookUpdate
from app.core.security import get_current_user
from app.db.session import get_store
from app.services import look_service

router = APIRouter(prefix="/api/looks", tags=["looks"])


@router.post("")
async def create_look(
    body: LookCreate,
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    fields = body.model_dump(exclude={"items"})
    items_data = [it.model_dump() for it in body.items] if body.items else None
    return look_service.create_look(store, user["id"], items=items_data, **fields)


@router.get("")
async def list_looks(
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    return look_service.list_looks(store, user["id"], offset=offset, limit=limit)


@router.get("/{look_id}")
async def get_look(
    look_id: str,
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    look = look_service.get_look(store, uuid.UUID(look_id))
    if not look:
        raise HTTPException(status_code=404, detail="搭配不存在")
    return look


@router.patch("/{look_id}")
async def update_look(
    look_id: str,
    body: LookUpdate,
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    fields = body.model_dump(exclude={"items"}, exclude_none=True)
    items_data = [it.model_dump() for it in body.items] if body.items is not None else None
    look = look_service.update_look(store, uuid.UUID(look_id), items=items_data, **fields)
    if not look:
        raise HTTPException(status_code=404, detail="搭配不存在")
    return look


@router.delete("/{look_id}")
async def delete_look(
    look_id: str,
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    ok = look_service.delete_look(store, uuid.UUID(look_id))
    if not ok:
        raise HTTPException(status_code=404, detail="搭配不存在")
    return {"ok": True}


@router.post("/{look_id}/like")
async def like_look(
    look_id: str,
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    look = look_service.like_look(store, uuid.UUID(look_id))
    if not look:
        raise HTTPException(status_code=404, detail="搭配不存在")
    return look
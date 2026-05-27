import uuid

from fastapi import APIRouter, Depends, HTTPException
from fastapi import UploadFile, File, Form

from app.api.schemas import ProfileUpdate
from app.core.security import get_current_user
from app.db.session import get_store
from app.services import user_service

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me")
async def get_profile(
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    return user_service.get_or_create_profile(store, uuid.UUID(user["id"]))


@router.patch("/me")
async def update_profile(
    body: ProfileUpdate,
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    fields = body.model_dump(exclude_none=True)
    if not fields:
        raise HTTPException(status_code=400, detail="没有要更新的字段")
    profile = user_service.update_profile(store, uuid.UUID(user["id"]), **fields)
    if not profile:
        raise HTTPException(status_code=404, detail="用户不存在")
    return profile


@router.get("/me/stats")
async def get_stats(
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    return user_service.get_stats(store, uuid.UUID(user["id"]))
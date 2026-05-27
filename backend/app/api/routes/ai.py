import uuid

from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.db.session import get_store
from app.services import ai_service

router = APIRouter(prefix="/api/ai", tags=["ai"])

# 模拟天气数据
MOCK_WEATHER = {"city": "上海", "temp": 24, "condition": "晴"}


@router.get("/recommend")
async def daily_recommend(
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    items = store.list_clothing(str(user["id"]), limit=200)
    return ai_service.generate_daily_recommendation(items, MOCK_WEATHER)


@router.get("/inspiration")
async def inspiration(
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    items = store.list_clothing(str(user["id"]), limit=200)
    return ai_service.generate_inspiration(items)
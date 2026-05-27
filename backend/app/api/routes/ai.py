from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.db.session import get_store
from app.services import ai_service, weather_service

router = APIRouter(prefix="/api/ai", tags=["ai"])


async def _get_weather(store, user_id: str) -> dict:
    """获取用户所在城市的天气。默认上海。"""
    profile = store.get_profile(user_id)
    city = (profile.get("city") if profile else None) or "上海"
    return weather_service.get_weather_by_city(city)


@router.get("/recommend")
async def daily_recommend(
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    items = store.list_clothing(str(user["id"]), limit=200)
    weather = await _get_weather(store, str(user["id"]))
    return ai_service.generate_daily_recommendation(items, weather)


@router.get("/inspiration")
async def inspiration(
    user: dict = Depends(get_current_user),
    store=Depends(get_store),
):
    items = store.list_clothing(str(user["id"]), limit=200)
    return ai_service.generate_inspiration(items)
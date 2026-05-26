from fastapi import APIRouter

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me")
async def get_profile():
    return {"message": "个人信息"}


@router.patch("/me")
async def update_profile():
    return {"message": "更新个人信息"}


@router.get("/me/stats")
async def get_stats():
    return {"message": "衣柜统计"}
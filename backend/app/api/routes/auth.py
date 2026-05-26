from fastapi import APIRouter

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register")
async def register():
    return {"message": "注册功能通过 Supabase Auth 实现"}


@router.post("/login")
async def login():
    return {"message": "登录功能通过 Supabase Auth 实现"}


@router.post("/refresh")
async def refresh():
    return {"message": "Token 刷新功能通过 Supabase Auth 实现"}


@router.get("/me")
async def get_me():
    return {"message": "获取当前用户信息"}
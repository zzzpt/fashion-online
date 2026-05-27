from fastapi import APIRouter

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register")
async def register():
    """注册 — 前端直接调用 Supabase Auth，此端点仅作文档说明"""
    return {"message": "注册功能通过 Supabase Auth 实现"}


@router.post("/login")
async def login():
    """登录 — 前端直接调用 Supabase Auth，此端点仅作文档说明"""
    return {"message": "登录功能通过 Supabase Auth 实现"}


@router.post("/refresh")
async def refresh():
    """刷新 token — 前端直接调用 Supabase Auth"""
    return {"message": "Token 刷新功能通过 Supabase Auth 实现"}


@router.get("/me")
async def get_me():
    """获取当前用户 — 由 Supabase Auth 客户端管理 session"""
    return {"message": "获取当前用户信息"}
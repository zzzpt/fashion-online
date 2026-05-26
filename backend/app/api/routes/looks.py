from fastapi import APIRouter

router = APIRouter(prefix="/api/looks", tags=["looks"])


@router.post("")
async def create_look():
    return {"message": "创建 Look"}


@router.get("")
async def list_looks():
    return {"message": "Look 列表"}


@router.get("/{look_id}")
async def get_look(look_id: str):
    return {"message": f"Look 详情 {look_id}"}


@router.patch("/{look_id}")
async def update_look(look_id: str):
    return {"message": f"更新 Look {look_id}"}


@router.delete("/{look_id}")
async def delete_look(look_id: str):
    return {"message": f"删除 Look {look_id}"}


@router.post("/{look_id}/like")
async def like_look(look_id: str):
    return {"message": f"点赞 Look {look_id}"}
from fastapi import APIRouter

router = APIRouter(prefix="/api/clothing", tags=["clothing"])


@router.post("/upload")
async def upload_clothing():
    return {"message": "上传衣物"}


@router.get("")
async def list_clothing():
    return {"message": "衣物列表"}


@router.get("/{clothing_id}")
async def get_clothing(clothing_id: str):
    return {"message": f"单品详情 {clothing_id}"}


@router.patch("/{clothing_id}")
async def update_clothing(clothing_id: str):
    return {"message": f"编辑单品 {clothing_id}"}


@router.delete("/{clothing_id}")
async def delete_clothing(clothing_id: str):
    return {"message": f"删除单品 {clothing_id}"}


@router.get("/{clothing_id}/looks")
async def get_clothing_looks(clothing_id: str):
    return {"message": f"单品 {clothing_id} 相关的 Looks"}
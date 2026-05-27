import os
import uuid
import shutil
from pathlib import Path

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def save_upload(file_path: str | Path, user_id: str) -> str:
    """将图片复制到 uploads 目录，返回相对 URL 路径。"""
    src = Path(file_path)
    ext = src.suffix or ".jpg"
    filename = f"{user_id}_{uuid.uuid4().hex[:12]}{ext}"
    dest = UPLOAD_DIR / filename
    shutil.copy2(src, dest)
    return f"/uploads/{filename}"


def save_bytes(data: bytes, user_id: str, ext: str = ".jpg") -> str:
    """将字节数据保存到 uploads 目录，返回相对 URL 路径。"""
    filename = f"{user_id}_{uuid.uuid4().hex[:12]}{ext}"
    dest = UPLOAD_DIR / filename
    dest.write_bytes(data)
    return f"/uploads/{filename}"


def delete_upload(url_path: str) -> bool:
    """删除上传的文件。"""
    filename = os.path.basename(url_path)
    filepath = UPLOAD_DIR / filename
    if filepath.exists():
        filepath.unlink()
        return True
    return False
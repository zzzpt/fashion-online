"""本地抠图服务。使用 rembg (ONNX) 替代 remove.bg，无需 API Key。"""

import io
from pathlib import Path
import uuid

from app.services import storage_service


def remove_background(image_path: str, user_id: str) -> str | None:
    """对图片去除背景，返回透明背景图片的 URL 路径。失败返回 None。"""
    try:
        from rembg import remove, new_session
    except ImportError:
        return None

    src = Path(image_path) if not image_path.startswith("/uploads") else Path("uploads") / image_path.replace("/uploads/", "", 1)

    if not src.exists():
        return None

    input_bytes = src.read_bytes()
    try:
        session = new_session("u2net")
        output_bytes = remove(input_bytes, session=session)
    except Exception:
        # 模型下载或推理失败，降级用简单模式
        output_bytes = remove(input_bytes)

    if not output_bytes or len(output_bytes) < 100:
        return None

    ext = src.suffix or ".png"
    filename = f"{user_id}_{uuid.uuid4().hex[:12]}_nobg{ext}"
    dest = Path("uploads") / filename
    dest.write_bytes(output_bytes)

    return f"/uploads/{filename}"
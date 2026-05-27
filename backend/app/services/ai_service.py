import json
import random
from httpx import Client

from app.core.config import settings

DEEPSEEK_BASE = "https://api.deepseek.com/v1"

# 无 API Key 时的兜底
MOCK_COLORS = ["黑色", "白色", "灰色", "米色", "藏青", "酒红", "卡其", "粉色", "浅蓝", "深绿"]
MOCK_CATEGORIES = {
    "top": ["T恤", "衬衫", "卫衣", "针织衫", "吊带"],
    "bottom": ["牛仔裤", "休闲裤", "半身裙", "短裤", "阔腿裤"],
    "dress": ["连衣裙", "吊带裙", "衬衫裙"],
    "outerwear": ["西装", "风衣", "夹克", "羽绒服", "针织开衫"],
    "shoes": ["运动鞋", "高跟鞋", "靴子", "凉鞋", "乐福鞋"],
    "bag": ["手提包", "斜挎包", "双肩包", "手拿包"],
    "accessory": ["项链", "耳环", "手链", "丝巾", "帽子"],
}
MOCK_STYLES = ["简约", "通勤", "休闲", "甜美", "复古", "街头", "优雅", "度假"]
MOCK_SEASONS = ["spring", "summer", "autumn", "winter"]
MOCK_MATERIALS = ["棉", "麻", "丝绸", "羊毛", "牛仔", "雪纺", "针织", "皮质"]


def _is_available() -> bool:
    return bool(settings.deepseek_api_key)


def _call_deepseek(messages: list[dict], temperature: float = 0.7) -> str:
    """调用 DeepSeek API (OpenAI 兼容格式)。"""
    with Client(base_url=DEEPSEEK_BASE, timeout=30) as client:
        resp = client.post(
            "/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.deepseek_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.deepseek_model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": 1000,
            },
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


def analyze_clothing(image_url: str) -> dict:
    """AI 分析衣物图片，返回识别结果。"""
    if not _is_available():
        return _mock_analyze()

    prompt = """你是一个时尚搭配专家。请分析这张衣物图片，返回 JSON（只返回 JSON，不要其他内容）：

{
  "category": "top/bottom/dress/outerwear/shoes/bag/accessory",
  "sub_category": "中文具体品类，如T恤/牛仔裤",
  "color": "主要颜色（中文）",
  "color_palette": ["颜色1", "颜色2", "颜色3"],
  "material": "材质（中文）",
  "season": ["适合的季节，可选 spring/summer/autumn/winter"],
  "style_tags": ["风格标签，如简约/通勤/休闲"],
  "ai_description": "一句话描述这件衣服，中文"
}"""

    try:
        content = _call_deepseek([
            {"role": "system", "content": "你是一个精确的时尚AI。只返回JSON，不闲聊。"},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_url}},
                ],
            },
        ])
        # 清理可能的 markdown 代码块
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            if content.endswith("```"):
                content = content[:-3]
        return json.loads(content)
    except Exception:
        return _mock_analyze()


def _mock_analyze() -> dict:
    category = random.choice(list(MOCK_CATEGORIES.keys()))
    sub = random.choice(MOCK_CATEGORIES[category])
    color = random.choice(MOCK_COLORS)
    return {
        "category": category,
        "sub_category": sub,
        "color": color,
        "color_palette": random.sample(MOCK_COLORS, 3),
        "material": random.choice(MOCK_MATERIALS),
        "season": random.sample(MOCK_SEASONS, random.randint(1, 2)),
        "style_tags": random.sample(MOCK_STYLES, random.randint(2, 4)),
        "ai_description": f"这是一件{color}的{sub}，风格{random.choice(MOCK_STYLES)}。",
    }


def generate_daily_recommendation(clothing_items: list[dict], weather: dict) -> dict:
    """AI 每日推荐，根据天气和衣柜生成搭配建议。"""
    if not clothing_items:
        return {"message": "衣柜还是空的，先上传几件衣服吧"}

    if not _is_available():
        return _mock_recommend(clothing_items, weather)

    wardrobe_text = "\n".join(
        f"- [{i['category']}] {i.get('color', '')} {i.get('sub_category', '')} "
        f"风格:{i.get('style_tags', [])} (id:{i['id']})"
        for i in clothing_items[:50]
    )

    prompt = f"""天气：{weather['city']} {weather['temp']}°C {weather['condition']}

衣柜物品：
{wardrobe_text}

请根据天气从衣柜中挑选 2-4 件合适的衣物搭配一套日常穿搭。返回 JSON：
{{
  "item_ids": ["选中的衣物id"],
  "look_title": "穿搭标题",
  "description": "为什么这样搭配",
  "style_note": "穿搭建议一句话"
}}"""

    try:
        content = _call_deepseek([
            {"role": "system", "content": "你是时尚搭配师。只返回JSON。"},
            {"role": "user", "content": prompt},
        ])
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            if content.endswith("```"):
                content = content[:-3]
        result = json.loads(content)
        selected_ids = set(result.get("item_ids", []))
        selected = [i for i in clothing_items if i["id"] in selected_ids]
        return {
            "weather": weather,
            "look_title": result.get("look_title", "今日穿搭"),
            "description": result.get("description", ""),
            "items": selected,
            "style_note": result.get("style_note", ""),
        }
    except Exception:
        return _mock_recommend(clothing_items, weather)


def _mock_recommend(clothing_items: list[dict], weather: dict) -> dict:
    tops = [i for i in clothing_items if i.get("category") in ("top", "outerwear")]
    bottoms = [i for i in clothing_items if i.get("category") in ("bottom", "dress")]
    shoes = [i for i in clothing_items if i.get("category") == "shoes"]
    selected = []
    if tops:
        selected.append(random.choice(tops))
    if bottoms:
        selected.append(random.choice(bottoms))
    if shoes:
        selected.append(random.choice(shoes))
    return {
        "weather": weather,
        "look_title": f"{weather.get('condition', '晴')}天穿搭推荐",
        "description": f"今日{weather.get('city', '你所在的城市')}{weather.get('temp', 22)}°C，{weather.get('condition', '晴')}。",
        "items": selected,
        "style_note": random.choice(["同色系搭配更显高级", "亮色点缀让造型更有活力", "层次感穿搭让比例更好"]),
    }


def generate_inspiration(clothing_items: list[dict]) -> list[dict]:
    """AI 生成搭配灵感。"""
    if len(clothing_items) < 2:
        return []
    if not _is_available():
        return _mock_inspiration(clothing_items)

    wardrobe_text = "\n".join(
        f"- [{i['category']}] {i.get('color', '')} {i.get('sub_category', '')} (id:{i['id']})"
        for i in clothing_items[:50]
    )

    prompt = f"""衣柜物品：
{wardrobe_text}

请生成 3 套不同的穿搭灵感搭配，返回 JSON 数组：
[{{"title": "搭配名称", "description": "搭配说明", "item_ids": ["选中衣物id"]}}]"""

    try:
        content = _call_deepseek([
            {"role": "system", "content": "你是时尚搭配师。只返回JSON数组。"},
            {"role": "user", "content": prompt},
        ])
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            if content.endswith("```"):
                content = content[:-3]
        results = json.loads(content)
        inspirations = []
        for r in results[:4]:
            selected_ids = set(r.get("item_ids", []))
            selected = [i for i in clothing_items if i["id"] in selected_ids]
            inspirations.append({
                "title": r.get("title", "灵感搭配"),
                "description": r.get("description", ""),
                "items": selected,
                "cover_url": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=600&fit=crop",
            })
        return inspirations
    except Exception:
        return _mock_inspiration(clothing_items)


def _mock_inspiration(clothing_items: list[dict]) -> list[dict]:
    inspirations = []
    for _ in range(min(4, len(clothing_items) // 2)):
        combo = random.sample(clothing_items, min(3, len(clothing_items)))
        inspirations.append({
            "title": f"灵感搭配 #{_ + 1}",
            "description": f"基于你的{random.choice(MOCK_STYLES)}风格单品组合",
            "items": combo,
            "cover_url": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=600&fit=crop",
        })
    return inspirations
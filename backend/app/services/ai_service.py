import random

# 模拟 AI 识别结果池
COLORS = ["黑色", "白色", "灰色", "米色", "藏青", "酒红", "卡其", "粉色", "浅蓝", "深绿"]
CATEGORIES = {
    "top": ["T恤", "衬衫", "卫衣", "针织衫", "吊带"],
    "bottom": ["牛仔裤", "休闲裤", "半身裙", "短裤", "阔腿裤"],
    "dress": ["连衣裙", "吊带裙", "衬衫裙"],
    "outerwear": ["西装", "风衣", "夹克", "羽绒服", "针织开衫"],
    "shoes": ["运动鞋", "高跟鞋", "靴子", "凉鞋", "乐福鞋"],
    "bag": ["手提包", "斜挎包", "双肩包", "手拿包"],
    "accessory": ["项链", "耳环", "手链", "丝巾", "帽子"],
}
STYLES = ["简约", "通勤", "休闲", "甜美", "复古", "街头", "优雅", "度假"]
SEASONS = ["spring", "summer", "autumn", "winter"]
MATERIALS = ["棉", "麻", "丝绸", "羊毛", "牛仔", "雪纺", "针织", "皮质"]


def analyze_clothing(image_url: str) -> dict:
    """模拟 AI 分析衣物图片，返回识别结果。"""
    category = random.choice(list(CATEGORIES.keys()))
    sub = random.choice(CATEGORIES[category])
    color = random.choice(COLORS)
    palette = random.sample(COLORS, 3)

    return {
        "category": category,
        "sub_category": sub,
        "color": color,
        "color_palette": palette,
        "material": random.choice(MATERIALS),
        "season": random.sample(SEASONS, random.randint(1, 2)),
        "style_tags": random.sample(STYLES, random.randint(2, 4)),
        "ai_description": f"这是一件{color}的{sub}，风格{random.choice(STYLES)}，适合{random.choice(SEASONS)}季节穿着。",
    }


def generate_daily_recommendation(clothing_items: list[dict], weather: dict) -> dict:
    """模拟 AI 每日推荐，根据天气和衣柜生成搭配建议。"""
    if not clothing_items:
        return {"message": "衣柜还是空的，先上传几件衣服吧"}

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
        "description": f"今日{weather.get('city', '你所在的城市')}{weather.get('temp', 22)}°C，{weather.get('condition', '晴')}，为你推荐以下搭配：",
        "items": selected,
        "style_note": random.choice([
            "同色系搭配更显高级", "亮色点缀让造型更有活力",
            "层次感穿搭让比例更好", "撞色搭配个性十足",
        ]),
    }


def generate_inspiration(clothing_items: list[dict]) -> list[dict]:
    """模拟 AI 生成搭配灵感，从衣柜组合多套搭配。"""
    if len(clothing_items) < 2:
        return []

    inspirations = []
    for _ in range(min(4, len(clothing_items) // 2)):
        combo = random.sample(clothing_items, min(3, len(clothing_items)))
        inspirations.append({
            "title": f"灵感搭配 #{_ + 1}",
            "description": f"基于你的{random.choice(STYLES)}风格单品组合",
            "items": combo,
            "cover_url": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=600&fit=crop",
        })

    return inspirations
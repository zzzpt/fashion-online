from httpx import Client

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# 城市坐标映射
CITY_COORDS: dict[str, tuple[float, float]] = {
    "北京": (39.9042, 116.4074),
    "上海": (31.2304, 121.4737),
    "广州": (23.1291, 113.2644),
    "深圳": (22.5431, 114.0579),
    "杭州": (30.2741, 120.1551),
    "成都": (30.5728, 104.0668),
    "武汉": (30.5928, 114.3055),
    "南京": (32.0603, 118.7969),
    "重庆": (29.4316, 106.9123),
    "西安": (34.3416, 108.9398),
}

WEATHER_CODE_MAP: dict[int, str] = {
    0: "晴", 1: "晴", 2: "多云", 3: "阴",
    45: "雾", 48: "雾凇",
    51: "小雨", 53: "中雨", 55: "大雨",
    61: "小雨", 63: "中雨", 65: "大雨",
    71: "小雪", 73: "中雪", 75: "大雪",
    80: "阵雨", 81: "阵雨", 82: "暴雨",
    95: "雷暴", 96: "冰雹", 99: "冰雹",
}


def get_weather(lat: float, lon: float, city: str = "") -> dict:
    """通过 Open-Meteo 免费 API 获取天气。"""
    try:
        with Client(timeout=10) as client:
            resp = client.get(
                OPEN_METEO_URL,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "current": "temperature_2m,weather_code,wind_speed_10m",
                    "timezone": "auto",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            current = data.get("current", {})
            code = current.get("weather_code", 0)
            return {
                "city": city or "未知",
                "temp": current.get("temperature_2m", 22),
                "condition": WEATHER_CODE_MAP.get(code, "未知"),
                "wind_speed": current.get("wind_speed_10m", 0),
            }
    except Exception:
        return {"city": city or "未知", "temp": 22, "condition": "晴", "wind_speed": 0}


def get_weather_by_city(city: str) -> dict:
    coords = CITY_COORDS.get(city)
    if coords:
        return get_weather(coords[0], coords[1], city)
    return {"city": city, "temp": 22, "condition": "晴", "wind_speed": 0}
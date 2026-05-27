from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = ""

    # Database
    database_url: str = ""

    # DeepSeek (OpenAI 兼容)
    deepseek_api_key: str = ""
    deepseek_model: str = "deepseek-chat"

    # remove.bg（可选，rembg 本地替代）
    removebg_api_key: str = ""

    # AI 图片生成（可选）
    fal_api_key: str = ""
    replicate_api_key: str = ""

    # 天气 API（可选，Open-Meteo 免费替代）
    weather_api_key: str = ""

    # Redis（可选）
    redis_url: str = ""

    # App
    app_name: str = "Fashion Online"
    debug: bool = False

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = ""

    # Database
    database_url: str = ""

    # OpenAI
    openai_api_key: str = ""

    # remove.bg
    removebg_api_key: str = ""

    # AI 图片生成
    fal_api_key: str = ""
    replicate_api_key: str = ""

    # 天气 API
    weather_api_key: str = ""

    # Redis
    redis_url: str = ""

    # App
    app_name: str = "Fashion Online"
    debug: bool = False

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Kindred Kids Compass API"
    app_env: str = "development"
    api_prefix: str = "/api/v1"

    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    supabase_jwt_audience: str = "authenticated"
    supabase_storage_bucket: str = "student-avatars"
    jwt_cache_ttl_seconds: int = 3600


settings = Settings()

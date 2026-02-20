from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str


class SignupRequest(BaseModel):
    full_name: str
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str
    role: str
    church_id: str | None = None
    branch_name: str | None = None
    location: str | None = None
    region: str | None = None
    district: str | None = None
    area: str | None = None


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int
    token_type: str = "bearer"
    user_id: str
    role: str
    church_id: str

from fastapi import APIRouter, HTTPException

from ..schemas.auth import LoginRequest, SignupRequest
from ..supabase_client import supabase_admin, supabase_anon

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login(payload: LoginRequest):
    auth = supabase_anon.auth.sign_in_with_password({"email": payload.email, "password": payload.password})
    if not auth.session or not auth.user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    profile = supabase_admin.table("users").select("role, church_id").eq("id", auth.user.id).single().execute()
    if not profile.data:
        raise HTTPException(status_code=403, detail="Profile missing")

    return {
        "access_token": auth.session.access_token,
        "refresh_token": auth.session.refresh_token,
        "expires_in": auth.session.expires_in,
        "token_type": "bearer",
        "user_id": auth.user.id,
        "role": profile.data["role"],
        "church_id": profile.data["church_id"],
    }


@router.post("/signup")
async def signup(payload: SignupRequest):
    if payload.role not in {"admin", "teacher"}:
        raise HTTPException(status_code=400, detail="Role must be admin or teacher")

    church_id = payload.church_id
    if payload.role == "admin":
        if not payload.branch_name or not payload.location:
            raise HTTPException(status_code=400, detail="branch_name and location are required for admin signup")
        church = (
            supabase_admin.table("churches")
            .insert({"name": "Kindred Kids", "branch_name": payload.branch_name, "location": payload.location, "region": payload.region, "district": payload.district, "area": payload.area})
            .execute()
        )
        church_id = church.data[0]["id"]

    if payload.role == "teacher" and not church_id:
        raise HTTPException(status_code=400, detail="church_id is required for teacher signup")

    auth = supabase_anon.auth.sign_up({"email": payload.email, "password": payload.password})
    if not auth.user:
        raise HTTPException(status_code=400, detail="Unable to create user")

    supabase_admin.table("users").insert(
        {
            "id": auth.user.id,
            "full_name": payload.full_name,
            "email": payload.email,
            "role": payload.role,
            "church_id": church_id,
        }
    ).execute()

    if not auth.session:
        raise HTTPException(status_code=202, detail="Signup created. Please verify email then login.")

    return {
        "access_token": auth.session.access_token,
        "refresh_token": auth.session.refresh_token,
        "expires_in": auth.session.expires_in,
        "token_type": "bearer",
        "user_id": auth.user.id,
        "role": payload.role,
        "church_id": church_id,
    }

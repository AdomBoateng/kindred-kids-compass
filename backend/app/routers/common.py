from fastapi import APIRouter, Depends

from ..auth import get_current_profile
from ..supabase_client import supabase_admin

router = APIRouter(prefix="/common", tags=["common"])


@router.get("/me")
async def me(profile=Depends(get_current_profile)):
    return profile


@router.get("/church")
async def active_church(profile=Depends(get_current_profile)):
    church = supabase_admin.table("churches").select("*").eq("id", profile["church_id"]).single().execute()
    return church.data


@router.get("/notifications")
async def notifications(profile=Depends(get_current_profile)):
    res = (
        supabase_admin.table("notifications")
        .select("id, title, message, category, created_at")
        .eq("church_id", profile["church_id"])
        .or_(f"target_role.eq.all,target_role.eq.{profile['role']}")
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    )
    return res.data


@router.post("/notifications")
async def create_notification(payload: dict, profile=Depends(get_current_profile)):
    data = {
        "church_id": profile["church_id"],
        "target_role": payload.get("target_role", "all"),
        "category": payload.get("category", "general"),
        "title": payload["title"],
        "message": payload["message"],
    }
    res = supabase_admin.table("notifications").insert(data).execute()
    return res.data[0]


@router.get("/birthdays")
async def upcoming_birthdays(days: int = 30, profile=Depends(get_current_profile)):
    res = supabase_admin.rpc("get_upcoming_birthdays", {"p_church_id": profile["church_id"], "p_days": days}).execute()
    return res.data


@router.get("/analytics/attendance")
async def attendance_analytics(profile=Depends(get_current_profile)):
    res = supabase_admin.rpc(
        "get_attendance_analytics",
        {"p_church_id": profile["church_id"], "p_teacher_id": profile["id"] if profile["role"] == "teacher" else None},
    ).execute()
    return res.data


@router.get("/analytics/performance")
async def performance_analytics(profile=Depends(get_current_profile)):
    res = supabase_admin.rpc(
        "get_performance_analytics",
        {"p_church_id": profile["church_id"], "p_teacher_id": profile["id"] if profile["role"] == "teacher" else None},
    ).execute()
    return res.data

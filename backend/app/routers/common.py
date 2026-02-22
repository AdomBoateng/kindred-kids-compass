from fastapi import APIRouter, Depends, HTTPException

from ..auth import get_current_profile
from ..supabase_client import supabase_admin, supabase_anon

router = APIRouter(prefix="/common", tags=["common"])


@router.get("/me")
async def me(profile=Depends(get_current_profile)):
    return profile


@router.patch("/me")
async def update_me(payload: dict, profile=Depends(get_current_profile)):
    allowed = {"full_name", "phone", "avatar_url"}
    updates = {k: v for k, v in payload.items() if k in allowed}
    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields provided")

    res = supabase_admin.table("users").update(updates).eq("id", profile["id"]).eq("church_id", profile["church_id"]).execute()
    return res.data[0] if res.data else {"updated": False}


@router.post("/me/change-password")
async def change_password(payload: dict, profile=Depends(get_current_profile)):
    current_password = payload.get("current_password")
    new_password = payload.get("new_password")
    if not current_password or not new_password:
        raise HTTPException(status_code=400, detail="current_password and new_password are required")

    try:
        verify = supabase_anon.auth.sign_in_with_password({"email": profile["email"], "password": current_password})
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Current password is incorrect") from exc

    if not verify.user:
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    supabase_admin.auth.admin.update_user_by_id(profile["id"], {"password": new_password})
    return {"updated": True}


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


@router.get("/settings")
async def get_settings(profile=Depends(get_current_profile)):
    res = (
        supabase_admin.table("user_settings")
        .select("security, notifications, privacy, advanced, display")
        .eq("user_id", profile["id"])
        .maybe_single()
        .execute()
    )

    if res.data:
        return res.data

    return {
        "security": {},
        "notifications": {
            "emailNotifications": True,
            "pushNotifications": False,
            "birthdayReminders": True,
            "attendanceAlerts": True,
            "newStudentAlerts": True,
        },
        "privacy": {"showEmail": False, "showPhone": True},
        "advanced": {},
        "display": {"darkMode": False, "highContrast": False, "largeText": False},
    }


@router.patch("/settings/{section}")
async def update_settings(section: str, payload: dict, profile=Depends(get_current_profile)):
    if section not in {"security", "notifications", "privacy", "advanced", "display"}:
        raise HTTPException(status_code=404, detail="Invalid settings section")

    existing = (
        supabase_admin.table("user_settings")
        .select("id")
        .eq("user_id", profile["id"])
        .maybe_single()
        .execute()
    )

    if existing.data:
        result = supabase_admin.table("user_settings").update({section: payload}).eq("user_id", profile["id"]).execute()
        return result.data[0]

    result = supabase_admin.table("user_settings").insert({"user_id": profile["id"], section: payload}).execute()
    return result.data[0]


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

import asyncio
import base64
import re
import smtplib
from email.mime.text import MIMEText

import httpx
from fastapi import APIRouter, Depends, HTTPException

from ..auth import get_current_profile
from ..config import settings
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
    items = res.data or []

    birthdays = await upcoming_birthdays(days=7, include_teachers=True, profile=profile)
    for birthday in birthdays[:10]:
        items.append({
            "id": f"birthday-{birthday['id']}",
            "title": "Upcoming Birthday",
            "message": f"{birthday['full_name']} ({birthday['person_type']}) has a birthday in {birthday['days_until_birthday']} day(s).",
            "category": "birthday",
            "created_at": birthday.get("upcoming_date", ""),
        })

    return items[:20]


def _send_email_background(recipients: list[str], subject: str, message: str):
    if not recipients or not settings.smtp_host or not settings.smtp_from_email:
        return

    msg = MIMEText(message)
    msg["Subject"] = subject
    msg["From"] = settings.smtp_from_email
    msg["To"] = ", ".join(recipients)

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
        server.starttls()
        if settings.smtp_username and settings.smtp_password:
            server.login(settings.smtp_username, settings.smtp_password)
        server.sendmail(settings.smtp_from_email, recipients, msg.as_string())


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

    if payload.get("send_email", True):
        users_query = supabase_admin.table("users").select("email, role").eq("church_id", profile["church_id"])
        users = users_query.execute().data
        target = data["target_role"]
        recipients = [u["email"] for u in users if target == "all" or u["role"] == target]
        asyncio.get_running_loop().run_in_executor(None, _send_email_background, recipients, data["title"], data["message"])

    return res.data[0]


@router.get("/settings")
async def get_settings(profile=Depends(get_current_profile)):
    res = (
        supabase_admin.table("user_settings")
        .select("security, notifications, privacy, advanced")
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
    }


@router.patch("/settings/{section}")
async def update_settings(section: str, payload: dict, profile=Depends(get_current_profile)):
    if section not in {"security", "notifications", "privacy", "advanced"}:
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
async def upcoming_birthdays(days: int = 30, include_teachers: bool = False, profile=Depends(get_current_profile)):
    res = supabase_admin.rpc("get_upcoming_birthdays", {"p_church_id": profile["church_id"], "p_days": days}).execute()
    students = [
        {
            "id": row["student_id"],
            "full_name": row["full_name"],
            "class_name": row.get("class_name"),
            "date_of_birth": row["date_of_birth"],
            "days_until_birthday": row["days_until_birthday"],
            "person_type": "student",
            "upcoming_date": row.get("date_of_birth"),
        }
        for row in (res.data or [])
    ]

    if not include_teachers:
        return students

    teachers = supabase_admin.table("users").select("id, full_name, date_of_birth").eq("church_id", profile["church_id"]).eq("role", "teacher").not_.is_("date_of_birth", "null").execute().data
    import datetime as _dt
    today = _dt.date.today()
    teacher_birthdays = []
    for t in teachers:
        dob = t.get("date_of_birth")
        if not dob:
            continue
        dob_date = _dt.date.fromisoformat(dob)
        next_bday = _dt.date(today.year, dob_date.month, dob_date.day)
        if next_bday < today:
            next_bday = _dt.date(today.year + 1, dob_date.month, dob_date.day)
        delta = (next_bday - today).days
        if delta <= days:
            teacher_birthdays.append({
                "id": t["id"],
                "full_name": t["full_name"],
                "class_name": None,
                "date_of_birth": dob,
                "days_until_birthday": delta,
                "person_type": "teacher",
                "upcoming_date": str(next_bday),
            })

    return sorted(students + teacher_birthdays, key=lambda x: x["days_until_birthday"])


@router.post("/birthdays/remind-sms")
async def birthday_sms_reminder(profile=Depends(get_current_profile)):
    if not settings.hubtel_client_id or not settings.hubtel_client_secret or not settings.hubtel_from:
        raise HTTPException(status_code=400, detail="Hubtel SMS settings are not configured")

    birthdays = supabase_admin.rpc("get_upcoming_birthdays", {"p_church_id": profile["church_id"], "p_days": 2}).execute().data
    if not birthdays:
        return {"sent": 0}

    students = supabase_admin.table("students").select("id, guardian_contact, first_name, last_name").eq("church_id", profile["church_id"]).execute().data
    by_id = {s["id"]: s for s in students}

    sent = 0
    auth = base64.b64encode(f"{settings.hubtel_client_id}:{settings.hubtel_client_secret}".encode()).decode()
    headers = {"Authorization": f"Basic {auth}", "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        for birthday in birthdays:
            student = by_id.get(birthday["student_id"])
            if not student or not student.get("guardian_contact"):
                continue
            to_number = re.sub(r"\s+", "", student["guardian_contact"])
            payload = {
                "From": settings.hubtel_from,
                "To": to_number,
                "Content": f"Reminder: {student['first_name']} {student['last_name']} has a birthday in {birthday['days_until_birthday']} day(s).",
                "RegisteredDelivery": True,
            }
            try:
                response = await client.post(settings.hubtel_api_url, headers=headers, json=payload)
                if response.status_code < 300:
                    sent += 1
            except Exception:
                continue

    return {"sent": sent}


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

from fastapi import APIRouter, Depends, HTTPException

from ..auth import require_role
from ..schemas.admin import ClassCreate, StudentCreate, TeacherClassAssign, TeacherCreate
from ..supabase_client import supabase_admin

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard")
async def dashboard(profile=Depends(require_role("admin"))):
    church_id = profile["church_id"]
    students = supabase_admin.table("students").select("id", count="exact").eq("church_id", church_id).execute()
    classes = supabase_admin.table("classes").select("id", count="exact").eq("church_id", church_id).execute()
    teachers = (
        supabase_admin.table("profiles")
        .select("id", count="exact")
        .eq("church_id", church_id)
        .eq("role", "teacher")
        .execute()
    )
    return {
        "students": students.count or 0,
        "classes": classes.count or 0,
        "teachers": teachers.count or 0,
    }


@router.get("/teachers")
async def list_teachers(profile=Depends(require_role("admin"))):
    res = (
        supabase_admin.table("profiles")
        .select("id, full_name, email, role, church_id")
        .eq("church_id", profile["church_id"])
        .eq("role", "teacher")
        .execute()
    )
    return res.data


@router.post("/teachers")
async def create_teacher(payload: TeacherCreate, profile=Depends(require_role("admin"))):
    auth_res = supabase_admin.auth.admin.create_user(
        {
            "email": payload.email,
            "email_confirm": True,
            "user_metadata": {"full_name": payload.full_name, "role": "teacher", "church_id": profile["church_id"]},
        }
    )
    if not auth_res.user:
        raise HTTPException(status_code=400, detail="Failed to create auth user")

    insert = (
        supabase_admin.table("profiles")
        .insert(
            {
                "id": auth_res.user.id,
                "full_name": payload.full_name,
                "email": payload.email,
                "phone": payload.phone,
                "role": "teacher",
                "church_id": profile["church_id"],
            }
        )
        .execute()
    )
    return insert.data[0]


@router.get("/classes")
async def list_classes(profile=Depends(require_role("admin"))):
    res = supabase_admin.table("classes").select("*").eq("church_id", profile["church_id"]).order("name").execute()
    return res.data


@router.post("/classes")
async def create_class(payload: ClassCreate, profile=Depends(require_role("admin"))):
    res = (
        supabase_admin.table("classes")
        .insert({**payload.model_dump(), "church_id": profile["church_id"]})
        .execute()
    )
    return res.data[0]


@router.post("/classes/assign-teacher")
async def assign_teacher(payload: TeacherClassAssign, profile=Depends(require_role("admin"))):
    teacher = (
        supabase_admin.table("profiles")
        .select("id")
        .eq("id", payload.teacher_id)
        .eq("church_id", profile["church_id"])
        .eq("role", "teacher")
        .single()
        .execute()
    )
    if not teacher.data:
        raise HTTPException(status_code=404, detail="Teacher not found")

    record = supabase_admin.table("class_teachers").insert(payload.model_dump()).execute()
    return record.data[0]


@router.get("/students")
async def list_students(profile=Depends(require_role("admin"))):
    res = (
        supabase_admin.table("students")
        .select("id, class_id, first_name, last_name, date_of_birth, guardian_name, guardian_contact, allergies, notes, gender, avatar_url")
        .eq("church_id", profile["church_id"])
        .order("first_name")
        .execute()
    )
    return res.data


@router.post("/students")
async def create_student(payload: StudentCreate, profile=Depends(require_role("admin"))):
    body = payload.model_dump()
    body["church_id"] = profile["church_id"]
    res = supabase_admin.table("students").insert(body).execute()
    return res.data[0]

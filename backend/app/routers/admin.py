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
        supabase_admin.table("users")
        .select("id", count="exact")
        .eq("church_id", church_id)
        .eq("role", "teacher")
        .execute()
    )
    return {"students": students.count or 0, "classes": classes.count or 0, "teachers": teachers.count or 0}


@router.get("/church")
async def get_church(profile=Depends(require_role("admin"))):
    res = supabase_admin.table("churches").select("*").eq("id", profile["church_id"]).single().execute()
    return res.data


@router.patch("/church")
async def update_church(payload: dict, profile=Depends(require_role("admin"))):
    res = supabase_admin.table("churches").update(payload).eq("id", profile["church_id"]).execute()
    return res.data[0]


@router.get("/teachers")
async def list_teachers(profile=Depends(require_role("admin"))):
    res = (
        supabase_admin.table("users")
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
        supabase_admin.table("users")
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


@router.delete("/teachers/{teacher_id}")
async def remove_teacher(teacher_id: str, profile=Depends(require_role("admin"))):
    supabase_admin.table("users").delete().eq("id", teacher_id).eq("church_id", profile["church_id"]).eq("role", "teacher").execute()
    supabase_admin.auth.admin.delete_user(teacher_id)
    return {"deleted": True}


@router.get("/classes")
async def list_classes(profile=Depends(require_role("admin"))):
    res = supabase_admin.table("classes").select("*").eq("church_id", profile["church_id"]).order("name").execute()
    return res.data


@router.post("/classes")
async def create_class(payload: ClassCreate, profile=Depends(require_role("admin"))):
    res = supabase_admin.table("classes").insert({**payload.model_dump(), "church_id": profile["church_id"]}).execute()
    return res.data[0]


@router.patch("/classes/{class_id}")
async def update_class(class_id: str, payload: dict, profile=Depends(require_role("admin"))):
    res = supabase_admin.table("classes").update(payload).eq("id", class_id).eq("church_id", profile["church_id"]).execute()
    return res.data[0]


@router.delete("/classes/{class_id}")
async def delete_class(class_id: str, profile=Depends(require_role("admin"))):
    supabase_admin.table("classes").delete().eq("id", class_id).eq("church_id", profile["church_id"]).execute()
    return {"deleted": True}


@router.post("/classes/assign-teacher")
async def assign_teacher(payload: TeacherClassAssign, profile=Depends(require_role("admin"))):
    teacher = (
        supabase_admin.table("users")
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


@router.get("/students/{student_id}")
async def get_student(student_id: str, profile=Depends(require_role("admin"))):
    res = supabase_admin.table("students").select("*").eq("id", student_id).eq("church_id", profile["church_id"]).single().execute()
    return res.data


@router.patch("/students/{student_id}")
async def update_student(student_id: str, payload: dict, profile=Depends(require_role("admin"))):
    res = supabase_admin.table("students").update(payload).eq("id", student_id).eq("church_id", profile["church_id"]).execute()
    return res.data[0]


@router.delete("/students/{student_id}")
async def delete_student(student_id: str, profile=Depends(require_role("admin"))):
    supabase_admin.table("students").delete().eq("id", student_id).eq("church_id", profile["church_id"]).execute()
    return {"deleted": True}


@router.get("/attendance-reports")
async def attendance_reports(profile=Depends(require_role("admin"))):
    res = supabase_admin.rpc("get_attendance_analytics", {"p_church_id": profile["church_id"], "p_teacher_id": None}).execute()
    return res.data


@router.get("/performance-reports")
async def performance_reports(profile=Depends(require_role("admin"))):
    res = supabase_admin.rpc("get_performance_analytics", {"p_church_id": profile["church_id"], "p_teacher_id": None}).execute()
    return res.data

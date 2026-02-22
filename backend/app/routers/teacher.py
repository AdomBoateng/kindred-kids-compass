from fastapi import APIRouter, Depends

from ..auth import require_role
from ..schemas.teacher import AttendanceSessionCreate, PerformanceTestCreate, StudentNoteIn
from ..supabase_client import supabase_admin

router = APIRouter(prefix="/teacher", tags=["teacher"])


@router.get("/dashboard")
async def dashboard(profile=Depends(require_role("teacher"))):
    teacher_id = profile["id"]
    classes = (
        supabase_admin.table("class_teachers")
        .select("class_id, classes(id, name, age_group)")
        .eq("teacher_id", teacher_id)
        .execute()
    )
    class_ids = [row["class_id"] for row in classes.data]
    students_count = 0
    if class_ids:
        students = supabase_admin.table("students").select("id", count="exact").in_("class_id", class_ids).execute()
        students_count = students.count or 0

    return {"classes": [row["classes"] for row in classes.data], "students": students_count}


@router.get("/classes")
async def my_classes(profile=Depends(require_role("teacher"))):
    res = (
        supabase_admin.table("class_teachers")
        .select("class_id, classes(id, name, age_group, description)")
        .eq("teacher_id", profile["id"])
        .execute()
    )
    return [row["classes"] for row in res.data]


@router.get("/students")
async def my_students(profile=Depends(require_role("teacher"))):
    class_links = supabase_admin.table("class_teachers").select("class_id").eq("teacher_id", profile["id"]).execute()
    class_ids = [row["class_id"] for row in class_links.data]
    if not class_ids:
        return []

    students = supabase_admin.table("students").select("*").in_("class_id", class_ids).order("first_name").execute()
    return students.data


@router.get("/students/{student_id}")
async def student_profile(student_id: str, profile=Depends(require_role("teacher"))):
    res = (
        supabase_admin.table("students")
        .select("*, student_notes(id, note, created_at, author_id)")
        .eq("id", student_id)
        .eq("church_id", profile["church_id"])
        .single()
        .execute()
    )
    return res.data


@router.post("/attendance")
async def record_attendance(payload: AttendanceSessionCreate, profile=Depends(require_role("teacher"))):
    session = (
        supabase_admin.table("attendance_sessions")
        .insert({"class_id": payload.class_id, "session_date": str(payload.session_date), "recorded_by": profile["id"], "church_id": profile["church_id"]})
        .execute()
    )
    attendance_session_id = session.data[0]["id"]
    rows = [{"attendance_session_id": attendance_session_id, **item.model_dump()} for item in payload.students]
    supabase_admin.table("attendance_records").insert(rows).execute()
    return {"attendance_session_id": attendance_session_id, "records": len(rows)}


@router.get("/attendance")
async def attendance_history(class_id: str | None = None, profile=Depends(require_role("teacher"))):
    query = supabase_admin.table("attendance_sessions").select("*").eq("recorded_by", profile["id"]).order("session_date", desc=True)
    if class_id:
        query = query.eq("class_id", class_id)
    res = query.limit(50).execute()
    return res.data


@router.post("/performance")
async def record_performance(payload: PerformanceTestCreate, profile=Depends(require_role("teacher"))):
    test = (
        supabase_admin.table("performance_tests")
        .insert({"class_id": payload.class_id, "title": payload.title, "taken_on": str(payload.taken_on), "recorded_by": profile["id"], "church_id": profile["church_id"]})
        .execute()
    )
    test_id = test.data[0]["id"]
    rows = [{"test_id": test_id, **s.model_dump()} for s in payload.scores]
    supabase_admin.table("performance_scores").insert(rows).execute()
    return {"test_id": test_id, "scores": len(rows)}


@router.get("/performance")
async def performance_history(class_id: str | None = None, profile=Depends(require_role("teacher"))):
    query = supabase_admin.table("performance_tests").select("*").eq("recorded_by", profile["id"]).order("taken_on", desc=True)
    if class_id:
        query = query.eq("class_id", class_id)
    res = query.limit(50).execute()
    return res.data


@router.post("/student-notes")
async def add_student_note(payload: StudentNoteIn, profile=Depends(require_role("teacher", "admin"))):
    res = (
        supabase_admin.table("student_notes")
        .insert({"student_id": payload.student_id, "note": payload.note, "author_id": profile["id"], "church_id": profile["church_id"]})
        .execute()
    )
    return res.data[0]


@router.delete("/students/{student_id}")
async def remove_student(student_id: str, profile=Depends(require_role("teacher"))):
    class_links = supabase_admin.table("class_teachers").select("class_id").eq("teacher_id", profile["id"]).execute()
    class_ids = [row["class_id"] for row in class_links.data]
    if not class_ids:
        return {"deleted": False}

    supabase_admin.table("students").delete().eq("id", student_id).eq("church_id", profile["church_id"]).in_("class_id", class_ids).execute()
    return {"deleted": True}


@router.delete("/attendance/{session_id}")
async def delete_attendance(session_id: str, profile=Depends(require_role("teacher"))):
    supabase_admin.table("attendance_sessions").delete().eq("id", session_id).eq("recorded_by", profile["id"]).execute()
    return {"deleted": True}


@router.delete("/performance/{test_id}")
async def delete_performance(test_id: str, profile=Depends(require_role("teacher"))):
    supabase_admin.table("performance_tests").delete().eq("id", test_id).eq("recorded_by", profile["id"]).execute()
    return {"deleted": True}

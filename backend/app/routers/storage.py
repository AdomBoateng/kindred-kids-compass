import mimetypes
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from ..auth import get_current_profile
from ..config import settings
from ..supabase_client import supabase_admin

router = APIRouter(prefix="/storage", tags=["storage"])


@router.post("/students/{student_id}/avatar")
async def upload_student_avatar(student_id: str, file: UploadFile = File(...), profile=Depends(get_current_profile)):
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="File is empty")

    ext = mimetypes.guess_extension(file.content_type or "image/jpeg") or ".jpg"
    filename = f"{profile['church_id']}/{student_id}/{uuid.uuid4().hex}{ext}"

    supabase_admin.storage.from_(settings.supabase_storage_bucket).upload(
        path=filename,
        file=content,
        file_options={"content-type": file.content_type or "image/jpeg", "upsert": "true"},
    )

    public_url = supabase_admin.storage.from_(settings.supabase_storage_bucket).get_public_url(filename)

    supabase_admin.table("students").update({"avatar_url": public_url}).eq("id", student_id).eq(
        "church_id", profile["church_id"]
    ).execute()

    return {"path": filename, "avatar_url": public_url}

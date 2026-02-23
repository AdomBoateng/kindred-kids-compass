from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class TeacherCreate(BaseModel):
    full_name: str
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    password: str = Field(min_length=6)


class TeacherOut(BaseModel):
    id: str
    full_name: str
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    role: str
    church_id: str


class ClassCreate(BaseModel):
    name: str
    description: Optional[str] = None
    age_group: str


class ClassOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    age_group: str
    church_id: str


class StudentCreate(BaseModel):
    class_id: str
    first_name: str
    last_name: str
    date_of_birth: date
    guardian_name: str
    guardian_contact: str
    allergies: Optional[str] = None
    notes: Optional[str] = None
    gender: Optional[str] = None


class StudentOut(BaseModel):
    id: str
    class_id: str
    first_name: str
    last_name: str
    date_of_birth: date
    guardian_name: str
    guardian_contact: str
    allergies: Optional[str]
    notes: Optional[str]
    gender: Optional[str]
    avatar_url: Optional[str]


class TeacherClassAssign(BaseModel):
    teacher_id: str
    class_id: str


class StudentNoteCreate(BaseModel):
    student_id: str
    note: str = Field(min_length=3)

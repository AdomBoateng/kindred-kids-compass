from datetime import date
from pydantic import BaseModel, EmailStr


class ProfileOut(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: str
    church_id: str


class NotificationOut(BaseModel):
    id: str
    title: str
    message: str
    category: str
    created_at: str


class BirthdayReminderOut(BaseModel):
    student_id: str
    full_name: str
    class_name: str
    date_of_birth: date
    days_until_birthday: int


class AttendancePoint(BaseModel):
    session_date: date
    present_count: int
    total_count: int
    attendance_rate: float


class PerformancePoint(BaseModel):
    taken_on: date
    avg_percent: float

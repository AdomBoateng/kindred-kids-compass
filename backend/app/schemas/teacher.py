from datetime import date
from typing import Optional

from pydantic import BaseModel


class AttendanceItemIn(BaseModel):
    student_id: str
    present: bool
    notes: Optional[str] = None


class AttendanceSessionCreate(BaseModel):
    class_id: str
    session_date: date
    students: list[AttendanceItemIn]


class PerformanceScoreIn(BaseModel):
    student_id: str
    score: float
    max_score: float
    notes: Optional[str] = None


class PerformanceTestCreate(BaseModel):
    class_id: str
    title: str
    taken_on: date
    scores: list[PerformanceScoreIn]


class StudentNoteIn(BaseModel):
    student_id: str
    note: str

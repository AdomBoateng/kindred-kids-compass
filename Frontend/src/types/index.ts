export type UserRole = "admin" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  churchId: string;
  avatar?: string;
}

export interface Church {
  id: string;
  name: string;
  branchName: string;
  location: string;
  region?: string;
  district?: string;
  area?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  guardianName: string;
  guardianContact: string;
  allergies?: string;
  notes?: string;
  classId: string;
  churchId: string;
  avatar?: string;
  joinDate: string;
  gender?: "male" | "female" | "other";
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  ageGroup: string;
  teacherIds: string[];
  studentIds: string[];
  churchId: string;
}

export interface Attendance {
  id: string;
  date: string;
  classId: string;
  churchId: string;
  students: {
    studentId: string;
    present: boolean;
    notes?: string;
  }[];
}

export interface TestScore {
  id: string;
  studentId: string;
  testName: string;
  score: number;
  maxScore: number;
  date: string;
  churchId: string;
  notes?: string;
}

export interface Teacher extends User {
  classIds: string[];
}

export type Admin = User

// Dashboard types
export interface StudentStat {
  total: number;
  newThisMonth: number;
  birthdays: Student[];
}

export interface AttendanceStat {
  averageRate: number;
  trend: number;
  lastSessionCount: number;
}

export interface PerformanceStat {
  averageScore: number;
  trend: number;
  testsTaken: number;
}

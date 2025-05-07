
export type UserRole = "admin" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
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
  avatar?: string;
  joinDate: string;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  ageGroup: string;
  teacherIds: string[];
  studentIds: string[];
}

export interface Attendance {
  id: string;
  date: string;
  classId: string;
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
  notes?: string;
}

export interface Teacher extends User {
  classIds: string[];
}

export interface Admin extends User {
  // Admin specific fields if needed
}

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

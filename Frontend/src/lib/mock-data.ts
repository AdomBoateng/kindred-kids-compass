import { Attendance, Church, Class, Student, TestScore, User } from "@/types";

export const mockChurches: Church[] = [
  { id: "church-1", name: "Kindred Kids", branchName: "Central Church", location: "Downtown" },
  { id: "church-2", name: "Kindred Kids", branchName: "North Branch", location: "Northside" },
];

export const mockUsers: User[] = [
  {
    id: "admin-1",
    name: "Pastor Grace Admin",
    email: "admin.central@church.org",
    role: "admin",
    churchId: "church-1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin1",
  },
  {
    id: "admin-2",
    name: "Pastor Daniel Admin",
    email: "admin.north@church.org",
    role: "admin",
    churchId: "church-2",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin2",
  },
  {
    id: "teacher-1",
    name: "Sarah Johnson",
    email: "teacher.central@church.org",
    role: "teacher",
    churchId: "church-1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1",
  },
  {
    id: "teacher-2",
    name: "Michael Barnes",
    email: "michael.central@church.org",
    role: "teacher",
    churchId: "church-1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2",
  },
  {
    id: "teacher-3",
    name: "Rebecca Williams",
    email: "teacher.north@church.org",
    role: "teacher",
    churchId: "church-2",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher3",
  },
];

export const mockClasses: Class[] = [
  {
    id: "class-1",
    name: "Preschool Class",
    description: "For children ages 3-5",
    ageGroup: "3-5",
    teacherIds: ["teacher-1"],
    studentIds: ["student-1", "student-2", "student-3"],
    churchId: "church-1",
  },
  {
    id: "class-2",
    name: "Elementary Class",
    description: "For children ages 6-8",
    ageGroup: "6-8",
    teacherIds: ["teacher-2"],
    studentIds: ["student-4", "student-5", "student-6"],
    churchId: "church-1",
  },
  {
    id: "class-3",
    name: "Junior Class",
    description: "For children ages 9-11",
    ageGroup: "9-11",
    teacherIds: ["teacher-3"],
    studentIds: ["student-7", "student-8", "student-9"],
    churchId: "church-2",
  },
];

export const mockStudents: Student[] = [
  { id: "student-1", firstName: "Emma", lastName: "Johnson", dateOfBirth: "2019-05-08", guardianName: "Robert & Mary Johnson", guardianContact: "555-123-4567", allergies: "Peanuts", notes: "Shy but warms up quickly", classId: "class-1", churchId: "church-1", joinDate: "2022-01-10" },
  { id: "student-2", firstName: "Noah", lastName: "Williams", dateOfBirth: "2019-12-15", guardianName: "James Williams", guardianContact: "555-987-6543", notes: "Very energetic and sociable", classId: "class-1", churchId: "church-1", joinDate: "2022-02-05" },
  { id: "student-3", firstName: "Olivia", lastName: "Brown", dateOfBirth: "2019-03-22", guardianName: "Sarah Brown", guardianContact: "555-456-7890", allergies: "Dairy", classId: "class-1", churchId: "church-1", joinDate: "2022-01-15" },
  { id: "student-4", firstName: "Ava", lastName: "Davis", dateOfBirth: "2016-07-19", guardianName: "Daniel Davis", guardianContact: "555-321-6547", classId: "class-2", churchId: "church-1", joinDate: "2022-01-10" },
  { id: "student-5", firstName: "Ethan", lastName: "Miller", dateOfBirth: getDateStringForUpcomingBirthday(7), guardianName: "Jessica Miller", guardianContact: "555-654-9870", allergies: "Gluten", classId: "class-2", churchId: "church-1", joinDate: "2022-03-01" },
  { id: "student-6", firstName: "Isabella", lastName: "Wilson", dateOfBirth: "2017-01-30", guardianName: "Christopher & Amanda Wilson", guardianContact: "555-258-3690", notes: "Enjoys art and crafts", classId: "class-2", churchId: "church-1", joinDate: "2022-01-25" },
  { id: "student-7", firstName: "Mia", lastName: "Anderson", dateOfBirth: "2014-04-12", guardianName: "David & Laura Anderson", guardianContact: "555-369-8520", allergies: "Strawberries", classId: "class-3", churchId: "church-2", joinDate: "2022-01-05" },
  { id: "student-8", firstName: "Jacob", lastName: "Thomas", dateOfBirth: getDateStringForUpcomingBirthday(14), guardianName: "Elizabeth Thomas", guardianContact: "555-963-8521", notes: "Very interested in Bible stories", classId: "class-3", churchId: "church-2", joinDate: "2022-02-10" },
  { id: "student-9", firstName: "Charlotte", lastName: "White", dateOfBirth: "2013-08-28", guardianName: "Matthew & Sophia White", guardianContact: "555-852-7413", classId: "class-3", churchId: "church-2", joinDate: "2022-03-05" },
];

export const mockAttendance: Attendance[] = [
  { id: "attendance-1", date: "2023-05-07", classId: "class-1", churchId: "church-1", students: [{ studentId: "student-1", present: true }, { studentId: "student-2", present: true }, { studentId: "student-3", present: false, notes: "Sick" }] },
  { id: "attendance-2", date: "2023-05-14", classId: "class-2", churchId: "church-1", students: [{ studentId: "student-4", present: true }, { studentId: "student-5", present: true }, { studentId: "student-6", present: true }] },
  { id: "attendance-3", date: "2023-05-21", classId: "class-3", churchId: "church-2", students: [{ studentId: "student-7", present: false, notes: "Family vacation" }, { studentId: "student-8", present: true }, { studentId: "student-9", present: true }] },
];

export const mockTestScores: TestScore[] = [
  { id: "score-1", studentId: "student-1", testName: "Bible Memory Verse", score: 8, maxScore: 10, date: "2023-05-07", churchId: "church-1" },
  { id: "score-2", studentId: "student-4", testName: "Noah's Ark Quiz", score: 15, maxScore: 20, date: "2023-05-14", churchId: "church-1" },
  { id: "score-3", studentId: "student-7", testName: "Bible Memory Verse", score: 9, maxScore: 10, date: "2023-05-07", churchId: "church-2" },
];

function getDateStringForUpcomingBirthday(daysFromNow: number): string {
  const today = new Date();
  const birthYear = Math.floor(Math.random() * (2019 - 2013 + 1)) + 2013;
  const upcomingDate = new Date(today);
  upcomingDate.setDate(today.getDate() + daysFromNow);

  return `${birthYear}-${(upcomingDate.getMonth() + 1).toString().padStart(2, "0")}-${upcomingDate.getDate().toString().padStart(2, "0")}`;
}

export function getChurchById(churchId?: string): Church | undefined {
  if (!churchId) return undefined;
  return mockChurches.find((church) => church.id === churchId);
}

export function getUsersByChurchId(churchId?: string): User[] {
  if (!churchId) return mockUsers;
  return mockUsers.filter((user) => user.churchId === churchId);
}

export function getClassesByChurchId(churchId?: string): Class[] {
  if (!churchId) return mockClasses;
  return mockClasses.filter((classItem) => classItem.churchId === churchId);
}

export function getStudentsByChurchId(churchId?: string): Student[] {
  if (!churchId) return mockStudents;
  return mockStudents.filter((student) => student.churchId === churchId);
}

export function getClassById(classId: string): Class | undefined {
  return mockClasses.find((classItem) => classItem.id === classId);
}

export function getStudentById(studentId: string): Student | undefined {
  return mockStudents.find((student) => student.id === studentId);
}

export function getStudentsByClassId(classId: string, churchId?: string): Student[] {
  return mockStudents.filter((student) => student.classId === classId && (!churchId || student.churchId === churchId));
}

export function getTeachersByClassId(classId: string, churchId?: string): User[] {
  const classItem = mockClasses.find((item) => item.id === classId && (!churchId || item.churchId === churchId));
  if (!classItem) return [];

  return mockUsers.filter(
    (user) => user.role === "teacher" && classItem.teacherIds.includes(user.id) && (!churchId || user.churchId === churchId),
  );
}

export function getPrimaryClassForTeacher(teacherId?: string, churchId?: string): Class | undefined {
  if (!teacherId) return undefined;
  return mockClasses.find((classItem) => classItem.teacherIds.includes(teacherId) && (!churchId || classItem.churchId === churchId));
}

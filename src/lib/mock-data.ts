
import { User, Student, Class, Attendance, TestScore, UserRole } from "@/types";

// Mock Users (Teachers and Admins)
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@church.org",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "teacher@church.org",
    role: "teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher",
  },
  {
    id: "3",
    name: "Michael Barnes",
    email: "michael@church.org",
    role: "teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
  },
  {
    id: "4",
    name: "Rebecca Williams",
    email: "rebecca@church.org",
    role: "teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rebecca",
  },
];

// Mock Classes
export const mockClasses: Class[] = [
  {
    id: "1",
    name: "Preschool Class",
    description: "For children ages 3-5",
    ageGroup: "3-5",
    teacherIds: ["2"],
    studentIds: ["1", "2", "3", "4"],
  },
  {
    id: "2",
    name: "Elementary Class",
    description: "For children ages 6-8",
    ageGroup: "6-8",
    teacherIds: ["3"],
    studentIds: ["5", "6", "7", "8"],
  },
  {
    id: "3",
    name: "Junior Class",
    description: "For children ages 9-11",
    ageGroup: "9-11",
    teacherIds: ["4"],
    studentIds: ["9", "10", "11", "12"],
  },
];

// Mock Students
export const mockStudents: Student[] = [
  {
    id: "1",
    firstName: "Emma",
    lastName: "Johnson",
    dateOfBirth: "2019-05-08",
    guardianName: "Robert & Mary Johnson",
    guardianContact: "555-123-4567",
    allergies: "Peanuts",
    notes: "Shy but warms up quickly",
    classId: "1",
    joinDate: "2022-01-10",
  },
  {
    id: "2",
    firstName: "Noah",
    lastName: "Williams",
    dateOfBirth: "2019-12-15",
    guardianName: "James Williams",
    guardianContact: "555-987-6543",
    notes: "Very energetic and sociable",
    classId: "1",
    joinDate: "2022-02-05",
  },
  {
    id: "3",
    firstName: "Olivia",
    lastName: "Brown",
    dateOfBirth: "2019-03-22",
    guardianName: "Sarah Brown",
    guardianContact: "555-456-7890",
    allergies: "Dairy",
    classId: "1",
    joinDate: "2022-01-15",
  },
  {
    id: "4",
    firstName: "Liam",
    lastName: "Jones",
    dateOfBirth: getDateStringForUpcomingBirthday(3),
    guardianName: "Michael & Emily Jones",
    guardianContact: "555-789-0123",
    notes: "Loves music activities",
    classId: "1",
    joinDate: "2022-02-20",
  },
  {
    id: "5",
    firstName: "Ava",
    lastName: "Davis",
    dateOfBirth: "2016-07-19",
    guardianName: "Daniel Davis",
    guardianContact: "555-321-6547",
    classId: "2",
    joinDate: "2022-01-10",
  },
  {
    id: "6",
    firstName: "Ethan",
    lastName: "Miller",
    dateOfBirth: getDateStringForUpcomingBirthday(7),
    guardianName: "Jessica Miller",
    guardianContact: "555-654-9870",
    allergies: "Gluten",
    classId: "2",
    joinDate: "2022-03-01",
  },
  {
    id: "7",
    firstName: "Isabella",
    lastName: "Wilson",
    dateOfBirth: "2017-01-30",
    guardianName: "Christopher & Amanda Wilson",
    guardianContact: "555-258-3690",
    notes: "Enjoys art and crafts",
    classId: "2",
    joinDate: "2022-01-25",
  },
  {
    id: "8",
    firstName: "Lucas",
    lastName: "Taylor",
    dateOfBirth: "2016-09-05",
    guardianName: "Jennifer Taylor",
    guardianContact: "555-147-2583",
    classId: "2",
    joinDate: "2022-02-15",
  },
  {
    id: "9",
    firstName: "Mia",
    lastName: "Anderson",
    dateOfBirth: "2014-04-12",
    guardianName: "David & Laura Anderson",
    guardianContact: "555-369-8520",
    allergies: "Strawberries",
    classId: "3",
    joinDate: "2022-01-05",
  },
  {
    id: "10",
    firstName: "Jacob",
    lastName: "Thomas",
    dateOfBirth: getDateStringForUpcomingBirthday(14),
    guardianName: "Elizabeth Thomas",
    guardianContact: "555-963-8521",
    notes: "Very interested in Bible stories",
    classId: "3",
    joinDate: "2022-02-10",
  },
  {
    id: "11",
    firstName: "Charlotte",
    lastName: "White",
    dateOfBirth: "2013-08-28",
    guardianName: "Matthew & Sophia White",
    guardianContact: "555-852-7413",
    classId: "3",
    joinDate: "2022-03-05",
  },
  {
    id: "12",
    firstName: "Mason",
    lastName: "Harris",
    dateOfBirth: "2013-11-17",
    guardianName: "Joseph Harris",
    guardianContact: "555-741-9632",
    notes: "Likes to help others",
    classId: "3",
    joinDate: "2022-01-20",
  },
];

// Mock Attendance Records
export const mockAttendance: Attendance[] = [
  {
    id: "1",
    date: "2023-05-07",
    classId: "1",
    students: [
      { studentId: "1", present: true },
      { studentId: "2", present: true },
      { studentId: "3", present: false, notes: "Sick" },
      { studentId: "4", present: true },
    ],
  },
  {
    id: "2",
    date: "2023-05-14",
    classId: "1",
    students: [
      { studentId: "1", present: true },
      { studentId: "2", present: true },
      { studentId: "3", present: true },
      { studentId: "4", present: true },
    ],
  },
  {
    id: "3",
    date: "2023-05-21",
    classId: "1",
    students: [
      { studentId: "1", present: false, notes: "Family vacation" },
      { studentId: "2", present: true },
      { studentId: "3", present: true },
      { studentId: "4", present: true },
    ],
  },
];

// Mock Test Scores
export const mockTestScores: TestScore[] = [
  {
    id: "1",
    studentId: "1",
    testName: "Bible Memory Verse",
    score: 8,
    maxScore: 10,
    date: "2023-05-07",
  },
  {
    id: "2",
    studentId: "1",
    testName: "Noah's Ark Quiz",
    score: 15,
    maxScore: 20,
    date: "2023-05-14",
  },
  {
    id: "3",
    studentId: "2",
    testName: "Bible Memory Verse",
    score: 9,
    maxScore: 10,
    date: "2023-05-07",
  },
];

// Helper function to generate dates for upcoming birthdays
function getDateStringForUpcomingBirthday(daysFromNow: number): string {
  const today = new Date();
  // Set year to birth year (between 2013-2019 for the mock data)
  const birthYear = Math.floor(Math.random() * (2019 - 2013 + 1)) + 2013;
  // Calculate month and day for the upcoming birthday
  const upcomingDate = new Date(today);
  upcomingDate.setDate(today.getDate() + daysFromNow);
  
  return `${birthYear}-${(upcomingDate.getMonth() + 1).toString().padStart(2, '0')}-${upcomingDate.getDate().toString().padStart(2, '0')}`;
}

// Helper function to get a class by ID
export function getClassById(classId: string): Class | undefined {
  return mockClasses.find(c => c.id === classId);
}

// Helper function to get a student by ID
export function getStudentById(studentId: string): Student | undefined {
  return mockStudents.find(s => s.id === studentId);
}

// Helper function to get students by class ID
export function getStudentsByClassId(classId: string): Student[] {
  return mockStudents.filter(student => student.classId === classId);
}

// Helper function to get teachers by class ID
export function getTeachersByClassId(classId: string): User[] {
  const classItem = mockClasses.find(c => c.id === classId);
  if (!classItem) return [];
  
  return mockUsers.filter(user => 
    user.role === 'teacher' && classItem.teacherIds.includes(user.id)
  );
}

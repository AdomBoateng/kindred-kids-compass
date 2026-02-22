import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Church, Class, Student, User } from "@/types";
import { sanitizeText } from "@/lib/security";
import { api } from "@/lib/api";

function getActiveChurchFromStorage(churchId?: string): Church | undefined {
  if (!churchId) return undefined;
  const raw = localStorage.getItem("activeChurch");
  if (!raw) return undefined;
  try {
    const church = JSON.parse(raw) as Church;
    if (church.id !== churchId) return undefined;
    return {
      ...church,
      id: sanitizeText(church.id),
      name: sanitizeText(church.name),
      branchName: sanitizeText(church.branchName),
      location: sanitizeText(church.location),
      region: church.region ? sanitizeText(church.region) : undefined,
      district: church.district ? sanitizeText(church.district) : undefined,
      area: church.area ? sanitizeText(church.area) : undefined,
    };
  } catch {
    return undefined;
  }
}

const mapStudent = (student: { id: string; class_id: string; church_id?: string; first_name: string; last_name: string; date_of_birth: string; guardian_name: string; guardian_contact: string; allergies?: string; notes?: string; gender?: "male" | "female" | "other"; avatar_url?: string }): Student => ({
  id: student.id,
  classId: student.class_id,
  churchId: student.church_id || "",
  firstName: student.first_name,
  lastName: student.last_name,
  dateOfBirth: student.date_of_birth,
  guardianName: student.guardian_name,
  guardianContact: student.guardian_contact,
  allergies: student.allergies,
  notes: student.notes,
  gender: student.gender,
  avatar: student.avatar_url,
  joinDate: new Date().toISOString().slice(0, 10),
});

export function useChurchScope() {
  const { user } = useAuth();
  const churchId = user?.churchId;
  const [church, setChurch] = useState<Church | undefined>(getActiveChurchFromStorage(churchId));
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const churchResponse = await api.getChurch();
        const activeChurch: Church = { id: churchResponse.id, name: churchResponse.name, branchName: churchResponse.branch_name, location: churchResponse.location, region: churchResponse.region, district: churchResponse.district, area: churchResponse.area };
        setChurch(activeChurch);

        if (user.role === "admin") {
          const [teachers, classRows, studentRows] = await Promise.all([api.getTeachers(), api.getClasses(), api.getStudents()]);

          const mappedUsers: User[] = teachers.map((teacher) => ({
            id: teacher.id,
            name: teacher.full_name,
            email: teacher.email,
            role: "teacher",
            churchId: teacher.church_id,
          }));

          const mappedClasses: Class[] = classRows.map((classRow) => ({
            id: classRow.id,
            name: classRow.name,
            description: classRow.description,
            ageGroup: classRow.age_group,
            churchId: classRow.church_id,
            teacherIds: (classRow.class_teachers || []).map((assignment) => assignment.teacher_id),
            studentIds: studentRows.filter((student) => student.class_id === classRow.id).map((student) => student.id),
          }));

          const mappedStudents = studentRows.map((student) => mapStudent({ ...student, church_id: student.church_id || activeChurch.id }));
          setUsers(mappedUsers);
          setClasses(mappedClasses);
          setStudents(mappedStudents);
          setRuntimeScopeData({ church: activeChurch, users: mappedUsers, classes: mappedClasses, students: mappedStudents });
          return;
        }

        const [teacherClasses, teacherStudents] = await Promise.all([api.getTeacherClasses(), api.getTeacherStudents()]);
        const mappedStudents = teacherStudents.map((s) => mapStudent({ ...s, church_id: s.church_id || (churchId || "") }));
        const mappedClasses: Class[] = teacherClasses.map((c) => ({ id: c.id, name: c.name, description: c.description, ageGroup: c.age_group, churchId: churchId || "", teacherIds: [user.id], studentIds: mappedStudents.filter((s) => s.classId === c.id).map((s) => s.id) }));
        const teacherUser: User = { id: user.id, name: user.name, email: user.email, role: "teacher", churchId: user.churchId, avatar: user.avatar };
        setUsers([teacherUser]); setClasses(mappedClasses); setStudents(mappedStudents);
        localStorage.setItem("runtimeScopeData", JSON.stringify({ church: activeChurch, users: [teacherUser], classes: mappedClasses, students: mappedStudents }));
      } catch (error) {
        console.warn("Unable to load church scope from API.", error);
      } finally { setIsLoading(false); }
    };
    load();
  }, [churchId, user]);

  return useMemo(() => ({ churchId, church, users, classes, students, teachers: users.filter((u) => u.role === "teacher"), isLoading }), [churchId, church, users, classes, students, isLoading]);
}

import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChurchScope } from "@/hooks/use-church-scope";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, classes } = useChurchScope();
  const student = useMemo(() => students.find((s) => s.id === id), [students, id]);
  const classItem = classes.find((c) => c.id === student?.classId);

  const deleteStudent = async () => {
    if (!id) return;
    await api.deleteStudentAsTeacher(id);
    toast({ title: "Student deleted" });
    navigate("/teacher/students");
  };

  if (!student) return <Layout><PageHeader title="Student not found" /></Layout>;
  return <Layout><PageHeader title={`${student.firstName} ${student.lastName}`} description={classItem?.name || ""} /><Card><CardContent className="pt-6"><p>Guardian: {student.guardianName}</p><p>Contact: {student.guardianContact}</p><Button variant="destructive" onClick={deleteStudent}>Delete Student</Button></CardContent></Card></Layout>;
}

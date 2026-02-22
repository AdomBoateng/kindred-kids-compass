import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StudentCard } from "@/components/cards/StudentCard";
import { useChurchScope } from "@/hooks/use-church-scope";
import { Plus, Search, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { LogoLoader } from "@/components/common/LogoLoader";

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { students, classes, church, isLoading } = useChurchScope();

  const filteredStudents = useMemo(() => students.filter((student) => student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || student.lastName.toLowerCase().includes(searchTerm.toLowerCase())), [students, searchTerm]);
  const getClassInfo = (classId: string) => {
    const classData = classes.find((cls) => cls.id === classId);
    return classData ? { id: classData.id, name: classData.name } : { id: "", name: "No Class Assigned" };
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    await api.deleteStudentAsAdmin(studentId);
    toast({ title: "Student Deleted", description: `${studentName} has been removed from the system.` });
    window.location.reload();
  };

  if (isLoading) return <Layout><LogoLoader label="Loading students..." /></Layout>;

  return (
    <Layout>
      <PageHeader title="Students" description={`Manage student records for ${church?.branchName || "your branch"}`} />
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" /><Input placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div>
        <Button asChild><Link to="/admin/students/new"><Plus className="mr-2 h-4 w-4" />Add Student</Link></Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="relative">
            <StudentCard student={student} classInfo={getClassInfo(student.classId)} />
            <Button variant="destructive" size="sm" className="absolute top-2 right-2 z-10" onClick={() => handleDeleteStudent(student.id, `${student.firstName} ${student.lastName}`)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </Layout>
  );
}

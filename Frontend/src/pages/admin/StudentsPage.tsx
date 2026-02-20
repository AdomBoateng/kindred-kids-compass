import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudentCard } from "@/components/cards/StudentCard";
import { useChurchScope } from "@/hooks/use-church-scope";
import { Link } from "react-router-dom";
import { Plus, Search, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { students, classes, church } = useChurchScope();
  
  // Filter students based on search term
  const filteredStudents = students.filter(
    student => 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get class info for each student
  const getClassInfo = (classId: string) => {
    const classData = classes.find(cls => cls.id === classId);
    return classData ? { id: classData.id, name: classData.name } : { id: "", name: "No Class Assigned" };
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    // In a real app, this would make an API call to delete the student
    toast({
      title: "Student Deleted",
      description: `${studentName} has been removed from the system.`,
    });
  };

  return (
    <Layout>
      {/* Background logo image */}
      <img
        src={logo}
        alt="Kindred Kids Compass Logo"
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
        style={{
          width: "20vw",
          maxWidth: 900,
          minWidth: 300,
          zIndex: 0,
        }}
      />
      <PageHeader 
        title="Students" 
        description={`Manage student records for ${church?.branchName || 'your branch'}`} 
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          asChild
          className="hover:bg-[#FFC107] hover:text-black transition-colors"
        >
          <Link to="/admin/students/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="relative">
            <StudentCard
              student={student}
              classInfo={getClassInfo(student.classId)}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Student</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {student.firstName} {student.lastName}? This action cannot be undone and will remove all associated records.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteStudent(student.id, `${student.firstName} ${student.lastName}`)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Student
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
        
        {filteredStudents.length === 0 && (
          <div className="col-span-full flex justify-center p-8 text-muted-foreground">
            No students found.
          </div>
        )}
      </div>
    </Layout>
  );
}


import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudentCard } from "@/components/cards/StudentCard";
import { mockStudents, mockClasses } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import logo from "@/assets/logo.png";

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter students based on search term
  const filteredStudents = mockStudents.filter(
    student => 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get class name for each student
  const getClassInfo = (classId: string) => {
    const classData = mockClasses.find(cls => cls.id === classId);
    return classData ? classData.name : "No Class Assigned";
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
        description="Manage student records and information" 
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
        <Button asChild>
          <Link to="/admin/students/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            classInfo={getClassInfo(student.classId)}
          />
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

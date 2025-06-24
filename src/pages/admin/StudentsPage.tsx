import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockStudents, mockClasses } from "@/lib/mock-data";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { StudentCard } from "@/components/cards/StudentCard";
import logo from "@/assets/logo.png";

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  
  // Filter students based on search term and class filter
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = classFilter === "all" || student.classId === classFilter;
    
    return matchesSearch && matchesClass;
  });

  return (
    <Layout>
       {/* Background logo image */}
      <img
        src={logo}
        alt="Kindred Kids Compass Logo"
        aria-hidden="true"
        className="pointer-events-none select-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
        style={{
          width: "50vw",
          maxWidth: 900,
          minWidth: 300,
          zIndex: 0,
        }}
      />
      <PageHeader 
        title="Students" 
        description="Manage students and their information" 
      />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {mockClasses.map(cls => (
                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button asChild className="w-full sm:w-auto">
          <Link to="/admin/students/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Student
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const studentClass = mockClasses.find(c => c.id === student.classId);
          
          return (
            <StudentCard
              key={student.id}
              student={{
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                avatar: student.avatar,
                classId: student.classId,
                dateOfBirth: student.dateOfBirth,
                guardianName: student.guardianName,
                guardianContact: student.guardianContact,
                joinDate: format(new Date(student.joinDate), "MMM d, yyyy")
              }}
              href={`/student/${student.id}`}
            />
          );
        })}
        
        {filteredStudents.length === 0 && (
          <div className="col-span-full flex justify-center p-8 text-muted-foreground">
            No students found.
          </div>
        )}
      </div>
    </Layout>
  );
}

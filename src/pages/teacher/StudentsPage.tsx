
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StudentCard } from "@/components/cards/StudentCard";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { getPrimaryClassForTeacher, getStudentsByClassId } from "@/lib/mock-data";
import { Search, Plus, FileEdit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { StudentFormSheet } from "@/components/forms/StudentFormSheet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [activeView, setActiveView] = useState("grid");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const teacherClass = getPrimaryClassForTeacher(user?.id, user?.churchId);
  const teacherClassId = teacherClass?.id || "";
  
  // Get all students in the teacher's class
  const classStudents = getStudentsByClassId(teacherClassId, user?.churchId);
  
  const filteredStudents = classStudents.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleEditStudent = (student) => {
    setEditingStudent(student);
  };

  const handleCloseForm = () => {
    setIsAddStudentOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    // In a real app, this would make an API call to delete the student
    toast({
      title: "Student Deleted",
      description: `${studentName} has been removed from your class.`,
    });
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Students" 
        description="Manage and view all students in your class"
      />
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value={teacherClassId}>{teacherClass?.name || "Preschool Class"}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setIsAddStudentOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Class Overview: {teacherClass?.name || "Preschool Class"}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Total Students</div>
              <div className="text-2xl font-semibold">{classStudents.length}</div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Boys</div>
              <div className="text-2xl font-semibold">
                {classStudents.filter(s => s.gender === 'male').length || 0}
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Girls</div>
              <div className="text-2xl font-semibold">
                {classStudents.filter(s => s.gender === 'female').length || 0}
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Average Age</div>
              <div className="text-2xl font-semibold">
                {Math.round(
                  classStudents.reduce((acc, s) => acc + (new Date().getFullYear() - new Date(s.dateOfBirth).getFullYear()), 0) / 
                  (classStudents.length || 1)
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="grid" className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Student List</h2>
          <TabsList>
            <TabsTrigger value="grid" onClick={() => setActiveView("grid")}>Grid</TabsTrigger>
            <TabsTrigger value="list" onClick={() => setActiveView("list")}>List</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="grid" className="mt-6">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No students found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudents.map(student => (
                <StudentCard 
                  key={student.id} 
                  student={student}
                  classInfo={{
                    id: teacherClassId,
                    name: teacherClass?.name || "Preschool Class"
                  }}
                  onEdit={() => handleEditStudent(student)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No students found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Guardian</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.firstName} ${student.lastName}`}
                              alt={`${student.firstName} ${student.lastName}`}
                            />
                            <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
                          </Avatar>
                          <span>{student.firstName} {student.lastName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()}</TableCell>
                      <TableCell>{student.guardianName}</TableCell>
                      <TableCell>{student.guardianContact}</TableCell>
                       <TableCell>
                         <div className="flex gap-2">
                           <Button variant="ghost" size="sm" asChild>
                             <Link to={`/student/${student.id}`}>View</Link>
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="sm"
                             onClick={() => handleEditStudent(student)}
                           >
                             <FileEdit className="h-4 w-4 mr-1" />
                             Edit
                           </Button>
                           <AlertDialog>
                             <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                 <Trash2 className="h-4 w-4 mr-1" />
                                 Delete
                               </Button>
                             </AlertDialogTrigger>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Delete Student</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   Are you sure you want to remove {student.firstName} {student.lastName} from your class? This action cannot be undone.
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
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <StudentFormSheet 
        isOpen={isAddStudentOpen || editingStudent !== null} 
        onClose={handleCloseForm}
        student={editingStudent}
        classId={teacherClassId}
      />
    </Layout>
  );
}

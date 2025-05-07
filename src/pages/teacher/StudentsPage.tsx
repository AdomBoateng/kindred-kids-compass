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
import { getStudentsByClassId, mockClasses } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  
  // For demo, assume teacher with ID 2 is assigned to class with ID 1 (Preschool Class)
  const teacherClassId = "1";
  const teacherClass = mockClasses.find(c => c.id === teacherClassId);
  
  // Get all students in the teacher's class
  const classStudents = getStudentsByClassId(teacherClassId);
  
  const filteredStudents = classStudents.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  
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
                {classStudents.filter(s => s.gender === 'male').length}
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Girls</div>
              <div className="text-2xl font-semibold">
                {classStudents.filter(s => s.gender === 'female').length}
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
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      
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
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/student/${student.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </TabsContent>
    </Layout>
  );
}

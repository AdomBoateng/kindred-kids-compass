import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { calculateAge } from "@/lib/date-utils";
import { ArrowLeft, Calendar, Activity, ClipboardList, FileEdit } from "lucide-react";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { StudentFormSheet } from "@/components/forms/StudentFormSheet";
import { useAuth } from "@/context/AuthContext";
import { useChurchScope } from "@/hooks/use-church-scope";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { user } = useAuth();
  const { students, classes } = useChurchScope();
  
  const student = students.find((s) => s.id === id);
  
  if (!student) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
          <p className="text-muted-foreground mb-6">The student you are looking for doesn't exist.</p>
          <Button asChild>
            <Link to={user?.role === 'admin' ? "/admin/students" : "/teacher/students"}>
              Back to Students
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const studentClass = classes.find((c) => c.id === student.classId);
  const age = calculateAge(student.dateOfBirth);
  const fullName = `${student.firstName} ${student.lastName}`;
  
  // Mock attendance data
  const attendanceData = [
    { date: "Apr 2", rate: student.id === "1" ? 100 : 0, students: 1 },
    { date: "Apr 9", rate: 100, students: 1 },
    { date: "Apr 16", rate: student.id === "3" ? 0 : 100, students: 1 },
    { date: "Apr 23", rate: 100, students: 1 },
    { date: "Apr 30", rate: student.id === "2" ? 0 : 100, students: 1 },
    { date: "May 7", rate: 100, students: 1 },
  ];
  
  // Mock performance data
  const recentPerformance = [
    { date: "May 7, 2023", type: "Bible Quiz", score: 90 },
    { date: "Apr 30, 2023", type: "Memory Verse", score: 85 },
    { date: "Apr 23, 2023", type: "Bible Quiz", score: 95 },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <Link 
          to={user?.role === 'admin' ? "/admin/students" : "/teacher/students"} 
          className="text-muted-foreground hover:text-foreground flex items-center text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Students List
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div className="flex-shrink-0 flex justify-center">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage 
              src={student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`} 
              alt={fullName} 
            />
            <AvatarFallback className="text-2xl">
              {student.firstName[0]}{student.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-grow text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold">{fullName}</h1>
            <Button 
              variant="outline" 
              size="sm"
              className="sm:ml-4"
              onClick={() => setIsEditFormOpen(true)}
            >
              <FileEdit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          </div>
          <p className="text-muted-foreground mb-4">{studentClass?.name || "Unassigned"} • {age} years old</p>
          
          {/* Only show teacher-specific actions if user is a teacher */}
          {user?.role === 'teacher' && (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/student/${id}/record-attendance`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Record Attendance
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/student/${id}/add-performance`}>
                  <Activity className="h-4 w-4 mr-2" />
                  Add Performance
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/student/${id}/add-note`}>
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Add Note
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-muted-foreground mb-2">Birthday</h3>
            <p className="text-lg">{new Date(student.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-muted-foreground mb-2">Guardian</h3>
            <p className="text-lg">{student.guardianName}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-muted-foreground mb-2">Contact</h3>
            <p className="text-lg">{student.guardianContact}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {user?.role === 'teacher' && (
            <>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Student Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-medium">{fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{age} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Class</p>
                  <p className="font-medium">{studentClass?.name || "Unassigned"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Guardian Name</p>
                  <p className="font-medium">{student.guardianName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contact Number</p>
                  <p className="font-medium">{student.guardianContact}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-muted-foreground">Allergies</p>
                  <p className="font-medium">{student.allergies || "None"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-muted-foreground">Special Notes</p>
                  <p className="font-medium">{student.notes || "No special notes"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Only show attendance and performance overview for teachers */}
          {user?.role === 'teacher' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Recent Attendance</h3>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/teacher/attendance?student=${id}`}>View All</Link>
                    </Button>
                  </div>
                  
                  <AttendanceChart
                    data={attendanceData}
                    height={200}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Recent Performance</h3>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/teacher/performance?student=${id}`}>View All</Link>
                    </Button>
                  </div>
                  
                  {recentPerformance.map((item, index) => (
                    <div key={index} className="py-2 border-b last:border-b-0">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.type}</span>
                        <span className="font-medium">{item.score}%</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{item.date}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* Only render teacher-specific tabs if user is a teacher */}
        {user?.role === 'teacher' && (
          <>
            <TabsContent value="attendance">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Attendance History</h3>
                  <AttendanceChart
                    data={attendanceData}
                    title="6-Week Attendance"
                    showLegend={false}
                  />
                  
                  <div className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Recorded By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>May 7, 2023</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">Present</span>
                          </TableCell>
                          <TableCell>Sarah Johnson</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>April 30, 2023</TableCell>
                          <TableCell>
                            <span className={student.id === "2" ? 
                              "bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs" : 
                              "bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs"}>
                              {student.id === "2" ? "Absent" : "Present"}
                            </span>
                          </TableCell>
                          <TableCell>Sarah Johnson</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>April 23, 2023</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">Present</span>
                          </TableCell>
                          <TableCell>Sarah Johnson</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Performance History</h3>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentPerformance.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.score}%</TableCell>
                          <TableCell>{index === 0 ? "Excellent understanding of the material" : "Good participation"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="flex justify-end mt-6">
                    <Button>
                      <Activity className="h-4 w-4 mr-2" />
                      Add Performance Record
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Teacher Notes</h3>
                  
                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Sarah Johnson</span>
                      <span className="text-sm text-muted-foreground">May 1, 2023</span>
                    </div>
                    <p>
                      {student.firstName} showed great enthusiasm during our Bible story time. 
                      Really engaged with questions and remembered details from previous lessons.
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Sarah Johnson</span>
                      <span className="text-sm text-muted-foreground">April 15, 2023</span>
                    </div>
                    <p>
                      Parent mentioned that {student.firstName} has been practicing memory verses at home.
                      Very proud of their progress!
                    </p>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button>
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
      
      <StudentFormSheet 
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        student={student}
        classId={student.classId}
      />
    </Layout>
  );
}

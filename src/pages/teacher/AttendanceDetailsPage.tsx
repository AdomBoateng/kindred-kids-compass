import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays } from "date-fns";
import { ArrowLeft, Calendar, Users, Check, X } from "lucide-react";
import { getPrimaryClassForTeacher, getStudentsByClassId } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";

// Mock detailed attendance data
const mockDetailedAttendance = [
  {
    date: new Date(),
    students: [
      { id: "1", name: "Emma Johnson", status: "present" },
      { id: "2", name: "Liam Brown", status: "absent", reason: "Sick" },
      { id: "3", name: "Olivia Davis", status: "present" },
      { id: "4", name: "Noah Wilson", status: "present" },
      { id: "5", name: "Ava Miller", status: "late" },
    ],
    totalPresent: 3,
    totalLate: 1,
    totalAbsent: 1,
    recordedBy: "Sarah Johnson",
    notes: "Regular Sunday morning service"
  },
  {
    date: subDays(new Date(), 7),
    students: [
      { id: "1", name: "Emma Johnson", status: "present" },
      { id: "2", name: "Liam Brown", status: "present" },
      { id: "3", name: "Olivia Davis", status: "present" },
      { id: "4", name: "Noah Wilson", status: "present" },
      { id: "5", name: "Ava Miller", status: "present" },
    ],
    totalPresent: 5,
    totalLate: 0,
    totalAbsent: 0,
    recordedBy: "Sarah Johnson",
    notes: "Perfect attendance today!"
  },
  {
    date: subDays(new Date(), 14),
    students: [
      { id: "1", name: "Emma Johnson", status: "present" },
      { id: "2", name: "Liam Brown", status: "present" },
      { id: "3", name: "Olivia Davis", status: "absent", reason: "Family trip" },
      { id: "4", name: "Noah Wilson", status: "present" },
      { id: "5", name: "Ava Miller", status: "late" },
    ],
    totalPresent: 3,
    totalLate: 1,
    totalAbsent: 1,
    recordedBy: "Sarah Johnson",
    notes: "Good participation despite lower attendance"
  },
];

export default function AttendanceDetailsPage() {
  const { user } = useAuth();
  const { date } = useParams();
  const [selectedDate, setSelectedDate] = useState("latest");
  
  // For demo, assume teacher with ID 2 is assigned to class with ID 1 (Preschool Class)
  const teacherClass = getPrimaryClassForTeacher(user?.id, user?.churchId);
  const teacherClassId = teacherClass?.id || "";
  const classStudents = getStudentsByClassId(teacherClassId, user?.churchId);
  
  // Get attendance record based on selected date
  const attendanceRecord = selectedDate === "latest" 
    ? mockDetailedAttendance[0] 
    : mockDetailedAttendance.find((_, index) => index.toString() === selectedDate) || mockDetailedAttendance[0];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <Check className="h-4 w-4 text-green-600" />;
      case "absent":
        return <X className="h-4 w-4 text-red-600" />;
      case "late":
        return <Calendar className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-md text-xs font-medium";
    switch (status) {
      case "present":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "absent":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "late":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return baseClasses;
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/teacher/attendance" className="text-muted-foreground hover:text-foreground flex items-center text-sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Attendance Overview
        </Link>
      </div>

      <PageHeader 
        title="Attendance Details" 
        description={`Detailed attendance record for ${teacherClass?.name || "Preschool Class"}`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Date</div>
            <div className="text-lg font-medium">{format(attendanceRecord.date, 'MMM d, yyyy')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Present</div>
            <div className="text-2xl font-medium text-green-600">{attendanceRecord.totalPresent}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Late</div>
            <div className="text-2xl font-medium text-yellow-600">{attendanceRecord.totalLate}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Absent</div>
            <div className="text-2xl font-medium text-red-600">{attendanceRecord.totalAbsent}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Attendance</CardTitle>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest Record</SelectItem>
                    <SelectItem value="0">Today</SelectItem>
                    <SelectItem value="1">Last Week</SelectItem>
                    <SelectItem value="2">2 Weeks Ago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecord.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`}
                              alt={student.name}
                            />
                            <AvatarFallback>
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(student.status)}
                          <span className={getStatusBadge(student.status)}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.reason || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Record Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Recorded By</div>
                <div className="font-medium">{attendanceRecord.recordedBy}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Total Students</div>
                <div className="font-medium">{attendanceRecord.students.length}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Attendance Rate</div>
                <div className="font-medium">
                  {Math.round((attendanceRecord.totalPresent / attendanceRecord.students.length) * 100)}%
                </div>
              </div>
              
              {attendanceRecord.notes && (
                <div>
                  <div className="text-sm text-muted-foreground">Notes</div>
                  <div className="text-sm bg-muted/50 p-2 rounded-md">
                    {attendanceRecord.notes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

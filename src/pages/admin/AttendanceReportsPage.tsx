
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { mockClasses, mockStudents } from "@/lib/mock-data";
import { CalendarIcon, FileText, Printer } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import logo from "@/assets/logo.png";

// Sample attendance data
const attendanceData = [
  { 
    date: "2023-10-15", 
    classId: "1", 
    students: [
      { studentId: "1", present: true },
      { studentId: "2", present: true },
      { studentId: "3", present: false },
    ]
  },
  { 
    date: "2023-10-22", 
    classId: "1", 
    students: [
      { studentId: "1", present: true },
      { studentId: "2", present: false },
      { studentId: "3", present: true },
    ]
  },
  { 
    date: "2023-10-29", 
    classId: "1", 
    students: [
      { studentId: "1", present: true },
      { studentId: "2", present: true },
      { studentId: "3", present: true },
    ]
  },
];

// Sample attendance chart data
const chartData = [
  { date: "Sep", rate: 78, students: 45 },
  { date: "Oct", rate: 82, students: 48 },
  { date: "Nov", rate: 85, students: 50 },
  { date: "Dec", rate: 80, students: 47 },
  { date: "Jan", rate: 88, students: 52 },
  { date: "Feb", rate: 92, students: 54 },
];

export default function AttendanceReportsPage() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Get student name by ID
  const getStudentName = (id: string) => {
    const student = mockStudents.find(s => s.id === id);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown";
  };

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
          marginTop: "10vh",
          maxWidth: 900,
          minWidth: 300,
          zIndex: 0,
        }}
      />
      <PageHeader 
        title="Attendance Reports" 
        description="View attendance records and analytics" 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Attendance Records</CardTitle>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Select date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={setDateRange as any}
                        numberOfMonths={2}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Classes</SelectItem>
                      {mockClasses.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Attendance records for selected period</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.flatMap(record => 
                    record.students.map((student, index) => {
                      const className = mockClasses.find(c => c.id === record.classId)?.name || "Unknown";
                      
                      // Skip if filtering by class and doesn't match
                      if (selectedClass && record.classId !== selectedClass) {
                        return null;
                      }
                      
                      return (
                        <TableRow key={`${record.date}-${student.studentId}-${index}`}>
                          {index === 0 && (
                            <TableCell rowSpan={record.students.length}>
                              {format(new Date(record.date), "MMMM d, yyyy")}
                            </TableCell>
                          )}
                          {index === 0 && (
                            <TableCell rowSpan={record.students.length}>{className}</TableCell>
                          )}
                          <TableCell>{getStudentName(student.studentId)}</TableCell>
                          <TableCell>
                            <Badge variant={student.present ? "default" : "destructive"}>
                              {student.present ? "Present" : "Absent"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    }).filter(Boolean)
                  )}
                  
                  {attendanceData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No attendance records found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="mr-2">
                  <FileText className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Total Classes</p>
                  <p className="text-2xl font-bold">{attendanceData.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Average Attendance Rate</p>
                  <p className="text-2xl font-bold">83%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Perfect Attendance</p>
                  <p className="text-2xl font-bold">2 Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceChart data={chartData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

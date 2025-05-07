
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Calendar } from "lucide-react";
import { mockClasses, getStudentsByClassId } from "@/lib/mock-data";
import { AttendanceChart } from "@/components/charts/AttendanceChart";

// Mock attendance data for the class
const attendanceData = [
  { date: "Apr 2", rate: 85, students: 12 },
  { date: "Apr 9", rate: 92, students: 13 },
  { date: "Apr 16", rate: 78, students: 11 },
  { date: "Apr 23", rate: 88, students: 12 },
  { date: "Apr 30", rate: 95, students: 14 },
  { date: "May 7", rate: 90, students: 13 },
];

// Mock attendance history
const mockAttendanceHistory = [
  {
    date: new Date(),
    presentCount: 13,
    totalCount: 14,
    rate: 92.86,
    recordedBy: "Sarah Johnson",
  },
  {
    date: subDays(new Date(), 7),
    presentCount: 14,
    totalCount: 14,
    rate: 100,
    recordedBy: "Sarah Johnson",
  },
  {
    date: subDays(new Date(), 14),
    presentCount: 12,
    totalCount: 14,
    rate: 85.71,
    recordedBy: "Sarah Johnson",
  },
  {
    date: subDays(new Date(), 21),
    presentCount: 13,
    totalCount: 14,
    rate: 92.86,
    recordedBy: "Sarah Johnson",
  }
];

export default function AttendancePage() {
  const [periodFilter, setPeriodFilter] = useState("6weeks");
  
  // For demo, assume teacher with ID 2 is assigned to class with ID 1 (Preschool Class)
  const teacherClassId = "1";
  const teacherClass = mockClasses.find(c => c.id === teacherClassId);
  const classStudents = getStudentsByClassId(teacherClassId);
  
  // Calculate average attendance rate
  const averageAttendance = Math.round(
    attendanceData.reduce((sum, item) => sum + item.rate, 0) / attendanceData.length
  );

  return (
    <Layout>
      <PageHeader 
        title="Attendance" 
        description="Track and manage class attendance"
      >
        <Button asChild>
          <Link to="/teacher/attendance/new">
            <Calendar className="h-4 w-4 mr-2" />
            Record Attendance
          </Link>
        </Button>
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Class</div>
            <div className="text-2xl font-medium">{teacherClass?.name || "Preschool Class"}</div>
            <div className="text-sm text-muted-foreground mt-2">Total Students</div>
            <div className="text-xl">{classStudents.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Last Service</div>
            <div className="text-2xl font-medium">{attendanceData[attendanceData.length - 1].rate}%</div>
            <div className="text-sm text-muted-foreground mt-2">Students Present</div>
            <div className="text-xl">{attendanceData[attendanceData.length - 1].students} / {classStudents.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">6-Week Average</div>
            <div className="text-2xl font-medium">{averageAttendance}%</div>
            <div className="text-sm text-muted-foreground mt-2">Period</div>
            <div className="text-xl">Apr 2 - May 7</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendance Trends</CardTitle>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6weeks">Last 6 Weeks</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Class attendance percentage over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceChart
                data={attendanceData}
                showLegend={true}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Insights</CardTitle>
              <CardDescription>
                Key statistics for your class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Most Recent</div>
                  <div className="text-lg font-medium">{attendanceData[attendanceData.length - 1].rate}%</div>
                  <div className="text-xs text-muted-foreground">
                    {attendanceData[attendanceData.length - 1].date}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Highest Attendance</div>
                  <div className="text-lg font-medium">
                    {Math.max(...attendanceData.map(item => item.rate))}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {attendanceData.find(item => item.rate === Math.max(...attendanceData.map(item => item.rate)))?.date}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Lowest Attendance</div>
                  <div className="text-lg font-medium">
                    {Math.min(...attendanceData.map(item => item.rate))}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {attendanceData.find(item => item.rate === Math.min(...attendanceData.map(item => item.rate)))?.date}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Perfect Attendance Students</div>
                  <div className="text-lg font-medium">8</div>
                  <div className="text-xs text-muted-foreground">
                    During the last 6 weeks
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            Record of past class attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Recorded By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAttendanceHistory.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{format(record.date, 'MMM d, yyyy')}</TableCell>
                  <TableCell>{record.presentCount}</TableCell>
                  <TableCell>{record.totalCount}</TableCell>
                  <TableCell>{record.rate.toFixed(1)}%</TableCell>
                  <TableCell>{record.recordedBy}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
}

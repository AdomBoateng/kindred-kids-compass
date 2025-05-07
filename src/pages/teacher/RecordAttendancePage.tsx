
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { getStudentsByClassId, mockClasses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function RecordAttendancePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  // For demo, assume teacher with ID 2 is assigned to class with ID 1 (Preschool Class)
  const teacherClassId = "1";
  const teacherClass = mockClasses.find(c => c.id === teacherClassId);
  const classStudents = getStudentsByClassId(teacherClassId);
  
  const handleCheckboxChange = (studentId: string, isChecked: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: isChecked
    }));
  };
  
  const handleSubmit = () => {
    // In a real app, this would save to the database
    console.log('Attendance saved for:', format(date, 'yyyy-MM-dd'));
    console.log('Attendance data:', attendance);
    
    toast({
      title: "Attendance Recorded",
      description: `Successfully saved attendance for ${format(date, 'MMMM d, yyyy')}`,
    });
  };
  
  const presentCount = Object.values(attendance).filter(v => v).length;
  const attendanceRate = classStudents.length > 0 
    ? Math.round((presentCount / classStudents.length) * 100) 
    : 0;

  return (
    <Layout>
      <PageHeader 
        title="Record Attendance" 
        description="Mark students present or absent for today's service"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-medium mb-2">Class</div>
            <div>{teacherClass?.name || "Preschool Class"}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-medium mb-2">Date</div>
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-medium mb-2">Students</div>
            <div>{classStudents.length} total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-medium mb-2">Present</div>
            <div>{presentCount} ({attendanceRate}%)</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead className="w-24 text-center">Present</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map(student => {
                const fullName = `${student.firstName} ${student.lastName}`;
                return (
                  <TableRow key={student.id}>
                    <TableCell>{fullName}</TableCell>
                    <TableCell>{new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={attendance[student.id] || false}
                        onCheckedChange={(checked) => {
                          handleCheckboxChange(student.id, Boolean(checked));
                        }}
                        className="mx-auto"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit}>Save Attendance</Button>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}

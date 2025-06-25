
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { mockStudents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function RecordStudentAttendancePage() {
  const { id } = useParams<{ id: string }>();
  const [date, setDate] = useState<Date>(new Date());
  const [isPresent, setIsPresent] = useState(false);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  
  const student = mockStudents.find(s => s.id === id);
  
  if (!student) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
          <p className="text-muted-foreground mb-6">The student you are looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/teacher/students">Back to Students</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const fullName = `${student.firstName} ${student.lastName}`;
  
  const handleSubmit = () => {
    console.log('Attendance recorded for:', fullName);
    console.log('Date:', format(date, 'yyyy-MM-dd'));
    console.log('Present:', isPresent);
    console.log('Notes:', notes);
    
    toast({
      title: "Attendance Recorded",
      description: `Successfully recorded attendance for ${fullName} on ${format(date, 'MMMM d, yyyy')}`,
    });
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link 
          to={`/student/${id}`} 
          className="text-muted-foreground hover:text-foreground flex items-center text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Student Profile
        </Link>
      </div>
      
      <PageHeader 
        title="Record Attendance" 
        description={`Mark attendance for ${fullName}`}
      />
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage 
                  src={student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`}
                  alt={fullName}
                />
                <AvatarFallback className="text-lg">
                  {student.firstName[0]}{student.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{fullName}</h2>
                <p className="text-muted-foreground">
                  {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()} years old
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="present"
                  checked={isPresent}
                  onCheckedChange={(checked) => setIsPresent(Boolean(checked))}
                />
                <label 
                  htmlFor="present" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as Present
                </label>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
                <Textarea 
                  placeholder="Add any notes about attendance..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link to={`/student/${id}`}>Cancel</Link>
                </Button>
                <Button onClick={handleSubmit}>Save Attendance</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

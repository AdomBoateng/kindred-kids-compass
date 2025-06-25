
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { mockStudents } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

const performanceCategories = ["Bible Quiz", "Memory Verse", "Participation", "Craft Project"];

export default function AddStudentPerformancePage() {
  const { id } = useParams<{ id: string }>();
  const [performanceType, setPerformanceType] = useState("");
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [score, setScore] = useState("");
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
  
  const handleScoreChange = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;
    setScore(value);
  };
  
  const handleSubmit = () => {
    if (!performanceType || !score) {
      toast({
        title: "Missing Information",
        description: "Please select an assessment type and enter a score",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Performance recorded for:', fullName);
    console.log('Date:', date);
    console.log('Type:', performanceType);
    console.log('Score:', score);
    console.log('Notes:', notes);
    
    toast({
      title: "Performance Recorded",
      description: `Successfully added ${performanceType} score for ${fullName}`,
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
        title="Add Performance" 
        description={`Record performance score for ${fullName}`}
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
                <label className="text-sm font-medium mb-2 block">Assessment Type</label>
                <Select value={performanceType} onValueChange={setPerformanceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {performanceCategories.map(category => (
                      <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Score (%)</label>
                <Input 
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter score (0-100)"
                  value={score}
                  onChange={(e) => handleScoreChange(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
                <Textarea 
                  placeholder="Add any notes about the performance..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link to={`/student/${id}`}>Cancel</Link>
                </Button>
                <Button onClick={handleSubmit}>Save Performance</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { getStudentsByClassId, mockClasses } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";

const performanceCategories = ["Bible Quiz", "Memory Verse", "Participation", "Craft Project"];

export default function RecordPerformancePage() {
  const [performanceType, setPerformanceType] = useState("");
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [scores, setScores] = useState<Record<string, { score: number, notes: string }>>({});
  const [description, setDescription] = useState("");
  
  const { toast } = useToast();
  
  // For demo, assume teacher with ID 2 is assigned to class with ID 1 (Preschool Class)
  const teacherClassId = "1";
  const teacherClass = mockClasses.find(c => c.id === teacherClassId);
  const classStudents = getStudentsByClassId(teacherClassId);
  
  const handleScoreChange = (studentId: string, value: string) => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) return;
    
    if (numValue < 0) return;
    if (numValue > 100) return;
    
    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: numValue
      }
    }));
  };
  
  const handleNotesChange = (studentId: string, notes: string) => {
    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes
      }
    }));
  };
  
  const handleSubmit = () => {
    if (!performanceType) {
      toast({
        title: "Missing Information",
        description: "Please select an assessment type",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save to the database
    console.log('Performance saved for:', date);
    console.log('Type:', performanceType);
    console.log('Description:', description);
    console.log('Scores data:', scores);
    
    toast({
      title: "Performance Recorded",
      description: `Successfully saved ${performanceType} scores for ${format(new Date(date), 'MMMM d, yyyy')}`,
    });
  };
  
  // Calculate average score
  const scoreValues = Object.values(scores).map(s => s.score);
  const averageScore = scoreValues.length > 0
    ? scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length
    : 0;
  
  return (
    <Layout>
      <div className="mb-6">
        <Link to="/teacher/performance" className="text-muted-foreground hover:text-foreground flex items-center text-sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Performance
        </Link>
      </div>
      
      <PageHeader 
        title="Record Performance" 
        description={`Add assessment scores for students in ${teacherClass?.name || "your class"}`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
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
                <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                <Textarea 
                  placeholder="Enter details about this assessment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Quick Stats</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Class</span>
                <span className="font-medium">{teacherClass?.name || "Preschool Class"}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Students</span>
                <span className="font-medium">{classStudents.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scores Entered</span>
                <span className="font-medium">{Object.keys(scores).length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Score</span>
                <span className="font-medium">{averageScore.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Enter Student Scores</h3>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Score (%)</TableHead>
                <TableHead>Notes (Optional)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map(student => {
                const fullName = `${student.firstName} ${student.lastName}`;
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`}
                            alt={fullName}
                          />
                          <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <span>{fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        value={scores[student.id]?.score || ""}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        placeholder="Add notes..."
                        value={scores[student.id]?.notes || ""}
                        onChange={(e) => handleNotesChange(student.id, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link to="/teacher/performance">Cancel</Link>
        </Button>
        <Button onClick={handleSubmit}>Save Assessment</Button>
      </div>
    </Layout>
  );
}

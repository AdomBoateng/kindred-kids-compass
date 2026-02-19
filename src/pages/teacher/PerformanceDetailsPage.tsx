
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
import { ArrowLeft, Trophy, Target, TrendingUp } from "lucide-react";
import { getPrimaryClassForTeacher, getStudentsByClassId } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";

// Mock detailed performance data
const mockDetailedPerformance = [
  {
    id: "1",
    date: "May 7, 2023",
    type: "Bible Quiz",
    topic: "David and Goliath",
    students: [
      { id: "1", name: "Emma Johnson", score: 90, notes: "Excellent understanding of the story" },
      { id: "2", name: "Liam Brown", score: 85, notes: "Good participation, needs work on details" },
      { id: "3", name: "Olivia Davis", score: 95, notes: "Outstanding performance, very engaged" },
      { id: "4", name: "Noah Wilson", score: 80, notes: "Solid understanding, quiet but attentive" },
      { id: "5", name: "Ava Miller", score: 88, notes: "Great improvement from last week" },
    ],
    averageScore: 87.6,
    highestScore: 95,
    lowestScore: 80,
    recordedBy: "Sarah Johnson",
    notes: "Students showed great engagement with the story. Discussion was lively and thoughtful."
  },
  {
    id: "2",
    date: "Apr 30, 2023",
    type: "Memory Verse",
    topic: "Psalm 23:1",
    students: [
      { id: "1", name: "Emma Johnson", score: 100, notes: "Perfect recitation with expression" },
      { id: "2", name: "Liam Brown", score: 90, notes: "Minor hesitation but got it right" },
      { id: "3", name: "Olivia Davis", score: 80, notes: "Needed some prompting" },
      { id: "4", name: "Noah Wilson", score: 85, notes: "Slow but accurate" },
      { id: "5", name: "Ava Miller", score: 95, notes: "Beautiful delivery with feeling" },
    ],
    averageScore: 90,
    highestScore: 100,
    lowestScore: 80,
    recordedBy: "Sarah Johnson",
    notes: "Memory verse work is paying off. Most students are gaining confidence."
  },
  {
    id: "3",
    date: "Apr 23, 2023",
    type: "Bible Quiz",
    topic: "Noah's Ark",
    students: [
      { id: "1", name: "Emma Johnson", score: 85, notes: "Good grasp of main points" },
      { id: "2", name: "Liam Brown", score: 90, notes: "Surprised everyone with detailed answers" },
      { id: "3", name: "Olivia Davis", score: 80, notes: "Distracted today but tried hard" },
      { id: "4", name: "Noah Wilson", score: 75, notes: "Struggling with sequencing events" },
      { id: "5", name: "Ava Miller", score: 95, notes: "Exceptional recall and understanding" },
    ],
    averageScore: 85,
    highestScore: 95,
    lowestScore: 75,
    recordedBy: "Sarah Johnson",
    notes: "Mixed results today. Some students really shined while others seemed off their game."
  },
];

export default function PerformanceDetailsPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [selectedRecord, setSelectedRecord] = useState(id || "1");
  
  // For demo, assume teacher with ID 2 is assigned to class with ID 1 (Preschool Class)
  const teacherClass = getPrimaryClassForTeacher(user?.id, user?.churchId);
  const teacherClassId = teacherClass?.id || "";
  const classStudents = getStudentsByClassId(teacherClassId, user?.churchId);
  
  // Get performance record based on selected ID
  const performanceRecord = mockDetailedPerformance.find(p => p.id === selectedRecord) || mockDetailedPerformance[0];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    const baseClasses = "px-2 py-1 rounded-md text-xs font-medium";
    if (score >= 90) return `${baseClasses} bg-green-100 text-green-800`;
    if (score >= 80) return `${baseClasses} bg-yellow-100 text-yellow-800`;
    return `${baseClasses} bg-red-100 text-red-800`;
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/teacher/performance" className="text-muted-foreground hover:text-foreground flex items-center text-sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Performance Overview
        </Link>
      </div>

      <PageHeader 
        title="Performance Details" 
        description={`Detailed performance record for ${teacherClass?.name || "Preschool Class"}`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Assessment</div>
            </div>
            <div className="text-lg font-medium">{performanceRecord.type}</div>
            <div className="text-sm text-muted-foreground">{performanceRecord.topic}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
            <div className="text-2xl font-medium">{performanceRecord.averageScore}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Highest Score</div>
            </div>
            <div className="text-2xl font-medium text-green-600">{performanceRecord.highestScore}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Lowest Score</div>
            <div className="text-2xl font-medium text-red-600">{performanceRecord.lowestScore}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Scores</CardTitle>
                <Select value={selectedRecord} onValueChange={setSelectedRecord}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select record" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDetailedPerformance.map((record) => (
                      <SelectItem key={record.id} value={record.id}>
                        {record.date} - {record.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceRecord.students.map((student) => (
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
                        <span className={`text-lg font-medium ${getScoreColor(student.score)}`}>
                          {student.score}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={getScoreBadge(student.score)}>
                          {student.score >= 90 ? 'Excellent' : student.score >= 80 ? 'Good' : 'Needs Work'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{student.notes}</span>
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
              <CardTitle>Assessment Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Date</div>
                <div className="font-medium">{performanceRecord.date}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Type</div>
                <div className="font-medium">{performanceRecord.type}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Topic</div>
                <div className="font-medium">{performanceRecord.topic}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Recorded By</div>
                <div className="font-medium">{performanceRecord.recordedBy}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Students Assessed</div>
                <div className="font-medium">{performanceRecord.students.length}</div>
              </div>
              
              {performanceRecord.notes && (
                <div>
                  <div className="text-sm text-muted-foreground">Teacher Notes</div>
                  <div className="text-sm bg-muted/50 p-3 rounded-md">
                    {performanceRecord.notes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Excellent (90%+)</span>
                <span className="font-medium">
                  {performanceRecord.students.filter(s => s.score >= 90).length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Good (80-89%)</span>
                <span className="font-medium">
                  {performanceRecord.students.filter(s => s.score >= 80 && s.score < 90).length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Needs Work (&lt;80%)</span>
                <span className="font-medium">
                  {performanceRecord.students.filter(s => s.score < 80).length}
                </span>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pass Rate</span>
                  <span className="font-medium">
                    {Math.round((performanceRecord.students.filter(s => s.score >= 80).length / performanceRecord.students.length) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

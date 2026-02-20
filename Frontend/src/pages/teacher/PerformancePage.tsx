import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Activity, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getPrimaryClassForTeacher, getStudentsByClassId } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";
import { calculateAge } from "@/lib/date-utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Sample performance data
const performanceCategories = ["Bible Quiz", "Memory Verse", "Participation", "Craft Project"];

const mockPerformanceData = [
  {
    date: "May 7, 2023",
    type: "Bible Quiz",
    students: [
      { id: "1", score: 90 },
      { id: "2", score: 85 },
      { id: "3", score: 95 },
      { id: "4", score: 80 },
      { id: "5", score: 88 },
    ],
    averageScore: 87.6
  },
  {
    date: "Apr 30, 2023",
    type: "Memory Verse",
    students: [
      { id: "1", score: 100 },
      { id: "2", score: 90 },
      { id: "3", score: 80 },
      { id: "4", score: 85 },
      { id: "5", score: 95 },
    ],
    averageScore: 90
  },
  {
    date: "Apr 23, 2023",
    type: "Bible Quiz",
    students: [
      { id: "1", score: 85 },
      { id: "2", score: 90 },
      { id: "3", score: 80 },
      { id: "4", score: 75 },
      { id: "5", score: 95 },
    ],
    averageScore: 85
  },
];

export default function PerformancePage() {
  const { user } = useAuth();
  const [periodFilter, setPeriodFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();
  
  // For demo, assume teacher with ID 2 is assigned to class with ID 1 (Preschool Class)
  const teacherClass = getPrimaryClassForTeacher(user?.id, user?.churchId);
  const teacherClassId = teacherClass?.id || "";
  const classStudents = getStudentsByClassId(teacherClassId, user?.churchId);
  
  // Calculate student performance stats
  const studentPerformance = classStudents.map(student => {
    // Find all scores for this student
    const scores = mockPerformanceData.flatMap(p => 
      p.students.filter(s => s.id === student.id).map(s => s.score)
    );
    
    // Calculate average score
    const averageScore = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;
    
    // Find highest score
    const highestScore = scores.length > 0
      ? Math.max(...scores)
      : 0;
    
    return {
      student,
      averageScore,
      highestScore,
      totalEntries: scores.length
    };
  });
  
  // Sort students by average score (highest first)
  studentPerformance.sort((a, b) => b.averageScore - a.averageScore);

  const handleDeletePerformance = (date: string, type: string) => {
    // In a real app, this would make an API call to delete the performance record
    toast({
      title: "Performance Record Deleted",
      description: `${type} assessment from ${date} has been deleted.`,
    });
  };

  return (
    <Layout>
      <PageHeader 
        title="Performance Tracking" 
        description="Track and manage class performance scores"
      >
        <Button asChild className="hover:bg-[#FFC107] hover:text-black transition-colors">
          <Link to="/teacher/performance/new">
            <Activity className="h-4 w-4 mr-2" />
            Record Scores
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
            <div className="text-sm text-muted-foreground">Last Assessment</div>
            <div className="text-2xl font-medium">Bible Quiz</div>
            <div className="text-sm text-muted-foreground mt-2">Average Score</div>
            <div className="text-xl">87.6%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Overall Average</div>
            <div className="text-2xl font-medium">87.5%</div>
            <div className="text-sm text-muted-foreground mt-2">Total Assessments</div>
            <div className="text-xl">3</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Performance Records</CardTitle>
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {performanceCategories.map(category => (
                        <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={periodFilter} onValueChange={setPeriodFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>
                History of class performance assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Average</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPerformanceData.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.students.length}</TableCell>
                      <TableCell>{record.averageScore.toFixed(1)}%</TableCell>
                       <TableCell>
                         <div className="flex gap-2">
                           <Button variant="ghost" size="sm" asChild>
                             <Link to={`/teacher/performance/details/${index + 1}`}>
                               View Details
                             </Link>
                           </Button>
                           <AlertDialog>
                             <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                 <Trash2 className="h-4 w-4 mr-1" />
                                 Delete
                               </Button>
                             </AlertDialogTrigger>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Delete Performance Record</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   Are you sure you want to delete the {record.type} assessment from {record.date}? This action cannot be undone and will remove all student scores.
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
                                 <AlertDialogAction
                                   onClick={() => handleDeletePerformance(record.date, record.type)}
                                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                 >
                                   Delete Record
                                 </AlertDialogAction>
                               </AlertDialogFooter>
                             </AlertDialogContent>
                           </AlertDialog>
                         </div>
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>New Performance Record</CardTitle>
              <CardDescription>
                Record scores for a new assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Assessment Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
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
                    <input 
                      type="date" 
                      defaultValue={new Date().toISOString().split('T')[0]} 
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                
                <Button asChild className="w-full">
                  <Link to="/teacher/performance/new">
                    <Activity className="h-4 w-4 mr-2" />
                    Start New Assessment
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>
                Students with highest average scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentPerformance.slice(0, 5).map((item, index) => (
                  <div key={item.student.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage 
                            src={item.student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.student.firstName} ${item.student.lastName}`}
                            alt={`${item.student.firstName} ${item.student.lastName}`}
                          />
                          <AvatarFallback>{item.student.firstName[0]}{item.student.lastName[0]}</AvatarFallback>
                        </Avatar>
                        {index < 3 && (
                          <div className={`absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs text-white font-medium
                            ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'}`}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{item.student.firstName} {item.student.lastName}</div>
                        <div className="text-xs text-muted-foreground">
                          {calculateAge(item.student.dateOfBirth)} years old
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.averageScore.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">
                        {item.totalEntries} assessments
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 border-t pt-4">
                <Button variant="ghost" asChild className="w-full">
                  <Link to="/teacher/students">View All Students</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
              <CardDescription>
                Assessment statistics summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Assessments</span>
                  <span className="font-medium">{mockPerformanceData.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bible Quizzes</span>
                  <span className="font-medium">
                    {mockPerformanceData.filter(p => p.type === "Bible Quiz").length}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Memory Verses</span>
                  <span className="font-medium">
                    {mockPerformanceData.filter(p => p.type === "Memory Verse").length}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Highest Class Average</span>
                  <span className="font-medium">
                    {Math.max(...mockPerformanceData.map(p => p.averageScore)).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lowest Class Average</span>
                  <span className="font-medium">
                    {Math.min(...mockPerformanceData.map(p => p.averageScore)).toFixed(1)}%
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

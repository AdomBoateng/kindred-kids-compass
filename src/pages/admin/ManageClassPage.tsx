
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockClasses, mockUsers, mockStudents } from "@/lib/mock-data";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Users, UserCheck, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

export default function ManageClassPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  
  const [classData, setClassData] = useState({
    name: "",
    ageGroup: "",
    description: "",
    teacherIds: [] as string[],
    studentIds: [] as string[],
  });

  // Get class data based on ID
  useEffect(() => {
    if (id) {
      const foundClass = mockClasses.find(cls => cls.id === id);
      if (foundClass) {
        setClassData({
          name: foundClass.name,
          ageGroup: foundClass.ageGroup,
          description: foundClass.description || "",
          teacherIds: foundClass.teacherIds,
          studentIds: foundClass.studentIds,
        });
      }
    }
  }, [id]);

  // Get only teachers from users
  const teachers = mockUsers.filter(user => user.role === "teacher");
  const classStudents = mockStudents.filter(student => classData.studentIds.includes(student.id));
  const classTeachers = teachers.filter(teacher => classData.teacherIds.includes(teacher.id));

  const handleTeacherToggle = (teacherId: string) => {
    setClassData(prev => ({
      ...prev,
      teacherIds: prev.teacherIds.includes(teacherId)
        ? prev.teacherIds.filter(id => id !== teacherId)
        : [...prev.teacherIds, teacherId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!classData.name || !classData.ageGroup) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically update the class data
    console.log("Updating class:", classData);
    
    toast({
      title: "Success",
      description: "Class updated successfully!",
    });
    
    navigate("/admin/classes");
  };

  if (!id) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Class not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Background logo image */}
      <img
        src={logo}
        alt="Kindred Kids Compass Logo"
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
        style={{
          width: "30vw",
          maxWidth: 900,
          minWidth: 300,
          zIndex: 0,
        }}
      />
      
      <PageHeader 
        title={`Manage: ${classData.name}`}
        description="Update class information and manage assignments"
      >
        <Button variant="outline" onClick={() => navigate("/admin/classes")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Classes
        </Button>
      </PageHeader>

      <Tabs defaultValue="details" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Class Details
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center">
            <UserCheck className="mr-2 h-4 w-4" />
            Teachers ({classTeachers.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Students ({classStudents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Class Name *</Label>
                    <Input
                      id="name"
                      value={classData.name}
                      onChange={(e) => setClassData({...classData, name: e.target.value})}
                      placeholder="e.g., Preschool Class A"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ageGroup">Age Group *</Label>
                    <Select 
                      value={classData.ageGroup} 
                      onValueChange={(value) => setClassData({...classData, ageGroup: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-3 years">2-3 years</SelectItem>
                        <SelectItem value="3-4 years">3-4 years</SelectItem>
                        <SelectItem value="4-5 years">4-5 years</SelectItem>
                        <SelectItem value="5-6 years">5-6 years</SelectItem>
                        <SelectItem value="Mixed ages">Mixed ages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={classData.description}
                    onChange={(e) => setClassData({...classData, description: e.target.value})}
                    placeholder="Brief description of the class..."
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Assign Teachers</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {teachers.map((teacher) => (
                      <div key={teacher.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`teacher-${teacher.id}`}
                          checked={classData.teacherIds.includes(teacher.id)}
                          onCheckedChange={() => handleTeacherToggle(teacher.id)}
                        />
                        <Label 
                          htmlFor={`teacher-${teacher.id}`}
                          className="cursor-pointer"
                        >
                          {teacher.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classTeachers.length > 0 ? (
                  classTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium">{teacher.name}</h4>
                          <p className="text-sm text-muted-foreground">{teacher.email}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Teacher</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No teachers assigned to this class.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classStudents.length > 0 ? (
                  classStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-medium">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium">{student.firstName} {student.lastName}</h4>
                          <p className="text-sm text-muted-foreground">Guardian: {student.guardianName}</p>
                        </div>
                      </div>
                      <Badge variant="outline">Student</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No students enrolled in this class.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

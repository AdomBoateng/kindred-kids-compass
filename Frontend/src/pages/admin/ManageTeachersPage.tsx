
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Mail, UserCheck, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { useChurchScope } from "@/hooks/use-church-scope";

export default function ManageTeachersPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { teachers, classes, isLoading } = useChurchScope();
  
  // Find the teacher by ID
  const teacher = teachers.find(user => user.id === id);
  
  // Get classes assigned to this teacher
  const assignedClasses = classes.filter(cls => cls.teacherIds.includes(id || ""));
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: teacher?.name || "",
    email: teacher?.email || "",
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading teacher profile...</p>
        </div>
      </Layout>
    );
  }

  if (!teacher) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl font-bold mb-4">Teacher Not Found</h2>
          <Button onClick={() => navigate("/admin/teachers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teachers
          </Button>
        </div>
      </Layout>
    );
  }

  const handleSave = () => {
    // Here you would typically update the teacher data
    console.log("Updating teacher:", formData);
    
    toast({
      title: "Success",
      description: "Teacher information updated successfully!",
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: teacher.name,
      email: teacher.email,
    });
    setIsEditing(false);
  };

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
        title={`Manage Teacher: ${teacher.name}`} 
        description="View and edit teacher information and assignments"
      >
        <Button variant="outline" onClick={() => navigate("/admin/teachers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teachers
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teacher Information Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={teacher.avatar} alt={teacher.name} />
                    <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  Teacher Information
                </CardTitle>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <UserCheck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{teacher.email}</p>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Active</p>
                      <p className="text-sm text-muted-foreground">Account Status</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Class Assignments Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Class Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {assignedClasses.length > 0 ? (
                <div className="space-y-3">
                  {assignedClasses.map((classItem) => (
                    <div key={classItem.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{classItem.name}</p>
                          <p className="text-sm text-muted-foreground">{classItem.ageGroup}</p>
                        </div>
                        <Badge variant="secondary">
                          {classItem.studentIds.length} students
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No classes assigned to this teacher.
                </p>
              )}
              
              <Separator className="my-4" />
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/admin/classes/assign")}
              >
                Manage Class Assignments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

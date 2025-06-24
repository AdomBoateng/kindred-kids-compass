
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockUsers } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

export default function CreateClassPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    ageGroup: "",
    description: "",
    teacherIds: [] as string[],
  });

  // Get only teachers from users
  const teachers = mockUsers.filter(user => user.role === "teacher");

  const handleTeacherToggle = (teacherId: string) => {
    setFormData(prev => ({
      ...prev,
      teacherIds: prev.teacherIds.includes(teacherId)
        ? prev.teacherIds.filter(id => id !== teacherId)
        : [...prev.teacherIds, teacherId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ageGroup) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically save the class data
    console.log("Creating class:", formData);
    
    toast({
      title: "Success",
      description: "Class created successfully!",
    });
    
    navigate("/admin/classes");
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
        title="Create New Class" 
        description="Set up a new class with teachers and details"
      >
        <Button variant="outline" onClick={() => navigate("/admin/classes")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Classes
        </Button>
      </PageHeader>

      <div className="max-w-2xl mx-auto">
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
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Preschool Class A"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ageGroup">Age Group *</Label>
                  <Select 
                    value={formData.ageGroup} 
                    onValueChange={(value) => setFormData({...formData, ageGroup: value})}
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
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                        checked={formData.teacherIds.includes(teacher.id)}
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
                {teachers.length === 0 && (
                  <p className="text-muted-foreground text-sm">No teachers available to assign.</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/admin/classes")}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Create Class
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

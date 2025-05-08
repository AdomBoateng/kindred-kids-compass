
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClasses, mockUsers } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

export default function AssignTeachersPage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Record<string, string[]>>(
    // Initialize with current assignments from mock data
    mockClasses.reduce((acc, cls) => {
      acc[cls.id] = cls.teacherIds;
      return acc;
    }, {} as Record<string, string[]>)
  );

  // Extract teachers from mockUsers
  const teachers = mockUsers.filter(user => user.role === "teacher");

  const toggleTeacherAssignment = (classId: string, teacherId: string) => {
    setAssignments(prev => {
      const currentAssignments = [...(prev[classId] || [])];
      
      if (currentAssignments.includes(teacherId)) {
        return {
          ...prev,
          [classId]: currentAssignments.filter(id => id !== teacherId)
        };
      } else {
        return {
          ...prev,
          [classId]: [...currentAssignments, teacherId]
        };
      }
    });
  };

  const handleSaveAssignments = () => {
    // In a real app, we would send this data to an API
    console.log("New teacher assignments:", assignments);
    
    toast({
      title: "Assignments updated",
      description: "Teacher class assignments have been updated successfully."
    });
    
    navigate("/admin/classes");
  };

  return (
    <Layout>
      <PageHeader 
        title="Assign Teachers to Classes" 
        description="Manage teacher-class assignments" 
      />
      
      <div className="grid grid-cols-1 gap-6">
        {mockClasses.map(cls => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle>{cls.name}</CardTitle>
              <p className="text-muted-foreground text-sm">{cls.ageGroup} • {cls.studentIds.length} students</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium">Assigned Teachers</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {teachers.map(teacher => {
                    const isAssigned = assignments[cls.id]?.includes(teacher.id);
                    
                    return (
                      <div 
                        key={teacher.id}
                        className={cn(
                          "flex items-center space-x-2 p-2 rounded-md border",
                          isAssigned ? "border-primary bg-primary/5" : "border-muted"
                        )}
                      >
                        <Checkbox 
                          checked={isAssigned} 
                          onCheckedChange={() => toggleTeacherAssignment(cls.id, teacher.id)} 
                          id={`teacher-${teacher.id}-class-${cls.id}`}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={teacher.avatar} alt={teacher.name} />
                          <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <label 
                          htmlFor={`teacher-${teacher.id}-class-${cls.id}`}
                          className="text-sm font-medium leading-none cursor-pointer flex-1"
                        >
                          {teacher.name}
                        </label>
                        {isAssigned && <Badge variant="outline">Assigned</Badge>}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {teachers.length === 0 && (
                <div className="text-center text-muted-foreground p-4">
                  No teachers available to assign. Add teachers first.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end mt-6">
        <Button variant="outline" className="mr-2" onClick={() => navigate("/admin/classes")}>
          Cancel
        </Button>
        <Button onClick={handleSaveAssignments}>Save Assignments</Button>
      </div>
    </Layout>
  );
}

// Helper function for conditional class names
function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

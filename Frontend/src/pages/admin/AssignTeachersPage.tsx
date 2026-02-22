import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useChurchScope } from "@/hooks/use-church-scope";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function AssignTeachersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { classes, teachers, isLoading } = useChurchScope();
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [initialAssignments, setInitialAssignments] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const normalizedInitialAssignments = useMemo(
    () =>
      classes.reduce(
        (acc, classItem) => {
          acc[classItem.id] = classItem.teacherIds;
          return acc;
        },
        {} as Record<string, string[]>,
      ),
    [classes],
  );

  useEffect(() => {
    setAssignments(normalizedInitialAssignments);
    setInitialAssignments(normalizedInitialAssignments);
  }, [normalizedInitialAssignments]);

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

  const handleSaveAssignments = async () => {
    setIsSaving(true);
    try {
      const additions: Array<{ class_id: string; teacher_id: string }> = [];
      const removals: Array<{ class_id: string; teacher_id: string }> = [];

      for (const classItem of classes) {
        const currentSet = new Set(initialAssignments[classItem.id] || []);
        const nextSet = new Set(assignments[classItem.id] || []);

        for (const teacherId of nextSet) {
          if (!currentSet.has(teacherId)) {
            additions.push({ class_id: classItem.id, teacher_id: teacherId });
          }
        }

        for (const teacherId of currentSet) {
          if (!nextSet.has(teacherId)) {
            removals.push({ class_id: classItem.id, teacher_id: teacherId });
          }
        }
      }

      await Promise.all([
        ...additions.map((payload) => api.assignTeacherToClass(payload)),
        ...removals.map((payload) => api.unassignTeacherFromClass(payload)),
      ]);

      toast({
        title: "Assignments updated",
        description: "Teacher class assignments have been updated successfully.",
      });

      navigate("/admin/classes");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Failed to save teacher assignments.";
      toast({
        title: "Unable to save assignments",
        description: detail,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading class assignments...</p>
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
        className="pointer-events-none select-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
        style={{
          width: "50vw",
          marginTop: "10vh",
          maxWidth: 900,
          minWidth: 300,
          zIndex: 0,
        }}
      />
      <PageHeader 
        title="Assign Teachers to Classes" 
        description="Manage teacher-class assignments" 
      />
      
      <div className="grid grid-cols-1 gap-6">
        {classes.map(cls => (
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
        <Button onClick={handleSaveAssignments} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Assignments"}
        </Button>
      </div>
    </Layout>
  );
}

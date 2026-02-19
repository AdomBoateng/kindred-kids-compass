import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Settings, UserPlus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
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
import logo from "@/assets/logo.png";
import { useChurchScope } from "@/hooks/use-church-scope";

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { teachers, church } = useChurchScope();
  
  const filteredTeachers = teachers.filter(
    user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTeacher = (teacherId: string, teacherName: string) => {
    // In a real app, this would make an API call to delete the teacher
    toast({
      title: "Teacher Deleted",
      description: `${teacherName} has been removed from the system.`,
    });
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
                width: "20vw",
                maxWidth: 900,
                minWidth: 300,
                zIndex: 0,
              }}
            />
      <PageHeader 
        title="Teachers" 
        description={`Manage teachers and their class assignments for ${church?.branchName || 'your branch'}`}
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          asChild
          className="hover:bg-[#FFC107] hover:text-black transition-colors"
        >
          <Link to="/admin/teachers/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Teacher
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <Card
            key={teacher.id}
            className="p-4 bg-[#040273] hover:bg-[#FFC107] transition-colors duration-200 text-white hover:text-black"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{teacher.name}</p>
                <p className="text-xs text-white hover:text-black truncate">{teacher.email}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/admin/teachers/${teacher.id}`}>
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Manage Teacher</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Teacher</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {teacher.name}? This action cannot be undone and will remove all associated class assignments.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Teacher
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredTeachers.length === 0 && (
          <div className="col-span-full flex justify-center p-8 text-muted-foreground">
            No teachers found.
          </div>
        )}
      </div>
    </Layout>
  );
}

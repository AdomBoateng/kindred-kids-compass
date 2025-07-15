import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockClasses, mockUsers } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Plus, Users, Trash2 } from "lucide-react";
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

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Filter classes based on search term
  const filteredClasses = mockClasses.filter(
    cls => cls.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           cls.ageGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find teacher names for each class
  const getTeacherNames = (teacherIds: string[]) => {
    return teacherIds
      .map(id => mockUsers.find(user => user.id === id)?.name || "Unknown")
      .join(", ");
  };

  const handleDeleteClass = (classId: string, className: string) => {
    // In a real app, this would make an API call to delete the class
    toast({
      title: "Class Deleted",
      description: `${className} has been removed from the system.`,
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
        title="Classes" 
        description="Manage classes and their assignments" 
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          asChild
          className="hover:bg-[#FFC107] hover:text-black transition-colors"
        >
          <Link to="/admin/classes/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Class
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <Card 
            key={cls.id}
            className="group bg-[#040273] hover:bg-[#FFC107] transition-colors duration-200 text-white hover:text-black"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{cls.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-white border-white group-hover:text-black group-hover:border-black"
                  >
                    {cls.ageGroup}
                  </Badge>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive p-1">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Class</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {cls.name}? This action cannot be undone and will remove all students and assignments from this class.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteClass(cls.id, cls.name)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Class
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Teachers</p>
                  <p className="text-sm text-white group-hover:text-black">
                    {getTeacherNames(cls.teacherIds) || "No teachers assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Students</p>
                  <p className="text-sm text-white group-hover:text-black">
                    {cls.studentIds.length} enrolled
                  </p>
                </div>
                {cls.description && (
                  <div>
                    <p className="text-sm text-white group-hover:text-black line-clamp-2">
                      {cls.description}
                    </p>
                  </div>
                )}
                <div className="pt-2 flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/classes/${cls.id}`} className="flex items-center text-black hover:text-black">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Class
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredClasses.length === 0 && (
          <div className="col-span-full flex justify-center p-8 text-muted-foreground">
            No classes found.
          </div>
        )}
      </div>
    </Layout>
  );
}

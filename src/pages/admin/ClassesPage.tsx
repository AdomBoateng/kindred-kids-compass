
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockClasses, mockUsers } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
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

  return (
    <Layout>
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
        <Button asChild>
          <Link to="/admin/classes/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Class
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <Card key={cls.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{cls.name}</CardTitle>
                <Badge variant="outline">{cls.ageGroup}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Teachers</p>
                  <p className="text-sm text-muted-foreground">{getTeacherNames(cls.teacherIds)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Students</p>
                  <p className="text-sm text-muted-foreground">{cls.studentIds.length} enrolled</p>
                </div>
                {cls.description && (
                  <div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{cls.description}</p>
                  </div>
                )}
                <div className="pt-2 flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/classes/${cls.id}`}>
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

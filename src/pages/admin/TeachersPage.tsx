
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockUsers } from "@/lib/mock-data";
import { User, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter teachers from mockUsers
  const teachers = mockUsers.filter(
    user => user.role === "teacher" && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <PageHeader 
        title="Teachers" 
        description="Manage teachers and their class assignments"
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
        <Button asChild>
          <Link to="/admin/teachers/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Teacher
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{teacher.name}</p>
                <p className="text-xs text-muted-foreground truncate">{teacher.email}</p>
                {teacher.phone && (
                  <p className="text-xs text-muted-foreground">{teacher.phone}</p>
                )}
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/admin/teachers/${teacher.id}`}>
                  <User className="h-4 w-4" />
                  <span className="sr-only">View Details</span>
                </Link>
              </Button>
            </div>
          </Card>
        ))}
        
        {teachers.length === 0 && (
          <div className="col-span-full flex justify-center p-8 text-muted-foreground">
            No teachers found.
          </div>
        )}
      </div>
    </Layout>
  );
}

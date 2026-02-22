import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Settings, UserPlus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useChurchScope } from "@/hooks/use-church-scope";
import { api } from "@/lib/api";
import { LogoLoader } from "@/components/common/LogoLoader";

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { teachers, church, isLoading } = useChurchScope();

  const filteredTeachers = useMemo(() => teachers.filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())), [teachers, searchTerm]);

  const handleDeleteTeacher = async (teacherId: string, teacherName: string) => {
    await api.deleteTeacher(teacherId);
    toast({ title: "Teacher Deleted", description: `${teacherName} has been removed from the system.` });
    window.location.reload();
  };

  if (isLoading) return <Layout><LogoLoader label="Loading teachers..." /></Layout>;

  return (
    <Layout>
      <PageHeader title="Teachers" description={`Manage teachers and class assignments for ${church?.branchName || "your branch"}`} />
      <div className="flex justify-between items-center mb-6">
        <Input placeholder="Search teachers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-sm" />
        <Button asChild><Link to="/admin/teachers/new"><UserPlus className="mr-2 h-4 w-4" />Add New Teacher</Link></Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12"><AvatarImage src={teacher.avatar} alt={teacher.name} /><AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium">{teacher.name}</p><p className="text-xs text-muted-foreground truncate">{teacher.email}</p></div>
              <Button variant="ghost" size="icon" asChild><Link to={`/admin/teachers/${teacher.id}`}><Settings className="h-4 w-4" /></Link></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}

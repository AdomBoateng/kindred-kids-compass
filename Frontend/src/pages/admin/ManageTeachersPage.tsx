import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useChurchScope } from "@/hooks/use-church-scope";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { LogoLoader } from "@/components/common/LogoLoader";

export default function ManageTeachersPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { teachers, classes, isLoading } = useChurchScope();
  const teacher = useMemo(() => teachers.find((t) => t.id === id), [teachers, id]);
  const assigned = classes.filter((c) => c.teacherIds.includes(id || ""));
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    if (teacher) {
      setFullName(teacher.name);
      setEmail(teacher.email);
      setPhone("");
      setDateOfBirth(teacher.dateOfBirth || "");
    }
  }, [teacher]);

  const onSave = async () => {
    if (!id) return;
    await api.updateTeacher(id, { full_name: fullName, email, phone, date_of_birth: dateOfBirth || undefined });
    toast({ title: "Teacher updated" });
  };


  const toggleAssign = async (classId: string) => {
    if (!id) return;
    if (assigned.some((c) => c.id === classId)) {
      await api.unassignTeacherFromClass(classId, id);
      toast({ title: "Unassigned from class" });
    } else {
      await api.assignTeacherToClass({ class_id: classId, teacher_id: id });
      toast({ title: "Assigned to class" });
    }
    window.location.reload();
  };

  const onDelete = async () => {
    if (!id) return;
    await api.deleteTeacher(id);
    toast({ title: "Teacher deleted" });
    navigate("/admin/teachers");
  };

  if (isLoading) return <Layout><LogoLoader label="Loading teacher details..." /></Layout>;
  if (!teacher) return <Layout><PageHeader title="Teacher not found" /><Button onClick={() => navigate('/admin/teachers')}>Back</Button></Layout>;

  return (
    <Layout>
      <PageHeader title={teacher.name} description={teacher.email} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader><CardTitle>Edit Teacher Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2"><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
            <div className="grid gap-2"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="grid gap-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div className="grid gap-2"><Label>Birthday</Label><Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} /></div>
            <div className="flex gap-3"><Button onClick={onSave}>Save Changes</Button><Button variant="destructive" onClick={onDelete}>Delete Teacher</Button></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50">
          <CardHeader><CardTitle>Assigned Classes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {classes.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-1">
                <span className="text-sm">{c.name}</span>
                <Button size="sm" variant={assigned.some((a) => a.id === c.id) ? "secondary" : "outline"} onClick={() => toggleAssign(c.id)}>{assigned.some((a) => a.id === c.id) ? "Unassign" : "Assign"}</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

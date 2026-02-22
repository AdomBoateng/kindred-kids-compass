import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChurchScope } from "@/hooks/use-church-scope";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function ManageTeachersPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { teachers, classes } = useChurchScope();
  const teacher = useMemo(() => teachers.find((t) => t.id === id), [teachers, id]);
  const assigned = classes.filter((c) => c.teacherIds.includes(id || ""));

  const onDelete = async () => {
    if (!id) return;
    await api.deleteTeacher(id);
    toast({ title: "Teacher deleted" });
    navigate("/admin/teachers");
  };

  if (!teacher) return <Layout><PageHeader title="Teacher not found" /><Button onClick={() => navigate('/admin/teachers')}>Back</Button></Layout>;

  return (
    <Layout>
      <PageHeader title={teacher.name} description={teacher.email} />
      <Card><CardContent className="pt-6 space-y-3"><p>Assigned classes: {assigned.length}</p>{assigned.map((c) => <p key={c.id}>{c.name}</p>)}<Button variant="destructive" onClick={onDelete}>Delete Teacher</Button></CardContent></Card>
    </Layout>
  );
}

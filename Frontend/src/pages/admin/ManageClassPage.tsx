import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useChurchScope } from "@/hooks/use-church-scope";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { LogoLoader } from "@/components/common/LogoLoader";

export default function ManageClassPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { classes, students, teachers, isLoading } = useChurchScope();
  const classItem = useMemo(() => classes.find((c) => c.id === id), [classes, id]);
  const classStudents = students.filter((s) => s.classId === id);
  const [name, setName] = useState(classItem?.name || "");
  const [ageGroup, setAgeGroup] = useState(classItem?.ageGroup || "");
  const [description, setDescription] = useState(classItem?.description || "");

  const toggleAssign = async (teacherId: string) => {
    if (!id) return;
    if (classItem.teacherIds.includes(teacherId)) {
      await api.unassignTeacherFromClass(id, teacherId);
      toast({ title: "Teacher unassigned" });
    } else {
      await api.assignTeacherToClass({ class_id: id, teacher_id: teacherId });
      toast({ title: "Teacher assigned" });
    }
    window.location.reload();
  };

  const onSave = async () => {
    if (!id) return;
    await api.updateClass(id, { name, age_group: ageGroup, description });
    toast({ title: "Class updated" });
  };

  const onDelete = async () => {
    if (!id) return;
    await api.deleteClass(id);
    toast({ title: "Class deleted" });
    navigate("/admin/classes");
  };

  if (isLoading) return <Layout><LogoLoader label="Loading class details..." /></Layout>;
  if (!classItem) return <Layout><PageHeader title="Class not found" /></Layout>;

  return (
    <Layout>
      <PageHeader title={classItem.name} description={classItem.ageGroup} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader><CardTitle>Edit Class</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="grid gap-2"><Label>Age Group</Label><Input value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} /></div>
            <div className="grid gap-2"><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div className="flex gap-3"><Button onClick={onSave}>Save Changes</Button><Button variant="destructive" onClick={onDelete}>Delete Class</Button></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50">
          <CardHeader><CardTitle>Assign Teachers</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {teachers.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <Checkbox checked={classItem.teacherIds.includes(t.id)} onCheckedChange={() => toggleAssign(t.id)} />
                <span className="text-sm">{t.name}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-2">Students in class: {classStudents.length}</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

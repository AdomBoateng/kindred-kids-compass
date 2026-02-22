import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChurchScope } from "@/hooks/use-church-scope";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function ManageClassPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { classes, students } = useChurchScope();
  const classItem = useMemo(() => classes.find((c) => c.id === id), [classes, id]);
  const classStudents = students.filter((s) => s.classId === id);

  const onDelete = async () => {
    if (!id) return;
    await api.deleteClass(id);
    toast({ title: "Class deleted" });
    navigate("/admin/classes");
  };

  if (!classItem) return <Layout><PageHeader title="Class not found" /></Layout>;
  return <Layout><PageHeader title={classItem.name} description={classItem.ageGroup} /><Card><CardContent className="pt-6 space-y-2"><p>Students: {classStudents.length}</p>{classStudents.map((s)=><p key={s.id}>{s.firstName} {s.lastName}</p>)}<Button variant="destructive" onClick={onDelete}>Delete Class</Button></CardContent></Card></Layout>;
}

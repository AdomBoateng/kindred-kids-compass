import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useChurchScope } from "@/hooks/use-church-scope";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function StudentsPage() {
  const { students } = useChurchScope();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => students.filter((s) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(q.toLowerCase())), [students, q]);
  const onDelete = async (id: string) => { await api.deleteStudentAsTeacher(id); toast({ title: "Student deleted" }); window.location.reload(); };

  return (
    <Layout>
      <PageHeader title="Students" description="Live students from database" />
      <Input placeholder="Search students..." value={q} onChange={(e) => setQ(e.target.value)} className="mb-4" />
      <Card><CardContent className="pt-6 space-y-2">{filtered.map((s)=><div key={s.id} className="flex justify-between"><Link to={`/student/${s.id}`}>{s.firstName} {s.lastName}</Link><Button variant="destructive" size="sm" onClick={()=>onDelete(s.id)}>Delete</Button></div>)}</CardContent></Card>
    </Layout>
  );
}

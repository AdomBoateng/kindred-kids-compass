import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { useChurchScope } from "@/hooks/use-church-scope";
import { Card, CardContent } from "@/components/ui/card";

export default function AssignTeachersPage() {
  const { classes, teachers } = useChurchScope();
  return <Layout><PageHeader title="Assign Teachers" description="Current live class and teacher data" /><Card><CardContent className="pt-6">{classes.map((c)=><p key={c.id}>{c.name}: {teachers.filter((t)=>c.teacherIds.includes(t.id)).map((t)=>t.name).join(', ') || 'No teacher assigned'}</p>)}</CardContent></Card></Layout>;
}

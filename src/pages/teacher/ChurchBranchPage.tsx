import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { useChurchScope } from "@/hooks/use-church-scope";

export default function TeacherChurchBranchPage() {
  const { church, classes, students } = useChurchScope();

  return (
    <Layout>
      <PageHeader
        title="My Church Branch"
        description="You only see children and classes from your assigned branch."
      />

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">{church?.name}</h2>
        <p className="text-muted-foreground">Branch: {church?.branchName}</p>
        <p className="text-muted-foreground">Location: {church?.location}</p>
        <p className="pt-2">Active Classes: {classes.length}</p>
        <p>Children in Branch: {students.length}</p>
      </Card>
    </Layout>
  );
}

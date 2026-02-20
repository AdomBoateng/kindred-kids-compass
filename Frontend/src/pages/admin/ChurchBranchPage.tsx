import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { useChurchScope } from "@/hooks/use-church-scope";

export default function ChurchBranchPage() {
  const { church, teachers, classes, students } = useChurchScope();

  return (
    <Layout>
      <PageHeader
        title="Church Branch"
        description="Your branch context controls which teachers, classes, and students you can manage."
      />

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">{church?.name}</h2>
        <p className="text-muted-foreground">Branch: {church?.branchName}</p>
        <p className="text-muted-foreground">Location: {church?.location}</p>
        {church?.region && <p className="text-muted-foreground">Region: {church.region}</p>}
        {church?.district && <p className="text-muted-foreground">District: {church.district}</p>}
        {church?.area && <p className="text-muted-foreground">Area: {church.area}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <Card className="p-4">Teachers: {teachers.length}</Card>
          <Card className="p-4">Classes: {classes.length}</Card>
          <Card className="p-4">Students: {students.length}</Card>
        </div>
      </Card>
    </Layout>
  );
}

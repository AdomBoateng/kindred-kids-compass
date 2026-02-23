import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function PerformancePage() {
  const [rows, setRows] = useState<Array<{ id: string; title: string; taken_on: string }>>([]);
  const load = () => api.getPerformanceHistory().then((r) => setRows(r));
  useEffect(() => { load(); }, []);
  const del = async (id: string) => { await api.deletePerformance(id); toast({ title: "Performance deleted" }); load(); };
  return <Layout><PageHeader title="Performance" description="Live performance records" /><Card><CardContent className="pt-6 space-y-2"><Button asChild><Link to="/teacher/performance/new">Record Performance</Link></Button>{rows.map((r)=><div key={r.id} className="flex justify-between"><span>{r.title} ({r.taken_on})</span><Button variant="destructive" size="sm" onClick={()=>del(r.id)}>Delete</Button></div>)}</CardContent></Card></Layout>;
}

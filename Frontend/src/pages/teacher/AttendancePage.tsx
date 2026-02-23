import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function AttendancePage() {
  const [rows, setRows] = useState<Array<{ id: string; session_date: string }>>([]);
  const load = () => api.getAttendanceHistory().then((r) => setRows(r.map((x) => ({ id: x.id, session_date: x.session_date }))));
  useEffect(() => { load(); }, []);
  const del = async (id: string) => { await api.deleteAttendance(id); toast({ title: "Attendance deleted" }); load(); };
  return <Layout><PageHeader title="Attendance" description="Live attendance sessions" /><Card><CardContent className="pt-6 space-y-2"><Button asChild><Link to="/teacher/attendance/new">Record Attendance</Link></Button>{rows.map((r)=><div key={r.id} className="flex justify-between"><span>{r.session_date}</span><Button variant="destructive" size="sm" onClick={()=>del(r.id)}>Delete</Button></div>)}</CardContent></Card></Layout>;
}

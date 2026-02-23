import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function AttendanceReportsPage() {
  const [rows, setRows] = useState<Array<{ session_date: string; present_count: number; total_count: number; attendance_rate: number }>>([]);
  useEffect(() => { api.getAttendanceAnalytics().then(setRows).catch(() => setRows([])); }, []);
  return <Layout><PageHeader title="Attendance Reports" description="Live attendance analytics" /><Card><CardContent className="pt-6 space-y-2">{rows.map((r)=><p key={r.session_date}>{r.session_date}: {r.present_count}/{r.total_count} ({r.attendance_rate}%)</p>)}</CardContent></Card></Layout>;
}

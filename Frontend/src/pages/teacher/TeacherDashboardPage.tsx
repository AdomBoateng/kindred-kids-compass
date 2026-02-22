import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/cards/StatCard";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { useAuth } from "@/context/AuthContext";
import { useChurchScope } from "@/hooks/use-church-scope";
import { api } from "@/lib/api";
import { LogoLoader } from "@/components/common/LogoLoader";

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const { classes, students, isLoading } = useChurchScope();
  const [attendanceData, setAttendanceData] = useState<Array<{ date: string; rate: number; students: number }>>([]);
  const [performanceData, setPerformanceData] = useState<Array<{ testName: string; averageScore: number; participationRate: number }>>([]);

  useEffect(() => {
    api.getAttendanceAnalytics().then((data) => {
      setAttendanceData(data.slice().reverse().map((point) => ({ date: new Date(point.session_date).toLocaleDateString(undefined, { month: "short" }), rate: Number(point.attendance_rate || 0), students: Number(point.total_count || 0) })));
    }).catch(() => setAttendanceData([]));

    api.getPerformanceAnalytics().then((data) => {
      setPerformanceData(data.slice().reverse().map((point, index) => ({ testName: `Assessment ${index + 1}`, averageScore: Number(point.avg_percent || 0), participationRate: 100 })));
    }).catch(() => setPerformanceData([]));
  }, []);

  if (isLoading) return <Layout><LogoLoader label="Loading teacher dashboard..." /></Layout>;

  return (
    <Layout>
      <PageHeader title="Teacher Dashboard" description={`Welcome back, ${user?.name || "Teacher"}`} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="My Classes" value={classes.length} variant="purple" />
        <StatCard title="My Students" value={students.length} variant="outline" />
        <StatCard title="Attendance Coverage" value={attendanceData.length ? `${Math.round(attendanceData.reduce((a, b) => a + b.rate, 0) / attendanceData.length)}%` : "0%"} variant="outline" />
      </div>
      <div className="space-y-6">
        <AttendanceChart data={attendanceData} title="My Attendance Trends" description="Data from recorded attendance sessions" />
        <PerformanceChart data={performanceData} title="My Class Performance" description="Data from recorded performance tests" />
      </div>
    </Layout>
  );
}

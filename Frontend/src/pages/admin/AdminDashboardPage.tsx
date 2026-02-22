import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/cards/StatCard";
import { BirthdayList } from "@/components/birthdays/BirthdayList";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, Users, FileChartLine, UserCheck } from "lucide-react";
import logo from "@/assets/logo.png";
import { useChurchScope } from "@/hooks/use-church-scope";
import { api } from "@/lib/api";
import { LogoLoader } from "@/components/common/LogoLoader";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { church, teachers, classes, students, isLoading } = useChurchScope();
  const [attendanceData, setAttendanceData] = useState<Array<{ date: string; rate: number; students: number }>>([]);
  const [performanceData, setPerformanceData] = useState<Array<{ testName: string; averageScore: number; participationRate: number }>>([]);
  const [birthdayStudents, setBirthdayStudents] = useState(students);

  useEffect(() => {
    api.getAttendanceAnalytics().then((data) => {
      setAttendanceData(
        data.slice().reverse().map((point) => ({
          date: new Date(point.session_date).toLocaleDateString(undefined, { month: "short" }),
          rate: Number(point.attendance_rate || 0),
          students: Number(point.total_count || 0),
        })),
      );
    }).catch(() => setAttendanceData([]));

    api.getPerformanceAnalytics().then((data) => {
      setPerformanceData(
        data.slice().reverse().map((point, index) => ({
          testName: `Assessment ${index + 1}`,
          averageScore: Number(point.avg_percent || 0),
          participationRate: 100,
        })),
      );
    }).catch(() => setPerformanceData([]));

    api.getBirthdays(30).then((rows) => {
      const mapped = rows.map((row) => {
        const names = row.full_name.split(" ");
        return {
          id: row.student_id,
          firstName: names[0] || row.full_name,
          lastName: names.slice(1).join(" "),
          dateOfBirth: row.date_of_birth,
          guardianName: "",
          guardianContact: "",
          classId: "",
          churchId: user?.churchId || "",
          joinDate: "",
        };
      });
      setBirthdayStudents(mapped);
    }).catch(() => setBirthdayStudents([]));
  }, [user?.churchId]);

  if (isLoading) {
    return <Layout><LogoLoader label="Loading dashboard data..." /></Layout>;
  }

  return (
    <Layout>
      <img src={logo} alt="Kindred Kids Compass Logo" aria-hidden="true" className="pointer-events-none select-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" style={{ width: "50vw", marginTop: "10vh", maxWidth: 900, minWidth: 300, zIndex: 0 }} />
      <div className="relative z-10">
        <PageHeader title="Admin Dashboard" description={`Welcome back, ${user?.name || "Admin"} • ${church?.branchName || "Your Church"}`} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Students" value={students.length} trend={5} trendLabel="vs. last month" variant="purple" />
          <StatCard title="Total Classes" value={classes.length} variant="outline" />
          <StatCard title="Teachers" value={teachers.length} variant="outline" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AttendanceChart data={attendanceData} title="Attendance Trends" description="Attendance data from attendance sessions" />
            <div className="mt-8">
              <PerformanceChart data={performanceData} title="Test Performance" description="Performance data from recorded tests" />
            </div>
          </div>

          <div className="space-y-8">
            <BirthdayList students={birthdayStudents} emptyMessage="No upcoming birthdays in the next 30 days." />
            <div className="bg-[#040273] hover:bg-[#FFC107] transition-colors duration-200 text-black border rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start group" asChild><Link to="/admin/students/new"><UserPlus className="mr-2 h-4 w-4" />Add New Student</Link></Button>
                <Button variant="outline" className="w-full justify-start group" asChild><Link to="/admin/teachers/new"><Users className="mr-2 h-4 w-4" />Add New Teacher</Link></Button>
                <Button variant="outline" className="w-full justify-start group" asChild><Link to="/admin/classes/new"><UserCheck className="mr-2 h-4 w-4" />Create Class</Link></Button>
                <Button variant="outline" className="w-full justify-start group" asChild><Link to="/admin/attendance/reports"><FileChartLine className="mr-2 h-4 w-4" />View Reports</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

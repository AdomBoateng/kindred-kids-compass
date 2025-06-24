import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/cards/StatCard";
import { BirthdayList } from "@/components/birthdays/BirthdayList";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { useAuth } from "@/context/AuthContext";
import { mockStudents, mockClasses, mockUsers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, Users, FileChartLine, UserCheck } from "lucide-react";
import logo from "@/assets/logo.png"; // Add this import (adjust if not using alias)

// Sample data for attendance chart
const attendanceData = [
  { date: "Jan", rate: 78, students: 45 },
  { date: "Feb", rate: 82, students: 48 },
  { date: "Mar", rate: 85, students: 50 },
  { date: "Apr", rate: 80, students: 47 },
  { date: "May", rate: 88, students: 52 },
  { date: "Jun", rate: 92, students: 54 },
];

// Sample data for performance chart
const performanceData = [
  { testName: "Memory Verse 1", averageScore: 85, participationRate: 92 },
  { testName: "Bible Quiz 1", averageScore: 78, participationRate: 88 },
  { testName: "Memory Verse 2", averageScore: 82, participationRate: 90 },
  { testName: "David & Goliath Quiz", averageScore: 75, participationRate: 85 },
  { testName: "Memory Verse 3", averageScore: 80, participationRate: 88 },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  // Count teachers (excluding admin)
  const teacherCount = mockUsers.filter(u => u.role === "teacher").length;
  
  // Count students with birthdays in next 30 days
  const birthdayStudents = mockStudents.filter(student => {
    const birthDate = new Date(student.dateOfBirth);
    const today = new Date();
    const birthDateThisYear = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    
    // If birthday already passed this year, check next year
    if (birthDateThisYear < today) {
      birthDateThisYear.setFullYear(today.getFullYear() + 1);
    }
    
    // Calculate days until birthday
    const diffTime = birthDateThisYear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 30;
  });
  
  return (
    <Layout>
      {/* Background logo image */}
      <img
        src={logo}
        alt="Kindred Kids Compass Logo"
        aria-hidden="true"
        className="pointer-events-none select-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
        style={{
          width: "50vw",
          marginTop: "10vh",
          maxWidth: 900,
          minWidth: 300,
          zIndex: 0,
        }}
      />
      <div className="relative z-10">
        <PageHeader 
          title="Admin Dashboard" 
          description={`Welcome back, ${user?.name || 'Admin'}`}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Students" 
            value={mockStudents.length} 
            trend={5}
            trendLabel="vs. last month"
            variant="purple"
          />
          <StatCard 
            title="Total Classes" 
            value={mockClasses.length}
            variant="outline" 
          />
          <StatCard 
            title="Teachers" 
            value={teacherCount}
            variant="outline" 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AttendanceChart 
              data={attendanceData}
              title="Attendance Trends"
              description="Monthly attendance percentage across all classes"
            />
            
            <div className="mt-8">
              <PerformanceChart 
                data={performanceData}
                title="Test Performance"
                description="Average scores and participation rates"
              />
            </div>
          </div>
          
          <div className="space-y-8">
            <BirthdayList 
              students={birthdayStudents}
              emptyMessage="No upcoming birthdays in the next 30 days."
            />
            
            <div className="bg-[#040273] hover:bg-[#FFC107] transition-colors duration-200 text-black border rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start group" asChild>
                  <Link to="/admin/students/new" className="flex items-center text-black group-hover:text-black transition-colors">
                    <UserPlus className="mr-2 h-4 w-4 text-black group-hover:text-black transition-colors" />
                    <div>
                      <div className="font-medium text-black group-hover:text-black transition-colors">Add New Student</div>
                      <div className="text-xs text-black group-hover:text-black transition-colors">Register a new child to the system</div>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start group" asChild>
                  <Link to="/admin/teachers/new" className="flex items-center text-black group-hover:text-black transition-colors">
                    <UserPlus className="mr-2 h-4 w-4 text-black group-hover:text-black transition-colors" />
                    <div>
                      <div className="font-medium text-black group-hover:text-black transition-colors">Add New Teacher</div>
                      <div className="text-xs text-black group-hover:text-black transition-colors">Register a teacher account</div>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start group" asChild>
                  <Link to="/admin/attendance/reports" className="flex items-center text-black group-hover:text-black transition-colors">
                    <FileChartLine className="mr-2 h-4 w-4 text-black group-hover:text-black transition-colors" />
                    <div>
                      <div className="font-medium text-black group-hover:text-black transition-colors">View Attendance Reports</div>
                      <div className="text-xs text-black group-hover:text-black transition-colors">Check attendance history by class</div>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start group" asChild>
                  <Link to="/admin/classes/assign" className="flex items-center text-black group-hover:text-black transition-colors">
                    <UserCheck className="mr-2 h-4 w-4 text-black group-hover:text-black transition-colors" />
                    <div>
                      <div className="font-medium text-black group-hover:text-black transition-colors">Assign Teachers to Classes</div>
                      <div className="text-xs text-black group-hover:text-black transition-colors">Manage teacher-class assignments</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

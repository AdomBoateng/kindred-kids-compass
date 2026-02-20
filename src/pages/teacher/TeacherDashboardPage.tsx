import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/cards/StatCard";
import { BirthdayList } from "@/components/birthdays/BirthdayList";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { useAuth } from "@/context/AuthContext";
import { 
  getPrimaryClassForTeacher,
  getStudentsByClassId 
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StudentCard } from "@/components/cards/StudentCard";
import { Link } from "react-router-dom";

// Sample data for attendance chart (teacher specific)
const teacherAttendanceData = [
  { date: "Apr 2", rate: 85, students: 12 },
  { date: "Apr 9", rate: 92, students: 13 },
  { date: "Apr 16", rate: 78, students: 11 },
  { date: "Apr 23", rate: 88, students: 12 },
  { date: "Apr 30", rate: 95, students: 14 },
  { date: "May 7", rate: 90, students: 13 },
];

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  
  const teacherClass = getPrimaryClassForTeacher(user?.id, user?.churchId);
  const teacherClassId = teacherClass?.id || "";
  
  // Get students in the teacher's class
  const classStudents = getStudentsByClassId(teacherClassId, user?.churchId);
  
  // Count students with birthdays in next 14 days
  const birthdayStudents = classStudents.filter(student => {
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
    
    return diffDays <= 14;
  });
  
  return (
    <Layout>
      <PageHeader 
        title="Teacher Dashboard" 
        description={`Welcome back, ${user?.name || 'Teacher'}`}
      >
        <Button
          asChild
          className="hover:bg-[#FFC107] transition-colors"
        >
          <Link to="/teacher/attendance/new">Record Attendance</Link>
        </Button>
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="My Class" 
          value={teacherClass?.name || "Preschool Class"} 
          footer={
            <div className="flex justify-between">
              <span>Students:</span>
              <span>{classStudents.length}</span>
            </div>
          }
          variant="purple"
        />
        <StatCard 
          title="Last Attendance" 
          value="90%" 
          trend={5}
          trendLabel="vs. previous service"
          variant="outline"
        />
        <StatCard 
          title="Upcoming Birthdays" 
          value={birthdayStudents.length}
          footer={
            birthdayStudents.length > 0 && (
              <div className="flex justify-between">
                <span>Next:</span>
                <span className="font-medium">{birthdayStudents[0].firstName}</span>
              </div>
            )
          }
          variant="outline"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AttendanceChart 
            data={teacherAttendanceData}
            title="Recent Attendance"
            description="Weekly attendance percentage for your class"
          />
          
          <div className="mt-8">
            <h2 className="section-title mb-6">My Students</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {classStudents.slice(0, 4).map(student => (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  classInfo={{
                    id: teacherClassId,
                    name: teacherClass?.name || "Preschool Class"
                  }}
                />
              ))}
              
              {classStudents.length > 4 && (
                <div className="sm:col-span-2 mt-3 text-center">
                  <Button asChild variant="outline">
                    <Link to="/teacher/students">View All Students</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <BirthdayList 
            students={birthdayStudents}
            title="Class Birthdays"
            description="Students with birthdays in the next 14 days"
            emptyMessage="No upcoming birthdays in your class for the next 14 days."
            limit={3}
          />
          
          <div className="dashboard-card bg-[#040273] hover:bg-[#FFC107] transition-colors duration-200 text-white hover:text-black rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/teacher/attendance/new" className="block p-3 hover:bg-muted rounded-lg transition-colors group">
                <div className="font-bold">Take Attendance</div>
                <div className="text-sm text-white group-hover:text-black transition-colors">Record today's attendance</div>
              </Link>
              <Link to="/teacher/performance/new" className="block p-3 hover:bg-muted rounded-lg transition-colors group">
                <div className="font-bold">Record Test Scores</div>
                <div className="text-sm text-white group-hover:text-black transition-colors">Enter Bible quiz or memory verse scores</div>
              </Link>
              <Link to="/teacher/students" className="block p-3 hover:bg-muted rounded-lg transition-colors group">
                <div className="font-bold">Student Profiles</div>
                <div className="text-sm text-white group-hover:text-black transition-colors">View student details and history</div>
              </Link>
              <Link to="/teacher/reports" className="block p-3 hover:bg-muted rounded-lg transition-colors group">
                <div className="font-bold">Generate Reports</div>
                <div className="text-sm text-white group-hover:text-black transition-colors">Create attendance and performance reports</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import TeachersPage from "./pages/admin/TeachersPage";
import ManageTeachersPage from "./pages/admin/ManageTeachersPage";
import ClassesPage from "./pages/admin/ClassesPage";
import CreateClassPage from "./pages/admin/CreateClassPage";
import ManageClassPage from "./pages/admin/ManageClassPage";
import StudentsPage from "./pages/admin/StudentsPage";
import NewStudentPage from "./pages/admin/NewStudentPage";
import NewTeacherPage from "./pages/admin/NewTeacherPage";
import AttendanceReportsPage from "./pages/admin/AttendanceReportsPage";
import AssignTeachersPage from "./pages/admin/AssignTeachersPage";

// Teacher pages
import TeacherDashboardPage from "./pages/teacher/TeacherDashboardPage";
import TeacherStudentsPage from "./pages/teacher/StudentsPage";
import StudentProfilePage from "./pages/teacher/StudentProfilePage";
import AttendancePage from "./pages/teacher/AttendancePage";
import RecordAttendancePage from "./pages/teacher/RecordAttendancePage";
import AttendanceDetailsPage from "./pages/teacher/AttendanceDetailsPage";
import PerformancePage from "./pages/teacher/PerformancePage";
import RecordPerformancePage from "./pages/teacher/RecordPerformancePage";
import PerformanceDetailsPage from "./pages/teacher/PerformanceDetailsPage";
import ReportsPage from "./pages/teacher/ReportsPage";
import TeacherProfilePage from "./pages/teacher/TeacherProfilePage";
import TeacherSettingsPage from "./pages/teacher/TeacherSettingsPage";
import RecordStudentAttendancePage from "./pages/teacher/RecordStudentAttendancePage";
import AddStudentPerformancePage from "./pages/teacher/AddStudentPerformancePage";
import AddStudentNotePage from "./pages/teacher/AddStudentNotePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/teachers" element={<TeachersPage />} />
            <Route path="/admin/teachers/new" element={<NewTeacherPage />} />
            <Route path="/admin/teachers/:id" element={<ManageTeachersPage />} />
            <Route path="/admin/classes" element={<ClassesPage />} />
            <Route path="/admin/classes/new" element={<CreateClassPage />} />
            <Route path="/admin/classes/:id" element={<ManageClassPage />} />
            <Route path="/admin/classes/assign" element={<AssignTeachersPage />} />
            <Route path="/admin/students" element={<StudentsPage />} />
            <Route path="/admin/students/new" element={<NewStudentPage />} />
            <Route path="/admin/attendance/reports" element={<AttendanceReportsPage />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Teacher routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
            <Route path="/teacher/students" element={<TeacherStudentsPage />} />
            <Route path="/student/:id" element={<StudentProfilePage />} />
            <Route path="/teacher/attendance" element={<AttendancePage />} />
            <Route path="/teacher/attendance/new" element={<RecordAttendancePage />} />
            <Route path="/teacher/attendance/details/:date?" element={<AttendanceDetailsPage />} />
            <Route path="/teacher/performance" element={<PerformancePage />} />
            <Route path="/teacher/performance/new" element={<RecordPerformancePage />} />
            <Route path="/teacher/performance/details/:id?" element={<PerformanceDetailsPage />} />
            <Route path="/teacher/reports" element={<ReportsPage />} />
            <Route path="/teacher/profile" element={<TeacherProfilePage />} />
            <Route path="/teacher/settings" element={<TeacherSettingsPage />} />
            <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
            
            {/* Individual student action routes */}
            <Route path="/student/:id/record-attendance" element={<RecordStudentAttendancePage />} />
            <Route path="/student/:id/add-performance" element={<AddStudentPerformancePage />} />
            <Route path="/student/:id/add-note" element={<AddStudentNotePage />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

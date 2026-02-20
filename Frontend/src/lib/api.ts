const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
const ACCESS_TOKEN_STORAGE_KEY = "accessToken";

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user_id: string;
  role: "admin" | "teacher";
  church_id: string;
}

export interface SignupPayload {
  full_name: string;
  email: string;
  password: string;
  role: "admin" | "teacher";
  church_id?: string;
  branch_name?: string;
  location?: string;
  region?: string;
  district?: string;
  area?: string;
}

export interface ChurchResponse {
  id: string;
  name: string;
  branch_name: string;
  location: string;
  region?: string;
  district?: string;
  area?: string;
}

interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.requiresAuth) {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let detail = "Request failed";
    try {
      const payload = await response.json();
      detail = payload.detail || detail;
    } catch {
      // no-op
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  login(email: string, password: string) {
    return request<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  signup(payload: SignupPayload) {
    return request<LoginResponse>("/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getMe() {
    return request<{ id: string; full_name?: string; email: string; role: "admin" | "teacher"; church_id: string }>("/api/v1/common/me", {
      requiresAuth: true,
    });
  },

  getChurch(accessToken?: string) {
    return request<ChurchResponse>("/api/v1/common/church", {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      requiresAuth: !accessToken,
    });
  },

  getBirthdays(days = 30) {
    return request<Array<{ id: string; first_name: string; last_name: string; date_of_birth: string; class_name?: string }>>(`/api/v1/common/birthdays?days=${days}`, {
      requiresAuth: true,
    });
  },

  getAdminDashboard() {
    return request<{ students: number; classes: number; teachers: number }>("/api/v1/admin/dashboard", { requiresAuth: true });
  },
  getTeachers() {
    return request<Array<{ id: string; full_name: string; email: string; role: "teacher"; church_id: string }>>("/api/v1/admin/teachers", { requiresAuth: true });
  },
  createTeacher(payload: { full_name: string; email: string; phone?: string }) {
    return request("/api/v1/admin/teachers", { method: "POST", body: JSON.stringify(payload), requiresAuth: true });
  },
  getClasses() {
    return request<Array<{ id: string; name: string; description?: string; age_group: string; church_id: string }>>("/api/v1/admin/classes", { requiresAuth: true });
  },
  createClass(payload: { name: string; age_group: string; description?: string }) {
    return request("/api/v1/admin/classes", { method: "POST", body: JSON.stringify(payload), requiresAuth: true });
  },
  getStudents() {
    return request<Array<{ id: string; class_id: string; first_name: string; last_name: string; date_of_birth: string; guardian_name: string; guardian_contact: string; allergies?: string; notes?: string; gender?: "male" | "female" | "other"; avatar_url?: string; church_id?: string }>>("/api/v1/admin/students", { requiresAuth: true });
  },
  getStudent(studentId: string) {
    return request(`/api/v1/admin/students/${studentId}`, { requiresAuth: true });
  },
  createStudent(payload: { class_id: string; first_name: string; last_name: string; date_of_birth: string; guardian_name: string; guardian_contact: string; allergies?: string; notes?: string; gender?: "male" | "female" | "other"; avatar_url?: string }) {
    return request("/api/v1/admin/students", { method: "POST", body: JSON.stringify(payload), requiresAuth: true });
  },
  getTeacherDashboard() {
    return request<{ classes: Array<{ id: string; name: string; age_group: string }>; students: number }>("/api/v1/teacher/dashboard", { requiresAuth: true });
  },
  getTeacherClasses() {
    return request<Array<{ id: string; name: string; description?: string; age_group: string }>>("/api/v1/teacher/classes", { requiresAuth: true });
  },
  getTeacherStudents() {
    return request<Array<{ id: string; class_id: string; church_id: string; first_name: string; last_name: string; date_of_birth: string; guardian_name: string; guardian_contact: string; allergies?: string; notes?: string; gender?: "male" | "female" | "other"; avatar_url?: string }>>("/api/v1/teacher/students", { requiresAuth: true });
  },
  getTeacherStudent(studentId: string) {
    return request(`/api/v1/teacher/students/${studentId}`, { requiresAuth: true });
  },
  recordAttendance(payload: { class_id: string; session_date: string; students: Array<{ student_id: string; present: boolean; notes?: string }> }) {
    return request("/api/v1/teacher/attendance", { method: "POST", body: JSON.stringify(payload), requiresAuth: true });
  },
  getAttendanceHistory(classId?: string) {
    const query = classId ? `?class_id=${classId}` : "";
    return request<Array<{ id: string; class_id: string; session_date: string }>>(`/api/v1/teacher/attendance${query}`, { requiresAuth: true });
  },
  recordPerformance(payload: { class_id: string; title: string; taken_on: string; scores: Array<{ student_id: string; score: number; max_score: number; notes?: string }> }) {
    return request("/api/v1/teacher/performance", { method: "POST", body: JSON.stringify(payload), requiresAuth: true });
  },
  getPerformanceHistory(classId?: string) {
    const query = classId ? `?class_id=${classId}` : "";
    return request<Array<{ id: string; class_id: string; title: string; taken_on: string }>>(`/api/v1/teacher/performance${query}`, { requiresAuth: true });
  },
  addStudentNote(payload: { student_id: string; note: string }) {
    return request("/api/v1/teacher/student-notes", { method: "POST", body: JSON.stringify(payload), requiresAuth: true });
  },
};

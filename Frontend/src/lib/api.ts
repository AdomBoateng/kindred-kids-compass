const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let detail = "Request failed";
    try {
      const payload = await response.json();
      detail = payload.detail || detail;
    } catch {
      // no-op, keep fallback detail
    }
    throw new Error(detail);
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

  getChurch(accessToken: string) {
    return request<ChurchResponse>("/api/v1/common/church", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

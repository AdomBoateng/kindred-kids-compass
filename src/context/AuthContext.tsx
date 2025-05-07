
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

// Mock users for demo
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@church.org",
    password: "admin123",
    role: "admin" as UserRole,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "teacher@church.org",
    password: "teacher123",
    role: "teacher" as UserRole,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher",
  },
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("ministry_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem("ministry_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Protect routes based on authentication and role
  useEffect(() => {
    const publicRoutes = ["/login", "/"];
    
    if (!isLoading) {
      // If not authenticated and trying to access protected route
      if (!user && !publicRoutes.includes(location.pathname)) {
        navigate("/login");
        toast({
          title: "Authentication required",
          description: "Please log in to access this page",
          variant: "destructive",
        });
      }
      
      // If authenticated but on login page, redirect to dashboard
      if (user && location.pathname === "/login") {
        navigate(user.role === "admin" ? "/admin/dashboard" : "/teacher/dashboard");
      }
      
      // Role-based access control
      if (user) {
        // Admin trying to access teacher routes
        if (user.role === "admin" && location.pathname.startsWith("/teacher")) {
          navigate("/admin/dashboard");
        }
        
        // Teacher trying to access admin routes
        if (user.role === "teacher" && location.pathname.startsWith("/admin")) {
          navigate("/teacher/dashboard");
        }
      }
    }
  }, [user, isLoading, location.pathname, navigate, toast]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        throw new Error("Invalid credentials");
      }
      
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("ministry_user", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${foundUser.name}`,
      });
      
      navigate(
        foundUser.role === "admin" ? "/admin/dashboard" : "/teacher/dashboard"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ministry_user");
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

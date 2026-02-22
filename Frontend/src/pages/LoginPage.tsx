import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import logo from '../assets/logo.png';
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome to Kindred Kids Compass",
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 relative overflow-hidden">
      {/* Background Church Logo */}
      <img 
        src="/lovable-uploads/557871b8-5f11-4521-934c-b35a3c6aa666.png" 
        alt="Church Logo Background" 
        style={{
          position: 'absolute',
          bottom: '-10px',
          right: '-10px',
          opacity: 0.35,
          zIndex: 1,
          transform: 'scale(2.3)'
        }}
      />
      
      <div className="w-full max-w-md p-4 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
            <img
              src={logo}
              alt="Kindred Kids Compass Logo"
            />
          </div>
          <h1 className="text-3xl font-bold font-heading">Kindred Kids Compass</h1>
          <p className="text-muted-foreground mt-2">Children's Ministry Management System</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your church branch account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin.central@church.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={254}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={128}
                    autoComplete="current-password"
                    required
                    className="pr-10"
                  />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-start text-xs text-muted-foreground gap-1">
            <p>Central Admin: admin.central@church.org / admin123</p>
            <p>North Admin: admin.north@church.org / admin123</p>
            <p>Central Teacher: teacher.central@church.org / teacher123</p>
            <p>North Teacher: teacher.north@church.org / teacher123</p>
            <p className="pt-2">Need a branch admin account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

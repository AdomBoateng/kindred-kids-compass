
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  
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
          bottom: '-20px',
          right: '-50px',
          opacity: 0.15,
          zIndex: 1,
          transform: 'scale(1.3)'
        }}
      />
      
      <div className="w-full max-w-md p-4 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-2xl">KC</span>
          </div>
          <h1 className="text-3xl font-bold font-heading">Kindred Kids Compass</h1>
          <p className="text-muted-foreground mt-2">Children's Ministry Management System</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@church.org or teacher@church.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Use admin123 or teacher123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground">
              Demo credentials:
            </p>
            <div className="text-xs text-muted-foreground space-y-1 mt-1">
              <p>Admin: admin@church.org / admin123</p>
              <p>Teacher: teacher@church.org / teacher123</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

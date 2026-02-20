import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import logo from "../assets/logo.png";
import { containsUnsafeInput, isValidEmail, sanitizeText } from "@/lib/security";

interface RegisteredAdminCredential {
  id: string;
  name: string;
  email: string;
  password: string;
  churchId: string;
  branchName: string;
  location: string;
  region: string;
  district: string;
  area: string;
}

const LOCAL_STORAGE_KEY = "registeredAdmins";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [branchName, setBranchName] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const getRegisteredAdmins = (): RegisteredAdminCredential[] => {
    const rawAdmins = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!rawAdmins) return [];

    try {
      return JSON.parse(rawAdmins) as RegisteredAdminCredential[];
    } catch {
      return [];
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const sanitizedName = sanitizeText(name);
    const sanitizedBranch = sanitizeText(branchName);
    const sanitizedLocation = sanitizeText(location);
    const sanitizedRegion = sanitizeText(region);
    const sanitizedDistrict = sanitizeText(district);
    const sanitizedArea = sanitizeText(area);
    const normalizedEmail = sanitizeText(email, 254).toLowerCase();

    const allInputs = [sanitizedName, normalizedEmail, sanitizedBranch, sanitizedLocation, sanitizedRegion, sanitizedDistrict, sanitizedArea];
    if (allInputs.some(containsUnsafeInput)) {
      toast({
        title: "Invalid input",
        description: "Detected potentially unsafe HTML/script content in one or more fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please provide a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!sanitizedBranch) {
      toast({
        title: "Branch required",
        description: "Please enter the church branch name.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both password fields are the same.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const existingAdmins = getRegisteredAdmins();

    const alreadyExists = existingAdmins.some((admin) => admin.email.toLowerCase() === normalizedEmail);
    if (alreadyExists) {
      setIsSaving(false);
      toast({
        title: "Email already enrolled",
        description: "This email has already been used for an admin representative.",
        variant: "destructive",
      });
      return;
    }

    const churchId = `church-custom-${Date.now()}`;

    const newAdmin: RegisteredAdminCredential = {
      id: `custom-admin-${Date.now()}`,
      name: sanitizedName,
      email: normalizedEmail,
      password,
      churchId,
      branchName: sanitizedBranch,
      location: sanitizedLocation,
      region: sanitizedRegion,
      district: sanitizedDistrict,
      area: sanitizedArea,
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...existingAdmins, newAdmin]));

    toast({
      title: "Admin representative enrolled",
      description: `${sanitizedName} has been assigned to ${sanitizedBranch}.`,
    });

    setIsSaving(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 relative overflow-hidden px-4">
      <img
        src="/lovable-uploads/557871b8-5f11-4521-934c-b35a3c6aa666.png"
        alt="Church Logo Background"
        style={{
          position: "absolute",
          bottom: "-10px",
          right: "-10px",
          opacity: 0.35,
          zIndex: 1,
          transform: "scale(2.3)",
        }}
      />

      <div className="w-full max-w-lg relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
            <img src={logo} alt="Kindred Kids Compass Logo" />
          </div>
          <h1 className="text-3xl font-bold font-heading">Enroll Admin Representative</h1>
          <p className="text-muted-foreground mt-2">Create a branch-level admin account</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Admin Sign Up</CardTitle>
            <CardDescription>Register one admin representative per church branch.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" maxLength={254} autoComplete="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Church Branch Name</Label>
                <Input id="branch" maxLength={120} value={branchName} onChange={(e) => setBranchName(e.target.value)} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" maxLength={120} value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" maxLength={120} value={region} onChange={(e) => setRegion(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input id="district" maxLength={120} value={district} onChange={(e) => setDistrict(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area</Label>
                  <Input id="area" maxLength={120} value={area} onChange={(e) => setArea(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" maxLength={128} autoComplete="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    maxLength={128}
                    autoComplete="new-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "Enrolling..." : "Enroll Admin"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Already have an account?&nbsp;<Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

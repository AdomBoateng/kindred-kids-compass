import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ShieldCheck, Users, BarChart3 } from "lucide-react";
import logo from "@/assets/logo.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="container mx-auto px-6 py-12">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Kindred Kids Compass" className="h-10 w-10 rounded-full" />
            <span className="font-bold text-xl">Kindred Kids Compass</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Create Branch</Link>
            </Button>
          </div>
        </header>

        <section className="grid lg:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-sm mb-4">
              <Sparkles className="h-4 w-4" />Modern ministry operations platform
            </p>
            <h1 className="text-5xl font-extrabold leading-tight mb-4">Manage your children’s ministry with clarity, speed, and care.</h1>
            <p className="text-lg text-slate-600 mb-8">Attendance, performance, classes, teacher assignments, birthday reminders, and notifications in one secure workspace.</p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link to="/login">Go to Dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/signup">Register Church Branch</Link>
              </Button>
            </div>
          </div>
          <Card className="border shadow-xl bg-white">
            <CardContent className="p-6">
              <img src={logo} alt="Hero" className="h-52 w-52 mx-auto rounded-full ring-8 ring-slate-100" />
              <p className="text-center mt-6 text-slate-600">Built for Admins and Teachers to collaborate and nurture children effectively.</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <Card className="border bg-white shadow-sm">
            <CardContent className="p-6">
              <Users className="h-8 w-8 mb-3 text-indigo-700" />
              <h3 className="font-semibold text-lg mb-2">Team & Class Management</h3>
              <p className="text-slate-600 text-sm">Assign teachers, organize classes, and track students with real-time updates.</p>
            </CardContent>
          </Card>
          <Card className="border bg-white shadow-sm">
            <CardContent className="p-6">
              <BarChart3 className="h-8 w-8 mb-3 text-indigo-700" />
              <h3 className="font-semibold text-lg mb-2">Live Analytics</h3>
              <p className="text-slate-600 text-sm">Monitor attendance and performance trends from real database records.</p>
            </CardContent>
          </Card>
          <Card className="border bg-white shadow-sm">
            <CardContent className="p-6">
              <ShieldCheck className="h-8 w-8 mb-3 text-indigo-700" />
              <h3 className="font-semibold text-lg mb-2">Secure by Design</h3>
              <p className="text-slate-600 text-sm">Role-based access, profile protection, and notification controls.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

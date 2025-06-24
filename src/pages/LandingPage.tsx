import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import logo from "@/assets/logo.png";

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero Section with logo background */}
      <section
        className="relative py-20 md:py-32 overflow-hidden"
        style={{
          position: "relative",
        }}
      >
        {/* Logo background image */}
        <img
          src={logo}
          alt="Kindred Kids Compass Logo"
          aria-hidden="true"
          className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
          style={{
            width: "70vw",
            maxWidth: 900,
            minWidth: 300,
            zIndex: 0,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ministry-accent/30 to-background -z-10"></div>
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
              Kindred Kids Compass
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10">
              Streamlining children's ministry management for better care, engagement, and growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-12">
            Comprehensive Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-hover bg-card p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#040273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Management</h3>
              <p className="text-muted-foreground">
                Maintain comprehensive profiles with personal details, guardian contacts, allergies, and notes.
              </p>
            </div>
            
            <div className="card-hover bg-card p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#040273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Attendance Tracking</h3>
              <p className="text-muted-foreground">
                Record and monitor student attendance for each service with customizable notes.
              </p>
            </div>
            
            <div className="card-hover bg-card p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#040273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
              <p className="text-muted-foreground">
                Record test scores, Bible quizzes, and memory verse achievements to monitor progress.
              </p>
            </div>
            
            <div className="card-hover bg-card p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#040273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Birthday Alerts</h3>
              <p className="text-muted-foreground">
                Stay on top of upcoming student birthdays with timely notifications and reminders.
              </p>
            </div>
            
            <div className="card-hover bg-card p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#040273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Insightful Reports</h3>
              <p className="text-muted-foreground">
                Generate valuable reports on attendance trends, class performance, and ministry growth.
              </p>
            </div>
            
            <div className="card-hover bg-card p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#040273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Controls</h3>
              <p className="text-muted-foreground">
                Manage teachers, assign classes, and oversee all ministry activities from a central dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Ready to enhance your children's ministry?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join Kindred Kids Compass and discover a more organized, effective way to manage your children's ministry.
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/login">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

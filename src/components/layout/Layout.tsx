
import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if this is the login or landing page
  const isPublicPage = location.pathname === '/login' || location.pathname === '/';
  
  // Check if user is authenticated and on a dashboard page
  const isDashboard = user && (
    location.pathname.includes('/dashboard') ||
    location.pathname.includes('/admin/') ||
    location.pathname.includes('/teacher/')
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={`flex-grow ${isDashboard ? 'bg-muted/30' : ''}`}>
        {/* For login and landing pages, content takes up full width */}
        {isPublicPage ? (
          <>{children}</>
        ) : (
          <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
            {children}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

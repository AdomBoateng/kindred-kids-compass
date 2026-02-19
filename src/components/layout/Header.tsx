import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { getChurchById } from '@/lib/mock-data';
import { Bell, Menu, X } from 'lucide-react';
import logo from '../../assets/logo.png';

export function Header() {
  const { user, logout } = useAuth();
  const church = getChurchById(user?.churchId);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const closeMenu = () => setIsMobileMenuOpen(false);
  
  const headerClass = isScrolled 
    ? 'border-b shadow-sm bg-background/95 backdrop-blur-sm' 
    : 'bg-transparent';

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${headerClass}`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
              <img
              src={logo}
              alt="Kindred Kids Compass Logo"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-xl font-heading font-bold">Kindred Kids</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        {user && (
          <nav className="hidden md:flex items-center space-x-6">
            {user.role === 'admin' ? (
              <>
                <Link to="/admin/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">Dashboard</Link>
                <Link to="/admin/teachers" className="text-foreground/80 hover:text-foreground transition-colors">Teachers</Link>
                <Link to="/admin/classes" className="text-foreground/80 hover:text-foreground transition-colors">Classes</Link>
                <Link to="/admin/students" className="text-foreground/80 hover:text-foreground transition-colors">Students</Link>
                <Link to="/admin/church" className="text-foreground/80 hover:text-foreground transition-colors">Church</Link>
              </>
            ) : (
              <>
                <Link to="/teacher/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">Dashboard</Link>
                <Link to="/teacher/students" className="text-foreground/80 hover:text-foreground transition-colors">Students</Link>
                <Link to="/teacher/attendance" className="text-foreground/80 hover:text-foreground transition-colors">Attendance</Link>
                <Link to="/teacher/performance" className="text-foreground/80 hover:text-foreground transition-colors">Performance</Link>
                <Link to="/teacher/church" className="text-foreground/80 hover:text-foreground transition-colors">Church</Link>
              </>
            )}
          </nav>
        )}

        {/* User and mobile menu button */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">3</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div>
                      <p className="font-medium">Birthday Alert!</p>
                      <p className="text-sm text-muted-foreground">Emma Johnson's birthday is tomorrow</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div>
                      <p className="font-medium">New Student Added</p>
                      <p className="text-sm text-muted-foreground">Michael Taylor joined Preschool Class</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div>
                      <p className="font-medium">Test Scores Updated</p>
                      <p className="text-sm text-muted-foreground">10 students completed their Bible quiz</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p>{user.name}</p>
                      <p className="text-xs text-muted-foreground">{church?.branchName}</p>
                      <p className="text-xs text-muted-foreground">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/${user.role}/profile`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/${user.role}/settings`}>Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && user && (
        <div className="md:hidden border-t py-4 animate-fade-in">
          <nav className="container flex flex-col space-y-4">
            {user.role === 'admin' ? (
              <>
                <Link to="/admin/dashboard" className="px-4 py-2 hover:bg-muted rounded-md" onClick={closeMenu}>Dashboard</Link>
                <Link to="/admin/teachers" className="px-4 py-2 hover:bg-muted rounded-md" onClick={closeMenu}>Teachers</Link>
                <Link to="/admin/classes" className="px-4 py-2 hover:bg-muted rounded-md" onClick={closeMenu}>Classes</Link>
                <Link to="/admin/students" className="px-4 py-2 hover:bg-muted rounded-md" onClick={closeMenu}>Students</Link>
                <Link to="/admin/church" className="px-4 py-2 hover:bg-muted rounded-md" onClick={closeMenu}>Church</Link>
              </>
            ) : (
              <>
                <Link to="/teacher/dashboard" className="px-4 py-2 hover:bg-muted rounded-md" onClick={closeMenu}>Dashboard</Link>
                <Link to="/teacher/students" className="px-4 py-2 hover:bg-muted rounded-md" onClick={closeMenu}>Students</Link>
                <Link to="/teacher/attendance" className="px-4 py-2 hover:bg-muted rounded-md" onClick={closeMenu}>Attendance</Link>
                <Link to="/teacher/performance" className="px-4 py-2 hover:bg-muted rounded-md" onClick={closeMenu}>Performance</Link>
                <Link to="/teacher/church" className="px-4 py-2 hover:bg-muted rounded-md" onClick={closeMenu}>Church</Link>
              </>
            )}
            <div className="border-t pt-2">
              <Link to={`/${user.role}/profile`} className="px-4 py-2 hover:bg-muted rounded-md block" onClick={closeMenu}>Profile</Link>
              <Link to={`/${user.role}/settings`} className="px-4 py-2 hover:bg-muted rounded-md block" onClick={closeMenu}>Settings</Link>
              <button
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="w-full text-left px-4 py-2 hover:bg-muted rounded-md text-destructive"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

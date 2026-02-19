
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChurchById, mockUsers } from '@/lib/mock-data';
import { User } from '@/types';

// Define AuthContext interface
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoCredentials: Record<string, string> = {
  'admin.central@church.org': 'admin123',
  'admin.north@church.org': 'admin123',
  'teacher.central@church.org': 'teacher123',
  'michael.central@church.org': 'teacher123',
  'teacher.north@church.org': 'teacher123',
};

// Create AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  
  // Get user from localStorage or set to null
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null; // Changed default to null instead of mockUsers[1]
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const expectedPassword = demoCredentials[email.toLowerCase()];
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUser || !expectedPassword || password !== expectedPassword) {
        throw new Error('Invalid credentials');
      }
      
      // Set user in state and localStorage
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));

      const church = getChurchById(foundUser.churchId);
      if (church) {
        localStorage.setItem('activeChurch', JSON.stringify(church));
      }
      
      // Redirect based on role
      if (foundUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/teacher/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

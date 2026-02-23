import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Church, User } from '@/types';
import { containsUnsafeInput, isValidEmail, sanitizeText } from '@/lib/security';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';

const safeParseUser = (): User | null => {
  const savedUser = localStorage.getItem('user');
  if (!savedUser) return null;

  try {
    const parsedUser = JSON.parse(savedUser) as User;
    if (!parsedUser?.id || !parsedUser?.email || !parsedUser?.role || !parsedUser?.churchId) return null;
    if (containsUnsafeInput(parsedUser.name || '') || !isValidEmail(parsedUser.email)) return null;

    return {
      ...parsedUser,
      name: sanitizeText(parsedUser.name),
      email: sanitizeText(parsedUser.email, 254).toLowerCase(),
      churchId: sanitizeText(parsedUser.churchId, 120),
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(() => safeParseUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const normalizedEmail = sanitizeText(email, 254).toLowerCase();
      const safePassword = sanitizeText(password, 128);

      if (!isValidEmail(normalizedEmail) || containsUnsafeInput(normalizedEmail) || containsUnsafeInput(safePassword)) {
        throw new Error('Invalid credentials');
      }

      const authResponse = await api.login(normalizedEmail, safePassword);
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, authResponse.access_token);

      const profile = await api.getMe();
      const userFromApi: User = {
        id: profile.id,
        name: profile.full_name || normalizedEmail,
        email: profile.email,
        role: profile.role,
        churchId: profile.church_id,
        avatar: profile.avatar_url,
      };

      setUser(userFromApi);
      localStorage.setItem('user', JSON.stringify(userFromApi));

      const church = await api.getChurch();
      const activeChurch: Church = {
        id: church.id,
        name: church.name,
        branchName: church.branch_name,
        location: church.location,
        region: church.region,
        district: church.district,
        area: church.area,
      };
      localStorage.setItem('activeChurch', JSON.stringify(activeChurch));

      navigate(profile.role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard');
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
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem('runtimeScopeData');
    toast({ title: 'Logged out', description: 'You have been signed out successfully.' });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

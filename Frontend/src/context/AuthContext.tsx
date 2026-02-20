import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChurchById, mockUsers } from '@/lib/mock-data';
import { api } from '@/lib/api';
import { Church, User } from '@/types';
import { containsUnsafeInput, isValidEmail, sanitizeText } from '@/lib/security';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

const REGISTERED_ADMINS_STORAGE_KEY = 'registeredAdmins';
const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';

const demoCredentials: Record<string, string> = {
  'admin.central@church.org': 'admin123',
  'admin.north@church.org': 'admin123',
  'teacher.central@church.org': 'teacher123',
  'michael.central@church.org': 'teacher123',
  'teacher.north@church.org': 'teacher123',
};

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

const getRegisteredAdmins = (): RegisteredAdminCredential[] => {
  const rawAdmins = localStorage.getItem(REGISTERED_ADMINS_STORAGE_KEY);
  if (!rawAdmins) return [];

  try {
    const parsed = JSON.parse(rawAdmins) as RegisteredAdminCredential[];

    return parsed.filter((admin) => {
      if (!admin?.id || !admin?.email || !admin?.password || !admin?.churchId) return false;
      if (!isValidEmail(admin.email)) return false;

      const values = [admin.name, admin.email, admin.churchId, admin.branchName, admin.location, admin.region, admin.district, admin.area];
      return !values.some((value) => containsUnsafeInput(value || ''));
    }).map((admin) => ({
      ...admin,
      name: sanitizeText(admin.name),
      email: sanitizeText(admin.email, 254).toLowerCase(),
      churchId: sanitizeText(admin.churchId, 120),
      branchName: sanitizeText(admin.branchName),
      location: sanitizeText(admin.location),
      region: sanitizeText(admin.region),
      district: sanitizeText(admin.district),
      area: sanitizeText(admin.area),
    }));
  } catch {
    return [];
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

      try {
        const authResponse = await api.login(normalizedEmail, safePassword);
        const userFromApi: User = {
          id: authResponse.user_id,
          name: normalizedEmail,
          email: normalizedEmail,
          role: authResponse.role,
          churchId: authResponse.church_id,
        };

        setUser(userFromApi);
        localStorage.setItem('user', JSON.stringify(userFromApi));
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, authResponse.access_token);

        const church = await api.getChurch(authResponse.access_token);
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

        navigate(authResponse.role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard');
        return;
      } catch (apiError) {
        console.warn('API login unavailable, falling back to local demo credentials.', apiError);
      }

      const expectedPassword = demoCredentials[normalizedEmail];
      let foundUser = mockUsers.find(u => u.email.toLowerCase() === normalizedEmail);

      if (!foundUser || !expectedPassword || safePassword !== expectedPassword) {
        const registeredAdmins = getRegisteredAdmins();
        const registeredAdmin = registeredAdmins.find(
          (admin) => admin.email.toLowerCase() === normalizedEmail && admin.password === safePassword,
        );

        if (!registeredAdmin) {
          throw new Error('Invalid credentials');
        }

        foundUser = {
          id: registeredAdmin.id,
          name: registeredAdmin.name,
          email: registeredAdmin.email,
          role: 'admin',
          churchId: registeredAdmin.churchId,
        };
      }

      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));

      const church = getChurchById(foundUser.churchId);
      if (church) {
        localStorage.setItem('activeChurch', JSON.stringify(church));
      } else {
        const registeredAdmins = getRegisteredAdmins();
        const registeredAdmin = registeredAdmins.find((admin) => admin.id === foundUser.id);
        if (registeredAdmin) {
          const activeChurch: Church = {
            id: registeredAdmin.churchId,
            name: 'Kindred Kids',
            branchName: registeredAdmin.branchName,
            location: registeredAdmin.location,
            region: registeredAdmin.region,
            district: registeredAdmin.district,
            area: registeredAdmin.area,
          };
          localStorage.setItem('activeChurch', JSON.stringify(activeChurch));
        }
      }

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
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
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

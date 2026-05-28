import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { email: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

function getStoredToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [user, setUser] = useState<User | null>(() => {
    const stored = getStoredToken();
    return stored ? decodeToken(stored) : null;
  });

  const isAuthenticated = !!token;
  const role = user?.role ?? null;

  const navigate = useNavigate();

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    const { token: newToken } = data;

    const decoded = decodeToken(newToken);
    if (!decoded) throw new Error('Token inválido');

    setToken(newToken);
    setUser(decoded);
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', decoded.role);
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }

  useEffect(() => {
    window.addEventListener('auth:logout', logout);
    return () => window.removeEventListener('auth:logout', logout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
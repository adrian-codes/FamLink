'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  family_id: number | null;
}

interface Family {
  id: number;
  name: string;
  admin_id: number | null;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  family: Family | null;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchFamily();
    } else {
      setFamily(null);
      setIsAdmin(false);
    }
  }, [user]);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch('http://localhost:8000/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error('Error fetching user:', err);
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const fetchFamily = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/families/my-family', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch family');
      const familyData = await response.json();
      setFamily(familyData);
      setIsAdmin(familyData.admin_id != null && user!.id === familyData.admin_id);
    } catch (err) {
      console.error('Error fetching family:', err);
      setFamily(null);
      setIsAdmin(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      const authToken = data.access_token;
      setToken(authToken);
      localStorage.setItem('token', authToken);
      await fetchUser(authToken);
    } catch (err: any) {
      throw new Error(err.message || 'Login failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setFamily(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, family, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
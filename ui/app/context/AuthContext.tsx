'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  family_id: number | null;
}

interface Family {
  id: number;
  name: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  family: Family | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [family, setFamily] = useState<Family | null>(null);

  useEffect(() => {
    // Load token from localStorage on initial render
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8000/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const userData = await response.json();
      setUser(userData);
      if (userData.family_id) {
        fetchFamily(token, userData.family_id);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setToken(null); // Clear token if user fetch fails
    }
  };

  const fetchFamily = async (token: string, familyId: number) => {
    try {
      const response = await fetch('http://localhost:8000/families/my-family', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch family');
      const familyData = await response.json();
      setFamily(familyData);
    } catch (err) {
      console.error('Failed to fetch family:', err);
    }
  };

  const handleSetToken = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
      fetchUser(newToken);
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setFamily(null);
    }
  };

  const logout = () => {
    handleSetToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, family, setToken: handleSetToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
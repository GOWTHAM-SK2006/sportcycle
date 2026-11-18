'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { authApi, cartApi, getSessionId } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isAdmin: boolean;
  isSeller: boolean;
  isClubAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('sportcycle_token');
      const storedUser = localStorage.getItem('sportcycle_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error loading auth from localStorage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: any) => {
    const res = await authApi.login(credentials);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('sportcycle_token', res.token);
    localStorage.setItem('sportcycle_refreshToken', res.refreshToken);
    localStorage.setItem('sportcycle_user', JSON.stringify(res.user));

    // Merge guest cart if any
    const sessionId = getSessionId();
    if (sessionId) {
      try {
        await cartApi.mergeGuestCart(sessionId);
      } catch (err) {
        console.warn('Guest cart merge notice:', err);
      }
    }
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('sportcycle_token', res.token);
    localStorage.setItem('sportcycle_refreshToken', res.refreshToken);
    localStorage.setItem('sportcycle_user', JSON.stringify(res.user));

    const sessionId = getSessionId();
    if (sessionId) {
      try {
        await cartApi.mergeGuestCart(sessionId);
      } catch (err) {
        console.warn('Guest cart merge notice:', err);
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sportcycle_token');
    localStorage.removeItem('sportcycle_refreshToken');
    localStorage.removeItem('sportcycle_user');
    window.location.href = '/';
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('sportcycle_user', JSON.stringify(updatedUser));
  };

  const roles = user?.roles || [];
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isSeller = roles.includes('ROLE_SELLER') || isAdmin;
  const isClubAdmin = roles.includes('ROLE_CLUB_ADMIN') || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
        isSeller,
        isClubAdmin,
      }}
    >
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


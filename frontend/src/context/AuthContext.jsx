'use client';

import { createContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (authService.isAuthenticated()) {
          const response = await authService.getCurrentUser();
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.data.user);
    
    // Redirect based on user type
    if (response.data.user.userType === 'therapist') {
      router.push('/therapist-dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const register = async (data) => {
    const response = await authService.register(data);
    setUser(response.data.user);
    router.push('/dashboard');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isTherapist: user?.userType === 'therapist',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

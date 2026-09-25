import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nova_mart_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and check current user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('nova_mart_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (error) {
          console.warn('Auth token validation failed, clearing session:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        localStorage.setItem('nova_mart_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await authService.register({ name, email, password, phone });
      if (res.success) {
        localStorage.setItem('nova_mart_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Account created! Welcome to NOVA MART, ${res.user.name.split(' ')[0]}!`);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('nova_mart_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authService.updateProfile(profileData);
      if (res.success) {
        if (res.token) {
          localStorage.setItem('nova_mart_token', res.token);
          setToken(res.token);
        }
        setUser(res.user);
        toast.success('Profile updated successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      return { success: false, error: error.message };
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success) setUser(res.user);
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

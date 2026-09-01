import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister, getMyProfile } from '../api';

const AuthContext = createContext();

// Format role for display and matching ('admin' -> 'Admin', etc.)
export const formatRole = (r) => {
  if (!r) return null;
  const lower = r.toLowerCase();
  if (lower === 'admin') return 'Admin';
  if (lower === 'retailer') return 'Retailer';
  if (lower === 'dispatcher') return 'Dispatcher';
  if (lower === 'rider') return 'Rider';
  return r.charAt(0).toUpperCase() + r.slice(1);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('reflex_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('reflex_token') || null);
  const [loading, setLoading] = useState(true);

  const role = user ? formatRole(user.role) : null;
  const status = user ? (user.status || 'pending').toLowerCase() : null;

  // Verify stored token on initial load
  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('reflex_token');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await getMyProfile();
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('reflex_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('Session expired or invalid token:', err?.response?.data?.error || err.message);
      // Clear token if invalid
      if (err?.response?.status === 401) {
        localStorage.removeItem('reflex_token');
        localStorage.removeItem('reflex_user');
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    if (res.data && res.data.token) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('reflex_token', receivedToken);
      localStorage.setItem('reflex_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
    return null;
  };

  // Register handler
  const register = async (registrationData) => {
    const res = await apiRegister(registrationData);
    return res.data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('reflex_token');
    localStorage.removeItem('reflex_user');
    setToken(null);
    setUser(null);
  };

  // Force refresh user profile
  const refreshProfile = async () => {
    try {
      const res = await getMyProfile();
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('reflex_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        status,
        loading,
        isAuthenticated: Boolean(token && user && status === 'approved'),
        isPending: Boolean(user && status === 'pending'),
        isRejected: Boolean(user && status === 'rejected'),
        login,
        register,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

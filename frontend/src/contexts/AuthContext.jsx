import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token is invalid or expired, clear it
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store token
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        return true;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      // Re-throw the error to be handled by the component
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);

      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store token
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if needed
      await axios.post('http://localhost:5000/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('http://localhost:5000/api/users/profile', profileData);
      
      if (response.data.success) {
        setUser(response.data.data);
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const handleOAuthCallback = async (token) => {
    try {
      // Store the OAuth token
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user info
      await checkAuthStatus();
    } catch (error) {
      console.error('OAuth callback error:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send reset email' 
      };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', { 
        token, 
        password 
      });
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      console.error('Reset password error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reset password' 
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    handleOAuthCallback,
    forgotPassword,
    resetPassword,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
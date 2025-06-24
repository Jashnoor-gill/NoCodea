import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const ForgotPasswordModal = ({ onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('Password reset email sent! Check your inbox for instructions.');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#282828] rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Forgot Password</h3>
          <p className="text-[#B0B0B0]">Enter your email to receive a reset link</p>
        </div>

        {message && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-6">
            <p className="text-green-400 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="forgot-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#404040] border border-[#505050] rounded-lg text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Back to Login
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#B0B0B0] hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Login = ({ onSwitchToRegister, onClose }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      
      const success = await login(formData.email, formData.password);
      
      if (success) {
        toast.success(t('loginSuccess'));
        onClose();
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.status === 429) {
        // Too many login attempts
        toast.error(t('tooManyLoginAttempts'));
      } else if (error.response?.status === 400) {
        // Invalid credentials
        toast.error(t('invalidCredentials'));
      } else {
        // Other errors
        toast.error(t('loginFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordModal 
        onClose={() => setShowForgotPassword(false)}
        onSwitchToLogin={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#282828] rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NC</span>
            </div>
            <h2 className="text-2xl font-bold text-white">NoCodea</h2>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Welcome Back</h3>
          <p className="text-[#B0B0B0]">Sign in to your account to continue</p>
        </div>

        {errors.email && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
            <p className="text-red-400 text-sm">{errors.email}</p>
          </div>
        )}

        {errors.password && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
            <p className="text-red-400 text-sm">{errors.password}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 bg-[#404040] border border-[#505050] rounded-lg text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('enterEmail')}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 bg-[#404040] border border-[#505050] rounded-lg text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('enterPassword')}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0] hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-[#404040] border-[#505050] rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-[#B0B0B0]">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t('forgotPassword')}?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('loggingIn')}
              </div>
            ) : (
              t('login')
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#505050]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#282828] text-[#B0B0B0]">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="mt-4 w-full bg-[#404040] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#505050] transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[#B0B0B0]">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium">{t('securityNotice')}</p>
              <p className="mt-1">{t('accountLockedAfter')}</p>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#B0B0B0] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Login; 
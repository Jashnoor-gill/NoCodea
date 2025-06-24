import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const ResetPassword = ({ onClose, onSwitchToLogin }) => {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('request'); // 'request' or 'reset'
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    // Check if we have token and user in URL params
    const urlToken = searchParams.get('token');
    const urlUser = searchParams.get('user');
    
    if (urlToken && urlUser) {
      setToken(urlToken);
      setUser(urlUser);
      setStep('reset');
    }
  }, [searchParams]);

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

  const validateRequestForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = t('passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordMinLength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordsDontMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    if (!validateRequestForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      
      const result = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await result.json();

      if (data.success) {
        toast.success(t('resetEmailSent'));
        setStep('request');
        setFormData({ email: '', password: '', confirmPassword: '' });
      } else {
        toast.error(data.message || t('resetEmailFailed'));
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      toast.error(t('resetEmailFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateResetForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      
      const result = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          password: formData.password
        })
      });

      const data = await result.json();

      if (data.success) {
        toast.success(t('passwordResetSuccess'));
        if (onSwitchToLogin) {
          onSwitchToLogin();
        } else {
          navigate('/');
        }
      } else {
        toast.error(data.message || t('passwordResetFailed'));
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(t('passwordResetFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      navigate('/');
    }
  };

  if (step === 'reset') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('resetPassword')}</h2>
            <button
              onClick={handleBackToLogin}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('newPassword')} *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('enterNewPassword')}
                disabled={loading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('confirmPassword')} *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('confirmNewPassword')}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('resetting')}
                </div>
              ) : (
                t('resetPassword')
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleBackToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              disabled={loading}
            >
              {t('backToLogin')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('forgotPassword')}</h2>
          <button
            onClick={handleBackToLogin}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          {t('forgotPasswordDescription')}
        </p>

        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('email')} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('enterEmail')}
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('sending')}
              </div>
            ) : (
              t('sendResetEmail')
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleBackToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            disabled={loading}
          >
            {t('backToLogin')}
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium">{t('securityNotice')}</p>
              <p className="mt-1">{t('resetEmailSecurity')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 
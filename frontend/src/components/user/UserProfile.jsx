import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../Modal';

const UserProfile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    preferences: {
      language: 'en',
      currency: 'USD',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true
      }
    }
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        preferences: {
          language: user.preferences?.language || 'en',
          currency: user.preferences?.currency || 'USD',
          timezone: user.preferences?.timezone || 'UTC',
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            push: user.preferences?.notifications?.push ?? true
          }
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.includes('notifications.')) {
      const field = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          notifications: {
            ...prev.preferences.notifications,
            [field]: checked
          }
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
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

    if (!profile.name.trim()) {
      newErrors.name = t('nameRequired');
    }

    if (!profile.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = t('emailInvalid');
    }

    if (profile.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(profile.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('phoneInvalid');
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
      setSaving(true);
      
      const result = await updateProfile(profile);
      
      if (result.success) {
        toast.success(t('profileUpdatedSuccess'));
      } else {
        toast.error(result.error || t('profileUpdateFailed'));
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(t('profileUpdateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('passwordChangeSuccess'));
        setShowPasswordModal(false);
        setOldPassword('');
        setNewPassword('');
      } else {
        toast.error(data.message || t('passwordChangeFailed'));
      }
    } catch (error) {
      toast.error(t('passwordChangeFailed'));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t('confirmDeleteAccount'))) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users/me', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          toast.success(t('accountDeletedSuccess'));
          localStorage.removeItem('token');
          navigate('/');
          window.location.reload();
        } else {
          const data = await res.json();
          toast.error(data.message || t('accountDeletionFailed'));
        }
      } catch (error) {
        toast.error(t('accountDeletionFailed'));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-gray-700">{t('home')}</Link>
            <span>/</span>
            <Link to="/user" className="hover:text-gray-700">{t('account')}</Link>
            <span>/</span>
            <span className="text-gray-900">{t('profile')}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900">{t('myProfile')}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('personalInformation')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('fullName')} *
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('enterFullName')}
                      disabled={saving}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('email')} *
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('enterEmail')}
                      disabled={saving}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('phone')}
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('enterPhone')}
                    disabled={saving}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Preferences */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('preferences')}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="profile-language" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('language')}
                      </label>
                      <select
                        id="profile-language"
                        name="preferences.language"
                        value={profile.preferences.language}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="profile-currency" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('currency')}
                      </label>
                      <select
                        id="profile-currency"
                        name="preferences.currency"
                        value={profile.preferences.currency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD (C$)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="profile-timezone" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('timezone')}
                      </label>
                      <select
                        id="profile-timezone"
                        name="preferences.timezone"
                        value={profile.preferences.timezone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Notification Preferences */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">{t('notifications')}</h4>
                    <div className="space-y-2">
                      <label htmlFor="profile-notifications-email" className="flex items-center">
                        <input
                          id="profile-notifications-email"
                          type="checkbox"
                          name="notifications.email"
                          checked={profile.preferences.notifications.email}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          disabled={saving}
                        />
                        <span className="ml-2 text-sm text-gray-700">{t('emailNotifications')}</span>
                      </label>
                      
                      <label htmlFor="profile-notifications-push" className="flex items-center">
                        <input
                          id="profile-notifications-push"
                          type="checkbox"
                          name="notifications.push"
                          checked={profile.preferences.notifications.push}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          disabled={saving}
                        />
                        <span className="ml-2 text-sm text-gray-700">{t('pushNotifications')}</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {saving ? t('saving') : t('saveChanges')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('accountActions')}</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handlePasswordChange}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  {t('changePassword')}
                </button>
                
                <Link
                  to="/user/addresses"
                  className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  {t('manageAddresses')}
                </Link>
                
                <Link
                  to="/user/orders"
                  className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  {t('viewOrderHistory')}
                </Link>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('accountStatus')}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('memberSince')}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('unknown')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('lastLogin')}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : t('unknown')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('emailVerified')}</span>
                  <span className={`text-sm font-medium ${user?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.emailVerified ? t('yes') : t('no')}
                  </span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-lg border border-red-200 p-6">
              <h3 className="text-lg font-medium text-red-900 mb-4">{t('dangerZone')}</h3>
              
              <button
                onClick={handleDeleteAccount}
                className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-100 rounded-md transition-colors border border-red-300"
              >
                {t('deleteAccount')}
              </button>
              
              <p className="mt-2 text-xs text-red-600">
                {t('deleteAccountWarning')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)}>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('changePassword')}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('oldPassword')}</label>
              <input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('newPassword')}</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 bg-gray-200 rounded">{t('cancel')}</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={changingPassword}>
                {changingPassword ? t('saving') : t('saveChanges')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserProfile; 
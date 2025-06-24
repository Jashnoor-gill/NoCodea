import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const UserDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    addresses: 0,
    comments: 0,
    downloads: 0,
    orders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      
      // Load addresses count
      const addressesResponse = await axios.get('http://localhost:5000/api/users/addresses');
      const addressesCount = addressesResponse.data.data.length;
      
      // Load comments count
      const commentsResponse = await axios.get('http://localhost:5000/api/users/comments');
      const commentsCount = commentsResponse.data.data.length;
      
      // Load downloads count
      const downloadsResponse = await axios.get('http://localhost:5000/api/users/downloads');
      const downloadsCount = downloadsResponse.data.data.length;
      
      setStats({
        addresses: addressesCount,
        comments: commentsCount,
        downloads: downloadsCount,
        orders: 0 // TODO: Implement orders API
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success(t('logoutSuccess'));
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error(t('logoutFailed'));
    }
  };

  const dashboardItems = [
    {
      title: t('myAddresses'),
      description: t('manageAddresses'),
      icon: '📍',
      link: '/user/addresses',
      count: stats.addresses,
      color: 'bg-blue-500'
    },
    {
      title: t('myOrders'),
      description: t('viewOrderHistory'),
      icon: '📦',
      link: '/user/orders',
      count: stats.orders,
      color: 'bg-orange-500'
    },
    {
      title: t('myComments'),
      description: t('manageComments'),
      icon: '💬',
      link: '/user/comments',
      count: stats.comments,
      color: 'bg-green-500'
    },
    {
      title: t('myDownloads'),
      description: t('manageDownloads'),
      icon: '📁',
      link: '/user/downloads',
      count: stats.downloads,
      color: 'bg-purple-500'
    }
  ];

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-gray-700">{t('home')}</Link>
            <span>/</span>
            <span className="text-gray-900">{t('account')}</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('myAccount')}</h1>
              <p className="text-gray-600 mt-1">{t('welcomeBack')}, {user?.name}!</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              {user?.phone && (
                <p className="text-gray-600">{user.phone}</p>
              )}
            </div>
            
            <Link
              to="/user/profile"
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
            >
              {t('editProfile')}
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                  {item.icon}
                </div>
                <span className="text-2xl font-bold text-gray-900">{item.count}</span>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('quickActions')}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/user/profile"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">👤</span>
              <div>
                <p className="font-medium text-gray-900">{t('editProfile')}</p>
                <p className="text-sm text-gray-600">{t('updatePersonalInfo')}</p>
              </div>
            </Link>
            
            <Link
              to="/user/addresses/new"
              to="/products"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">🛍️</span>
              <div>
                <p className="font-medium text-gray-900">{t('shop')}</p>
                <p className="text-sm text-gray-600">{t('browseProducts')}</p>
              </div>
            </Link>
            
            <Link
              to="/search"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">🔍</span>
              <div>
                <p className="font-medium text-gray-900">{t('search')}</p>
                <p className="text-sm text-gray-600">{t('findProducts')}</p>
              </div>
            </Link>
            
            <Link
              to="/"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">🏠</span>
              <div>
                <p className="font-medium text-gray-900">{t('home')}</p>
                <p className="text-sm text-gray-600">{t('backToHome')}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 
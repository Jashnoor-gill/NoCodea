import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const UserOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [currentPage, filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/orders', {
        params: {
          page: currentPage,
          limit: 10,
          status: filter !== 'all' ? filter : undefined
        }
      });
      
      setOrders(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error(t('ordersLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '📦';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-gray-700">{t('home')}</Link>
            <span>/</span>
            <Link to="/user" className="hover:text-gray-700">{t('account')}</Link>
            <span>/</span>
            <span className="text-gray-900">{t('orders')}</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('myOrders')}</h1>
              <p className="text-gray-600 mt-1">{t('orderHistoryDescription')}</p>
            </div>
            
            <Link
              to="/order-tracking"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {t('trackOrder')}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: t('allOrders') },
              { key: 'pending', label: t('pending') },
              { key: 'processing', label: t('processing') },
              { key: 'shipped', label: t('shipped') },
              { key: 'delivered', label: t('delivered') },
              { key: 'cancelled', label: t('cancelled') }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => handleFilterChange(filterOption.key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noOrders')}</h3>
            <p className="text-gray-600 mb-6">{t('noOrdersMessage')}</p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {t('startShopping')}
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('previous')}
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('next')}
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

// Order Card Component
const OrderCard = ({ order, getStatusColor, getStatusIcon }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {t('order')} #{order.orderNumber}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            <span className="mr-1">{getStatusIcon(order.status)}</span>
            {order.status}
          </span>
          
          <span className="text-lg font-semibold text-gray-900">
            ${order.total?.toFixed(2)}
          </span>
        </div>
      </div>
      
      {/* Order Items Preview */}
      {order.items && order.items.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-700">{t('items')}:</span>
            <span className="text-sm text-gray-600">{order.items.length}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {order.items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {item.product?.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-8 h-8 object-cover rounded-md"
                  />
                )}
                <span className="text-sm text-gray-600">{item.product?.name}</span>
                {index < Math.min(3, order.items.length - 1) && <span className="text-gray-400">•</span>}
              </div>
            ))}
            {order.items.length > 3 && (
              <span className="text-sm text-gray-500">+{order.items.length - 3} more</span>
            )}
          </div>
        </div>
      )}
      
      {/* Order Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <Link
            to={`/user/orders/${order._id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {t('viewDetails')}
          </Link>
          
          {order.status === 'delivered' && (
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              {t('writeReview')}
            </button>
          )}
          
          {order.status === 'shipped' && (
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              {t('trackPackage')}
            </button>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          {t('orderId')}: {order.orderNumber}
        </div>
      </div>
    </div>
  );
};

export default UserOrders; 
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const OrderTracking = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    customerOrderId: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
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

    if (!formData.customerOrderId.trim()) {
      newErrors.customerOrderId = t('orderIdRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('emailInvalid');
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
      setLoading(true);
      setErrors({});
      setOrder(null);
      
      const response = await fetch('http://localhost:5000/api/orders/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
        toast.success(t('orderFound'));
      } else {
        toast.error(data.message || t('orderNotFound'));
      }
    } catch (error) {
      console.error('Order tracking error:', error);
      toast.error(t('trackingFailed'));
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-gray-700">{t('home')}</a>
            <span>/</span>
            <span className="text-gray-900">{t('orderTracking')}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900">{t('orderTracking')}</h1>
          <p className="text-gray-600 mt-2">{t('trackOrderDescription')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tracking Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('trackYourOrder')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('orderId')} *
                </label>
                <input
                  type="text"
                  name="customerOrderId"
                  value={formData.customerOrderId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.customerOrderId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterOrderId')}
                  disabled={loading}
                />
                {errors.customerOrderId && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerOrderId}</p>
                )}
              </div>

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
                    {t('tracking')}
                  </div>
                ) : (
                  t('trackOrder')
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">{t('needHelp')}</p>
                  <p className="mt-1">{t('trackingHelpText')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          {order && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('orderDetails')}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{t('orderId')}:</span>
                  <span className="text-sm text-gray-900 font-mono">{order.orderNumber}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{t('orderDate')}:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{t('total')}:</span>
                  <span className="text-sm text-gray-900 font-semibold">
                    ${order.total?.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{t('status')}:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    <span className="mr-1">{getStatusIcon(order.status)}</span>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{t('orderItems')}</h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                          <p className="text-sm text-gray-600">
                            {t('quantity')}: {item.quantity} × ${item.price?.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${(item.quantity * item.price)?.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{t('shippingAddress')}</h3>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.address1}</p>
                    {order.shippingAddress.address2 && (
                      <p className="text-sm text-gray-600">{order.shippingAddress.address2}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking; 
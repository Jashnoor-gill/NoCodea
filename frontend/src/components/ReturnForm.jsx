import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const ReturnForm = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    customerOrderId: '',
    email: user?.email || '',
    returnReasonId: '',
    description: '',
    quantity: 1
  });
  
  const [returnReasons, setReturnReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderValid, setOrderValid] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [step, setStep] = useState('order'); // 'order' or 'form'

  useEffect(() => {
    fetchReturnReasons();
  }, []);

  const fetchReturnReasons = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/returns/reasons');
      const data = await response.json();
      
      if (data.success) {
        setReturnReasons(data.data);
      }
    } catch (error) {
      console.error('Error fetching return reasons:', error);
    }
  };

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

  const validateOrder = async () => {
    if (!formData.customerOrderId || !formData.email) {
      setErrors({
        customerOrderId: !formData.customerOrderId ? t('orderIdRequired') : '',
        email: !formData.email ? t('emailRequired') : ''
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/returns/check/${formData.customerOrderId}?email=${formData.email}`
      );
      const data = await response.json();

      if (data.success && data.data.orderExists) {
        setOrderValid(true);
        setOrderDetails(data.data.order);
        setStep('form');
        toast.success(t('orderFound'));
      } else {
        setOrderValid(false);
        setOrderDetails(null);
        toast.error(t('orderNotFound'));
      }
    } catch (error) {
      console.error('Error validating order:', error);
      toast.error(t('orderValidationError'));
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.returnReasonId) {
      newErrors.returnReasonId = t('returnReasonRequired');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('descriptionRequired');
    } else if (formData.description.length < 10) {
      newErrors.description = t('descriptionMinLength');
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = t('quantityRequired');
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
      
      const response = await fetch('http://localhost:5000/api/returns/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t('returnSubmitted'));
        setFormData({
          customerOrderId: '',
          email: user?.email || '',
          returnReasonId: '',
          description: '',
          quantity: 1
        });
        setStep('order');
        setOrderValid(false);
        setOrderDetails(null);
      } else {
        toast.error(data.message || t('returnSubmissionFailed'));
      }
    } catch (error) {
      console.error('Error submitting return:', error);
      toast.error(t('returnSubmissionFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToOrder = () => {
    setStep('order');
    setOrderValid(false);
    setOrderDetails(null);
  };

  if (step === 'form') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('returnForm')}</h2>
          <button
            onClick={handleBackToOrder}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {t('backToOrder')}
          </button>
        </div>

        {/* Order Summary */}
        {orderDetails && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">{t('orderSummary')}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">{t('orderId')}:</span>
                <span className="ml-2">{orderDetails.customerOrderId}</span>
              </div>
              <div>
                <span className="font-medium">{t('orderTotal')}:</span>
                <span className="ml-2">${orderDetails.total}</span>
              </div>
              <div>
                <span className="font-medium">{t('orderStatus')}:</span>
                <span className="ml-2">{orderDetails.status}</span>
              </div>
              <div>
                <span className="font-medium">{t('orderDate')}:</span>
                <span className="ml-2">
                  {new Date(orderDetails.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('returnReason')} *
            </label>
            <select
              name="returnReasonId"
              value={formData.returnReasonId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.returnReasonId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">{t('selectReturnReason')}</option>
              {returnReasons.map((reason) => (
                <option key={reason._id} value={reason._id}>
                  {reason.name}
                </option>
              ))}
            </select>
            {errors.returnReasonId && (
              <p className="mt-1 text-sm text-red-600">{errors.returnReasonId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('quantity')} *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('description')} *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('describeReturnReason')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {t('descriptionHelp')}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('submitting')}
              </div>
            ) : (
              t('submitReturn')
            )}
          </button>
        </form>

        {/* Return Policy Notice */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">{t('returnPolicy')}</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• {t('returnPolicy1')}</li>
            <li>• {t('returnPolicy2')}</li>
            <li>• {t('returnPolicy3')}</li>
            <li>• {t('returnPolicy4')}</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('returnForm')}</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          {t('returnFormDescription')}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
          />
          {errors.customerOrderId && (
            <p className="mt-1 text-sm text-red-600">{errors.customerOrderId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <button
          onClick={validateOrder}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('validating')}
            </div>
          ) : (
            t('validateOrder')
          )}
        </button>
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">{t('needHelp')}</h4>
        <p className="text-sm text-blue-800">
          {t('returnHelpText')}
        </p>
        <div className="mt-2 text-sm text-blue-700">
          <p>📧 {t('contactEmail')}: support@nocodea.com</p>
          <p>📞 {t('contactPhone')}: +1 (555) 123-4567</p>
        </div>
      </div>
    </div>
  );
};

export default ReturnForm; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const UserAddresses = () => {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/addresses');
      setAddresses(response.data.data);
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error(t('addressesLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm(t('confirmDeleteAddress'))) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/users/addresses/${addressId}`);
      toast.success(t('addressDeletedSuccess'));
      loadAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error(t('addressDeleteFailed'));
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await axios.put(`http://localhost:5000/api/users/addresses/${addressId}/default`);
      toast.success(t('defaultAddressUpdated'));
      loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error(t('defaultAddressUpdateFailed'));
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-gray-700">{t('home')}</Link>
            <span>/</span>
            <Link to="/user" className="hover:text-gray-700">{t('account')}</Link>
            <span>/</span>
            <span className="text-gray-900">{t('addresses')}</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{t('myAddresses')}</h1>
            <Link
              to="/user/addresses/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {t('addNewAddress')}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noAddresses')}</h3>
            <p className="text-gray-600 mb-6">{t('noAddressesMessage')}</p>
            <Link
              to="/user/addresses/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {t('addFirstAddress')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Address Card Component
const AddressCard = ({ address, onDelete, onSetDefault }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium text-gray-900">
            {address.firstName} {address.lastName}
          </h3>
          {address.isDefault && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {t('default')}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSetDefault(address._id)}
            disabled={address.isDefault}
            className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
          >
            {t('setDefault')}
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        {address.company && (
          <p className="font-medium">{address.company}</p>
        )}
        <p>{address.address1}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>
          {address.city}, {address.regionName} {address.postalCode}
        </p>
        <p>{address.countryName}</p>
        <p>{address.phone}</p>
      </div>
      
      <div className="flex items-center justify-end space-x-2 mt-6 pt-4 border-t border-gray-200">
        <Link
          to={`/user/addresses/${address._id}/edit`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {t('edit')}
        </Link>
        <button
          onClick={() => onDelete(address._id)}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          {t('delete')}
        </button>
      </div>
    </div>
  );
};

export default UserAddresses; 
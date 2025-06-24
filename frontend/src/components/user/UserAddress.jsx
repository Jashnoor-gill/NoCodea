import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const UserAddress = () => {
  const { addressId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: '',
    region: '',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    loadCountries();
    if (addressId) {
      loadAddress();
    }
  }, [addressId]);

  useEffect(() => {
    if (address.country) {
      loadRegions(address.country);
    }
  }, [address.country]);

  const loadCountries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/countries');
      setCountries(response.data.data);
    } catch (error) {
      console.error('Error loading countries:', error);
      toast.error(t('countriesLoadFailed'));
    }
  };

  const loadRegions = async (countryId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/regions`, {
        params: { country: countryId }
      });
      setRegions(response.data.data);
    } catch (error) {
      console.error('Error loading regions:', error);
    }
  };

  const loadAddress = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users/addresses/${addressId}`);
      setAddress(response.data.data);
    } catch (error) {
      console.error('Error loading address:', error);
      toast.error(t('addressLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (addressId) {
        await axios.put(`http://localhost:5000/api/users/addresses/${addressId}`, address);
        toast.success(t('addressUpdatedSuccess'));
      } else {
        await axios.post('http://localhost:5000/api/users/addresses', address);
        toast.success(t('addressCreatedSuccess'));
      }
      
      navigate('/user/addresses');
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(t('addressSaveFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (loading && addressId) {
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
            <Link to="/user/addresses" className="hover:text-gray-700">{t('addresses')}</Link>
            <span>/</span>
            <span className="text-gray-900">
              {addressId ? t('editAddress') : t('addAddress')}
            </span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {addressId ? t('editAddress') : t('addAddress')}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('personalInformation')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('firstName')} *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={address.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('lastName')} *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={address.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('company')}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={address.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('addressInformation')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('addressLine1')} *
                  </label>
                  <input
                    type="text"
                    name="address1"
                    value={address.address1}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('addressLine2')}
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={address.address2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('city')} *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('postalCode')} *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('country')} *
                    </label>
                    <select
                      name="country"
                      value={address.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t('selectCountry')}</option>
                      {countries.map((country) => (
                        <option key={country._id} value={country._id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('region')} *
                  </label>
                  <select
                    name="region"
                    value={address.region}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t('selectRegion')}</option>
                    {regions.map((region) => (
                      <option key={region._id} value={region._id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Default Address */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={address.isDefault}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                {t('setAsDefaultAddress')}
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                to="/user/addresses"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? t('saving') : (addressId ? t('updateAddress') : t('saveAddress'))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserAddress; 
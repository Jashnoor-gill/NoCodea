import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const SearchHeader = ({ className = '' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    // Handle click outside autocomplete
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAutocomplete = async (query) => {
    if (query.length < 2) {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/search/autocomplete', {
        params: { q: query }
      });
      setAutocompleteResults(response.data.data);
      setShowAutocomplete(true);
    } catch (error) {
      console.error('Error getting autocomplete:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 2) {
      handleAutocomplete(value);
    } else {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowAutocomplete(false);
    if (searchTerm.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleAutocompleteSelect = (item) => {
    setSearchTerm(item.name || item.title);
    setShowAutocomplete(false);
    navigate(`/search?search=${encodeURIComponent(item.name || item.title)}`);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'product':
        return '📦';
      case 'category':
        return '📁';
      case 'manufacturer':
        return '🏭';
      case 'vendor':
        return '🏪';
      case 'post':
        return '📝';
      default:
        return '🔍';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchInputChange}
            placeholder={t('searchPlaceholder')}
            className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {/* Search Button */}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-3 flex items-center bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        {/* Autocomplete Dropdown */}
        {showAutocomplete && autocompleteResults.length > 0 && (
          <div
            ref={autocompleteRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {autocompleteResults.map((item, index) => (
              <button
                key={`${item.type}-${item._id || index}`}
                onClick={() => handleAutocompleteSelect(item)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <span className="text-lg">{getResultIcon(item.type)}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {item.name || item.title}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {item.type}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchHeader; 
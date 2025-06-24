import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [searchType, setSearchType] = useState(searchParams.get('type') || 'all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });
  
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      performSearch();
    }
  }, [searchTerm, searchType, pagination.page]);

  useEffect(() => {
    // Update URL params when search changes
    if (searchTerm) {
      setSearchParams({ search: searchTerm, type: searchType });
    }
  }, [searchTerm, searchType]);

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

  const performSearch = async () => {
    try {
      setLoading(true);
      const params = {
        q: searchTerm,
        type: searchType,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await axios.get('http://localhost:5000/api/search', { params });
      setResults(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.meta.total
      }));
    } catch (error) {
      console.error('Error performing search:', error);
      toast.error(t('searchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAutocomplete = async (query) => {
    if (query.length < 2) {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/search/autocomplete', {
        params: { q: query, type: searchType }
      });
      setAutocompleteResults(response.data.data);
      setShowAutocomplete(true);
    } catch (error) {
      console.error('Error getting autocomplete:', error);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
    
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
      performSearch();
    }
  };

  const handleAutocompleteSelect = (item) => {
    setSearchTerm(item.name || item.title);
    setShowAutocomplete(false);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getResultLink = (item) => {
    switch (item.type) {
      case 'product':
        return `/products/${item.slug}`;
      case 'category':
        return `/categories/${item.slug}`;
      case 'manufacturer':
        return `/manufacturers/${item.slug}`;
      case 'vendor':
        return `/vendors/${item.slug}`;
      case 'post':
        return `/posts/${item.slug}`;
      default:
        return '#';
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-gray-700">{t('home')}</Link>
            <span>/</span>
            <span className="text-gray-900">{t('search')}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('search')}</h1>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  placeholder={t('searchPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
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
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <span className="text-lg">{getResultIcon(item.type)}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {item.name || item.title}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {item.type}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('allTypes')}</option>
                <option value="product">{t('products')}</option>
                <option value="category">{t('categories')}</option>
                <option value="manufacturer">{t('manufacturers')}</option>
                <option value="vendor">{t('vendors')}</option>
                <option value="post">{t('posts')}</option>
              </select>
              
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('search')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {t('searchResults', { 
                    term: searchTerm,
                    count: pagination.total
                  })}
                </p>
              </div>

              {/* Results Grid */}
              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.map((item) => (
                    <SearchResultCard key={`${item.type}-${item._id}`} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noSearchResults')}</h3>
                  <p className="text-gray-600">
                    {t('noSearchResultsMessage', { term: searchTerm })}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('previous')}
                    </button>
                    
                    {[...Array(Math.ceil(pagination.total / pagination.limit))].map((_, i) => {
                      const page = i + 1;
                      const isCurrent = page === pagination.page;
                      const isNearCurrent = Math.abs(page - pagination.page) <= 2;
                      
                      if (isCurrent || isNearCurrent || page === 1 || page === Math.ceil(pagination.total / pagination.limit)) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 border rounded-md text-sm font-medium ${
                              isCurrent
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === 2 || page === Math.ceil(pagination.total / pagination.limit) - 1) {
                        return <span key={page} className="px-2 text-gray-500">...</span>;
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('next')}
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Search Result Card Component
const SearchResultCard = ({ item }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Link to={getResultLink(item)}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
          <img
            src={item.image || item.logo || '/placeholder-product.jpg'}
            alt={item.name || item.title}
            className="w-full h-48 object-cover"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">{getResultIcon(item.type)}</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
            {item.type}
          </span>
        </div>
        
        <Link to={getResultLink(item)}>
          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
            {item.name || item.title}
          </h3>
        </Link>
        
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {item.shortDescription || item.description}
        </p>
        
        {item.type === 'product' && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {item.salePrice ? (
                <>
                  <span className="text-lg font-bold text-red-600">
                    ${item.salePrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${item.price}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  ${item.price}
                </span>
              )}
            </div>
            
            {item.stock > 0 ? (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                {t('inStock')}
              </span>
            ) : (
              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                {t('outOfStock')}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const getResultLink = (item) => {
  switch (item.type) {
    case 'product':
      return `/products/${item.slug}`;
    case 'category':
      return `/categories/${item.slug}`;
    case 'manufacturer':
      return `/manufacturers/${item.slug}`;
    case 'vendor':
      return `/vendors/${item.slug}`;
    case 'post':
      return `/posts/${item.slug}`;
    default:
      return '#';
  }
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

export default Search; 
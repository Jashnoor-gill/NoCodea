import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const ManufacturerDetail = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [manufacturer, setManufacturer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });

  useEffect(() => {
    if (slug) {
      loadManufacturer();
      loadProducts();
    }
  }, [slug, pagination.page]);

  const loadManufacturer = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/manufacturers/slug/${slug}`);
      setManufacturer(response.data.data);
    } catch (error) {
      console.error('Error loading manufacturer:', error);
      toast.error(t('manufacturerLoadFailed'));
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        manufacturer: manufacturer?._id,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await axios.get('http://localhost:5000/api/products', { params });
      setProducts(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.meta.total
      }));
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error(t('productsLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  if (!manufacturer && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('manufacturerNotFound')}</h1>
          <Link to="/products" className="text-blue-600 hover:underline">
            {t('backToProducts')}
          </Link>
        </div>
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
            <Link to="/products" className="hover:text-gray-700">{t('products')}</Link>
            <span>/</span>
            <span className="text-gray-900">{manufacturer?.name}</span>
          </nav>
          
          <div className="flex items-center space-x-6">
            {manufacturer?.logo && (
              <img
                src={manufacturer.logo}
                alt={manufacturer.name}
                className="w-24 h-24 object-contain"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{manufacturer?.name}</h1>
              {manufacturer?.description && (
                <p className="mt-2 text-gray-600">{manufacturer.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

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
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {t('showingResults', { 
                  start: (pagination.page - 1) * pagination.limit + 1,
                  end: Math.min(pagination.page * pagination.limit, pagination.total),
                  total: pagination.total
                })}
              </p>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏭</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noProductsFound')}</h3>
                <p className="text-gray-600">{t('noProductsFromManufacturer')}</p>
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
                    
                    if (isCurrent || page === 1 || page === Math.ceil(pagination.total / pagination.limit)) {
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
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
          <img
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.shortDescription}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  ${product.salePrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>
          
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {t('inStock')}
            </span>
          ) : (
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
              {t('outOfStock')}
            </span>
          )}
        </div>
        
        <div className="mt-3 flex items-center space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
            {t('addToCart')}
          </button>
          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDetail; 
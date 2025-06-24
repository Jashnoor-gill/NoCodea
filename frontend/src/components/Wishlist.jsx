import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const Wishlist = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all'); // 'all', 'low', 'medium', 'high'
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, currentPage, filter]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = `http://localhost:5000/api/wishlist?page=${currentPage}&limit=12`;
      if (filter !== 'all') {
        url = `http://localhost:5000/api/wishlist/priority/${filter}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        if (filter !== 'all') {
          setWishlist(data.data);
          setTotalPages(1);
        } else {
          setWishlist(data.data);
          setTotalPages(data.pagination.pages);
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error(t('wishlistLoadError'));
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId, priority = 'medium', notes = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          priority,
          notes
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t('addedToWishlist'));
        fetchWishlist();
      } else {
        toast.error(data.message || t('addToWishlistError'));
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error(t('addToWishlistError'));
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t('removedFromWishlist'));
        fetchWishlist();
      } else {
        toast.error(data.message || t('removeFromWishlistError'));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error(t('removeFromWishlistError'));
    }
  };

  const updateWishlistItem = async (productId, updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/wishlist/${productId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t('wishlistItemUpdated'));
        setEditingItem(null);
        fetchWishlist();
      } else {
        toast.error(data.message || t('updateWishlistError'));
      }
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      toast.error(t('updateWishlistError'));
    }
  };

  const moveToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/wishlist/move-to-cart/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t('movedToCart'));
        // TODO: Implement actual cart functionality
      } else {
        toast.error(data.message || t('moveToCartError'));
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
      toast.error(t('moveToCartError'));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return t('highPriority');
      case 'medium':
        return t('mediumPriority');
      case 'low':
        return t('lowPriority');
      default:
        return t('mediumPriority');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('wishlistLoginRequired')}</h2>
          <p className="text-gray-600 mb-6">{t('wishlistLoginDescription')}</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            {t('loginToViewWishlist')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('myWishlist')}</h1>
        <p className="text-gray-600">{t('wishlistDescription')}</p>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('allItems')}
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'high'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('highPriority')}
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'medium'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('mediumPriority')}
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'low'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('lowPriority')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('wishlistEmpty')}</h2>
          <p className="text-gray-600 mb-6">{t('wishlistEmptyDescription')}</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            {t('browseProducts')}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={item.productId?.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.productId?.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {getPriorityLabel(item.priority)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(item.productId._id)}
                    className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.productId?.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.productId?.price}
                    </span>
                    {item.priceWhenAdded && item.priceWhenAdded !== item.productId?.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.priceWhenAdded}
                      </span>
                    )}
                  </div>

                  {editingItem === item._id ? (
                    <div className="space-y-3">
                      <select
                        value={item.priority}
                        onChange={(e) => updateWishlistItem(item.productId._id, { priority: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="low">{t('lowPriority')}</option>
                        <option value="medium">{t('mediumPriority')}</option>
                        <option value="high">{t('highPriority')}</option>
                      </select>
                      <textarea
                        placeholder={t('addNotes')}
                        defaultValue={item.notes}
                        onBlur={(e) => updateWishlistItem(item.productId._id, { notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                        rows="2"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {item.notes && (
                        <p className="text-sm text-gray-600 line-clamp-2">{item.notes}</p>
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingItem(item._id)}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm hover:bg-gray-200 transition-colors"
                        >
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => moveToCart(item.productId._id)}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors"
                        >
                          {t('addToCart')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('previous')}
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-2 border rounded-md text-sm font-medium ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
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
  );
};

export default Wishlist; 
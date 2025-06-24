import React, { createContext, useContext, useCallback } from 'react';
import { useToast } from '../components/ToastProvider';

const NoCodeaThemeContext = createContext();

export function NoCodeaThemeProvider({ children }) {
  const { showToast } = useToast();

  // --- AJAX helper ---
  const apiCall = useCallback(async (url, params = {}, method = 'POST') => {
    const options = {
      method,
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    };
    if (method === 'POST') {
      options.body = new URLSearchParams(params);
    }
    const res = await fetch(url, options);
    if (!res.ok) throw new Error('API error');
    return await res.text();
  }, []);

  // --- Cart ---
  const cartApi = useCallback(async (action, params = {}) => {
    return apiCall('/api/cart', { action, ...params });
  }, [apiCall]);
  const addToCart = useCallback(async (productId, options = {}) => {
    await cartApi('add', { product_id: productId, ...options });
    showToast({ bg: 'bg-green-600', title: 'Cart', message: 'Product added to cart!' });
  }, [cartApi, showToast]);
  const removeFromCart = useCallback(async (key) => {
    await cartApi('remove', { key });
    showToast({ bg: 'bg-red-600', title: 'Cart', message: 'Product removed from cart.' });
  }, [cartApi, showToast]);

  // --- Wishlist ---
  const wishlistApi = useCallback(async (action, params = {}) => {
    return apiCall('/api/wishlist', { action, ...params });
  }, [apiCall]);
  const addToWishlist = useCallback(async (productId) => {
    await wishlistApi('add', { product_id: productId });
    showToast({ bg: 'bg-pink-600', title: 'Wishlist', message: 'Product added to wishlist!' });
  }, [wishlistApi, showToast]);

  // --- Compare ---
  const compareApi = useCallback(async (action, params = {}) => {
    return apiCall('/api/compare', { action, ...params });
  }, [apiCall]);
  const addToCompare = useCallback(async (productId) => {
    await compareApi('add', { product_id: productId });
    showToast({ bg: 'bg-blue-600', title: 'Compare', message: 'Product added to compare.' });
  }, [compareApi, showToast]);

  // --- Comments ---
  const commentsApi = useCallback(async (action, params = {}) => {
    return apiCall('/api/comments', { action, ...params });
  }, [apiCall]);
  const addComment = useCallback(async (params) => {
    await commentsApi('addComment', params);
    showToast({ bg: 'bg-green-700', title: 'Comment', message: 'Comment added.' });
  }, [commentsApi, showToast]);

  // --- User ---
  const userApi = useCallback(async (action, params = {}) => {
    return apiCall('/api/user', { action, ...params });
  }, [apiCall]);
  const login = useCallback(async (params) => {
    await userApi('login', params);
    showToast({ bg: 'bg-blue-700', title: 'Login', message: 'Logged in successfully.' });
  }, [userApi, showToast]);

  // --- Search ---
  const searchApi = useCallback(async (params = {}) => {
    return apiCall('/api/search', params, 'GET');
  }, [apiCall]);

  // --- Alert ---
  const showAlert = useCallback((message) => {
    showToast({ bg: 'bg-yellow-600', title: 'Alert', message });
  }, [showToast]);

  return (
    <NoCodeaThemeContext.Provider value={{
      addToCart,
      removeFromCart,
      addToWishlist,
      addToCompare,
      addComment,
      login,
      searchApi,
      showAlert,
    }}>
      {children}
    </NoCodeaThemeContext.Provider>
  );
}

export function useNoCodeaTheme() {
  return useContext(NoCodeaThemeContext);
} 
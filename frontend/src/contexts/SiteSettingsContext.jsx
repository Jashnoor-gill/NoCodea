import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const defaultSettings = {
  siteName: 'NoCode Builder',
  siteDescription: 'Build websites without code',
  theme: 'light',
  language: 'en'
};

const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/settings');
        if (res.data) {
          setSettings({ ...defaultSettings, ...res.data });
        }
      } catch (err) {
        console.error('Failed to fetch site settings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const value = {
    settings,
    loading,
    error,
    setSettings
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}; 
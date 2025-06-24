import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAdminMenu } from '../services/api';

const AdminMenuContext = createContext();

export function AdminMenuProvider({ children }) {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminMenu()
      .then(setMenu)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminMenuContext.Provider value={{ menu, loading, error }}>
      {children}
    </AdminMenuContext.Provider>
  );
}

export function useAdminMenu() {
  return useContext(AdminMenuContext);
} 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAdmin(false);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  if (isAdmin === null) return <div>Checking admin access...</div>;
  if (!isAdmin) return null;
  return children;
};

export default RequireAdmin; 
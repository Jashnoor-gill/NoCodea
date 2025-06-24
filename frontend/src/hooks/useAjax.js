import { useState, useCallback } from 'react';

export function useAjax(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (override = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { ...options, ...override });
      if (!res.ok) throw new Error('Network error');
      const json = await res.json();
      setData(json);
      return json;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { data, loading, error, refetch: fetchData };
} 
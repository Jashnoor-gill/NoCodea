import { useEffect } from 'react';

export function useDataAttr(ref, key, value) {
  useEffect(() => {
    if (!ref.current) return;
    if (value !== undefined) {
      ref.current.setAttribute(`data-${key}`, value);
    }
    return () => {
      if (value !== undefined) ref.current.removeAttribute(`data-${key}`);
    };
  }, [ref, key, value]);
} 
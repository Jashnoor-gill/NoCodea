import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function usePortal(children, selector = '#portal-root') {
  const elRef = useRef(null);
  useEffect(() => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('div');
      el.id = selector.replace('#', '');
      document.body.appendChild(el);
    }
    elRef.current = el;
  }, [selector]);
  if (!elRef.current) return null;
  return createPortal(children, elRef.current);
} 
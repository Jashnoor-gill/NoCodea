import { useEffect, useRef } from 'react';

export function useEventListener(target, type, handler, options) {
  const savedHandler = useRef();
  useEffect(() => { savedHandler.current = handler; }, [handler]);
  useEffect(() => {
    const element = typeof target === 'function' ? target() : target?.current || target || window;
    if (!element?.addEventListener) return;
    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(type, eventListener, options);
    return () => element.removeEventListener(type, eventListener, options);
  }, [target, type, options]);
} 
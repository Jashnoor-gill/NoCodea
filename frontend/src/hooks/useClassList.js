import { useEffect } from 'react';

export function useClassList(ref, classNames = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    classNames.forEach((cls) => el.classList.add(cls));
    return () => classNames.forEach((cls) => el.classList.remove(cls));
  }, [ref, classNames]);
} 
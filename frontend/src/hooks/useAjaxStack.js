import { useRef } from 'react';

/**
 * useAjaxStack - React hook for managing a queue of async AJAX calls (like AjaxStack in admin.js)
 * Usage: const { add } = useAjaxStack(); add(() => fetch(...))
 */
export function useAjaxStack() {
  const stack = useRef([]);
  const running = useRef(false);

  const execute = async () => {
    if (running.current || stack.current.length === 0) return;
    running.current = true;
    while (stack.current.length > 0) {
      const call = stack.current.shift();
      try {
        await call();
      } catch (e) {
        // Optionally handle error
      }
    }
    running.current = false;
  };

  const add = (call) => {
    stack.current.push(call);
    execute();
  };

  return { add };
} 
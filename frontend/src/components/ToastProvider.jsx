import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({
    bg = 'bg-blue-600',
    title = '',
    message = '',
    position = 'bottom',
    duration = 4000,
    id = null,
  }) => {
    const toastId = id || `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id: toastId, bg, title, message, position }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toasts */}
      <div className="fixed z-50 w-full flex flex-col items-center pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto max-w-md w-full shadow-lg rounded-lg mt-2 px-4 py-3 text-white ${toast.bg} ${toast.position === 'top' ? 'top-4' : 'bottom-4'} animate-fade-in-out`}
            style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', [toast.position]: '1rem' }}
            role="alert"
            aria-live="assertive"
          >
            <div className="font-bold mb-1">{toast.title}</div>
            <div>{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

// Tailwind animation (add to your global CSS):
// @keyframes fade-in-out { 0% { opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { opacity: 0; } }
// .animate-fade-in-out { animation: fade-in-out 4s both; } 
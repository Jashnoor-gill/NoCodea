import React, { useState } from 'react';

export default function Alert({ type = 'info', children, dismissible = false, className = '' }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const typeClasses = {
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return (
    <div className={`relative rounded px-4 py-3 mb-4 ${typeClasses[type] || typeClasses.info} ${className}`} role="alert">
      {children}
      {dismissible && (
        <button
          className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700 dark:hover:text-white focus:outline-none"
          onClick={() => setOpen(false)}
          aria-label="Close alert"
        >
          &times;
        </button>
      )}
    </div>
  );
} 
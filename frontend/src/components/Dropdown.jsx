import React, { useState, useRef, useEffect } from 'react';

export default function Dropdown({ label, children, className = '', menuClass = '' }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef();
  const menuRef = useRef();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!menuRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
        type="button"
      >
        {label}
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div
          ref={menuRef}
          className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${menuClass}`}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
} 
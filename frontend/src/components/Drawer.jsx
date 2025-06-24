import React, { useEffect, useRef } from 'react';

export default function Drawer({ open, onClose, side = 'left', title, children, className = '', showClose = true }) {
  const overlayRef = useRef();
  const drawerRef = useRef();

  // Focus trap
  useEffect(() => {
    if (open && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Click outside to close
  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose && onClose();
  };

  if (!open) return null;

  const sideClass = side === 'right' ? 'right-0' : 'left-0';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm"
      onClick={onOverlayClick}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        ref={drawerRef}
        className={`fixed top-0 ${sideClass} h-full w-80 bg-white dark:bg-gray-900 shadow-lg p-6 outline-none transition-transform duration-300 ${open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full'} ${className}`}
        tabIndex={0}
        role="document"
        aria-labelledby="drawer-title"
      >
        {showClose && (
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
        {title && <h2 id="drawer-title" className="text-xl font-semibold mb-4">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
} 
import React, { useEffect, useRef } from 'react';

export default function Modal({ open, onClose, title, children, className = '', showClose = true }) {
  const overlayRef = useRef();
  const dialogRef = useRef();

  // Focus trap
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
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

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onOverlayClick}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        ref={dialogRef}
        className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-6 outline-none ${className}`}
        tabIndex={0}
        role="document"
        aria-labelledby="modal-title"
      >
        {showClose && (
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
        {title && <h2 id="modal-title" className="text-xl font-semibold mb-4">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
} 
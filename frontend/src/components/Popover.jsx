import React, { useState, useRef, useEffect } from 'react';

export default function Popover({ trigger, content, className = '', popoverClass = '' }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef();
  const popoverRef = useRef();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!popoverRef.current.contains(e.target) && !triggerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span ref={triggerRef} onClick={() => setOpen((v) => !v)} tabIndex={0} aria-haspopup="true" aria-expanded={open}>
        {trigger}
      </span>
      {open && (
        <span
          ref={popoverRef}
          className={`absolute z-50 mt-2 p-4 bg-white dark:bg-gray-900 rounded shadow-lg border border-gray-200 dark:border-gray-700 ${popoverClass}`}
          role="dialog"
        >
          {content}
        </span>
      )}
    </span>
  );
} 
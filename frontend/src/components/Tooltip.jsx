import React, { useState, useRef } from 'react';

export default function Tooltip({ children, content, position = 'top', className = '' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  return (
    <span
      className="relative inline-block"
      ref={ref}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      aria-describedby="tooltip"
    >
      {children}
      {visible && (
        <span
          id="tooltip"
          role="tooltip"
          className={`absolute z-50 px-2 py-1 text-xs rounded bg-gray-800 text-white whitespace-nowrap shadow-lg ${position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : ''} ${position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : ''} ${position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : ''} ${position === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' : ''} ${className}`}
        >
          {content}
        </span>
      )}
    </span>
  );
} 
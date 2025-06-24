import React, { useState } from 'react';

export default function Accordion({ items = [], allowMultiple = false, className = '' }) {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggle = (idx) => {
    setOpenIndexes((prev) => {
      if (allowMultiple) {
        return prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx];
      } else {
        return prev.includes(idx) ? [] : [idx];
      }
    });
  };

  return (
    <div className={`w-full ${className}`} role="presentation">
      {items.map((item, idx) => (
        <div key={idx} className="border-b border-gray-200 dark:border-gray-700">
          <button
            className="w-full flex justify-between items-center py-4 px-6 text-left focus:outline-none focus:ring"
            aria-expanded={openIndexes.includes(idx)}
            aria-controls={`accordion-panel-${idx}`}
            onClick={() => toggle(idx)}
          >
            <span>{item.title}</span>
            <svg className={`w-5 h-5 transform transition-transform ${openIndexes.includes(idx) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <div
            id={`accordion-panel-${idx}`}
            className={`overflow-hidden transition-all duration-300 ${openIndexes.includes(idx) ? 'max-h-96 py-4 px-6' : 'max-h-0 p-0'}`}
            role="region"
            aria-labelledby={`accordion-header-${idx}`}
          >
            {openIndexes.includes(idx) && item.content}
          </div>
        </div>
      ))}
    </div>
  );
} 
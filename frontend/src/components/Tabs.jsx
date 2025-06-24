import React, { useState } from 'react';

export default function Tabs({ tabs = [], className = '' }) {
  const [active, setActive] = useState(0);

  return (
    <div className={`w-full ${className}`}>
      <div role="tablist" className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={active === idx}
            aria-controls={`tab-panel-${idx}`}
            id={`tab-${idx}`}
            className={`px-4 py-2 -mb-px border-b-2 transition-colors duration-200 focus:outline-none ${active === idx ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 dark:text-gray-300'}`}
            onClick={() => setActive(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs[active] && (
          <div
            id={`tab-panel-${active}`}
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
          >
            {tabs[active].content}
          </div>
        )}
      </div>
    </div>
  );
} 
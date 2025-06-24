import React, { useState, useRef, useEffect } from 'react';

// Utility: Convert hex to rgba
function hexToRgba(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length === 6) c += 'ff';
  const num = parseInt(c, 16);
  return {
    r: (num >> 24) & 255,
    g: (num >> 16) & 255,
    b: (num >> 8) & 255,
    a: ((num & 255) / 255)
  };
}

// Utility: Convert rgba to hex
function rgbaToHex({ r, g, b, a }) {
  const toHex = v => v.toString(16).padStart(2, '0');
  return (
    '#' + toHex(r) + toHex(g) + toHex(b) + (a < 1 ? toHex(Math.round(a * 255)) : '')
  );
}

// Utility: Clamp value
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function ColorPicker({
  value = '#ff0000',
  onChange,
  swatches = [
    '#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51',
    '#d62828', '#023e8a', '#0077b6', '#0096c7', '#00b4d8', '#48cae4'
  ],
  alpha = true,
  format = 'hex',
  className = '',
  style = {},
  inline = false,
}) {
  // Internal color state
  const [color, setColor] = useState(value);
  const [show, setShow] = useState(inline);
  const [input, setInput] = useState(value);
  const pickerRef = useRef();

  useEffect(() => {
    setColor(value);
    setInput(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (inline || !show) return;
    const handle = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setShow(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [show, inline]);

  // Handle color input change
  const handleInput = (e) => {
    setInput(e.target.value);
    if (/^#([0-9a-f]{3,8})$/i.test(e.target.value)) {
      setColor(e.target.value);
      onChange && onChange(e.target.value);
    }
  };

  // Handle swatch click
  const handleSwatch = (sw) => {
    setColor(sw);
    setInput(sw);
    onChange && onChange(sw);
    if (!inline) setShow(false);
  };

  // Handle alpha slider
  const handleAlpha = (a) => {
    let rgba = hexToRgba(color);
    rgba.a = a;
    const hex = rgbaToHex(rgba);
    setColor(hex);
    setInput(hex);
    onChange && onChange(hex);
  };

  // Render
  return (
    <div className={`relative ${className}`} style={style}>
      {/* Trigger field */}
      {!inline && (
        <button
          type="button"
          className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center focus:ring-2 focus:ring-blue-500"
          style={{ background: color }}
          onClick={() => setShow((s) => !s)}
          aria-label="Open color picker"
        />
      )}
      {/* Picker dialog */}
      {(show || inline) && (
        <div
          ref={pickerRef}
          className={`absolute z-50 mt-2 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg w-64 flex flex-col gap-4 ${inline ? 'static mt-0' : ''}`}
        >
          {/* Color input */}
          <input
            type="text"
            value={input}
            onChange={handleInput}
            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            aria-label="Color value"
          />
          {/* Swatches */}
          <div className="flex flex-wrap gap-2">
            {swatches.map((sw) => (
              <button
                key={sw}
                type="button"
                className="w-7 h-7 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                style={{ background: sw }}
                onClick={() => handleSwatch(sw)}
                aria-label={`Select swatch ${sw}`}
              />
            ))}
          </div>
          {/* Alpha slider */}
          {alpha && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Alpha</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={hexToRgba(color).a}
                onChange={e => handleAlpha(Number(e.target.value))}
                className="flex-1"
                aria-label="Alpha slider"
              />
              <span className="text-xs text-gray-500 w-8 text-right">{Math.round(hexToRgba(color).a * 100)}%</span>
            </div>
          )}
          {/* Preview */}
          <div className="flex items-center gap-2 mt-2">
            <span className="w-8 h-8 rounded border border-gray-300" style={{ background: color }} />
            <span className="text-xs text-gray-700 dark:text-gray-200">{color}</span>
          </div>
          {/* Close button */}
          {!inline && (
            <button
              type="button"
              className="mt-2 px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              onClick={() => setShow(false)}
            >
              Close
            </button>
          )}
        </div>
      )}
    </div>
  );
} 
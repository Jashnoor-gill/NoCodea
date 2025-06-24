import React, { useState, useEffect, useCallback, useRef } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * Lightbox component for React + Tailwind
 * Supports images and videos, keyboard navigation, and accessibility.
 * Usage:
 *   <Lightbox open={open} onClose={...} slides={[{src, type, title, desc}, ...]} startIndex={0} />
 */
export default function Lightbox({ open, onClose, slides = [], startIndex = 0 }) {
  const [current, setCurrent] = useState(startIndex);
  const overlayRef = useRef();

  useEffect(() => {
    if (open) setCurrent(startIndex);
  }, [open, startIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, current, slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  }, [slides.length]);
  const next = useCallback(() => {
    setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
  }, [slides.length]);

  if (!open || slides.length === 0) return null;
  const slide = slides[current];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-200"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <XMarkIcon className="w-7 h-7" />
      </button>

      {/* Prev button */}
      {slides.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
          onClick={prev}
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="w-7 h-7" />
        </button>
      )}

      {/* Next button */}
      {slides.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
          onClick={next}
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-7 h-7" />
        </button>
      )}

      {/* Slide content */}
      <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        {slide.type === 'image' && (
          <img
            src={slide.src}
            alt={slide.title || ''}
            className="object-contain max-h-[80vh] w-auto h-auto mx-auto select-none"
            draggable={false}
          />
        )}
        {slide.type === 'video' && (
          <video
            src={slide.src}
            controls
            autoPlay
            className="object-contain max-h-[80vh] w-auto h-auto mx-auto bg-black"
          />
        )}
        {/* Title/desc */}
        {(slide.title || slide.desc) && (
          <div className="w-full px-6 py-4 bg-white/80 dark:bg-gray-900/80 text-center">
            {slide.title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{slide.title}</h3>}
            {slide.desc && <p className="text-gray-700 dark:text-gray-300 text-sm">{slide.desc}</p>}
          </div>
        )}
      </div>
    </div>
  );
} 
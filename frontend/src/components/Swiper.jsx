import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * Swiper/Carousel React + Tailwind component
 * Props:
 *   slides: array of React nodes or {src, alt, ...}
 *   showArrows: boolean
 *   showPagination: boolean
 *   loop: boolean
 *   autoPlay: boolean | ms
 *   className: string (optional)
 */
export default function Swiper({
  slides = [],
  showArrows = true,
  showPagination = true,
  loop = false,
  autoPlay = false,
  className = '',
  initial = 0,
  ...props
}) {
  const [current, setCurrent] = useState(initial);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragDelta, setDragDelta] = useState(0);
  const timer = useRef();
  const trackRef = useRef();
  const slideCount = slides.length;

  // Autoplay
  useEffect(() => {
    if (!autoPlay || slideCount < 2) return;
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      next();
    }, typeof autoPlay === 'number' ? autoPlay : 3000);
    return () => clearTimeout(timer.current);
  }, [current, autoPlay, slideCount]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Touch/drag handlers
  const onTouchStart = (e) => {
    setIsDragging(true);
    setDragStart(e.touches ? e.touches[0].clientX : e.clientX);
    setDragDelta(0);
  };
  const onTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setDragDelta(x - dragStart);
  };
  const onTouchEnd = () => {
    setIsDragging(false);
    if (dragDelta > 50) prev();
    else if (dragDelta < -50) next();
    setDragDelta(0);
  };

  // Navigation
  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? (loop ? slideCount - 1 : 0) : c - 1));
  }, [loop, slideCount]);
  const next = useCallback(() => {
    setCurrent((c) => (c === slideCount - 1 ? (loop ? 0 : c) : c + 1));
  }, [loop, slideCount]);
  const goTo = (idx) => setCurrent(idx);

  // Responsive slide width
  const slideStyle = 'flex-shrink-0 w-full h-full';

  return (
    <div
      className={`relative w-full h-full select-none overflow-hidden ${className}`}
      tabIndex={0}
      aria-roledescription="carousel"
      {...props}
    >
      {/* Slides track */}
      <div
        ref={trackRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(calc(${-current * 100}% + ${isDragging ? dragDelta : 0}px))`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
        onMouseLeave={onTouchEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        role="group"
        aria-live="polite"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className={slideStyle + ' flex items-center justify-center bg-white dark:bg-gray-900'}
            aria-hidden={i !== current}
            tabIndex={i === current ? 0 : -1}
            style={{ minWidth: '100%', minHeight: '100%' }}
          >
            {typeof slide === 'string' || typeof slide === 'number' ? (
              <span>{slide}</span>
            ) : slide.src ? (
              <img
                src={slide.src}
                alt={slide.alt || ''}
                className="w-full h-full object-cover rounded"
                draggable={false}
              />
            ) : (
              slide
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && slideCount > 1 && (
        <>
          <button
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow hover:bg-white dark:hover:bg-gray-700 focus:outline-none z-10"
            onClick={prev}
            aria-label="Previous slide"
            disabled={!loop && current === 0}
            tabIndex={0}
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow hover:bg-white dark:hover:bg-gray-700 focus:outline-none z-10"
            onClick={next}
            aria-label="Next slide"
            disabled={!loop && current === slideCount - 1}
            tabIndex={0}
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        </>
      )}

      {/* Pagination bullets */}
      {showPagination && slideCount > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 focus:outline-none transition-all ${
                i === current
                  ? 'bg-blue-500 scale-110 shadow'
                  : 'bg-gray-300 dark:bg-gray-700 opacity-60'
              }`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
              tabIndex={0}
            />
          ))}
        </div>
      )}
    </div>
  );
} 
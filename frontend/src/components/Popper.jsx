import React, { useRef, useState } from 'react';
import { usePopper } from 'react-popper';

/**
 * Popper component for dynamic positioning (dropdowns, tooltips, popovers, etc.)
 *
 * Usage:
 *   <Popper
 *     reference={<button>Open</button>}
 *     popper={<div>Content</div>}
 *     placement="bottom"
 *     offset={[0, 8]}
 *     arrow
 *     className="bg-white shadow-lg rounded"
 *   />
 */
export default function Popper({
  reference,
  popper,
  placement = 'bottom',
  offset = [0, 8],
  arrow = false,
  className = '',
  arrowClass = 'bg-white shadow',
  ...props
}) {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    modifiers: [
      { name: 'offset', options: { offset } },
      arrow ? { name: 'arrow', options: { element: arrowElement } } : {},
      { name: 'preventOverflow', options: { padding: 8 } },
      { name: 'flip', options: { fallbackPlacements: ['top', 'right', 'left'] } },
    ].filter(Boolean),
  });

  return (
    <>
      {React.cloneElement(reference, { ref: setReferenceElement })}
      <div
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className={className}
        {...props}
      >
        {popper}
        {arrow && (
          <div
            ref={setArrowElement}
            style={styles.arrow}
            className={`w-3 h-3 rotate-45 absolute ${arrowClass}`}
            data-popper-arrow
          />
        )}
      </div>
    </>
  );
} 
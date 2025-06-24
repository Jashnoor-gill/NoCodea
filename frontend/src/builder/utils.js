// Utility functions for the modernized builder

/**
 * Generates DOM elements from an HTML string.
 * @param {string} html - The HTML string to convert.
 * @returns {HTMLCollection} - The generated DOM elements.
 */
export function generateElements(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.children;
}

/**
 * Checks if an object is a DOM element.
 * @param {any} obj - The object to check.
 * @returns {boolean} - True if the object is a DOM element.
 */
export function isElement(obj) {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj.nodeType === 1 &&
    typeof obj.style === 'object' &&
    typeof obj.ownerDocument === 'object'
  );
} 
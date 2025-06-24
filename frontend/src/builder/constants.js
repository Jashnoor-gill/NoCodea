// Constants for the modernized builder

export const DEFAULT_COMPONENT = '_base';
export const PRESERVE_PROPERTY_SECTIONS = true;
export const DRAG_ICON = 'icon';
export const DRAG_ELEMENT_STYLE = 'background:limegreen;width:100%;height:3px;border:1px solid limegreen;box-shadow:0px 0px 2px 1px rgba(0,0,0,0.14);overflow:hidden;';
export const DRAG_HTML = `<div style="${DRAG_ELEMENT_STYLE}"></div>`;

// These can be set dynamically if needed
export const BASE_URL = document.currentScript ? document.currentScript.src.replace(/[^\/]*?\.js$/, '') : '';
export const IMG_BASE_URL = BASE_URL; 
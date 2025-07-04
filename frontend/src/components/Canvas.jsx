import React from 'react';
import { useDrop } from 'react-dnd';
import sampleGallery1 from '../assets/photos/template-portfolio-hero.jpg';
import sampleGallery2 from '../assets/photos/template-business-hero.jpg';
import sampleGallery3 from '../assets/photos/template-restaurant-hero.jpg';

const FormElement = ({ element, isSelected, onClick, onDelete, isPreviewMode }) => {
  if (element.hidden) return null;
  const renderElement = () => {
    switch (element.type) {
      // Layout Components
      case 'container':
        return (
          <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[100px]" style={element.styles}>
            <div className="text-center text-gray-500">
              <p className="text-sm">Container</p>
              <p className="text-xs">Drop content here</p>
            </div>
          </div>
        );
      
      case 'row':
        return (
          <div className="w-full flex gap-4 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 min-h-[80px]" style={element.styles}>
            <div className="flex-1 text-center text-blue-500">
              <p className="text-sm">Column 1</p>
            </div>
            <div className="flex-1 text-center text-blue-500">
              <p className="text-sm">Column 2</p>
            </div>
          </div>
        );
      
      case 'column':
        return (
          <div className="w-full p-4 border-2 border-dashed border-green-300 rounded-lg bg-green-50 min-h-[80px]" style={element.styles}>
            <div className="text-center text-green-500">
              <p className="text-sm">Column</p>
              <p className="text-xs">Drop content here</p>
            </div>
          </div>
        );
      
      case 'section':
        return (
          <div className="w-full p-8 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50 min-h-[120px]" style={element.styles}>
            <div className="text-center text-purple-500">
              <p className="text-sm">Section</p>
              <p className="text-xs">Page section with spacing</p>
            </div>
          </div>
        );
      
      case 'divider':
        return (
          <div className="w-full py-4">
            <hr className="border-t-2 border-gray-300" />
          </div>
        );
      
      case 'spacer':
        return (
          <div className="w-full h-8 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500">Spacer (8px)</span>
          </div>
        );

      // Content Components
      case 'heading':
        return (
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900" style={element.styles}>
              {element.content || 'Your Heading Here'}
            </h2>
          </div>
        );
      
      case 'paragraph':
        return (
          <div className="space-y-2">
            <p className="text-lg text-gray-700 leading-relaxed" style={element.styles}>
              {element.content || 'This is a sample paragraph. You can edit this text to add your own content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
            </p>
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-2">
            <img src={sampleGallery1} alt="Sample" className="w-full h-48 object-cover rounded-lg border-2 border-gray-300" />
          </div>
        );
      
      case 'video':
        return (
          <div className="space-y-2">
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🎥</div>
                <p className="text-sm">Video Placeholder</p>
                <p className="text-xs">Click to add video</p>
              </div>
            </div>
          </div>
        );
      
      case 'button':
        return (
          <div className="space-y-2">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium" style={element.styles}>
              {element.content || 'Click Me'}
            </button>
          </div>
        );
      
      case 'link':
        return (
          <div className="space-y-2">
            <a href="#" className="text-blue-600 hover:text-blue-800 underline font-medium" style={element.styles}>
              {element.content || 'Sample Link'}
            </a>
          </div>
        );

      // Media Components
      case 'gallery':
        return (
          <div className="space-y-2" style={element.styles}>
            <div className="grid grid-cols-3 gap-4">
              {[sampleGallery1, sampleGallery2, sampleGallery3].map((img, i) => (
                <img key={i} src={img} alt={`Gallery ${i+1}`} className="h-24 w-full object-cover rounded-lg border-2 border-gray-300" />
              ))}
            </div>
          </div>
        );

      case 'carousel':
        return (
          <div className="space-y-2" style={element.styles}>
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🎠</div>
                <p className="text-sm">Carousel/Slider</p>
                <p className="text-xs">Image carousel component</p>
              </div>
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="space-y-2" style={element.styles}>
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-sm">Google Maps</p>
                <p className="text-xs">Map embed component</p>
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-2" style={element.styles}>
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform) => (
                <div key={platform} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-xs">{platform[0]}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // Advanced Components
      case 'navbar':
        return (
          <div className="space-y-2" style={element.styles}>
            <nav className="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">Logo</div>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
                </div>
              </div>
            </nav>
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-2" style={element.styles}>
            <footer className="bg-gray-800 text-white p-6 rounded-lg">
              <div className="text-center">
                <p className="text-sm">© 2024 Your Company. All rights reserved.</p>
              </div>
            </footer>
          </div>
        );

      case 'sidebar':
        return (
          <div className="space-y-2">
            <div className="w-64 bg-gray-100 p-4 rounded-lg border border-gray-200" style={element.styles}>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-900">Sidebar</div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">• Menu Item 1</div>
                  <div className="text-sm text-gray-600">• Menu Item 2</div>
                  <div className="text-sm text-gray-600">• Menu Item 3</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm" style={element.styles}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
              <p className="text-gray-600 mb-4">This is a sample card component with some content.</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                Learn More
              </button>
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className="space-y-2">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6" style={element.styles}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-medium text-gray-900">John Doe</div>
                  <div className="text-sm text-gray-500">CEO, Company</div>
                </div>
              </div>
              <p className="text-gray-600 italic">"This is an amazing product that has transformed our business!"</p>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm" style={element.styles}>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic Plan</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">$9<span className="text-lg text-gray-500">/month</span></div>
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-gray-600">• Feature 1</li>
                <li className="text-sm text-gray-600">• Feature 2</li>
                <li className="text-sm text-gray-600">• Feature 3</li>
              </ul>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </div>
        );

      // Form Components (existing)
      case 'text':
      case 'email':
      case 'number':
      case 'url':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {element.label || 'Label'}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={element.type}
              placeholder={element.placeholder || ''}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              disabled={!isPreviewMode}
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {element.label || 'Label'}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              placeholder={element.placeholder || ''}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              disabled={!isPreviewMode}
            />
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-2">
            <label htmlFor={`canvas-select-${element.id}`} className="block text-sm font-medium text-gray-700">
              {element.label || 'Label'}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select 
              id={`canvas-select-${element.id}`}
              name={`canvasSelect-${element.id}`}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
              disabled={!isPreviewMode}
            >
              <option value="">{element.placeholder || 'Select an option'}</option>
              {element.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <input
              type="checkbox"
              id={`canvas-checkbox-${element.id}`}
              name={`canvasCheckbox-${element.id}`}
              disabled={!isPreviewMode}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
            />
            <label htmlFor={`canvas-checkbox-${element.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
              {element.label || 'Checkbox'}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );
      
      case 'radio':
        return (
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <input
              type="radio"
              id={`canvas-radio-${element.id}`}
              name={`canvasRadio-${element.id}`}
              disabled={!isPreviewMode}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 transition-all duration-200"
            />
            <label htmlFor={`canvas-radio-${element.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
              {element.label || 'Radio Option'}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {element.label || 'Date'}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              disabled={!isPreviewMode}
            />
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {element.label || 'File Upload'}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="file"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              disabled={!isPreviewMode}
            />
          </div>
        );

      // Add new component types below:
      case 'audio':
        return (
          <div className="space-y-2" style={element.styles}>
            <audio controls className="w-full">
              <source src={element.src || ''} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case 'embed':
        return (
          <div className="space-y-2" style={element.styles}>
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <span className="text-gray-500 text-sm">Embed Placeholder</span>
            </div>
          </div>
        );
      case 'tabs':
        return (
          <div className="space-y-2" style={element.styles}>
            <div className="flex space-x-2 mb-2">
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded">Tab 1</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded">Tab 2</button>
            </div>
            <div className="p-4 bg-gray-50 border rounded">Tab content here</div>
          </div>
        );
      case 'accordion':
        return (
          <div className="space-y-2" style={element.styles}>
            <div className="border rounded">
              <button className="w-full text-left px-4 py-2 bg-gray-100 font-medium">Accordion Title</button>
              <div className="p-4">Accordion content here</div>
            </div>
          </div>
        );
      case 'faq':
        return (
          <div className="space-y-2" style={element.styles}>
            <div className="border rounded p-4 bg-gray-50">
              <div className="font-semibold">Q: Sample question?</div>
              <div className="text-gray-600">A: Sample answer goes here.</div>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="space-y-2" style={element.styles}>
            <div className="flex space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
                <div className="font-medium">Jane</div>
                <div className="text-xs text-gray-500">Designer</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
                <div className="font-medium">John</div>
                <div className="text-xs text-gray-500">Developer</div>
              </div>
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="flex space-x-8" style={element.styles}>
            <div className="text-center">
              <div className="text-2xl font-bold">123</div>
              <div className="text-xs text-gray-500">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">456</div>
              <div className="text-xs text-gray-500">Sales</div>
            </div>
          </div>
        );
      case 'timeline':
        return (
          <div className="space-y-2">
            <div className="border-l-2 border-blue-400 pl-4">
              <div className="mb-4">
                <div className="font-semibold">2023</div>
                <div className="text-gray-600">Started project</div>
              </div>
              <div>
                <div className="font-semibold">2024</div>
                <div className="text-gray-600">Launched product</div>
              </div>
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-blue-600 h-4 rounded-full" style={{ width: '60%' }}></div>
          </div>
        );
      case 'badge':
        return (
          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Badge</span>
        );
      case 'alert':
        return (
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
            <strong>Alert:</strong> This is an alert message.
          </div>
        );
      case 'modal':
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-8 rounded shadow-lg">
              <div className="font-bold mb-2">Modal Title</div>
              <div className="mb-4">Modal content goes here.</div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Close</button>
            </div>
          </div>
        );
      case 'tooltip':
        return (
          <span className="relative group">
            <span className="underline cursor-help">Hover me</span>
            <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">Tooltip text</span>
          </span>
        );
      case 'product-card':
        return (
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <img src={element.image || sampleGallery1} alt="Product" className="w-full h-32 object-cover rounded mb-2" />
            <div className="font-semibold">Product Name</div>
            <div className="text-gray-500 mb-2">$99.99</div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">Add to Cart</button>
          </div>
        );
      case 'product-grid':
        return (
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white border rounded-lg p-4 shadow-sm">
                <img src={sampleGallery1} alt="Product" className="w-full h-20 object-cover rounded mb-2" />
                <div className="font-semibold">Product {i}</div>
                <div className="text-gray-500 mb-2">$99.99</div>
                <button className="w-full px-2 py-1 bg-blue-600 text-white rounded text-xs">Add</button>
              </div>
            ))}
          </div>
        );
      case 'shopping-cart':
        return (
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="font-semibold mb-2">Shopping Cart</div>
            <div className="text-gray-500">Your cart is empty.</div>
          </div>
        );
      case 'checkout':
        return (
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="font-semibold mb-2">Checkout</div>
            <div className="text-gray-500">Checkout form goes here.</div>
          </div>
        );
      case 'product-detail':
        return (
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <img src={sampleGallery1} alt="Product" className="w-full h-32 object-cover rounded mb-2" />
            <div className="font-semibold">Product Name</div>
            <div className="text-gray-500 mb-2">$99.99</div>
            <div className="text-sm">Product details and description here.</div>
          </div>
        );
      case 'reviews':
        return (
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="font-semibold mb-2">Reviews</div>
            <div className="text-gray-500">No reviews yet.</div>
          </div>
        );
      case 'wishlist':
        return (
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="font-semibold mb-2">Wishlist</div>
            <div className="text-gray-500">Your wishlist is empty.</div>
          </div>
        );
      case 'html':
        return (
          <div className="w-full p-2 border border-gray-300 rounded bg-gray-50">
            <div dangerouslySetInnerHTML={{ __html: element.content || '<b>Custom HTML Block</b>' }} />
          </div>
        );
      case 'script':
        return (
          <div className="w-full p-2 border border-gray-300 rounded bg-gray-50">
            <pre className="text-xs text-gray-700">{element.content || '// Custom JS Block'}</pre>
          </div>
        );
      case 'style':
        return (
          <div className="w-full p-2 border border-gray-300 rounded bg-gray-50">
            <pre className="text-xs text-gray-700">{element.content || '/* Custom CSS Block */'}</pre>
          </div>
        );
      case 'iframe':
        return (
          <div className="w-full h-48 border border-gray-300 rounded bg-gray-50">
            <iframe src={element.src || 'https://example.com'} title="iFrame" className="w-full h-full rounded" />
          </div>
        );
      case 'widget':
        return (
          <div className="w-full p-2 border border-gray-300 rounded bg-gray-50" style={element.styles}>
            <span className="text-xs text-gray-700">Widget Placeholder</span>
          </div>
        );
      case 'api':
        return (
          <div className="w-full p-2 border border-gray-300 rounded bg-gray-50" style={element.styles}>
            <span className="text-xs text-gray-700">API Data Placeholder</span>
          </div>
        );
      case 'chart':
        return (
          <div className="w-full h-32 flex items-center justify-center border border-gray-300 rounded bg-gray-50" style={element.styles}>
            <span className="text-xs text-gray-700">Chart Placeholder</span>
          </div>
        );
      case 'calendar':
        return (
          <div className="w-full h-32 flex items-center justify-center border border-gray-300 rounded bg-gray-50" style={element.styles}>
            <span className="text-xs text-gray-700">Calendar Placeholder</span>
          </div>
        );
      case 'slider':
        return (
          <div className="w-full h-32 flex items-center justify-center border border-gray-300 rounded bg-gray-50" style={element.styles}>
            <span className="text-xs text-gray-700">Slider Placeholder</span>
          </div>
        );
      case 'lightbox':
        return (
          <div className="w-full h-32 flex items-center justify-center border border-gray-300 rounded bg-gray-50" style={element.styles}>
            <span className="text-xs text-gray-700">Lightbox Placeholder</span>
          </div>
        );

      default:
        return (
          <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="text-center text-gray-500">
              <p className="text-sm">Unknown Component: {element.type}</p>
            </div>
          </div>
        );
    }
  };

  // Apply styles from element.styles
  const inlineStyles = element.styles || {};

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
      }`}
      style={inlineStyles}
      onClick={() => {
        if (!element.locked) onClick(element);
      }}
    >
      {renderElement()}
      {/* Lock overlay in builder mode */}
      {!isPreviewMode && element.locked && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10 pointer-events-none">
          <span className="text-2xl text-gray-400">🔒</span>
        </div>
      )}
      {!isPreviewMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Delete element"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

const Canvas = ({ formElements, setFormElements, selectedElement, setSelectedElement, isPreviewMode = false, canvasBackground }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'FORM_COMPONENT',
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        const newElement = {
          id: Date.now().toString(),
          type: item.type,
          label: item.label,
          content: item.type === 'heading' ? 'Your Heading Here' : 
                  item.type === 'paragraph' ? 'This is a sample paragraph...' :
                  item.type === 'button' ? 'Click Me' :
                  item.type === 'link' ? 'Sample Link' : '',
          placeholder: '',
          required: false,
          options: item.type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
        };
        setFormElements(prev => [...prev, newElement]);
        setSelectedElement(newElement);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const handleElementClick = (element) => {
    if (!isPreviewMode) {
      setSelectedElement(element);
    }
  };

  const handleDeleteElement = (elementId) => {
    setFormElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  // Use the provided background or default gradient
  const canvasStyle = {
    background: canvasBackground || 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
    padding: '1.5rem',
    overflowY: 'auto',
    flex: 1
  };

  return (
    <div style={canvasStyle}>
      <div className="max-w-6xl mx-auto">
        <div
          ref={drop}
          className={`bg-white rounded-xl shadow-lg border-2 min-h-[600px] p-8 transition-all duration-300 ${
            isOver 
              ? 'border-blue-400 border-dashed bg-blue-50' 
              : 'border-gray-200'
          }`}
        >
          {isPreviewMode ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Website Preview</h2>
                <p className="text-gray-600">This is how your website will appear to visitors</p>
              </div>
              {formElements.map((element) => (
                <FormElement
                  key={element.id}
                  element={element}
                  isSelected={false}
                  isPreviewMode={true}
                />
              ))}
              {formElements.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-6xl mb-4">🌐</div>
                  <p className="text-lg font-medium">No website elements to preview</p>
                  <p className="text-sm">Add some components to your website first</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Website Builder</h2>
                <p className="text-gray-600">Drag components here to build your website</p>
              </div>
              {formElements.length === 0 ? (
                <div className="text-center text-gray-500 py-16">
                  <div className="text-8xl mb-6">🏗️</div>
                  <h3 className="text-xl font-semibold mb-2">Start Building Your Website</h3>
                  <p className="text-sm mb-4">Drag website components from the left panel to get started</p>
                  <div className="flex justify-center space-x-4 text-sm text-gray-400">
                    <span>📐 Layout</span>
                    <span>📝 Content</span>
                    <span>📋 Forms</span>
                  </div>
                </div>
              ) : (
                formElements.filter(el => !el.hidden).map((element) => (
                  <FormElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElement?.id === element.id}
                    onClick={handleElementClick}
                    onDelete={handleDeleteElement}
                    isPreviewMode={false}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas; 
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

const DraggableComponent = ({ type, label, icon, description, category }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'FORM_COMPONENT',
    item: { type, label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 hover:border-gray-300 transition-all ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-lg">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{label}</h4>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

const ComponentPanel = () => {
  const [activeCategory, setActiveCategory] = useState('layout');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = {
    layout: {
      name: 'Layout',
      icon: '📐',
      components: [
        { type: 'container', label: 'Container', icon: '📦', description: 'Flexible container for content' },
        { type: 'section', label: 'Section', icon: '📑', description: 'Page section with spacing' },
        { type: 'row', label: 'Row', icon: '📊', description: 'Horizontal layout row' },
        { type: 'column', label: 'Column', icon: '📋', description: 'Vertical layout column' },
        { type: 'divider', label: 'Divider', icon: '➖', description: 'Horizontal line separator' },
        { type: 'spacer', label: 'Spacer', icon: '⬜', description: 'Vertical spacing element' },
        { type: 'sidebar', label: 'Sidebar', icon: '📋', description: 'Side navigation panel' },
      ]
    },
    content: {
      name: 'Content',
      icon: '📝',
      components: [
        { type: 'heading', label: 'Heading', icon: '📝', description: 'Page heading (H1-H6)' },
        { type: 'paragraph', label: 'Paragraph', icon: '📄', description: 'Text paragraph' },
        { type: 'button', label: 'Button', icon: '🔘', description: 'Clickable button' },
        { type: 'link', label: 'Link', icon: '🔗', description: 'Hyperlink element' },
        { type: 'list', label: 'List', icon: '📋', description: 'Ordered or unordered list' },
        { type: 'quote', label: 'Quote', icon: '💬', description: 'Blockquote element' },
        { type: 'code', label: 'Code', icon: '💻', description: 'Code block or inline code' },
      ]
    },
    media: {
      name: 'Media',
      icon: '🖼️',
      components: [
        { type: 'image', label: 'Image', icon: '🖼️', description: 'Single image' },
        { type: 'video', label: 'Video', icon: '🎥', description: 'Video player' },
        { type: 'audio', label: 'Audio', icon: '🎵', description: 'Audio player' },
        { type: 'gallery', label: 'Gallery', icon: '🖼️', description: 'Image gallery' },
        { type: 'carousel', label: 'Carousel', icon: '🎠', description: 'Image carousel/slider' },
        { type: 'map', label: 'Map', icon: '🗺️', description: 'Google Maps embed' },
        { type: 'embed', label: 'Embed', icon: '📺', description: 'External content embed' },
      ]
    },
    forms: {
      name: 'Forms',
      icon: '📋',
      components: [
        { type: 'text', label: 'Text Input', icon: '📝', description: 'Single line text input' },
        { type: 'email', label: 'Email Input', icon: '📧', description: 'Email address input' },
        { type: 'number', label: 'Number Input', icon: '🔢', description: 'Numeric input' },
        { type: 'url', label: 'URL Input', icon: '🔗', description: 'URL input field' },
        { type: 'textarea', label: 'Text Area', icon: '📄', description: 'Multi-line text input' },
        { type: 'select', label: 'Select', icon: '📋', description: 'Dropdown selection' },
        { type: 'checkbox', label: 'Checkbox', icon: '☑️', description: 'Checkbox input' },
        { type: 'radio', label: 'Radio', icon: '🔘', description: 'Radio button input' },
        { type: 'date', label: 'Date Input', icon: '📅', description: 'Date picker' },
        { type: 'time', label: 'Time Input', icon: '⏰', description: 'Time picker' },
        { type: 'file', label: 'File Upload', icon: '📁', description: 'File upload input' },
        { type: 'password', label: 'Password', icon: '🔒', description: 'Password input' },
        { type: 'tel', label: 'Phone', icon: '📞', description: 'Phone number input' },
        { type: 'search', label: 'Search', icon: '🔍', description: 'Search input field' },
        { type: 'range', label: 'Range', icon: '📊', description: 'Range slider input' },
        { type: 'color', label: 'Color', icon: '🎨', description: 'Color picker input' },
      ]
    },
    navigation: {
      name: 'Navigation',
      icon: '🧭',
      components: [
        { type: 'navbar', label: 'Navigation Bar', icon: '🧭', description: 'Main navigation menu' },
        { type: 'breadcrumb', label: 'Breadcrumb', icon: '🍞', description: 'Breadcrumb navigation' },
        { type: 'pagination', label: 'Pagination', icon: '📄', description: 'Page navigation' },
        { type: 'tabs', label: 'Tabs', icon: '📑', description: 'Tabbed content' },
        { type: 'accordion', label: 'Accordion', icon: '📖', description: 'Collapsible content' },
        { type: 'menu', label: 'Menu', icon: '🍽️', description: 'Dropdown menu' },
      ]
    },
    components: {
      name: 'Components',
      icon: '🧩',
      components: [
        { type: 'card', label: 'Card', icon: '💳', description: 'Content card with header/body' },
        { type: 'testimonial', label: 'Testimonial', icon: '💬', description: 'Customer testimonial' },
        { type: 'pricing', label: 'Pricing', icon: '💰', description: 'Pricing table' },
        { type: 'social', label: 'Social Media', icon: '📱', description: 'Social media links' },
        { type: 'contact', label: 'Contact Form', icon: '📞', description: 'Contact form' },
        { type: 'newsletter', label: 'Newsletter', icon: '📧', description: 'Newsletter signup' },
        { type: 'faq', label: 'FAQ', icon: '❓', description: 'Frequently asked questions' },
        { type: 'team', label: 'Team', icon: '👥', description: 'Team member profiles' },
        { type: 'stats', label: 'Statistics', icon: '📊', description: 'Statistics/numbers display' },
        { type: 'timeline', label: 'Timeline', icon: '⏱️', description: 'Timeline component' },
        { type: 'progress', label: 'Progress', icon: '📈', description: 'Progress bar' },
        { type: 'badge', label: 'Badge', icon: '🏷️', description: 'Status badge/label' },
        { type: 'alert', label: 'Alert', icon: '⚠️', description: 'Alert/notification' },
        { type: 'modal', label: 'Modal', icon: '🪟', description: 'Modal dialog' },
        { type: 'tooltip', label: 'Tooltip', icon: '💡', description: 'Tooltip component' },
      ]
    },
    ecommerce: {
      name: 'E-commerce',
      icon: '🛒',
      components: [
        { type: 'product-card', label: 'Product Card', icon: '📦', description: 'Product display card' },
        { type: 'product-grid', label: 'Product Grid', icon: '📊', description: 'Product listing grid' },
        { type: 'shopping-cart', label: 'Shopping Cart', icon: '🛒', description: 'Shopping cart' },
        { type: 'checkout', label: 'Checkout', icon: '💳', description: 'Checkout form' },
        { type: 'product-detail', label: 'Product Detail', icon: '🔍', description: 'Product detail page' },
        { type: 'reviews', label: 'Reviews', icon: '⭐', description: 'Product reviews' },
        { type: 'wishlist', label: 'Wishlist', icon: '❤️', description: 'Wishlist component' },
      ]
    },
    advanced: {
      name: 'Advanced',
      icon: '⚡',
      components: [
        { type: 'html', label: 'HTML Block', icon: '🌐', description: 'Custom HTML code' },
        { type: 'script', label: 'Script', icon: '📜', description: 'JavaScript code block' },
        { type: 'style', label: 'Style', icon: '🎨', description: 'Custom CSS styles' },
        { type: 'iframe', label: 'iFrame', icon: '🖼️', description: 'Embedded iframe' },
        { type: 'widget', label: 'Widget', icon: '🔧', description: 'Custom widget' },
        { type: 'api', label: 'API Data', icon: '🔌', description: 'Dynamic data from API' },
        { type: 'chart', label: 'Chart', icon: '📊', description: 'Data visualization chart' },
        { type: 'calendar', label: 'Calendar', icon: '📅', description: 'Interactive calendar' },
        { type: 'slider', label: 'Slider', icon: '🎚️', description: 'Content slider' },
        { type: 'lightbox', label: 'Lightbox', icon: '💡', description: 'Image lightbox' },
      ]
    }
  };

  // Filter components based on search term
  const filteredCategories = Object.entries(categories).reduce((acc, [key, category]) => {
    const filteredComponents = category.components.filter(component =>
      component.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredComponents.length > 0) {
      acc[key] = { ...category, components: filteredComponents };
    }
    
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Components</h3>
        <p className="text-sm text-gray-500 mt-1">Drag components to build your website</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex flex-wrap gap-1">
          {Object.entries(filteredCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeCategory === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredCategories[activeCategory]?.components.map((component) => (
            <DraggableComponent
              key={component.type}
              type={component.type}
              label={component.label}
              icon={component.icon}
              description={component.description}
              category={activeCategory}
            />
          ))}
          
          {(!filteredCategories[activeCategory] || filteredCategories[activeCategory].components.length === 0) && (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-sm">No components found</p>
              <p className="text-xs">Try a different search term</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <p>💡 Tip: Drag components to the canvas to add them to your website</p>
          <p className="mt-1">Total: {Object.values(filteredCategories).reduce((sum, cat) => sum + cat.components.length, 0)} components</p>
        </div>
      </div>
    </div>
  );
};

export default ComponentPanel; 
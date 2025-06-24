import React, { useState } from 'react';

const PropertyPanel = ({ element, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');

  if (!element) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Properties</h3>
          <p className="text-sm text-gray-600">Select an element to edit its properties</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">⚙️</div>
            <p className="text-sm">No element selected</p>
            <p className="text-xs">Click on any element to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    onUpdate({
      ...element,
      [field]: value,
    });
  };

  const handleStyleChange = (property, value) => {
    onUpdate({
      ...element,
      styles: {
        ...element.styles,
        [property]: value,
      },
    });
  };

  const renderContentTab = () => {
    const isTextComponent = ['heading', 'paragraph', 'button', 'link'].includes(element.type);
    const isFormComponent = ['text', 'email', 'number', 'url', 'textarea', 'select', 'checkbox', 'radio', 'date', 'time', 'file', 'password', 'tel', 'search', 'range', 'color'].includes(element.type);
    const isMediaComponent = ['image', 'video', 'audio', 'gallery', 'carousel', 'map', 'embed'].includes(element.type);

    return (
      <div className="space-y-6">
        {/* Text Content */}
        {isTextComponent && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Content</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.type === 'heading' ? 'Heading Text' :
                 element.type === 'paragraph' ? 'Paragraph Text' :
                 element.type === 'button' ? 'Button Text' :
                 'Link Text'}
              </label>
              {element.type === 'paragraph' ? (
                <textarea
                  value={element.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Enter your content..."
                />
              ) : (
                <input
                  type="text"
                  value={element.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your content..."
                />
              )}
            </div>
          </div>
        )}

        {/* Form Properties */}
        {isFormComponent && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Form Properties</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
              <input
                type="text"
                value={element.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter field label..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
              <input
                type="text"
                value={element.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter placeholder text..."
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={element.required || false}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                Required field
              </label>
            </div>
          </div>
        )}

        {/* Media Properties */}
        {isMediaComponent && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Media Properties</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source URL</label>
              <input
                type="url"
                value={element.src || ''}
                onChange={(e) => handleChange('src', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
              <input
                type="text"
                value={element.alt || ''}
                onChange={(e) => handleChange('alt', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Description of the media"
              />
            </div>
          </div>
        )}

        {/* Link Properties */}
        {element.type === 'link' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Link Properties</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input
                type="url"
                value={element.href || ''}
                onChange={(e) => handleChange('href', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target</label>
              <select
                value={element.target || '_self'}
                onChange={(e) => handleChange('target', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="_self">Same Window</option>
                <option value="_blank">New Window</option>
                <option value="_parent">Parent Frame</option>
                <option value="_top">Top Frame</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStyleTab = () => {
    const styles = element.styles || {};
    
    return (
      <div className="space-y-6">
        <h4 className="text-sm font-medium text-gray-900">Styling</h4>
        
        {/* Typography */}
        <div className="space-y-4">
          <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Typography</h5>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size (px)</label>
            <input
              type="number"
              value={styles.fontSize || ''}
              onChange={(e) => handleStyleChange('fontSize', e.target.value + 'px')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="16"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
            <select
              value={styles.fontWeight || 'normal'}
              onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
              <option value="900">900</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Align</label>
            <select
              value={styles.textAlign || 'left'}
              onChange={(e) => handleStyleChange('textAlign', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Colors</h5>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
            <input
              type="color"
              value={styles.color || '#000000'}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <input
              type="color"
              value={styles.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Spacing */}
        <div className="space-y-4">
          <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Spacing</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Padding (px)</label>
              <input
                type="number"
                value={styles.padding || ''}
                onChange={(e) => handleStyleChange('padding', e.target.value + 'px')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Margin (px)</label>
              <input
                type="number"
                value={styles.margin || ''}
                onChange={(e) => handleStyleChange('margin', e.target.value + 'px')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Border */}
        <div className="space-y-4">
          <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Border</h5>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Border Width (px)</label>
            <input
              type="number"
              value={styles.borderWidth || ''}
              onChange={(e) => handleStyleChange('borderWidth', e.target.value + 'px')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius (px)</label>
            <input
              type="number"
              value={styles.borderRadius || ''}
              onChange={(e) => handleStyleChange('borderRadius', e.target.value + 'px')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderAdvancedTab = () => {
    return (
      <div className="space-y-6">
        <h4 className="text-sm font-medium text-gray-900">Advanced Properties</h4>
        
        {/* Element ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Element ID</label>
          <input
            type="text"
            value={element.id || ''}
            onChange={(e) => handleChange('id', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="unique-id"
          />
        </div>

        {/* CSS Classes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CSS Classes</label>
          <input
            type="text"
            value={element.className || ''}
            onChange={(e) => handleChange('className', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="class1 class2 class3"
          />
        </div>

        {/* Custom CSS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
          <textarea
            value={element.customCSS || ''}
            onChange={(e) => handleChange('customCSS', e.target.value)}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none font-mono text-xs"
            placeholder="/* Custom CSS styles */"
          />
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return renderContentTab();
      case 'style':
        return renderStyleTab();
      case 'advanced':
        return renderAdvancedTab();
      default:
        return renderContentTab();
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
        <p className="text-sm text-gray-500 mt-1">
          {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Element
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'content'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'style'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Style
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'advanced'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PropertyPanel; 
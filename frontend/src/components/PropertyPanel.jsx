import React, { useState } from 'react';

const PropertyPanel = ({ selectedElement, onUpdateElement }) => {
  const [activeTab, setActiveTab] = useState('content');

  if (!selectedElement) {
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
    onUpdateElement({
      ...selectedElement,
      [field]: value,
    });
  };

  const renderContentTab = () => {
    const isContentComponent = ['heading', 'paragraph', 'button', 'link'].includes(selectedElement.type);
    const isFormComponent = ['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'date', 'file'].includes(selectedElement.type);
    const isLayoutComponent = ['container', 'row', 'column', 'section', 'divider', 'spacer'].includes(selectedElement.type);

    return (
      <div className="space-y-6">
        {/* Content Properties */}
        {isContentComponent && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Content</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedElement.type === 'heading' ? 'Heading Text' :
                 selectedElement.type === 'paragraph' ? 'Paragraph Text' :
                 selectedElement.type === 'button' ? 'Button Text' :
                 'Link Text'}
              </label>
              {selectedElement.type === 'paragraph' ? (
                <textarea
                  value={selectedElement.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Enter your content..."
                />
              ) : (
                <input
                  type="text"
                  value={selectedElement.content || ''}
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
                value={selectedElement.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter field label..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
              <input
                type="text"
                value={selectedElement.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter placeholder text..."
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={selectedElement.required || false}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                Required field
              </label>
            </div>
            {selectedElement.type === 'select' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options (one per line)</label>
                <textarea
                  value={selectedElement.options?.join('\n') || ''}
                  onChange={(e) => handleChange('options', e.target.value.split('\n').filter(option => option.trim()))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                />
              </div>
            )}
          </div>
        )}

        {/* Layout Properties */}
        {isLayoutComponent && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Layout Properties</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
              <select
                value={selectedElement.width || 'full'}
                onChange={(e) => handleChange('width', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="full">Full Width</option>
                <option value="1/2">Half Width</option>
                <option value="1/3">One Third</option>
                <option value="2/3">Two Thirds</option>
                <option value="1/4">Quarter Width</option>
                <option value="3/4">Three Quarters</option>
              </select>
            </div>
            {selectedElement.type === 'spacer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
                <input
                  type="number"
                  value={selectedElement.height || 32}
                  onChange={(e) => handleChange('height', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  min="8"
                  max="200"
                />
              </div>
            )}
          </div>
        )}

        {/* Media Properties */}
        {['image', 'video', 'gallery', 'carousel'].includes(selectedElement.type) && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Media Properties</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source URL</label>
              <input
                type="url"
                value={selectedElement.src || ''}
                onChange={(e) => handleChange('src', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
              <input
                type="text"
                value={selectedElement.alt || ''}
                onChange={(e) => handleChange('alt', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Description of the image"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStyleTab = () => {
    return (
      <div className="space-y-6">
        <h4 className="text-sm font-medium text-gray-900">Styling</h4>
        
        {/* Text Styling */}
        {['heading', 'paragraph', 'button', 'link'].includes(selectedElement.type) && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <input
                type="color"
                value={selectedElement.textColor || '#000000'}
                onChange={(e) => handleChange('textColor', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <select
                value={selectedElement.fontSize || 'medium'}
                onChange={(e) => handleChange('fontSize', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xl">Extra Large</option>
                <option value="2xl">2XL</option>
                <option value="3xl">3XL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
              <select
                value={selectedElement.fontWeight || 'normal'}
                onChange={(e) => handleChange('fontWeight', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="light">Light</option>
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="semibold">Semibold</option>
                <option value="bold">Bold</option>
              </select>
            </div>
          </div>
        )}

        {/* Background Styling */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <input
              type="color"
              value={selectedElement.backgroundColor || '#ffffff'}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
            <input
              type="color"
              value={selectedElement.borderColor || '#e5e7eb'}
              onChange={(e) => handleChange('borderColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Border Width</label>
            <select
              value={selectedElement.borderWidth || '1'}
              onChange={(e) => handleChange('borderWidth', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="0">None</option>
              <option value="1">Thin</option>
              <option value="2">Medium</option>
              <option value="4">Thick</option>
            </select>
          </div>
        </div>

        {/* Spacing */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
            <select
              value={selectedElement.padding || '4'}
              onChange={(e) => handleChange('padding', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="0">None</option>
              <option value="2">Small</option>
              <option value="4">Medium</option>
              <option value="6">Large</option>
              <option value="8">Extra Large</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Margin</label>
            <select
              value={selectedElement.margin || '0'}
              onChange={(e) => handleChange('margin', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="0">None</option>
              <option value="2">Small</option>
              <option value="4">Medium</option>
              <option value="6">Large</option>
              <option value="8">Extra Large</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderAdvancedTab = () => {
    return (
      <div className="space-y-6">
        <h4 className="text-sm font-medium text-gray-900">Advanced Settings</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CSS Classes</label>
          <input
            type="text"
            value={selectedElement.className || ''}
            onChange={(e) => handleChange('className', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="custom-class another-class"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ID</label>
          <input
            type="text"
            value={selectedElement.id || ''}
            onChange={(e) => handleChange('id', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="unique-element-id"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Custom Attributes</label>
          <textarea
            value={selectedElement.customAttributes || ''}
            onChange={(e) => handleChange('customAttributes', e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
            placeholder="data-custom='value'&#10;aria-label='description'"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hidden"
            checked={selectedElement.hidden || false}
            onChange={(e) => handleChange('hidden', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hidden" className="ml-2 text-sm text-gray-700">
            Hide element
          </label>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'content', name: 'Content', icon: '📝' },
    { id: 'style', name: 'Style', icon: '🎨' },
    { id: 'advanced', name: 'Advanced', icon: '⚙️' }
  ];

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
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Properties</h3>
        <p className="text-sm text-gray-600 capitalize">
          {selectedElement.type} element
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {renderTabContent()}
      </div>

      {/* Element Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Type:</strong> {selectedElement.type}</p>
          <p><strong>ID:</strong> {selectedElement.id}</p>
          <p><strong>Position:</strong> {selectedElement.position || 'Auto'}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel; 
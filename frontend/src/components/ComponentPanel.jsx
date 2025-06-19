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
      className={`p-4 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 hover:border-gray-300 transition-all ${
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
  const [activeCategory, setActiveCategory] = useState('basic');

  const categories = {
    basic: {
      name: 'Basic Inputs',
      icon: '📝',
      components: [
        { type: 'text', label: 'Text Input', icon: '📝', description: 'Single line text input' },
        { type: 'email', label: 'Email Input', icon: '📧', description: 'Email address input' },
        { type: 'number', label: 'Number Input', icon: '🔢', description: 'Numeric input field' },
        { type: 'textarea', label: 'Text Area', icon: '📄', description: 'Multi-line text input' },
      ]
    },
    selection: {
      name: 'Selection',
      icon: '☑️',
      components: [
        { type: 'select', label: 'Dropdown', icon: '📋', description: 'Select from options' },
        { type: 'checkbox', label: 'Checkbox', icon: '☑️', description: 'Multiple choice option' },
        { type: 'radio', label: 'Radio Button', icon: '🔘', description: 'Single choice option' },
      ]
    },
    advanced: {
      name: 'Advanced',
      icon: '⚙️',
      components: [
        { type: 'date', label: 'Date Picker', icon: '📅', description: 'Date selection' },
        { type: 'time', label: 'Time Picker', icon: '🕐', description: 'Time selection' },
        { type: 'file', label: 'File Upload', icon: '📁', description: 'File upload field' },
        { type: 'url', label: 'URL Input', icon: '🔗', description: 'Website URL input' },
      ]
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Form Components</h3>
        <p className="text-sm text-gray-500 mt-1">Drag components to build your form</p>
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-1">
          {Object.entries(categories).map(([key, category]) => (
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
          {categories[activeCategory].components.map((component) => (
            <DraggableComponent
              key={component.type}
              type={component.type}
              label={component.label}
              icon={component.icon}
              description={component.description}
              category={activeCategory}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <p>💡 Tip: Drag components to the canvas to add them to your form</p>
        </div>
      </div>
    </div>
  );
};

export default ComponentPanel; 
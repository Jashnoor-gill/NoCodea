import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import buttonIcon from '../assets/icons/component-button.png';
import columnsIcon from '../assets/icons/component-columns.png';
import formIcon from '../assets/icons/component-form.png';
import galleryIcon from '../assets/icons/component-gallery.png';
import imageIcon from '../assets/icons/component-image.png';
import mapIcon from '../assets/icons/component-map.png';
import navigationIcon from '../assets/icons/component-navigation.png';
import textIcon from '../assets/icons/component-text.png';
import videoIcon from '../assets/icons/component-video.png';

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
      icon: <img src={textIcon} alt="Text" className="w-5 h-5 inline-block" />,
      components: [
        { type: 'text', label: 'Text Input', icon: <img src={textIcon} alt="Text" className="w-6 h-6" />, description: 'Single line text input' },
        { type: 'button', label: 'Button', icon: <img src={buttonIcon} alt="Button" className="w-6 h-6" />, description: 'Clickable button' },
        { type: 'form', label: 'Form', icon: <img src={formIcon} alt="Form" className="w-6 h-6" />, description: 'Form container' },
        { type: 'columns', label: 'Columns', icon: <img src={columnsIcon} alt="Columns" className="w-6 h-6" />, description: 'Multi-column layout' },
      ]
    },
    selection: {
      name: 'Selection',
      icon: '☑️',
      components: [
        { type: 'gallery', label: 'Gallery', icon: <img src={galleryIcon} alt="Gallery" className="w-6 h-6" />, description: 'Image gallery' },
        { type: 'image', label: 'Image', icon: <img src={imageIcon} alt="Image" className="w-6 h-6" />, description: 'Single image' },
        { type: 'video', label: 'Video', icon: <img src={videoIcon} alt="Video" className="w-6 h-6" />, description: 'Video player' },
        { type: 'map', label: 'Map', icon: <img src={mapIcon} alt="Map" className="w-6 h-6" />, description: 'Map embed' },
      ]
    },
    advanced: {
      name: 'Advanced',
      icon: <img src={navigationIcon} alt="Navigation" className="w-5 h-5 inline-block" />,
      components: [
        { type: 'navigation', label: 'Navigation', icon: <img src={navigationIcon} alt="Navigation" className="w-6 h-6" />, description: 'Navigation bar' },
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
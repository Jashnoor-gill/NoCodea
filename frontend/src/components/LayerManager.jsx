import React, { useState, useMemo } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ITEM_TYPE = 'LAYER_ITEM';

function LayerItem({ el, idx, moveLayer, selectedElement, setSelectedElement, setFormElements, depth = 0 }) {
  const ref = React.useRef(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(el.name || '');
  const [isExpanded, setIsExpanded] = useState(true);

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover(item) {
      if (item.idx === idx) return;
      moveLayer(item.idx, idx);
      item.idx = idx;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { idx },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  // Actions
  const toggleHidden = (e) => {
    e.stopPropagation();
    setFormElements(prev => prev.map((item, i) => i === idx ? { ...item, hidden: !item.hidden } : item));
  };
  
  const toggleLocked = (e) => {
    e.stopPropagation();
    setFormElements(prev => prev.map((item, i) => i === idx ? { ...item, locked: !item.locked } : item));
  };
  
  const startRenaming = (e) => {
    e.stopPropagation();
    setIsRenaming(true);
    setNameInput(el.name || '');
  };
  
  const handleRename = (e) => {
    e.preventDefault();
    setFormElements(prev => prev.map((item, i) => i === idx ? { ...item, name: nameInput } : item));
    setIsRenaming(false);
  };

  const duplicateElement = (e) => {
    e.stopPropagation();
    const duplicated = { ...el, id: Date.now().toString(), name: `${el.name || el.type} (Copy)` };
    setFormElements(prev => {
      const newElements = [...prev];
      newElements.splice(idx + 1, 0, duplicated);
      return newElements;
    });
  };

  const deleteElement = (e) => {
    e.stopPropagation();
    setFormElements(prev => prev.filter((item, i) => i !== idx));
    if (selectedElement && selectedElement.id === el.id) {
      setSelectedElement(null);
    }
  };

  const getElementIcon = (type) => {
    const icons = {
      heading: '📝',
      paragraph: '📄',
      button: '🔘',
      image: '🖼️',
      video: '🎥',
      container: '📦',
      row: '📊',
      column: '📋',
      section: '📑',
      divider: '➖',
      spacer: '⬜',
      navbar: '🧭',
      footer: '🦶',
      card: '💳',
      testimonial: '💬',
      pricing: '💰',
      text: '📝',
      email: '📧',
      number: '🔢',
      textarea: '📝',
      select: '📋',
      checkbox: '☑️',
      radio: '🔘',
      date: '📅',
      file: '📁',
      gallery: '🖼️',
      carousel: '🎠',
      map: '🗺️',
      social: '📱',
      sidebar: '📋',
      link: '🔗'
    };
    return icons[type] || '📄';
  };

  const getElementName = () => {
    if (el.name) return el.name;
    if (el.content && el.content.length < 30) return el.content;
    return `${el.type.charAt(0).toUpperCase() + el.type.slice(1)} ${idx + 1}`;
  };

  return (
    <li
      ref={ref}
      className={`px-2 py-1 rounded cursor-move flex items-center justify-between transition-colors ${
        selectedElement && selectedElement.id === el.id 
          ? 'bg-blue-100 text-blue-700 font-medium' 
          : 'hover:bg-gray-100'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => setSelectedElement(el)}
      style={{ 
        userSelect: 'none',
        marginLeft: `${depth * 16}px`
      }}
    >
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {/* Expand/Collapse for containers */}
        {(el.type === 'container' || el.type === 'section' || el.type === 'row') && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-gray-400 hover:text-gray-700 w-4 h-4 flex items-center justify-center"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        
        {/* Element Icon */}
        <span className="text-sm">{getElementIcon(el.type)}</span>
        
        {/* Hide/Show */}
        <button 
          onClick={toggleHidden} 
          className={`text-gray-400 hover:text-gray-700 ${el.hidden ? 'opacity-50' : ''}`}
          title={el.hidden ? 'Show' : 'Hide'}
        >
          {el.hidden ? '🚫' : '👁️'}
        </button>
        
        {/* Lock/Unlock */}
        <button 
          onClick={toggleLocked} 
          className={`text-gray-400 hover:text-gray-700 ${el.locked ? 'opacity-50' : ''}`}
          title={el.locked ? 'Unlock' : 'Lock'}
        >
          {el.locked ? '🔒' : '🔓'}
        </button>
        
        {/* Name (inline edit) */}
        <div className="flex-1 min-w-0">
          {isRenaming ? (
            <form onSubmit={handleRename} className="flex-1">
              <input
                className="border rounded px-1 text-xs w-full"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onBlur={handleRename}
                autoFocus
              />
            </form>
          ) : (
            <span 
              onDoubleClick={startRenaming} 
              className="truncate cursor-text text-sm"
              title={getElementName()}
            >
              {getElementName()}
            </span>
          )}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={duplicateElement}
          className="p-1 text-gray-400 hover:text-blue-600"
          title="Duplicate"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={deleteElement}
          className="p-1 text-gray-400 hover:text-red-600"
          title="Delete"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}

function LayerManager({ formElements, selectedElement, setSelectedElement, setFormElements }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showHidden, setShowHidden] = useState(true);
  const [showLocked, setShowLocked] = useState(true);
  const [groupByType, setGroupByType] = useState(false);

  // Move layer in the array
  const moveLayer = (from, to) => {
    if (from === to) return;
    const updated = [...formElements];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setFormElements(updated);
  };

  // Filter and group elements
  const filteredElements = useMemo(() => {
    let filtered = formElements.filter(el => {
      const matchesSearch = !searchTerm || 
        (el.name && el.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (el.content && el.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        el.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || el.type === filterType;
      const matchesHidden = showHidden || !el.hidden;
      const matchesLocked = showLocked || !el.locked;
      
      return matchesSearch && matchesType && matchesHidden && matchesLocked;
    });

    if (groupByType) {
      const grouped = {};
      filtered.forEach((el, idx) => {
        if (!grouped[el.type]) {
          grouped[el.type] = [];
        }
        grouped[el.type].push({ ...el, originalIndex: idx });
      });
      return grouped;
    }

    return filtered;
  }, [formElements, searchTerm, filterType, showHidden, showLocked, groupByType]);

  const elementTypes = useMemo(() => {
    const types = [...new Set(formElements.map(el => el.type))];
    return types.sort();
  }, [formElements]);

  const renderElements = () => {
    if (groupByType && typeof filteredElements === 'object') {
      return Object.entries(filteredElements).map(([type, elements]) => (
        <div key={type} className="mb-4">
          <div className="px-2 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded mb-1">
            {type.charAt(0).toUpperCase() + type.slice(1)} ({elements.length})
          </div>
          <ul className="space-y-1">
            {elements.map((el, idx) => (
              <LayerItem
                key={el.id || idx}
                el={el}
                idx={el.originalIndex}
                moveLayer={moveLayer}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                setFormElements={setFormElements}
              />
            ))}
          </ul>
        </div>
      ));
    }

    return (
      <ul className="space-y-1">
        {filteredElements.map((el, idx) => (
          <LayerItem
            key={el.id || idx}
            el={el}
            idx={idx}
            moveLayer={moveLayer}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            setFormElements={setFormElements}
          />
        ))}
      </ul>
    );
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Layers</h2>
          <span className="text-sm text-gray-500">{formElements.length} elements</span>
        </div>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search layers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Filter by type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="all">All Types</option>
            {elementTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={(e) => setShowHidden(e.target.checked)}
              className="mr-2"
            />
            <span className="text-xs text-gray-700">Show hidden</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showLocked}
              onChange={(e) => setShowLocked(e.target.checked)}
              className="mr-2"
            />
            <span className="text-xs text-gray-700">Show locked</span>
          </label>
        </div>
        
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={groupByType}
              onChange={(e) => setGroupByType(e.target.checked)}
              className="mr-2"
            />
            <span className="text-xs text-gray-700">Group by type</span>
          </label>
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-auto p-2">
        {renderElements()}
        
        {filteredElements.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">📄</div>
            <p className="text-sm">No layers found</p>
            <p className="text-xs">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Selected: {selectedElement ? selectedElement.type : 'None'}</span>
          <span>Visible: {formElements.filter(el => !el.hidden).length}</span>
        </div>
      </div>
    </div>
  );
}

export default LayerManager; 
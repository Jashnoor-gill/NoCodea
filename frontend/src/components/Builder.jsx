import React, { useEffect, useRef, useState } from 'react';
import Builder from '../builder';
import Components from '../builder/components';

const STORAGE_KEY = 'nocode_builder_canvas';

const BuilderComponent = ({ options = {} }) => {
  const containerRef = useRef(null);
  const builderRef = useRef(null);
  // Store dropped components as { type, props }
  const [canvasComponents, setCanvasComponents] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);

  useEffect(() => {
    builderRef.current = new Builder(options);
    builderRef.current.init();
    console.log('Builder initialized in React component');
    return () => {
      // Cleanup if needed
    };
  }, [options]);

  // Handle drag start for sidebar components
  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('componentType', component.type);
    console.log('Dragging component:', component.type);
  };

  // Handle drop on canvas
  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType');
    const comp = Components.get(type);
    if (comp) {
      // Initialize with default props
      const props = {};
      if (comp.properties) {
        comp.properties.forEach((p) => {
          props[p.key] = p.default;
        });
      }
      setCanvasComponents((prev) => [...prev, { type, props }]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle click on a canvas component
  const handleComponentClick = (idx) => {
    setSelectedIdx(idx);
  };

  // Handle property change
  const handlePropChange = (key, value) => {
    setCanvasComponents((prev) =>
      prev.map((comp, idx) =>
        idx === selectedIdx
          ? { ...comp, props: { ...comp.props, [key]: value } }
          : comp
      )
    );
  };

  // Handle component removal
  const handleRemoveComponent = (idx) => {
    setCanvasComponents((prev) => prev.filter((_, i) => i !== idx));
    if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else if (selectedIdx > idx) {
      setSelectedIdx((prev) => prev - 1);
    }
  };

  // Handle component reordering
  const handleMoveComponent = (direction) => {
    if (selectedIdx === null) return;
    setCanvasComponents((prev) => {
      const newArr = [...prev];
      const targetIdx = direction === 'up' ? selectedIdx - 1 : selectedIdx + 1;
      if (targetIdx < 0 || targetIdx >= newArr.length) return prev;
      // Swap
      [newArr[selectedIdx], newArr[targetIdx]] = [newArr[targetIdx], newArr[selectedIdx]];
      return newArr;
    });
    setSelectedIdx((prev) => {
      if (direction === 'up' && prev > 0) return prev - 1;
      if (direction === 'down' && prev < canvasComponents.length - 1) return prev + 1;
      return prev;
    });
  };

  // Save canvas state to localStorage
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(canvasComponents));
    alert('Canvas saved!');
  };

  // Load canvas state from localStorage
  const handleLoad = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      setCanvasComponents(JSON.parse(data));
      setSelectedIdx(null);
      alert('Canvas loaded!');
    } else {
      alert('No saved canvas found.');
    }
  };

  // Export canvas state as JSON file
  const handleExport = () => {
    const dataStr = JSON.stringify(canvasComponents, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nocode_builder_canvas.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const componentList = Components.getAll();
  const selectedComponent =
    selectedIdx !== null ? canvasComponents[selectedIdx] : null;
  const selectedComponentDef =
    selectedComponent && Components.get(selectedComponent.type);

  return (
    <div ref={containerRef} className="builder-container w-full h-[80vh] flex border rounded shadow-lg overflow-hidden bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r flex flex-col p-4">
        <h2 className="text-lg font-semibold mb-4">Components</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {componentList.map((comp) => (
            <div
              key={comp.name}
              className="cursor-move p-2 bg-white border rounded shadow-sm hover:bg-blue-50 transition"
              draggable
              onDragStart={(e) => handleDragStart(e, comp)}
            >
              <span className="font-medium">{comp.name}</span>
            </div>
          ))}
        </div>
      </aside>
      {/* Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        {/* Save/Load/Export Controls */}
        <div className="flex gap-2 mb-4 mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
            onClick={handleLoad}
          >
            Load
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600"
            onClick={handleExport}
          >
            Export
          </button>
          <label className="px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 cursor-pointer">
            Import
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (evt) => {
                  try {
                    const data = JSON.parse(evt.target.result);
                    setCanvasComponents(Array.isArray(data) ? data : []);
                    setSelectedIdx(null);
                    alert('Canvas imported!');
                  } catch (err) {
                    alert('Invalid JSON file.');
                  }
                };
                reader.readAsText(file);
                // Reset input so same file can be re-imported
                e.target.value = '';
              }}
            />
          </label>
        </div>
        <div
          className="w-4/5 h-4/5 bg-white border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-start p-4 overflow-auto"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {canvasComponents.length === 0 ? (
            <span className="text-gray-400 self-center my-auto">Drag components here</span>
          ) : (
            canvasComponents.map((comp, idx) => {
              const compDef = Components.get(comp.type);
              return (
                <div
                  key={idx}
                  className={`relative group my-2 w-full cursor-pointer transition border-2 ${
                    selectedIdx === idx
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => handleComponentClick(idx)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${compDef.name}`}
                  style={{ outline: 'none' }}
                >
                  {/* Delete button on hover */}
                  <button
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow hover:bg-red-600 transition"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveComponent(idx);
                    }}
                  >
                    ×
                  </button>
                  <div dangerouslySetInnerHTML={{ __html: compDef.html(comp.props) }} />
                </div>
              );
            })
          )}
        </div>
      </main>
      {/* Properties Panel */}
      <aside className="w-80 bg-gray-50 border-l flex flex-col p-4">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <div className="flex-1 overflow-y-auto">
          {selectedComponent && selectedComponentDef ? (
            <div className="p-4 bg-white rounded shadow">
              <div className="mb-2">
                <span className="font-semibold">Name:</span> {selectedComponentDef.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Type:</span> {selectedComponentDef.type}
              </div>
              <div className="flex gap-2 mb-4 mt-2">
                <button
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => handleMoveComponent('up')}
                  disabled={selectedIdx === 0}
                >
                  ↑ Move Up
                </button>
                <button
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => handleMoveComponent('down')}
                  disabled={selectedIdx === canvasComponents.length - 1}
                >
                  ↓ Move Down
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {selectedComponentDef.properties &&
                  selectedComponentDef.properties.map((prop) => (
                    <div key={prop.key}>
                      <label className="block text-sm font-medium mb-1" htmlFor={`prop-${prop.key}`}>
                        {prop.label}
                      </label>
                      {prop.type === 'select' ? (
                        <select
                          id={`prop-${prop.key}`}
                          className="w-full border rounded px-2 py-1"
                          value={selectedComponent.props[prop.key] || prop.default}
                          onChange={(e) => handlePropChange(prop.key, e.target.value)}
                        >
                          {prop.options && prop.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : prop.type === 'color' ? (
                        <input
                          id={`prop-${prop.key}`}
                          type="color"
                          className="w-8 h-8 p-0 border-none bg-transparent"
                          value={selectedComponent.props[prop.key] || prop.default}
                          onChange={(e) => handlePropChange(prop.key, e.target.value)}
                        />
                      ) : prop.type === 'textarea' ? (
                        <textarea
                          id={`prop-${prop.key}`}
                          className="w-full border rounded px-2 py-1"
                          value={selectedComponent.props[prop.key] || ''}
                          onChange={(e) => handlePropChange(prop.key, e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <input
                          id={`prop-${prop.key}`}
                          type={prop.type}
                          className="w-full border rounded px-2 py-1"
                          value={selectedComponent.props[prop.key] || ''}
                          onChange={(e) => handlePropChange(prop.key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
              </div>
              <button
                className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded shadow"
                onClick={() => handleRemoveComponent(selectedIdx)}
              >
                Delete Component
              </button>
            </div>
          ) : (
            <div className="text-gray-400 text-center mt-8">Select a component to view properties</div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default BuilderComponent; 
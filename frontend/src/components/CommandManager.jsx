import React, { useState, useEffect, useRef } from 'react';

const CommandManager = ({ onClose, onCommand }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const inputRef = useRef(null);

  const commands = [
    {
      id: 'undo',
      name: 'Undo',
      description: 'Undo last action',
      icon: '↶',
      shortcut: 'Ctrl+Z',
      category: 'Edit'
    },
    {
      id: 'redo',
      name: 'Redo',
      description: 'Redo last action',
      icon: '↷',
      shortcut: 'Ctrl+Y',
      category: 'Edit'
    },
    {
      id: 'copy',
      name: 'Copy',
      description: 'Copy selected element',
      icon: '📋',
      shortcut: 'Ctrl+C',
      category: 'Edit'
    },
    {
      id: 'paste',
      name: 'Paste',
      description: 'Paste copied element',
      icon: '📋',
      shortcut: 'Ctrl+V',
      category: 'Edit'
    },
    {
      id: 'delete',
      name: 'Delete',
      description: 'Delete selected element',
      icon: '🗑️',
      shortcut: 'Delete',
      category: 'Edit'
    },
    {
      id: 'duplicate',
      name: 'Duplicate',
      description: 'Duplicate selected element',
      icon: '📄',
      shortcut: 'Ctrl+D',
      category: 'Edit'
    },
    {
      id: 'select-all',
      name: 'Select All',
      description: 'Select all elements',
      icon: '☑️',
      shortcut: 'Ctrl+A',
      category: 'Edit'
    },
    {
      id: 'preview',
      name: 'Preview',
      description: 'Toggle preview mode',
      icon: '👁️',
      shortcut: 'Ctrl+P',
      category: 'View'
    },
    {
      id: 'fullscreen',
      name: 'Fullscreen',
      description: 'Toggle fullscreen mode',
      icon: '⛶',
      shortcut: 'F11',
      category: 'View'
    },
    {
      id: 'zoom-in',
      name: 'Zoom In',
      description: 'Zoom in canvas',
      icon: '🔍+',
      shortcut: 'Ctrl++',
      category: 'View'
    },
    {
      id: 'zoom-out',
      name: 'Zoom Out',
      description: 'Zoom out canvas',
      icon: '🔍-',
      shortcut: 'Ctrl+-',
      category: 'View'
    },
    {
      id: 'zoom-reset',
      name: 'Reset Zoom',
      description: 'Reset zoom to 100%',
      icon: '🔍',
      shortcut: 'Ctrl+0',
      category: 'View'
    },
    {
      id: 'save',
      name: 'Save',
      description: 'Save current project',
      icon: '💾',
      shortcut: 'Ctrl+S',
      category: 'File'
    },
    {
      id: 'export',
      name: 'Export',
      description: 'Export website',
      icon: '📤',
      shortcut: 'Ctrl+E',
      category: 'File'
    },
    {
      id: 'import',
      name: 'Import',
      description: 'Import website',
      icon: '📥',
      shortcut: 'Ctrl+I',
      category: 'File'
    },
    {
      id: 'new-project',
      name: 'New Project',
      description: 'Create new project',
      icon: '🆕',
      shortcut: 'Ctrl+N',
      category: 'File'
    },
    {
      id: 'open-project',
      name: 'Open Project',
      description: 'Open existing project',
      icon: '📁',
      shortcut: 'Ctrl+O',
      category: 'File'
    },
    {
      id: 'add-heading',
      name: 'Add Heading',
      description: 'Add heading element',
      icon: '📝',
      shortcut: 'H',
      category: 'Elements'
    },
    {
      id: 'add-paragraph',
      name: 'Add Paragraph',
      description: 'Add paragraph element',
      icon: '📄',
      shortcut: 'P',
      category: 'Elements'
    },
    {
      id: 'add-button',
      name: 'Add Button',
      description: 'Add button element',
      icon: '🔘',
      shortcut: 'B',
      category: 'Elements'
    },
    {
      id: 'add-image',
      name: 'Add Image',
      description: 'Add image element',
      icon: '🖼️',
      shortcut: 'I',
      category: 'Elements'
    },
    {
      id: 'add-container',
      name: 'Add Container',
      description: 'Add container element',
      icon: '📦',
      shortcut: 'C',
      category: 'Elements'
    },
    {
      id: 'add-section',
      name: 'Add Section',
      description: 'Add section element',
      icon: '📑',
      shortcut: 'S',
      category: 'Elements'
    },
    {
      id: 'toggle-layers',
      name: 'Toggle Layers',
      description: 'Show/hide layers panel',
      icon: '📋',
      shortcut: 'L',
      category: 'Panels'
    },
    {
      id: 'toggle-properties',
      name: 'Toggle Properties',
      description: 'Show/hide properties panel',
      icon: '⚙️',
      shortcut: 'P',
      category: 'Panels'
    },
    {
      id: 'toggle-assets',
      name: 'Toggle Assets',
      description: 'Show/hide assets panel',
      icon: '📁',
      shortcut: 'A',
      category: 'Panels'
    },
    {
      id: 'toggle-code',
      name: 'Toggle Code',
      description: 'Show/hide code editor',
      icon: '💻',
      shortcut: 'C',
      category: 'Panels'
    },
    {
      id: 'help',
      name: 'Help',
      description: 'Show help documentation',
      icon: '❓',
      shortcut: 'F1',
      category: 'Help'
    },
    {
      id: 'about',
      name: 'About',
      description: 'About this application',
      icon: 'ℹ️',
      shortcut: '',
      category: 'Help'
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          handleCommandSelect(filteredCommands[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
    }
  };

  const handleCommandSelect = (command) => {
    if (onCommand) {
      onCommand(command);
    }
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 200);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  const groupedCommands = filteredCommands.reduce((groups, command) => {
    if (!groups[command.category]) {
      groups[command.category] = [];
    }
    groups[command.category].push(command);
    return groups;
  }, {});

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⌘</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-lg font-medium border-none outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Commands List */}
        <div className="flex-1 overflow-auto">
          {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
            <div key={category}>
              <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-600 uppercase tracking-wide">
                {category}
              </div>
              {categoryCommands.map((command, index) => {
                const globalIndex = filteredCommands.findIndex(c => c.id === command.id);
                const isSelected = globalIndex === selectedIndex;
                
                return (
                  <button
                    key={command.id}
                    onClick={() => handleCommandSelect(command)}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{command.icon}</span>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{command.name}</div>
                        <div className="text-sm text-gray-500">{command.description}</div>
                      </div>
                    </div>
                    {command.shortcut && (
                      <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {command.shortcut}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg font-medium">No commands found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>Enter Select</span>
              <span>Esc Close</span>
            </div>
            <span>{filteredCommands.length} commands</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandManager; 
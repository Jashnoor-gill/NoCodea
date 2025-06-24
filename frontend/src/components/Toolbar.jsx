import React from 'react';

const Toolbar = ({ 
  isPreviewMode, 
  onPreview, 
  onSave, 
  onLoad, 
  onClear, 
  onExport, 
  onImport, 
  elementCount, 
  onOpenAssets,
  onOpenCode,
  onOpenCommands,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  loading
}) => {
  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = onImport;
    input.click();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Element Count */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Elements:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {elementCount}
            </span>
          </div>
          
          <div className="h-4 w-px bg-gray-300"></div>
          
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100"
              title="Undo (Ctrl+Z)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100"
              title="Redo (Ctrl+Y)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
            </button>
          </div>
          
          <div className="h-4 w-px bg-gray-300"></div>
          
          {/* Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Mode:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onPreview(false)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                  !isPreviewMode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🏗️ Build
              </button>
              <button
                onClick={() => onPreview(true)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                  isPreviewMode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👁️ Preview
              </button>
            </div>
          </div>
        </div>

        {/* Center Section - Quick Actions */}
        <div className="flex items-center space-x-2">
          {/* Command Palette */}
          <button
            onClick={onOpenCommands}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            title="Command Palette (Ctrl+K)"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            ⌘K
          </button>

          {/* Code Manager */}
          <button
            onClick={onOpenCode}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-700 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors duration-200"
            title="Code Manager"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Code
          </button>

          {/* Asset Manager */}
          <button
            onClick={onOpenAssets}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors duration-200"
            title="Asset Manager"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <rect x="7" y="9" width="10" height="6" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M7 15l2-2a2 2 0 012.828 0l2.172 2.172a2 2 0 002.828 0L17 15" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            Assets
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* File Operations */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onSave}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 shadow-sm"
              title="Save (Ctrl+S)"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              Save
            </button>
            
            <button
              onClick={onLoad}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Load
            </button>
          </div>

          {/* Import/Export */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleImportClick}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import
            </button>
            
            <button
              onClick={onExport}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onClear}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
            
            <button
              onClick={() => window.open('https://github.com/your-repo/website-builder', '_blank')}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-6">
            <span>📐 Layout: {elementCount > 0 ? Math.ceil(elementCount * 0.3) : 0}</span>
            <span>📝 Content: {elementCount > 0 ? Math.ceil(elementCount * 0.4) : 0}</span>
            <span>📋 Forms: {elementCount > 0 ? Math.ceil(elementCount * 0.2) : 0}</span>
            <span>🎨 Media: {elementCount > 0 ? Math.ceil(elementCount * 0.1) : 0}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Last action: {new Date().toLocaleTimeString()}</span>
            <span>Auto-save: Enabled</span>
            <span>History: {canUndo ? 'Available' : 'None'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar; 
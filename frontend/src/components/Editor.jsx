import React, { useState, useEffect } from 'react';
import { 
  CodeBracketIcon, 
  EyeIcon, 
  DocumentDuplicateIcon,
  PlayIcon,
  StopIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Editor = ({ onCodeChange, initialCode = '' }) => {
  const [code, setCode] = useState(initialCode);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [language, setLanguage] = useState('html');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code);
    }
  }, [code, onCodeChange]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const handleFormatCode = () => {
    // Basic code formatting - you could integrate with prettier or similar
    try {
      if (language === 'json') {
        const formatted = JSON.stringify(JSON.parse(code), null, 2);
        setCode(formatted);
      } else if (language === 'html') {
        // Basic HTML formatting
        const formatted = code
          .replace(/></g, '>\n<')
          .replace(/\n\s*\n/g, '\n')
          .trim();
        setCode(formatted);
      }
    } catch (error) {
      console.error('Error formatting code:', error);
    }
  };

  const handleRunCode = () => {
    if (language === 'html') {
      const newWindow = window.open('', '_blank');
      newWindow.document.write(code);
      newWindow.document.close();
    }
  };

  const getLanguageIcon = () => {
    switch (language) {
      case 'html':
        return '🌐';
      case 'css':
        return '🎨';
      case 'javascript':
        return '⚡';
      case 'json':
        return '📄';
      default:
        return '📝';
    }
  };

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        borderColor: '#404040'
      };
    }
    return {
      backgroundColor: '#ffffff',
      color: '#1f2937',
      borderColor: '#d1d5db'
    };
  };

  return (
    <div className="editor bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Editor Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CodeBracketIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
          </div>
          
          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="json">JSON</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Theme:</span>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-sm px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleFormatCode}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Format Code"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Format</span>
          </button>
          
          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Copy Code"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
            <span>Copy</span>
          </button>
          
          {language === 'html' && (
            <button
              onClick={handleRunCode}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
              title="Run Code"
            >
              <PlayIcon className="w-4 h-4" />
              <span>Run</span>
            </button>
          )}
          
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
            title="Toggle Preview"
          >
            <EyeIcon className="w-4 h-4" />
            <span>{isPreviewMode ? 'Hide' : 'Preview'}</span>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex h-96">
        {/* Code Editor */}
        <div className={`flex-1 ${isPreviewMode ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
          <div className="relative h-full">
            <textarea
              value={code}
              onChange={handleCodeChange}
              placeholder={`Enter your ${language.toUpperCase()} code here...`}
              className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
              style={getThemeStyles()}
              spellCheck="false"
            />
            
            {/* Line Numbers */}
            <div 
              className="absolute top-0 left-0 w-12 h-full p-4 font-mono text-xs text-gray-400 select-none pointer-events-none"
              style={{ backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f8f9fa' }}
            >
              {code.split('\n').map((_, index) => (
                <div key={index} className="text-right">
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {isPreviewMode && (
          <div className="w-1/2 border-l border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700">Preview</h4>
            </div>
            <div className="p-4 h-full overflow-auto">
              {language === 'html' ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: code }}
                  className="min-h-full"
                />
              ) : language === 'css' ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-2">CSS Preview:</div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {code}
                  </pre>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-2">Code Output:</div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {code}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Editor Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{getLanguageIcon()} {language.toUpperCase()}</span>
          <span>•</span>
          <span>{code.length} characters</span>
          <span>•</span>
          <span>{code.split('\n').length} lines</span>
        </div>
        
        <div className="text-sm text-gray-500">
          {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}
        </div>
      </div>
    </div>
  );
};

export default Editor; 
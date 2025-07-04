import React, { useState, useEffect, useRef } from 'react';
import { 
  CodeBracketIcon, 
  EyeIcon, 
  DocumentDuplicateIcon,
  PlayIcon,
  StopIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import ColorPicker from './ColorPicker';

const Editor = ({ onCodeChange, initialCode = '' }) => {
  const [htmlCode, setHtmlCode] = useState(initialCode || '');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [jsonCode, setJsonCode] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [language, setLanguage] = useState('html');
  const [theme, setTheme] = useState('dark');
  const iframeRef = useRef(null);
  const [canvasBackground, setCanvasBackground] = useState('');

  useEffect(() => {
    if (onCodeChange) {
      if (language === 'html') onCodeChange(htmlCode);
      else if (language === 'css') onCodeChange(cssCode);
      else if (language === 'javascript') onCodeChange(jsCode);
      else if (language === 'json') onCodeChange(jsonCode);
    }
  }, [htmlCode, cssCode, jsCode, jsonCode, language]);

  const handleCodeChange = (e) => {
    const value = e.target.value;
    if (language === 'html') setHtmlCode(value);
    else if (language === 'css') setCssCode(value);
    else if (language === 'javascript') setJsCode(value);
    else if (language === 'json') setJsonCode(value);
  };

  const handleCopyCode = () => {
    let code = '';
    if (language === 'html') code = htmlCode;
    else if (language === 'css') code = cssCode;
    else if (language === 'javascript') code = jsCode;
    else if (language === 'json') code = jsonCode;
    navigator.clipboard.writeText(code);
  };

  const handleFormatCode = () => {
    try {
      if (language === 'json') {
        const formatted = JSON.stringify(JSON.parse(jsonCode), null, 2);
        setJsonCode(formatted);
      } else if (language === 'html') {
        const formatted = htmlCode
          .replace(/></g, '>\n<')
          .replace(/\n\s*\n/g, '\n')
          .trim();
        setHtmlCode(formatted);
      } // Optionally add formatting for CSS/JS
    } catch (error) {
      console.error('Error formatting code:', error);
    }
  };

  const handleRunCode = () => {
    if (language === 'html') {
      const newWindow = window.open('', '_blank');
      newWindow.document.write(buildPreviewHtml());
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

  const buildPreviewHtml = () => {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Preview</title><style>${cssCode}</style></head><body>${htmlCode}<script>${jsCode}</script></body></html>`;
  };

  useEffect(() => {
    if (isPreviewMode && iframeRef.current && (language !== 'json')) {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(buildPreviewHtml());
      doc.close();
    }
  }, [isPreviewMode, htmlCode, cssCode, jsCode, language]);

  const getCurrentCode = () => {
    if (language === 'html') return htmlCode;
    if (language === 'css') return cssCode;
    if (language === 'javascript') return jsCode;
    if (language === 'json') return jsonCode;
    return '';
  };

  const setCurrentCode = (value) => {
    if (language === 'html') setHtmlCode(value);
    else if (language === 'css') setCssCode(value);
    else if (language === 'javascript') setJsCode(value);
    else if (language === 'json') setJsonCode(value);
  };

  return (
    <div className="editor bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-full">
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
      <div className="flex h-[80vh] min-h-[400px] w-full">
        {/* Code Editor */}
        <div className={`flex-1 ${isPreviewMode ? 'w-1/2' : 'w-full'} transition-all duration-300 h-full`}>
          <div className="relative h-full">
            <textarea
              value={getCurrentCode()}
              onChange={handleCodeChange}
              placeholder={`Enter your ${language.toUpperCase()} code here...`}
              className="w-full h-full p-4 pl-12 font-mono text-sm resize-none focus:outline-none"
              style={getThemeStyles()}
              spellCheck="false"
            />
            
            {/* Line Numbers */}
            <div 
              className="absolute top-0 left-0 w-12 h-full p-4 font-mono text-xs text-gray-400 select-none pointer-events-none"
              style={{ backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f8f9fa' }}
            >
              {getCurrentCode().split('\n').map((_, index) => (
                <div key={index} className="text-right">
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {isPreviewMode && (
          <div className="flex-1 border-l border-gray-200 bg-white h-full">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700">Preview</h4>
            </div>
            <div className="p-4 h-full overflow-auto">
              {language === 'json' ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-2">JSON Preview:</div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(jsonCode), null, 2);
                      } catch {
                        return jsonCode;
                      }
                    })()}
                  </pre>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  title="Live Preview"
                  className="w-full h-80 bg-white border rounded"
                  sandbox="allow-scripts allow-same-origin"
                  style={{ minHeight: '320px', height: '100%' }}
                />
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
          <span>{getCurrentCode().length} characters</span>
          <span>•</span>
          <span>{getCurrentCode().split('\n').length} lines</span>
        </div>
        
        <div className="text-sm text-gray-500">
          {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}
        </div>
      </div>

      <div className="flex items-center gap-4 p-2 bg-white border-b border-gray-200">
        <label className="text-sm font-medium text-gray-700">Canvas Background:</label>
        <ColorPicker value={canvasBackground} onChange={setCanvasBackground} />
      </div>
    </div>
  );
};

export default Editor; 
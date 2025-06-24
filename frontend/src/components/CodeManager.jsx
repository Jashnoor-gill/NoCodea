import React, { useState, useEffect } from 'react';

const CodeManager = ({ formElements, onClose, onApplyCode }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate code from form elements
  const generateCode = () => {
    setIsGenerating(true);
    
    try {
      // Generate HTML
      const html = generateHTML(formElements);
      setHtmlCode(html);
      
      // Generate CSS
      const css = generateCSS(formElements);
      setCssCode(css);
      
      // Generate JS
      const js = generateJS(formElements);
      setJsCode(js);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateHTML = (elements) => {
    let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    html += '  <meta charset="UTF-8">\n';
    html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '  <title>Your Website</title>\n';
    html += '  <link rel="stylesheet" href="styles.css">\n';
    html += '</head>\n<body>\n';
    
    elements.forEach(element => {
      if (element.hidden) return;
      
      const styles = element.styles || {};
      const styleString = Object.entries(styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      
      const styleAttr = styleString ? ` style="${styleString}"` : '';
      const className = element.className ? ` class="${element.className}"` : '';
      const id = element.id ? ` id="${element.id}"` : '';
      
      switch (element.type) {
        case 'heading':
          html += `  <h2${styleAttr}${className}${id}>${element.content || 'Your Heading'}</h2>\n`;
          break;
        case 'paragraph':
          html += `  <p${styleAttr}${className}${id}>${element.content || 'Your paragraph content'}</p>\n`;
          break;
        case 'button':
          html += `  <button${styleAttr}${className}${id}>${element.content || 'Click Me'}</button>\n`;
          break;
        case 'link':
          html += `  <a href="#"${styleAttr}${className}${id}>${element.content || 'Link Text'}</a>\n`;
          break;
        case 'image':
          html += `  <img src="${element.src || 'placeholder.jpg'}" alt="${element.alt || 'Image'}"${styleAttr}${className}${id}>\n`;
          break;
        case 'container':
          html += `  <div${styleAttr}${className}${id}>\n    <!-- Container content -->\n  </div>\n`;
          break;
        case 'section':
          html += `  <section${styleAttr}${className}${id}>\n    <!-- Section content -->\n  </section>\n`;
          break;
        case 'row':
          html += `  <div class="row"${styleAttr}${className}${id}>\n    <!-- Row content -->\n  </div>\n`;
          break;
        case 'column':
          html += `  <div class="column"${styleAttr}${className}${id}>\n    <!-- Column content -->\n  </div>\n`;
          break;
        case 'divider':
          html += `  <hr${styleAttr}${className}${id}>\n`;
          break;
        case 'spacer':
          html += `  <div class="spacer"${styleAttr}${className}${id}></div>\n`;
          break;
        case 'navbar':
          html += `  <nav${styleAttr}${className}${id}>\n    <div class="nav-container">\n      <div class="logo">Logo</div>\n      <ul class="nav-menu">\n        <li><a href="#">Home</a></li>\n        <li><a href="#">About</a></li>\n        <li><a href="#">Contact</a></li>\n      </ul>\n    </div>\n  </nav>\n`;
          break;
        case 'footer':
          html += `  <footer${styleAttr}${className}${id}>\n    <p>&copy; 2024 Your Company. All rights reserved.</p>\n  </footer>\n`;
          break;
        case 'card':
          html += `  <div class="card"${styleAttr}${className}${id}>\n    <h3>Card Title</h3>\n    <p>Card content goes here.</p>\n    <button>Learn More</button>\n  </div>\n`;
          break;
        case 'text':
        case 'email':
        case 'number':
        case 'url':
          html += `  <div class="form-group">\n`;
          html += `    <label for="${element.id}">${element.label || 'Label'}</label>\n`;
          html += `    <input type="${element.type}" id="${element.id}" placeholder="${element.placeholder || ''}"${element.required ? ' required' : ''}${styleAttr}${className}>\n`;
          html += `  </div>\n`;
          break;
        case 'textarea':
          html += `  <div class="form-group">\n`;
          html += `    <label for="${element.id}">${element.label || 'Label'}</label>\n`;
          html += `    <textarea id="${element.id}" placeholder="${element.placeholder || ''}"${element.required ? ' required' : ''}${styleAttr}${className}></textarea>\n`;
          html += `  </div>\n`;
          break;
        case 'select':
          html += `  <div class="form-group">\n`;
          html += `    <label for="${element.id}">${element.label || 'Label'}</label>\n`;
          html += `    <select id="${element.id}"${element.required ? ' required' : ''}${styleAttr}${className}>\n`;
          html += `      <option value="">${element.placeholder || 'Select an option'}</option>\n`;
          element.options?.forEach(option => {
            html += `      <option value="${option}">${option}</option>\n`;
          });
          html += `    </select>\n`;
          html += `  </div>\n`;
          break;
        case 'checkbox':
          html += `  <div class="form-group">\n`;
          html += `    <label class="checkbox-label">\n`;
          html += `      <input type="checkbox"${element.required ? ' required' : ''}${styleAttr}${className}>\n`;
          html += `      <span>${element.label || 'Checkbox'}</span>\n`;
          html += `    </label>\n`;
          html += `  </div>\n`;
          break;
        case 'radio':
          html += `  <div class="form-group">\n`;
          html += `    <label class="radio-label">\n`;
          html += `      <input type="radio"${element.required ? ' required' : ''}${styleAttr}${className}>\n`;
          html += `      <span>${element.label || 'Radio Option'}</span>\n`;
          html += `    </label>\n`;
          html += `  </div>\n`;
          break;
        default:
          html += `  <!-- ${element.type} element -->\n`;
      }
    });
    
    html += '</body>\n</html>';
    return html;
  };

  const generateCSS = (elements) => {
    let css = '/* Generated CSS */\n\n';
    css += '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n';
    css += 'body {\n  font-family: Arial, sans-serif;\n  line-height: 1.6;\n  color: #333;\n}\n\n';
    
    // Generate CSS for each element
    elements.forEach((element, index) => {
      if (element.hidden) return;
      
      const styles = element.styles || {};
      if (Object.keys(styles).length === 0) return;
      
      const selector = element.id ? `#${element.id}` : `.element-${index}`;
      css += `${selector} {\n`;
      
      Object.entries(styles).forEach(([property, value]) => {
        css += `  ${property}: ${value};\n`;
      });
      
      css += '}\n\n';
    });
    
    // Add common utility classes
    css += '/* Utility Classes */\n';
    css += '.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n\n';
    css += '.row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 20px;\n}\n\n';
    css += '.column {\n  flex: 1;\n  min-width: 0;\n}\n\n';
    css += '.spacer {\n  height: 20px;\n}\n\n';
    css += '.form-group {\n  margin-bottom: 20px;\n}\n\n';
    css += '.form-group label {\n  display: block;\n  margin-bottom: 5px;\n  font-weight: 500;\n}\n\n';
    css += '.form-group input,\n.form-group textarea,\n.form-group select {\n  width: 100%;\n  padding: 10px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  font-size: 16px;\n}\n\n';
    css += '.checkbox-label,\n.radio-label {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n}\n\n';
    css += 'button {\n  padding: 10px 20px;\n  background-color: #007bff;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 16px;\n}\n\n';
    css += 'button:hover {\n  background-color: #0056b3;\n}\n\n';
    css += 'a {\n  color: #007bff;\n  text-decoration: none;\n}\n\n';
    css += 'a:hover {\n  text-decoration: underline;\n}\n\n';
    css += 'img {\n  max-width: 100%;\n  height: auto;\n}\n\n';
    css += '/* Responsive Design */\n';
    css += '@media (max-width: 768px) {\n';
    css += '  .row {\n    flex-direction: column;\n  }\n';
    css += '  .column {\n    width: 100%;\n  }\n';
    css += '}\n';
    
    return css;
  };

  const generateJS = (elements) => {
    let js = '// Generated JavaScript\n\n';
    js += '// Wait for DOM to load\n';
    js += 'document.addEventListener("DOMContentLoaded", function() {\n';
    js += '  console.log("Website loaded successfully!");\n\n';
    
    // Add JavaScript for interactive elements
    elements.forEach(element => {
      if (element.hidden) return;
      
      switch (element.type) {
        case 'button':
          js += `  // Button functionality\n`;
          js += `  const button = document.querySelector('${element.id ? `#${element.id}` : 'button'}');\n`;
          js += `  if (button) {\n`;
          js += `    button.addEventListener('click', function() {\n`;
          js += `      console.log('Button clicked!');\n`;
          js += `      // Add your button functionality here\n`;
          js += `    });\n`;
          js += `  }\n\n`;
          break;
        case 'form':
          js += `  // Form handling\n`;
          js += `  const form = document.querySelector('form');\n`;
          js += `  if (form) {\n`;
          js += `    form.addEventListener('submit', function(e) {\n`;
          js += `      e.preventDefault();\n`;
          js += `      console.log('Form submitted!');\n`;
          js += `      // Add your form handling logic here\n`;
          js += `    });\n`;
          js += `  }\n\n`;
          break;
      }
    });
    
    js += '  // Smooth scrolling for anchor links\n';
    js += '  document.querySelectorAll("a[href^="#"]").forEach(anchor => {\n';
    js += '    anchor.addEventListener("click", function (e) {\n';
    js += '      e.preventDefault();\n';
    js += '      const target = document.querySelector(this.getAttribute("href"));\n';
    js += '      if (target) {\n';
    js += '        target.scrollIntoView({\n';
    js += '          behavior: "smooth"\n';
    js += '        });\n';
    js += '      }\n';
    js += '    });\n';
    js += '  });\n\n';
    
    js += '  // Add any additional custom JavaScript here\n';
    js += '});\n';
    
    return js;
  };

  const handleApplyCode = () => {
    if (onApplyCode) {
      onApplyCode({
        html: htmlCode,
        css: cssCode,
        js: jsCode
      });
    }
  };

  const handleDownloadCode = () => {
    // Create HTML file with embedded CSS and JS
    const fullHtml = htmlCode.replace(
      '<link rel="stylesheet" href="styles.css">',
      `<style>\n${cssCode}\n</style>`
    ).replace(
      '</body>',
      `<script>\n${jsCode}\n</script>\n</body>`
    );
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSeparate = () => {
    // Download HTML
    const htmlBlob = new Blob([htmlCode], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = 'index.html';
    document.body.appendChild(htmlLink);
    htmlLink.click();
    document.body.removeChild(htmlLink);
    URL.revokeObjectURL(htmlUrl);
    
    // Download CSS
    const cssBlob = new Blob([cssCode], { type: 'text/css' });
    const cssUrl = URL.createObjectURL(cssBlob);
    const cssLink = document.createElement('a');
    cssLink.href = cssUrl;
    cssLink.download = 'styles.css';
    document.body.appendChild(cssLink);
    cssLink.click();
    document.body.removeChild(cssLink);
    URL.revokeObjectURL(cssUrl);
    
    // Download JS
    const jsBlob = new Blob([jsCode], { type: 'text/javascript' });
    const jsUrl = URL.createObjectURL(jsBlob);
    const jsLink = document.createElement('a');
    jsLink.href = jsUrl;
    jsLink.download = 'script.js';
    document.body.appendChild(jsLink);
    jsLink.click();
    document.body.removeChild(jsLink);
    URL.revokeObjectURL(jsUrl);
  };

  useEffect(() => {
    generateCode();
  }, [formElements]);

  const tabs = [
    { id: 'html', name: 'HTML', icon: '🌐' },
    { id: 'css', name: 'CSS', icon: '🎨' },
    { id: 'js', name: 'JavaScript', icon: '⚡' }
  ];

  const getCodeForTab = () => {
    switch (activeTab) {
      case 'html': return htmlCode;
      case 'css': return cssCode;
      case 'js': return jsCode;
      default: return '';
    }
  };

  const setCodeForTab = (code) => {
    switch (activeTab) {
      case 'html': setHtmlCode(code); break;
      case 'css': setCssCode(code); break;
      case 'js': setJsCode(code); break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Code Manager</h2>
            <p className="text-sm text-gray-600">View and edit your website code</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={generateCode}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Regenerate</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
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

        {/* Code Editor */}
        <div className="flex-1 p-6">
          <div className="h-full bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
              <span className="text-sm text-gray-300">{activeTab.toUpperCase()}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText(getCodeForTab())}
                  className="p-1 text-gray-400 hover:text-white"
                  title="Copy code"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <textarea
              value={getCodeForTab()}
              onChange={(e) => setCodeForTab(e.target.value)}
              className="w-full h-full bg-gray-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none"
              spellCheck="false"
              placeholder={`Enter your ${activeTab.toUpperCase()} code here...`}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleApplyCode}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Apply Changes
              </button>
              <button
                onClick={handleDownloadCode}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Download HTML
              </button>
              <button
                onClick={handleDownloadSeparate}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Download Files
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {formElements.length} elements • {formElements.filter(el => !el.hidden).length} visible
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeManager; 
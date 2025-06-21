import React, { useState } from 'react';
import Editor from './Editor';
import { 
  CodeBracketIcon, 
  SparklesIcon,
  RocketLaunchIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const CodeShowcase = ({ onTryEditor }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [codeSnippets] = useState({
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="hero">
        <h1>Welcome to My Site</h1>
        <p>Built with NoCodea Website Builder</p>
    </header>
    
    <main>
        <section class="features">
            <div class="feature-card">
                <h3>Feature 1</h3>
                <p>Amazing feature description</p>
            </div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 My Website</p>
    </footer>
</body>
</html>`,
    css: `/* Modern CSS with NoCodea */
:root {
    --primary-color: #3b82f6;
    --secondary-color: #8b5cf6;
    --text-color: #1f2937;
    --bg-color: #ffffff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background: var(--bg-color);
}

.hero {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    text-align: center;
    padding: 4rem 2rem;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.features {
    padding: 4rem 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
}`,
    javascript: `// Interactive JavaScript with NoCodea
class WebsiteBuilder {
    constructor() {
        this.features = [];
        this.currentTheme = 'light';
    }

    addFeature(feature) {
        this.features.push({
            id: Date.now(),
            name: feature.name,
            description: feature.description,
            enabled: true
        });
        this.updateUI();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.toggle('dark-theme');
        this.updateThemeUI();
    }

    updateUI() {
        const featuresContainer = document.querySelector('.features');
        if (featuresContainer) {
            featuresContainer.innerHTML = this.features
                .map(feature => \`
                    <div class="feature-card" data-id="\${feature.id}">
                        <h3>\${feature.name}</h3>
                        <p>\${feature.description}</p>
                        <button onclick="builder.toggleFeature(\${feature.id})">
                            \${feature.enabled ? 'Disable' : 'Enable'}
                        </button>
                    </div>
                \`).join('');
        }
    }

    toggleFeature(id) {
        const feature = this.features.find(f => f.id === id);
        if (feature) {
            feature.enabled = !feature.enabled;
            this.updateUI();
        }
    }
}

// Initialize the website builder
const builder = new WebsiteBuilder();

// Add some sample features
builder.addFeature({
    name: 'Responsive Design',
    description: 'Mobile-first approach with flexible layouts'
});

builder.addFeature({
    name: 'Dark Mode',
    description: 'Toggle between light and dark themes'
});

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => builder.toggleTheme());
    }
});`,
    json: `{
  "website": {
    "name": "My NoCodea Website",
    "version": "1.0.0",
    "builder": "NoCodea",
    "settings": {
      "theme": "modern",
      "responsive": true,
      "seo": {
        "enabled": true,
        "title": "My Awesome Website",
        "description": "Built with NoCodea Website Builder",
        "keywords": ["website", "builder", "NoCodea", "modern"]
      },
      "performance": {
        "minify": true,
        "compress": true,
        "cache": true
      }
    },
    "components": [
      {
        "type": "header",
        "id": "main-header",
        "content": {
          "title": "Welcome to My Site",
          "subtitle": "Built with NoCodea Website Builder",
          "navigation": [
            {"label": "Home", "url": "#home"},
            {"label": "About", "url": "#about"},
            {"label": "Services", "url": "#services"},
            {"label": "Contact", "url": "#contact"}
          ]
        },
        "styles": {
          "background": "gradient",
          "textAlign": "center",
          "padding": "4rem 2rem"
        }
      },
      {
        "type": "section",
        "id": "features-section",
        "content": {
          "title": "Our Features",
          "features": [
            {
              "title": "Drag & Drop",
              "description": "Easy visual editing",
              "icon": "cursor-arrow-rays"
            },
            {
              "title": "Responsive",
              "description": "Mobile-first design",
              "icon": "device-phone-mobile"
            },
            {
              "title": "Fast",
              "description": "Optimized performance",
              "icon": "bolt"
            }
          ]
        }
      }
    ],
    "metadata": {
      "created": "2024-01-15T10:30:00Z",
      "lastModified": "2024-01-15T15:45:00Z",
      "author": "NoCodea Builder"
    }
  }
}`
  });

  const tabs = [
    { id: 'html', label: 'HTML', icon: '🌐' },
    { id: 'css', label: 'CSS', icon: '🎨' },
    { id: 'javascript', label: 'JavaScript', icon: '⚡' },
    { id: 'json', label: 'JSON', icon: '📄' }
  ];

  return (
    <section className="py-20 px-4 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CodeBracketIcon className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Powerful Code Editor
            </h2>
          </div>
          <p className="text-[#B0B0B0] text-lg max-w-3xl mx-auto">
            Write, edit, and preview your code in real-time with our advanced code editor. 
            Support for multiple languages with syntax highlighting and live preview.
          </p>
        </div>

        {/* Editor Showcase */}
        <div className="bg-[#282828] rounded-2xl overflow-hidden shadow-2xl">
          {/* Tab Navigation */}
          <div className="bg-[#202020] border-b border-[#404040]">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-white bg-[#404040] border-b-2 border-blue-500'
                      : 'text-[#B0B0B0] hover:text-white hover:bg-[#323232]'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Editor Content */}
          <div className="p-6">
            <Editor 
              initialCode={codeSnippets[activeTab]}
              onCodeChange={(code) => console.log('Code changed:', code)}
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Syntax Highlighting</h3>
            <p className="text-[#B0B0B0] text-sm">
              Beautiful syntax highlighting for multiple programming languages
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <RocketLaunchIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Live Preview</h3>
            <p className="text-[#B0B0B0] text-sm">
              See your changes instantly with real-time preview functionality
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CpuChipIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Features</h3>
            <p className="text-[#B0B0B0] text-sm">
              Auto-completion, error detection, and code formatting included
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={onTryEditor}
          >
            Try the Editor Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default CodeShowcase; 
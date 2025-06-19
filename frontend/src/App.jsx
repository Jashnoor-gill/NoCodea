import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import ComponentPanel from './components/ComponentPanel';
import Canvas from './components/Canvas';
import PropertyPanel from './components/PropertyPanel';
import Toolbar from './components/Toolbar';
import TemplateGallery from './components/TemplateGallery';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ResetPassword from './components/auth/ResetPassword';
import './App.css';

function AppContent() {
  const [formElements, setFormElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentProject, setCurrentProject] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, isAuthenticated } = useAuth();

  // Check for reset password token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (resetToken) {
      setShowResetPassword(true);
      setCurrentPage('landing');
    }
  }, []);

  const handleUpdateElement = (updatedElement) => {
    setFormElements(prev => 
      prev.map(el => el.id === updatedElement.id ? updatedElement : el)
    );
    setSelectedElement(updatedElement);
  };

  const handleSelectTemplate = (templateElements) => {
    // Generate unique IDs for template elements
    const elementsWithIds = templateElements.map((element, index) => ({
      ...element,
      id: Date.now().toString() + index,
      position: index
    }));
    setFormElements(elementsWithIds);
    setSelectedElement(null);
  };

  const handleSaveWebsite = async () => {
    if (!currentProject) {
      alert('No project selected. Please create or open a project first.');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/projects/${currentProject._id}`, {
        elements: formElements
      });
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadWebsite = () => {
    const savedData = localStorage.getItem('websiteData');
    if (savedData) {
      const websiteData = JSON.parse(savedData);
      setFormElements(websiteData.elements || []);
      alert('Website loaded successfully!');
    } else {
      alert('No saved website found.');
    }
  };

  const handleClearWebsite = () => {
    if (window.confirm('Are you sure you want to clear the entire website? This action cannot be undone.')) {
      setFormElements([]);
      setSelectedElement(null);
    }
  };

  const handleExportWebsite = () => {
    const websiteData = {
      title: currentProject?.name || 'My Website',
      elements: formElements,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(websiteData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${websiteData.title.toLowerCase().replace(/\s+/g, '-')}-export.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleImportWebsite = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const websiteData = JSON.parse(e.target.result);
          setFormElements(websiteData.elements || []);
          setSelectedElement(null);
          alert('Website imported successfully!');
        } catch (error) {
          alert('Error importing website. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    } else {
      setShowLogin(true);
    }
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setCurrentProject(null);
    setFormElements([]);
    setSelectedElement(null);
  };

  const handleOpenProject = async (projectId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
      const project = response.data.data;
      
      setCurrentProject(project);
      setFormElements(project.elements || []);
      setSelectedElement(null);
      setCurrentPage('builder');
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Failed to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleCloseAuth = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowResetPassword(false);
  };

  // Render Landing Page
  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} />
        {showLogin && (
          <Login 
            onClose={handleCloseAuth}
            onSwitchToRegister={handleSwitchToRegister}
          />
        )}
        {showRegister && (
          <Register 
            onClose={handleCloseAuth}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
        {showResetPassword && (
          <ResetPassword 
            onClose={handleCloseAuth}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </>
    );
  }

  // Render Dashboard
  if (currentPage === 'dashboard') {
    return (
      <Dashboard 
        onOpenProject={handleOpenProject}
        onCreateProject={() => setCurrentPage('builder')}
      />
    );
  }

  // Render Website Builder
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">WB</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">Website Builder</h1>
                  {currentProject && (
                    <span className="text-sm text-gray-500">- {currentProject.name}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToLanding}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Dashboard
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Welcome,</span>
                  <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Component Panel */}
          <div className="w-80 bg-white border-r border-gray-200">
            <ComponentPanel />
          </div>

          {/* Canvas */}
          <div className="flex-1 flex flex-col">
            <Toolbar
              onSave={handleSaveWebsite}
              onLoad={handleLoadWebsite}
              onClear={handleClearWebsite}
              onExport={handleExportWebsite}
              onImport={handleImportWebsite}
              onPreview={() => setIsPreviewMode(!isPreviewMode)}
              isPreviewMode={isPreviewMode}
              loading={loading}
            />
            
            <div className="flex-1 overflow-auto p-6">
              <Canvas
                formElements={formElements}
                setFormElements={setFormElements}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                isPreviewMode={isPreviewMode}
              />
            </div>
          </div>

          {/* Property Panel */}
          {selectedElement && !isPreviewMode && (
            <div className="w-80 bg-white border-l border-gray-200">
              <PropertyPanel
                element={selectedElement}
                onUpdate={handleUpdateElement}
              />
            </div>
          )}
        </div>

        {/* Template Gallery Modal */}
        {showTemplates && (
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            onClose={() => setShowTemplates(false)}
          />
        )}
      </div>
    </DndProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

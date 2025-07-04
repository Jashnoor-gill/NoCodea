import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';
import ComponentPanel from './components/ComponentPanel';
import Canvas from './components/Canvas';
import PropertyPanel from './components/PropertyPanel';
import Toolbar from './components/Toolbar';
import TemplateGallery from './components/TemplateGallery';
import TemplateManager from './components/TemplateManager';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import ProductCategory from './components/ProductCategory';
import ProductDetail from './components/ProductDetail';
import ManufacturerDetail from './components/ManufacturerDetail';
import VendorDetail from './components/VendorDetail';
import Search from './components/Search';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ResetPassword from './components/auth/ResetPassword';
import Editor from './components/Editor';
import OpeningAnimation from './components/OpeningAnimation';
import LoadingWave from './components/LoadingWave';
import UserAddress from './components/user/UserAddress';
import UserAddresses from './components/user/UserAddresses';
import UserComments from './components/user/UserComments';
import UserDownloads from './components/user/UserDownloads';
import UserDashboard from './components/user/UserDashboard';
import UserOrders from './components/user/UserOrders';
import UserProfile from './components/user/UserProfile';
import OrderTracking from './components/user/OrderTracking';
import ReturnForm from './components/ReturnForm';
import Wishlist from './components/Wishlist';
import './App.css';
import { AdminMenuProvider } from './contexts/AdminMenuContext';
import { SiteSettingsProvider, useSiteSettings } from './contexts/SiteSettingsContext';
import LayerManager from './components/LayerManager';
import AssetManager from './components/AssetManager';
import CodeManager from './components/CodeManager';
import DeviceManager from './components/DeviceManager';
import CommandManager from './components/CommandManager';
import AdminDashboard from './components/admin/AdminDashboard';
import PostManager from './components/admin/PostManager';
import CategoryManager from './components/admin/CategoryManager';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import UserManager from './components/admin/UserManager';
import RequireAdmin from './components/admin/RequireAdmin';
import DefaultThemeProvider from './themes/default/ThemeProvider.jsx';
// import OtherThemeProvider from './themes/other/ThemeProvider.jsx'; // add more as needed

const themeMap = {
  default: DefaultThemeProvider,
  // other: OtherThemeProvider,
};

function AppContent() {
  const { t } = useTranslation();
  const { user, isAuthenticated, handleOAuthCallback } = useAuth();
  const { settings } = useSiteSettings();
  const [formElements, setFormElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentProject, setCurrentProject] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOpeningAnimation, setShowOpeningAnimation] = useState(true);
  const [canvasBackground, setCanvasBackground] = useState('');

  // New GrapesJS-style features state
  const [showAssetManager, setShowAssetManager] = useState(false);
  const [showCodeManager, setShowCodeManager] = useState(false);
  const [showDeviceManager, setShowDeviceManager] = useState(false);
  const [showCommandManager, setShowCommandManager] = useState(false);
  const [currentDevice, setCurrentDevice] = useState({
    id: 'desktop',
    name: 'Desktop',
    width: '100%',
    height: '100%'
  });
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copiedElement, setCopiedElement] = useState(null);

  // Check for reset password token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (resetToken) {
      setCurrentPage('landing');
    }
  }, []);

  // Google OAuth callback handler
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.pathname === '/auth/callback') {
      const token = url.searchParams.get('token');
      if (token) {
        handleOAuthCallback(token);
        window.history.replaceState({}, document.title, '/'); // Clean up URL
        setCurrentPage('dashboard');
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandManager(true);
      }
      
      // Command/Ctrl + S for save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveWebsite();
      }
      
      // Command/Ctrl + Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      
      // Command/Ctrl + Shift + Z or Ctrl + Y for redo
      if ((e.metaKey || e.ctrlKey) && ((e.shiftKey && e.key === 'z') || e.key === 'y')) {
        e.preventDefault();
        handleRedo();
      }
      
      // Delete key for delete element
      if (e.key === 'Delete' && selectedElement) {
        e.preventDefault();
        handleDeleteElement(selectedElement.id);
      }
      
      // Escape to deselect
      if (e.key === 'Escape') {
        setSelectedElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement]);

  // History management
  const addToHistory = (elements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(elements));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setFormElements(JSON.parse(history[newIndex]));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setFormElements(JSON.parse(history[newIndex]));
    }
  };

  const handleOpeningAnimationComplete = () => {
    setShowOpeningAnimation(false);
  };

  const handleUpdateElement = (updatedElement) => {
    const newElements = formElements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    );
    setFormElements(newElements);
    setSelectedElement(updatedElement);
    addToHistory(newElements);
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
    addToHistory(elementsWithIds);
  };

  const handleSaveWebsite = async () => {
    if (!currentProject) {
      toast.warning(t('noProjectSelected'));
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/projects/${currentProject._id}`, {
        elements: formElements
      });
      toast.success(t('projectSavedSuccess'));
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(t('projectSaveFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleLoadWebsite = () => {
    const savedData = localStorage.getItem('websiteData');
    if (savedData) {
      const websiteData = JSON.parse(savedData);
      setFormElements(websiteData.elements || []);
      setCanvasBackground(websiteData.canvasBackground || '');
      toast.success(t('websiteLoadedSuccess'));
    } else {
      toast.info(t('noSavedWebsite'));
    }
  };

  const handleClearWebsite = () => {
    if (window.confirm('Are you sure you want to clear the entire website? This action cannot be undone.')) {
      setFormElements([]);
      setSelectedElement(null);
      addToHistory([]);
    }
  };

  const handleExportWebsite = () => {
    const websiteData = {
      title: currentProject?.name || 'My Website',
      elements: formElements,
      canvasBackground,
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
          setCanvasBackground(websiteData.canvasBackground || '');
          setSelectedElement(null);
          addToHistory(websiteData.elements || []);
          toast.success(t('websiteImportedSuccess'));
        } catch (error) {
          toast.error(t('websiteImportFailed'));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    } else {
      // setShowLogin(true); // Temporarily disabled sign in
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
      addToHistory(project.elements || []);
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error(t('projectLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  // New GrapesJS-style handlers
  const handleAssetSelect = (asset) => {
    if (selectedElement && selectedElement.type === 'image') {
      handleUpdateElement({
        ...selectedElement,
        src: asset.url,
        alt: asset.name
      });
    }
    setShowAssetManager(false);
  };

  const handleCommandExecute = (command) => {
    switch (command.id) {
      case 'undo':
        handleUndo();
        break;
      case 'redo':
        handleRedo();
        break;
      case 'copy':
        if (selectedElement) {
          setCopiedElement(selectedElement);
          toast.success('Element copied');
        }
        break;
      case 'paste':
        if (copiedElement) {
          const newElement = {
            ...copiedElement,
            id: Date.now().toString()
          };
          const newElements = [...formElements, newElement];
          setFormElements(newElements);
          setSelectedElement(newElement);
          addToHistory(newElements);
          toast.success('Element pasted');
        }
        break;
      case 'delete':
        if (selectedElement) {
          handleDeleteElement(selectedElement.id);
        }
        break;
      case 'duplicate':
        if (selectedElement) {
          const duplicated = {
            ...selectedElement,
            id: Date.now().toString(),
            name: `${selectedElement.name || selectedElement.type} (Copy)`
          };
          const newElements = [...formElements, duplicated];
          setFormElements(newElements);
          setSelectedElement(duplicated);
          addToHistory(newElements);
        }
        break;
      case 'preview':
        setIsPreviewMode(!isPreviewMode);
        break;
      case 'save':
        handleSaveWebsite();
        break;
      case 'export':
        handleExportWebsite();
        break;
      case 'import':
        document.getElementById('import-file').click();
        break;
      case 'toggle-layers':
        // Toggle layer manager visibility
        break;
      case 'toggle-properties':
        // Toggle properties panel visibility
        break;
      case 'toggle-assets':
        setShowAssetManager(!showAssetManager);
        break;
      case 'toggle-code':
        setShowCodeManager(!showCodeManager);
        break;
      default:
        console.log('Command not implemented:', command.id);
    }
  };

  const handleDeleteElement = (elementId) => {
    const newElements = formElements.filter(el => el.id !== elementId);
    setFormElements(newElements);
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
    addToHistory(newElements);
  };

  const handleDeviceChange = (device) => {
    setCurrentDevice(device);
    setShowDeviceManager(false);
  };

  const handleZoomChange = (newZoom) => {
    setZoom(Math.max(25, Math.min(200, newZoom)));
  };

  // Return the routes instead of conditional rendering
  return (
    <>
      <Toaster richColors />
      {showOpeningAnimation && (
        <OpeningAnimation onComplete={handleOpeningAnimationComplete} />
      )}
      {!showOpeningAnimation && (
        <Routes>
          <Route path="/" element={
            currentPage === 'landing' ? (
              <>
                <LandingPage onGetStarted={handleGetStarted} onTryEditor={() => setCurrentPage('builder')} />
                {/* {showLogin && (
                  <Login 
                    onClose={() => {}}
                    onSwitchToRegister={() => {}}
                  />
                )}
                {showRegister && (
                  <Register 
                    onClose={() => {}}
                    onSwitchToLogin={() => {}}
                  />
                )}
                {showResetPassword && (
                  <ResetPassword 
                    onClose={() => {}}
                    onSwitchToLogin={() => {}}
                  />
                )} */}
              </>
            ) : currentPage === 'editor' ? (
              <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center p-8">
                <Editor />
                <button
                  className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  onClick={() => setCurrentPage('landing')}
                >
                  Back to Home
                </button>
              </div>
            ) : currentPage === 'dashboard' ? (
              <div className="w-full min-h-screen bg-gray-50">
                <Dashboard 
                  onOpenProject={handleOpenProject}
                  onCreateProject={() => setCurrentPage('builder')}
                />
              </div>
            ) : (
              <DndProvider backend={HTML5Backend}>
                <div className="App h-screen flex flex-col bg-gray-50 w-full overflow-auto" style={{ height: '100vh', margin: 0, padding: 0 }}>
                  {/* Header */}
                  <header className="bg-white border-b border-gray-200 shadow-sm w-full">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                      <div className="flex items-center justify-between h-16 w-full">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">NC</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">{settings.siteName}</h1>
                            {currentProject && (
                              <span className="text-sm text-gray-500">- {currentProject.name}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {/* Device Preview */}
                          <button
                            onClick={() => setShowDeviceManager(true)}
                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                          >
                            <span>{currentDevice.icon || '🖥️'}</span>
                            <span>{currentDevice.name}</span>
                          </button>

                          {/* Zoom Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleZoomChange(zoom - 25)}
                              className="p-1 text-gray-500 hover:text-gray-700"
                              disabled={zoom <= 25}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                              </svg>
                            </button>
                            <span className="text-sm text-gray-600 min-w-[3rem] text-center">{zoom}%</span>
                            <button
                              onClick={() => handleZoomChange(zoom + 25)}
                              className="p-1 text-gray-500 hover:text-gray-700"
                              disabled={zoom >= 200}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </button>
                          </div>

                          <button
                            onClick={handleBackToLanding}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            {t('backToDashboard')}
                          </button>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{t('welcome')}</span>
                            <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* Main Content */}
                  <div className="flex-1 flex w-full">
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
                        onOpenAssets={() => setShowAssetManager(true)}
                        onOpenCode={() => setShowCodeManager(true)}
                        onOpenCommands={() => setShowCommandManager(true)}
                        elementCount={formElements.length}
                        canUndo={historyIndex > 0}
                        canRedo={historyIndex < history.length - 1}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                      />
                      
                      <div 
                        className="flex-1 overflow-auto w-full"
                        style={{
                          transform: `scale(${zoom / 100})`,
                          transformOrigin: 'top left',
                          width: `${100 / (zoom / 100)}%`,
                          height: `${100 / (zoom / 100)}%`
                        }}
                      >
                        <div
                          style={{
                            width: currentDevice.width,
                            height: currentDevice.height,
                            maxWidth: currentDevice.width,
                            margin: '0 auto'
                          }}
                        >
                          <Canvas
                            formElements={formElements}
                            setFormElements={setFormElements}
                            selectedElement={selectedElement}
                            setSelectedElement={setSelectedElement}
                            isPreviewMode={isPreviewMode}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Property Panel & Layer Manager */}
                    {!isPreviewMode && (
                      <>
                        <div className="w-80 bg-white border-l border-gray-200">
                          {selectedElement && (
                            <PropertyPanel
                              element={selectedElement}
                              onUpdate={handleUpdateElement}
                            />
                          )}
                        </div>
                        <div className="w-64 bg-white border-l border-gray-100">
                          <LayerManager
                            formElements={formElements}
                            selectedElement={selectedElement}
                            setSelectedElement={setSelectedElement}
                            setFormElements={setFormElements}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Template Gallery Modal */}
                  {showTemplates && (
                    <TemplateGallery
                      onSelectTemplate={handleSelectTemplate}
                      onClose={() => setShowTemplates(false)}
                    />
                  )}

                  {/* Asset Manager Modal */}
                  {showAssetManager && (
                    <AssetManager
                      onSelect={handleAssetSelect}
                      onClose={() => setShowAssetManager(false)}
                    />
                  )}

                  {/* Code Manager Modal */}
                  {showCodeManager && (
                    <CodeManager
                      formElements={formElements}
                      onClose={() => setShowCodeManager(false)}
                      onApplyCode={(code) => {
                        console.log('Code applied:', code);
                        setShowCodeManager(false);
                      }}
                    />
                  )}

                  {/* Device Manager Modal */}
                  {showDeviceManager && (
                    <DeviceManager
                      onDeviceChange={handleDeviceChange}
                      onClose={() => setShowDeviceManager(false)}
                    />
                  )}

                  {/* Command Manager Modal */}
                  {showCommandManager && (
                    <CommandManager
                      onCommand={handleCommandExecute}
                      onClose={() => setShowCommandManager(false)}
                    />
                  )}

                  {/* Hidden file input for import */}
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleImportWebsite}
                  />
                </div>
              </DndProvider>
            )
          } />
          <Route path="/products" element={<Products />} />
          <Route path="/categories/:slug" element={<ProductCategory />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/manufacturers/:slug" element={<ManufacturerDetail />} />
          <Route path="/vendors/:slug" element={<VendorDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/orders" element={<UserOrders />} />
          <Route path="/user/orders/:orderId" element={<UserOrders />} />
          <Route path="/user/addresses" element={<UserAddresses />} />
          <Route path="/user/addresses/new" element={<UserAddress />} />
          <Route path="/user/addresses/:addressId/edit" element={<UserAddress />} />
          <Route path="/user/comments" element={<UserComments />} />
          <Route path="/user/downloads" element={<UserDownloads />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/returns" element={<ReturnForm />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/templates" element={<TemplateManager />} />
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/posts" element={<RequireAdmin><PostManager /></RequireAdmin>} />
          <Route path="/admin/categories" element={<RequireAdmin><CategoryManager /></RequireAdmin>} />
          <Route path="/admin/users" element={<RequireAdmin><UserManager /></RequireAdmin>} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  const [ThemeProvider, setThemeProvider] = useState(() => themeMap['default']);

  useEffect(() => {
    const activeTheme = 'default'; // or from config
    setThemeProvider(() => themeMap[activeTheme] || DefaultThemeProvider);
  }, []);

  if (!ThemeProvider) return <div>Loading theme...</div>;

  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteSettingsProvider>
          <AdminMenuProvider>
            <Router>
              <Routes>
                <Route path="/" element={<AppContent />} />
                <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
                <Route path="/admin/posts" element={<RequireAdmin><PostManager /></RequireAdmin>} />
                <Route path="/admin/categories" element={<RequireAdmin><CategoryManager /></RequireAdmin>} />
                <Route path="/admin/users" element={<RequireAdmin><UserManager /></RequireAdmin>} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
              </Routes>
            </Router>
          </AdminMenuProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

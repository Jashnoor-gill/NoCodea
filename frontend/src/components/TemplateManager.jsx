import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  FolderOpen, 
  Save, 
  Trash2, 
  Plus, 
  Code, 
  Eye, 
  Settings,
  RefreshCw,
  FileText,
  Download,
  Upload
} from 'lucide-react';

const TemplateManager = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const siteSettings = useSiteSettings();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateContent, setTemplateContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [processedTemplate, setProcessedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  // Load templates
  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/templates/list');
      setTemplates(response.data.data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error(t('templatesLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Load template content
  const loadTemplateContent = async (templateName) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/templates/${templateName}`);
      setTemplateContent(response.data.data);
      setSelectedTemplate(templateName);
      setIsEditing(true);
      setIsPreviewMode(false);
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error(t('templateLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Save template
  const saveTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/api/templates/${selectedTemplate}`, {
        content: templateContent
      });
      toast.success(t('templateSavedSuccess'));
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error(t('templateSaveFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Delete template
  const deleteTemplate = async (templateName) => {
    if (!window.confirm(t('confirmDeleteTemplate'))) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/templates/${templateName}`);
      toast.success(t('templateDeletedSuccess'));
      
      if (selectedTemplate === templateName) {
        setSelectedTemplate(null);
        setTemplateContent('');
        setIsEditing(false);
      }
      
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error(t('templateDeleteFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Create new template
  const createTemplate = async () => {
    if (!newTemplateName.trim()) {
      toast.error(t('templateNameRequired'));
      return;
    }

    const templateName = newTemplateName.endsWith('.html') 
      ? newTemplateName 
      : `${newTemplateName}.html`;

    try {
      setLoading(true);
      const defaultContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[data-v-global-site.name]</title>
    <meta name="description" content="[data-v-global-site.description.meta-description]">
    <meta name="keywords" content="[data-v-global-site.description.meta-keywords]">
</head>
<body>
    <header>
        <h1>[data-v-global-site.name]</h1>
        <p>[data-v-global-site.description.tagline]</p>
    </header>
    
    <main>
        <section>
            <h2>Welcome to [data-v-global-site.name]</h2>
            <p>Current year: [data-v-year]</p>
            <p>User: [data-v-global-user.name]</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; [data-v-year] [data-v-global-site.name]. All rights reserved.</p>
    </footer>
</body>
</html>`;

      await axios.post(`http://localhost:5000/api/templates/${templateName}`, {
        content: defaultContent
      });
      
      toast.success(t('templateCreatedSuccess'));
      setNewTemplateName('');
      loadTemplates();
      loadTemplateContent(templateName);
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error(t('templateCreateFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Process template preview
  const processTemplatePreview = async () => {
    if (!selectedTemplate || !templateContent) return;

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/templates/process', {
        template: selectedTemplate,
        data: previewData,
        seo: {
          title: siteSettings.siteName,
          description: siteSettings.description?.metaDescription || '',
          keywords: siteSettings.description?.metaKeywords || ''
        },
        theme: {
          theme: localStorage.getItem('theme') || 'light',
          rtl: false
        }
      });
      
      setProcessedTemplate(response.data.data);
      setIsPreviewMode(true);
    } catch (error) {
      console.error('Error processing template:', error);
      toast.error(t('templateProcessFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Export template
  const exportTemplate = () => {
    if (!selectedTemplate || !templateContent) return;

    const blob = new Blob([templateContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedTemplate;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import template
  const importTemplate = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setTemplateContent(e.target.result);
      setNewTemplateName(file.name);
    };
    reader.readAsText(file);
  };

  // Clear cache
  const clearCache = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/templates/cache/clear');
      toast.success(t('cacheClearedSuccess'));
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error(t('cacheClearFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('templateManager')}</h1>
              <p className="text-gray-600 mt-1">{t('templateManagerDescription')}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={clearCache}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t('clearCache')}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{t('templates')}</h2>
                <button
                  onClick={() => setNewTemplateName('')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Create New Template */}
              {newTemplateName !== null && (
                <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder={t('templateName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={createTemplate}
                      disabled={loading}
                      className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      {t('create')}
                    </button>
                    <button
                      onClick={() => setNewTemplateName(null)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              )}

              {/* Template List */}
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.name}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.name
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => loadTemplateContent(template.name)}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {template.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTemplate(template.name);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Template Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Editor Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedTemplate || t('selectTemplate')}
                    </h3>
                    {selectedTemplate && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={saveTemplate}
                          disabled={loading}
                          className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>{t('save')}</span>
                        </button>
                        <button
                          onClick={exportTemplate}
                          className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>{t('export')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="file"
                        accept=".html"
                        onChange={importTemplate}
                        className="hidden"
                      />
                      <Upload className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">{t('import')}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Editor Content */}
              {selectedTemplate ? (
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <button
                      onClick={() => setIsPreviewMode(false)}
                      className={`flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors ${
                        !isPreviewMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Code className="w-4 h-4" />
                      <span>{t('edit')}</span>
                    </button>
                    <button
                      onClick={processTemplatePreview}
                      disabled={loading}
                      className={`flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors ${
                        isPreviewMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>{t('preview')}</span>
                    </button>
                  </div>

                  {isPreviewMode ? (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div
                        dangerouslySetInnerHTML={{ __html: processedTemplate }}
                        className="prose max-w-none"
                      />
                    </div>
                  ) : (
                    <textarea
                      value={templateContent}
                      onChange={(e) => setTemplateContent(e.target.value)}
                      className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('templateContentPlaceholder')}
                    />
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{t('selectTemplateToEdit')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateManager; 
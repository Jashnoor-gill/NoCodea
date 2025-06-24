import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import axios from 'axios';
import { toast } from 'sonner';

// Template Engine Component
const TemplateEngine = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const siteSettings = useSiteSettings();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [processedContent, setProcessedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Template data
  const [templateData, setTemplateData] = useState({
    // Basic data
    title: 'Sample Page',
    description: 'This is a sample page description',
    content: 'Sample content here',
    
    // Arrays for loops
    categories: [
      { taxonomy_item_id: 1, name: 'Electronics', url: '/categories/electronics' },
      { taxonomy_item_id: 2, name: 'Clothing', url: '/categories/clothing' },
      { taxonomy_item_id: 3, name: 'Books', url: '/categories/books' }
    ],
    
    archives: [
      { url: '/archive/2024', title: '2024' },
      { url: '/archive/2023', title: '2023' },
      { url: '/archive/2022', title: '2022' }
    ],
    
    payment_methods: [
      { payment_id: 1, key: 'stripe', name: 'Credit Card' },
      { payment_id: 2, key: 'paypal', name: 'PayPal' },
      { payment_id: 3, key: 'bank', name: 'Bank Transfer' }
    ],
    
    shipping_methods: [
      { shipping_id: 1, key: 'standard', name: 'Standard Shipping' },
      { shipping_id: 2, key: 'express', name: 'Express Shipping' },
      { shipping_id: 3, key: 'overnight', name: 'Overnight Shipping' }
    ],
    
    // Form data
    post: {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello world!',
      register: true,
      terms: true,
      newsletter: false
    },
    
    checkout: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      country_id: 'US',
      region_id: 'CA'
    },
    
    // Countries and regions
    countries: [
      { country_id: 'US', name: 'United States' },
      { country_id: 'CA', name: 'Canada' },
      { country_id: 'UK', name: 'United Kingdom' }
    ],
    
    regions: [
      { region_id: 'CA', name: 'California' },
      { region_id: 'NY', name: 'New York' },
      { region_id: 'TX', name: 'Texas' }
    ]
  });
  
  // SEO and theme data
  const [seoData, setSeoData] = useState({
    title: 'NoCodea - Website Builder',
    description: 'Build beautiful websites without code',
    keywords: 'website builder, no-code, drag and drop'
  });
  
  const [themeData, setThemeData] = useState({
    theme: 'light',
    rtl: false
  });

  // Global context data
  const globalData = {
    site: siteSettings,
    user: user,
    year: new Date().getFullYear(),
    locale: localStorage.getItem('language') || 'en',
    currency: localStorage.getItem('currency') || 'USD',
    theme: localStorage.getItem('theme') || 'light',
    isAuthenticated,
    csrf: localStorage.getItem('csrf') || '',
    // Add more global data as needed
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/templates');
      setTemplates(response.data.data);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplateContent = async (templateName) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/templates/${templateName}`);
      setTemplateContent(response.data.data.content);
      setSelectedTemplate(templateName);
    } catch (error) {
      console.error('Error loading template content:', error);
      toast.error('Failed to load template content');
    } finally {
      setLoading(false);
    }
  };

  const processTemplate = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }

    try {
      setLoading(true);
      
      // Combine all data for advanced processing
      const combinedData = {
        ...templateData,
        ...globalData,
        // Add component loop data for @loop syntax
        categories_loop: templateData.categories,
        archives_loop: templateData.archives,
        payment_methods_loop: templateData.payment_methods,
        shipping_methods_loop: templateData.shipping_methods,
        // Add form persistence data
        post: templateData.post,
        checkout: templateData.checkout,
        // Add countries and regions for dropdowns
        countries_loop: templateData.countries,
        regions_loop: templateData.regions
      };

      const requestData = {
        templateName: selectedTemplate,
        data: combinedData,
        seo: seoData,
        theme: themeData,
        countries: templateData.countries,
        regions: templateData.regions,
        post: templateData.post,
        checkout: templateData.checkout,
        csrfToken: globalData.csrf,
        baseUrl: globalData.site?.siteUrl || 'http://localhost:3000'
      };

      const response = await axios.post('http://localhost:5000/api/templates/process-advanced', requestData);
      setProcessedContent(response.data.data.processed);
      toast.success('Template processed successfully');
    } catch (error) {
      console.error('Error processing template:', error);
      toast.error('Failed to process template');
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    if (!selectedTemplate || !templateContent) {
      toast.error('Please select a template and add content');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/templates/${selectedTemplate}`, {
        content: templateContent
      });
      toast.success('Template saved successfully');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async () => {
    const name = prompt('Enter template name (e.g., my-template.html):');
    if (!name) return;

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/templates', {
        name,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[data-v-global-siteName]</title>
</head>
<body>
    <h1>Welcome to [data-v-global-siteName]</h1>
    <p>This is a new template created at [data-v-year]</p>
</body>
</html>`
      });
      toast.success('Template created successfully');
      loadTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (templateName) => {
    if (!confirm(`Are you sure you want to delete ${templateName}?`)) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/templates/${templateName}`);
      toast.success('Template deleted successfully');
      if (selectedTemplate === templateName) {
        setSelectedTemplate('');
        setTemplateContent('');
        setProcessedContent('');
      }
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    } finally {
      setLoading(false);
    }
  };

  const updateTemplateData = (key, value) => {
    setTemplateData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateArrayData = (arrayKey, index, field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [arrayKey]: prev[arrayKey].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayKey, newItem) => {
    setTemplateData(prev => ({
      ...prev,
      [arrayKey]: [...prev[arrayKey], newItem]
    }));
  };

  const removeArrayItem = (arrayKey, index) => {
    setTemplateData(prev => ({
      ...prev,
      [arrayKey]: prev[arrayKey].filter((_, i) => i !== index)
    }));
  };

  const updateSeoData = (key, value) => {
    setSeoData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateThemeData = (key, value) => {
    setThemeData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Template Engine</h1>
                <p className="text-gray-600">Process Vvveb-style templates with dynamic data</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={createTemplate}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Create Template
                </button>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Template List */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Templates</h3>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {templates.map((template) => (
                      <div
                        key={template.name}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedTemplate === template.name
                            ? 'bg-blue-100 border border-blue-300'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="flex-1"
                            onClick={() => loadTemplateContent(template.name)}
                          >
                            <div className="font-medium text-gray-900">{template.name}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(template.modified).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteTemplate(template.name)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Template Editor */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Template Editor</h3>
                  {selectedTemplate && (
                    <button
                      onClick={saveTemplate}
                      disabled={loading}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                  )}
                </div>
                {selectedTemplate ? (
                  <textarea
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    className="w-full h-96 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none"
                    placeholder="Enter template content..."
                  />
                ) : (
                  <div className="h-96 flex items-center justify-center text-gray-500">
                    Select a template to edit
                  </div>
                )}
              </div>
            </div>

            {/* Data Configuration */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Data Configuration</h3>
                  <button
                    onClick={processTemplate}
                    disabled={loading || !selectedTemplate}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    Process
                  </button>
                </div>

                {showAdvanced ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {/* Basic Data */}
                    <div>
                      <h4 className="font-medium mb-2">Basic Data</h4>
                      <input
                        type="text"
                        value={templateData.title}
                        onChange={(e) => updateTemplateData('title', e.target.value)}
                        placeholder="Title"
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                      />
                      <textarea
                        value={templateData.description}
                        onChange={(e) => updateTemplateData('description', e.target.value)}
                        placeholder="Description"
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                        rows="2"
                      />
                      <textarea
                        value={templateData.content}
                        onChange={(e) => updateTemplateData('content', e.target.value)}
                        placeholder="Content"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        rows="3"
                      />
                    </div>

                    {/* Categories */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Categories</h4>
                        <button
                          onClick={() => addArrayItem('categories', { taxonomy_item_id: Date.now(), name: '', url: '' })}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          + Add
                        </button>
                      </div>
                      {templateData.categories.map((category, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={category.name}
                            onChange={(e) => updateArrayData('categories', index, 'name', e.target.value)}
                            placeholder="Name"
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            value={category.url}
                            onChange={(e) => updateArrayData('categories', index, 'url', e.target.value)}
                            placeholder="URL"
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={() => removeArrayItem('categories', index)}
                            className="text-red-600 hover:text-red-800 px-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Archives */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Archives</h4>
                        <button
                          onClick={() => addArrayItem('archives', { url: '', title: '' })}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          + Add
                        </button>
                      </div>
                      {templateData.archives.map((archive, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={archive.title}
                            onChange={(e) => updateArrayData('archives', index, 'title', e.target.value)}
                            placeholder="Title"
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            value={archive.url}
                            onChange={(e) => updateArrayData('archives', index, 'url', e.target.value)}
                            placeholder="URL"
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={() => removeArrayItem('archives', index)}
                            className="text-red-600 hover:text-red-800 px-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Payment Methods */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Payment Methods</h4>
                        <button
                          onClick={() => addArrayItem('payment_methods', { payment_id: Date.now(), key: '', name: '' })}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          + Add
                        </button>
                      </div>
                      {templateData.payment_methods.map((payment, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={payment.name}
                            onChange={(e) => updateArrayData('payment_methods', index, 'name', e.target.value)}
                            placeholder="Name"
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            value={payment.key}
                            onChange={(e) => updateArrayData('payment_methods', index, 'key', e.target.value)}
                            placeholder="Key"
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={() => removeArrayItem('payment_methods', index)}
                            className="text-red-600 hover:text-red-800 px-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Methods */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Shipping Methods</h4>
                        <button
                          onClick={() => addArrayItem('shipping_methods', { shipping_id: Date.now(), key: '', name: '' })}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          + Add
                        </button>
                      </div>
                      {templateData.shipping_methods.map((shipping, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={shipping.name}
                            onChange={(e) => updateArrayData('shipping_methods', index, 'name', e.target.value)}
                            placeholder="Name"
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            value={shipping.key}
                            onChange={(e) => updateArrayData('shipping_methods', index, 'key', e.target.value)}
                            placeholder="Key"
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={() => removeArrayItem('shipping_methods', index)}
                            className="text-red-600 hover:text-red-800 px-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Form Data */}
                    <div>
                      <h4 className="font-medium mb-2">Form Data</h4>
                      <input
                        type="text"
                        value={templateData.post.name}
                        onChange={(e) => updateTemplateData('post', { ...templateData.post, name: e.target.value })}
                        placeholder="Name"
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                      />
                      <input
                        type="email"
                        value={templateData.post.email}
                        onChange={(e) => updateTemplateData('post', { ...templateData.post, email: e.target.value })}
                        placeholder="Email"
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                      />
                      <textarea
                        value={templateData.post.message}
                        onChange={(e) => updateTemplateData('post', { ...templateData.post, message: e.target.value })}
                        placeholder="Message"
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                        rows="2"
                      />
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={templateData.post.register}
                            onChange={(e) => updateTemplateData('post', { ...templateData.post, register: e.target.checked })}
                            className="mr-2"
                          />
                          Register
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={templateData.post.terms}
                            onChange={(e) => updateTemplateData('post', { ...templateData.post, terms: e.target.checked })}
                            className="mr-2"
                          />
                          Terms
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={templateData.post.newsletter}
                            onChange={(e) => updateTemplateData('post', { ...templateData.post, newsletter: e.target.checked })}
                            className="mr-2"
                          />
                          Newsletter
                        </label>
                      </div>
                    </div>

                    {/* Checkout Data */}
                    <div>
                      <h4 className="font-medium mb-2">Checkout Data</h4>
                      <input
                        type="text"
                        value={templateData.checkout.first_name}
                        onChange={(e) => updateTemplateData('checkout', { ...templateData.checkout, first_name: e.target.value })}
                        placeholder="First Name"
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                      />
                      <input
                        type="text"
                        value={templateData.checkout.last_name}
                        onChange={(e) => updateTemplateData('checkout', { ...templateData.checkout, last_name: e.target.value })}
                        placeholder="Last Name"
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                      />
                      <input
                        type="email"
                        value={templateData.checkout.email}
                        onChange={(e) => updateTemplateData('checkout', { ...templateData.checkout, email: e.target.value })}
                        placeholder="Email"
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                      />
                      <input
                        type="text"
                        value={templateData.checkout.phone}
                        onChange={(e) => updateTemplateData('checkout', { ...templateData.checkout, phone: e.target.value })}
                        placeholder="Phone"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    {/* SEO Data */}
                    <div>
                      <h4 className="font-medium mb-2">SEO</h4>
                      <input
                        type="text"
                        value={seoData.title}
                        onChange={(e) => updateSeoData('title', e.target.value)}
                        placeholder="SEO Title"
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                      />
                      <textarea
                        value={seoData.description}
                        onChange={(e) => updateSeoData('description', e.target.value)}
                        placeholder="SEO Description"
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                        rows="2"
                      />
                      <input
                        type="text"
                        value={seoData.keywords}
                        onChange={(e) => updateSeoData('keywords', e.target.value)}
                        placeholder="SEO Keywords"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    {/* Theme Data */}
                    <div>
                      <h4 className="font-medium mb-2">Theme</h4>
                      <select
                        value={themeData.theme}
                        onChange={(e) => updateThemeData('theme', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={themeData.rtl}
                          onChange={(e) => updateThemeData('rtl', e.target.checked)}
                          className="mr-2"
                        />
                        RTL Support
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Click "Show Advanced" to configure template data</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Processed Output */}
          {processedContent && (
            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Processed Output</h3>
                <div className="bg-white border border-gray-300 rounded-lg p-4 max-h-96 overflow-auto">
                  <pre className="text-sm whitespace-pre-wrap">{processedContent}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Higher-order component for template processing
export const withTemplate = (WrappedComponent, templateData = {}) => {
  return (props) => {
    const { template, ...restProps } = props;
    
    return (
      <TemplateEngine template={template} data={templateData}>
        <WrappedComponent {...restProps} />
      </TemplateEngine>
    );
  };
};

// Template macro components
export const TemplateMacro = ({ name, children, condition = true }) => {
  if (!condition) return null;
  
  return (
    <div className={`template-macro template-macro-${name}`}>
      {children}
    </div>
  );
};

// Dynamic content injection component
export const DynamicContent = ({ path, fallback = '', as = 'span' }) => {
  const siteSettings = useSiteSettings();
  const { user } = useAuth();
  
  const getValue = () => {
    const data = { site: siteSettings, user };
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : fallback;
    }, data);
  };

  const Component = as;
  return <Component>{getValue()}</Component>;
};

// URL generation component
export const DynamicUrl = ({ route, params = {}, children, as = 'a' }) => {
  const generateUrl = () => {
    const baseUrl = window.location.origin;
    const queryString = new URLSearchParams(params).toString();
    return `${baseUrl}${route}${queryString ? '?' + queryString : ''}`;
  };

  const Component = as;
  return (
    <Component href={generateUrl()}>
      {children}
    </Component>
  );
};

// CSRF token component
export const CsrfToken = ({ as = 'input' }) => {
  const token = localStorage.getItem('csrf') || '';
  const Component = as;
  
  return (
    <Component 
      type="hidden" 
      name="csrf" 
      value={token}
      data-v-csrf
    />
  );
};

// Year component
export const CurrentYear = ({ as = 'span' }) => {
  const Component = as;
  return <Component data-v-year>{new Date().getFullYear()}</Component>;
};

export default TemplateEngine; 
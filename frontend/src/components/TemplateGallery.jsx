import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  StarIcon, 
  EyeIcon, 
  ClockIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const TemplateGallery = ({ onSelectTemplate, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📄' },
    { id: 'business', name: 'Business', icon: '🏢' },
    { id: 'portfolio', name: 'Portfolio', icon: '🎨' },
    { id: 'blog', name: 'Blog', icon: '📝' },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
    { id: 'landing', name: 'Landing Page', icon: '🚀' },
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
    { id: 'agency', name: 'Agency', icon: '💼' },
    { id: 'personal', name: 'Personal', icon: '👤' }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  useEffect(() => {
    fetchTemplates();
    fetchFeaturedTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/templates');
      setTemplates(response.data.data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      // For demo purposes, create some mock templates
      setTemplates(createMockTemplates());
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedTemplates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/templates/featured');
      setFeaturedTemplates(response.data.data || []);
    } catch (error) {
      console.error('Error fetching featured templates:', error);
      // For demo purposes, create some mock featured templates
      setFeaturedTemplates(createMockTemplates().slice(0, 3));
    }
  };

  const createMockTemplates = () => [
    {
      _id: '1',
      name: 'Modern Business',
      description: 'Professional business website with clean design and modern layout',
      category: 'business',
      difficulty: 'beginner',
      thumbnail: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Modern+Business',
      previewImages: ['https://via.placeholder.com/800x600/3b82f6/ffffff?text=Preview+1'],
      stats: { downloads: 1250, rating: 4.8, reviews: 89 },
      features: ['responsive', 'seo-optimized', 'fast-loading'],
      estimatedTime: 30,
      isOfficial: true
    },
    {
      _id: '2',
      name: 'Creative Portfolio',
      description: 'Showcase your work with this stunning portfolio template',
      category: 'portfolio',
      difficulty: 'intermediate',
      thumbnail: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Creative+Portfolio',
      previewImages: ['https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Preview+1'],
      stats: { downloads: 890, rating: 4.9, reviews: 67 },
      features: ['responsive', 'customizable', 'portfolio-ready'],
      estimatedTime: 45,
      isOfficial: true
    },
    {
      _id: '3',
      name: 'E-commerce Store',
      description: 'Complete online store with product catalog and shopping cart',
      category: 'ecommerce',
      difficulty: 'advanced',
      thumbnail: 'https://via.placeholder.com/400x300/10b981/ffffff?text=E-commerce+Store',
      previewImages: ['https://via.placeholder.com/800x600/10b981/ffffff?text=Preview+1'],
      stats: { downloads: 567, rating: 4.7, reviews: 43 },
      features: ['ecommerce-ready', 'responsive', 'payment-ready'],
      estimatedTime: 60,
      isOfficial: true
    },
    {
      _id: '4',
      name: 'Personal Blog',
      description: 'Share your thoughts with this elegant blog template',
      category: 'blog',
      difficulty: 'beginner',
      thumbnail: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Personal+Blog',
      previewImages: ['https://via.placeholder.com/800x600/f59e0b/ffffff?text=Preview+1'],
      stats: { downloads: 2340, rating: 4.6, reviews: 156 },
      features: ['blog-ready', 'seo-optimized', 'social-media'],
      estimatedTime: 25,
      isOfficial: true
    },
    {
      _id: '5',
      name: 'Restaurant Website',
      description: 'Perfect for restaurants with menu, reservations, and location',
      category: 'restaurant',
      difficulty: 'intermediate',
      thumbnail: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Restaurant+Website',
      previewImages: ['https://via.placeholder.com/800x600/ef4444/ffffff?text=Preview+1'],
      stats: { downloads: 432, rating: 4.8, reviews: 34 },
      features: ['responsive', 'menu-ready', 'contact-form'],
      estimatedTime: 40,
      isOfficial: true
    },
    {
      _id: '6',
      name: 'Agency Landing',
      description: 'High-converting landing page for agencies and services',
      category: 'agency',
      difficulty: 'intermediate',
      thumbnail: 'https://via.placeholder.com/400x300/06b6d4/ffffff?text=Agency+Landing',
      previewImages: ['https://via.placeholder.com/800x600/06b6d4/ffffff?text=Preview+1'],
      stats: { downloads: 789, rating: 4.9, reviews: 78 },
      features: ['landing-page', 'high-converting', 'analytics'],
      estimatedTime: 35,
      isOfficial: true
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleUseTemplate = (template) => {
    // For demo purposes, create some basic elements based on template
    const elements = createTemplateElements(template);
    onSelectTemplate(elements);
    onClose();
  };

  const createTemplateElements = (template) => {
    // Create basic elements based on template category
    const baseElements = [
      {
        id: 'header-1',
        type: 'container',
        content: { text: template.name },
        styles: { 
          backgroundColor: '#ffffff',
          padding: '20px',
          textAlign: 'center',
          borderBottom: '1px solid #e5e7eb'
        },
        position: { x: 0, y: 0 },
        size: { width: '100%', height: 'auto' }
      },
      {
        id: 'hero-1',
        type: 'container',
        content: { text: template.description },
        styles: { 
          backgroundColor: '#f8fafc',
          padding: '60px 20px',
          textAlign: 'center'
        },
        position: { x: 0, y: 80 },
        size: { width: '100%', height: 'auto' }
      }
    ];

    return baseElements;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Template Gallery</h2>
              <p className="text-gray-600">Choose from hundreds of professional templates</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Templates */}
        {featuredTemplates.length > 0 && (
          <div className="px-6 py-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTemplates.map((template) => (
                <div key={template._id} className="group relative">
                  <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <StarIcon className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </span>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <StarIcon className="w-4 h-4 text-yellow-400" />
                          <span>{template.stats.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <span className="text-white font-semibold">Use Template</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              All Templates ({filteredTemplates.length})
            </h3>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading templates...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No templates found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <div key={template._id} className="group relative">
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {template.isOfficial && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Official
                          </span>
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                            {template.difficulty}
                          </span>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <ClockIcon className="w-4 h-4" />
                            <span>{template.estimatedTime}m</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <StarIcon className="w-4 h-4 text-yellow-400" />
                            <span>{template.stats.rating}</span>
                            <span>({template.stats.reviews})</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <EyeIcon className="w-4 h-4" />
                            <span>{template.stats.downloads}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <span className="text-white font-semibold flex items-center space-x-2">
                        <span>Use Template</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery; 
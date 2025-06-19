import React from 'react';

const WebsiteTemplates = ({ onSelectTemplate, onClose }) => {
  const templates = [
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'Modern landing page with hero section, features, and contact form',
      category: 'Business',
      thumbnail: '🏠',
      elements: [
        { id: '1', type: 'navbar', label: 'Navigation Bar' },
        { id: '2', type: 'section', label: 'Hero Section' },
        { id: '3', type: 'heading', content: 'Welcome to Our Platform', label: 'Main Heading' },
        { id: '4', type: 'paragraph', content: 'Build amazing websites with our intuitive drag-and-drop builder. No coding required!', label: 'Hero Text' },
        { id: '5', type: 'button', content: 'Get Started', label: 'CTA Button' },
        { id: '6', type: 'section', label: 'Features Section' },
        { id: '7', type: 'heading', content: 'Why Choose Us', label: 'Features Heading' },
        { id: '8', type: 'row', label: 'Features Row' },
        { id: '9', type: 'section', label: 'Contact Section' },
        { id: '10', type: 'heading', content: 'Get In Touch', label: 'Contact Heading' },
        { id: '11', type: 'form', label: 'Contact Form' }
      ]
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Showcase your work with a beautiful portfolio layout',
      category: 'Creative',
      thumbnail: '🎨',
      elements: [
        { id: '1', type: 'navbar', label: 'Navigation Bar' },
        { id: '2', type: 'section', label: 'Hero Section' },
        { id: '3', type: 'heading', content: 'Creative Portfolio', label: 'Main Heading' },
        { id: '4', type: 'paragraph', content: 'Showcasing my latest work and creative projects', label: 'Hero Text' },
        { id: '5', type: 'section', label: 'Portfolio Section' },
        { id: '6', type: 'heading', content: 'My Work', label: 'Portfolio Heading' },
        { id: '7', type: 'gallery', label: 'Portfolio Gallery' },
        { id: '8', type: 'section', label: 'About Section' },
        { id: '9', type: 'heading', content: 'About Me', label: 'About Heading' },
        { id: '10', type: 'paragraph', content: 'I am a passionate creative professional...', label: 'About Text' }
      ]
    },
    {
      id: 'blog',
      name: 'Blog',
      description: 'Clean blog layout with articles and sidebar',
      category: 'Content',
      thumbnail: '📝',
      elements: [
        { id: '1', type: 'navbar', label: 'Navigation Bar' },
        { id: '2', type: 'section', label: 'Header Section' },
        { id: '3', type: 'heading', content: 'My Blog', label: 'Blog Title' },
        { id: '4', type: 'paragraph', content: 'Thoughts, ideas, and insights', label: 'Blog Subtitle' },
        { id: '5', type: 'row', label: 'Main Content Row' },
        { id: '6', type: 'section', label: 'Article Section' },
        { id: '7', type: 'heading', content: 'Latest Posts', label: 'Posts Heading' },
        { id: '8', type: 'section', label: 'Sidebar' },
        { id: '9', type: 'heading', content: 'Categories', label: 'Sidebar Heading' },
        { id: '10', type: 'menu', label: 'Category Menu' }
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Online store with product grid and shopping cart',
      category: 'Business',
      thumbnail: '🛒',
      elements: [
        { id: '1', type: 'navbar', label: 'Navigation Bar' },
        { id: '2', type: 'section', label: 'Hero Section' },
        { id: '3', type: 'heading', content: 'Shop Our Products', label: 'Shop Heading' },
        { id: '4', type: 'paragraph', content: 'Discover amazing products at great prices', label: 'Shop Text' },
        { id: '5', type: 'section', label: 'Products Section' },
        { id: '6', type: 'heading', content: 'Featured Products', label: 'Products Heading' },
        { id: '7', type: 'gallery', label: 'Product Grid' },
        { id: '8', type: 'section', label: 'Categories Section' },
        { id: '9', type: 'heading', content: 'Shop by Category', label: 'Categories Heading' },
        { id: '10', type: 'row', label: 'Categories Row' }
      ]
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      description: 'Elegant restaurant website with menu and reservations',
      category: 'Food',
      thumbnail: '🍽️',
      elements: [
        { id: '1', type: 'navbar', label: 'Navigation Bar' },
        { id: '2', type: 'section', label: 'Hero Section' },
        { id: '3', type: 'heading', content: 'Welcome to Our Restaurant', label: 'Restaurant Name' },
        { id: '4', type: 'paragraph', content: 'Experience fine dining at its best', label: 'Tagline' },
        { id: '5', type: 'button', content: 'Make Reservation', label: 'Reservation Button' },
        { id: '6', type: 'section', label: 'Menu Section' },
        { id: '7', type: 'heading', content: 'Our Menu', label: 'Menu Heading' },
        { id: '8', type: 'row', label: 'Menu Items Row' },
        { id: '9', type: 'section', label: 'About Section' },
        { id: '10', type: 'heading', content: 'Our Story', label: 'About Heading' },
        { id: '11', type: 'paragraph', content: 'We are passionate about creating memorable dining experiences...', label: 'About Text' }
      ]
    },
    {
      id: 'agency',
      name: 'Agency',
      description: 'Professional agency website with services and team',
      category: 'Business',
      thumbnail: '🏢',
      elements: [
        { id: '1', type: 'navbar', label: 'Navigation Bar' },
        { id: '2', type: 'section', label: 'Hero Section' },
        { id: '3', type: 'heading', content: 'We Build Digital Experiences', label: 'Agency Tagline' },
        { id: '4', type: 'paragraph', content: 'Creative agency specializing in web design and digital marketing', label: 'Agency Description' },
        { id: '5', type: 'button', content: 'Our Work', label: 'Portfolio Button' },
        { id: '6', type: 'section', label: 'Services Section' },
        { id: '7', type: 'heading', content: 'Our Services', label: 'Services Heading' },
        { id: '8', type: 'row', label: 'Services Row' },
        { id: '9', type: 'section', label: 'Team Section' },
        { id: '10', type: 'heading', content: 'Meet Our Team', label: 'Team Heading' },
        { id: '11', type: 'gallery', label: 'Team Gallery' }
      ]
    }
  ];

  const handleTemplateSelect = (template) => {
    onSelectTemplate(template.elements);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
              <p className="text-gray-600 mt-1">Start with a pre-built layout or create from scratch</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Template Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleTemplateSelect(template)}
              >
                {/* Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center border-b border-gray-200 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                  <span className="text-8xl">{template.thumbnail}</span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {template.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{template.elements.length} elements</span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Use Template
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">More Templates Coming Soon</h3>
            <p className="text-gray-600 mb-4">We're constantly adding new templates to help you get started faster</p>
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              Start from Scratch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteTemplates; 
import React, { useState, useRef } from 'react';
import { 
  UserIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import CodeShowcase from './CodeShowcase';
import Hero3DBackground from './Hero3DBackground';
import landingHero from '../assets/illustrations/landing-website-builder.png';
import featureAnalytics from '../assets/illustrations/feature-analytics.png';
import featureDragDrop from '../assets/illustrations/feature-drag-drop.png';
import featureCloudStorage from '../assets/illustrations/feature-cloud-storage.png';
import featureCollaboration from '../assets/illustrations/feature-collaboration.png';
import featureCreativeProcess from '../assets/illustrations/feature-creative-process.png';
import featureLaunch from '../assets/illustrations/feature-launch.png';
import featureResponsive from '../assets/illustrations/feature-responsive.png';
import featureSecureLogin from '../assets/illustrations/feature-secure-login.png';
import ecommerceIcon from '../assets/illustrations/ecommerce.png';
import localizationIcon from '../assets/illustrations/localization.png';

const LandingPage = ({ onGetStarted, onTryEditor }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const features = [
    {
      image: featureAnalytics,
      title: "Analytics Dashboard",
      description: "Get insights with beautiful analytics and reporting."
    },
    {
      image: featureDragDrop,
      title: "Drag & Drop",
      description: "Intuitive drag-and-drop builder for fast website creation."
    },
    {
      image: featureCloudStorage,
      title: "Cloud Storage",
      description: "Save your projects in the cloud and access them from anywhere."
    },
    {
      image: featureCollaboration,
      title: "Collaboration",
      description: "Work with your team in real-time to build your website."
    },
    {
      image: featureCreativeProcess,
      title: "Creative Process",
      description: "Tools to help you through the creative process of building a website."
    },
    {
      image: featureLaunch,
      title: "Launch Your Website",
      description: "Deploy your website with a single click."
    },
    {
      image: featureResponsive,
      title: "Responsive Design",
      description: "Your website will look great on any device."
    },
    {
      image: featureSecureLogin,
      title: "Secure Login",
      description: "Secure user authentication and management."
    },
    {
      image: ecommerceIcon,
      title: "Advanced Ecommerce",
      description: "Built-in ecommerce tools for creating powerful online stores"
    },
    {
      image: localizationIcon,
      title: "Full Localization",
      description: "Multi-language support and localization for global reach"
    }
  ];

  const FeatureCard = ({ image, icon: Icon, title, description }) => {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * -10;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    };

    const handleMouseLeave = () => {
      const card = cardRef.current;
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    };

    return (
      <div
        ref={cardRef}
        className="bg-[#282828] rounded-lg p-8 text-center hover:bg-[#323232] transition-all duration-300 transform feature-3d-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ willChange: 'transform', perspective: 1000 }}
      >
        {image ? (
          <img src={image} alt={title} className="w-16 h-16 object-contain mx-auto mb-6" />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Icon className="w-8 h-8 text-white" />
          </div>
        )}
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-[#B0B0B0] text-sm leading-relaxed">{description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#1A1A1A] text-white font-['Inter',system-ui,sans-serif]">
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#202020] shadow-lg w-full">
        {/* Information Bar */}
        <div className="bg-[#1A1A1A] py-1 px-4 w-full">
          <div className="flex justify-between items-center text-xs text-[#A0A0A0] w-full">
            <div className="flex items-center space-x-4">
              <span>+00 (123) 123 1111</span>
              <span>admin@vivvweb.com</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span>Free shipping on orders over $50</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="bg-[#202020] py-3 px-4 w-full">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NC</span>
              </div>
              <h1 className="text-2xl font-bold text-white">NoCodea</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white hover:text-blue-400 transition-colors duration-200">Home</a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors duration-200">About</a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors duration-200">Shop</a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors duration-200">Vivv mega menu</a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors duration-200">Services</a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors duration-200">Blog</a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors duration-200">Contact</a>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-4">
                <button className="text-white hover:text-blue-400 transition-colors duration-200">
                  <UserIcon className="w-5 h-5" />
                </button>
                <button className="text-white hover:text-blue-400 transition-colors duration-200">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Save Button */}
              <button className="hidden md:block bg-[#404040] text-white px-4 py-2 rounded-lg hover:bg-[#505050] transition-colors duration-200 font-medium">
                Save
              </button>

              {/* Currency Dropdown */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  className="flex items-center space-x-1 text-white hover:text-blue-400 transition-colors duration-200"
                >
                  <span>US-Dollar</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                {isCurrencyDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-[#282828] rounded-lg shadow-lg py-2">
                    <a href="#" className="block px-4 py-2 text-white hover:bg-[#404040] transition-colors duration-200">US-Dollar</a>
                    <a href="#" className="block px-4 py-2 text-white hover:bg-[#404040] transition-colors duration-200">EUR</a>
                    <a href="#" className="block px-4 py-2 text-white hover:bg-[#404040] transition-colors duration-200">GBP</a>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white hover:text-blue-400 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#202020] border-t border-[#404040]">
            <div className="px-4 py-4 space-y-4">
              <a href="#" className="block text-white hover:text-blue-400 transition-colors duration-200">Home</a>
              <a href="#" className="block text-white hover:text-blue-400 transition-colors duration-200">About</a>
              <a href="#" className="block text-white hover:text-blue-400 transition-colors duration-200">Shop</a>
              <a href="#" className="block text-white hover:text-blue-400 transition-colors duration-200">Vivv mega menu</a>
              <a href="#" className="block text-white hover:text-blue-400 transition-colors duration-200">Services</a>
              <a href="#" className="block text-white hover:text-blue-400 transition-colors duration-200">Blog</a>
              <a href="#" className="block text-white hover:text-blue-400 transition-colors duration-200">Contact</a>
              <div className="flex items-center space-x-4 pt-4 border-t border-[#404040]">
                <button className="text-white hover:text-blue-400 transition-colors duration-200">
                  <UserIcon className="w-5 h-5" />
                </button>
                <button className="text-white hover:text-blue-400 transition-colors duration-200">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
                <button className="bg-[#404040] text-white px-4 py-2 rounded-lg hover:bg-[#505050] transition-colors duration-200 font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-40 pb-16 px-4 w-full overflow-hidden">
        <Hero3DBackground />
        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none opacity-60">
          <img src={landingHero} alt="Website Builder Hero" className="max-w-lg w-2/3 h-auto mx-auto" />
        </div>
        <div className="relative z-10 text-center w-full">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            The next generation website builder
          </h1>
          <p className="text-lg md:text-xl text-[#B0B0B0] mb-8 w-full leading-relaxed">
            Powerful and easy to use drag and drop website builder for blogs, presentation or ecommerce stores.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={onGetStarted}
              className="btn-3d bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 transform hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2"
            >
              Free Download!
            </button>
            <button className="btn-3d border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 transform hover:bg-white hover:text-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-offset-2">
              Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* SVG Wave Divider */}
      <div className="w-full overflow-hidden leading-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
          <path fill="#1A1A1A" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 bg-[#1A1A1A] w-full">
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Code Editor Showcase */}
      <CodeShowcase onTryEditor={onTryEditor} />

      {/* Additional Sections */}
      <section className="py-20 px-4 bg-[#202020] w-full">
        <div className="w-full text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Ready to build your next website?
          </h2>
          <p className="text-[#B0B0B0] text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers and designers who trust our platform to create stunning websites.
          </p>
          <button
            onClick={onGetStarted}
            className="btn-3d bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 transform hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-offset-2"
          >
            Start Building Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] py-12 px-4 border-t border-[#404040] w-full">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NC</span>
                </div>
                <h3 className="text-xl font-bold text-white">NoCodea</h3>
              </div>
              <p className="text-[#B0B0B0] text-sm">
                The next generation website builder for modern web development.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[#B0B0B0]">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[#B0B0B0]">
                <li><a href="#" className="hover:text-white transition-colors duration-200">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-[#B0B0B0]">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#404040] mt-8 pt-8 text-center text-sm text-[#B0B0B0]">
            <p>&copy; 2024 NoCodea. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 
import React, { useState } from 'react';
import { 
  UserIcon, 
  ShoppingCartIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  LockClosedIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import CodeShowcase from './CodeShowcase';

const LandingPage = ({ onGetStarted }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Better Security",
      description: "Advanced security features to protect your website and user data"
    },
    {
      icon: WrenchScrewdriverIcon,
      title: "Unlimited Customization",
      description: "Complete control over design and functionality with no limitations"
    },
    {
      icon: ShoppingCartIcon,
      title: "Advanced Ecommerce",
      description: "Built-in ecommerce tools for creating powerful online stores"
    },
    {
      icon: FlagIcon,
      title: "Full Localization",
      description: "Multi-language support and localization for global reach"
    }
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white font-['Inter',system-ui,sans-serif]">
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#202020] shadow-lg">
        {/* Information Bar */}
        <div className="bg-[#1A1A1A] py-1 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-[#A0A0A0]">
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
        <div className="bg-[#202020] py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
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
                  <ShoppingCartIcon className="w-5 h-5" />
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
                  <ShoppingCartIcon className="w-5 h-5" />
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
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        {/* Cosmic Background */}
        <div className="absolute inset-0 bg-gradient-radial from-[#1A1A1A] via-[#1A1A1A] to-[#2A1A3A]"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#3A1A5A] opacity-30"></div>
        
        {/* Planet/Cosmic Glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-blue-400/20 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            The next generation website builder
          </h1>
          <p className="text-lg md:text-xl text-[#B0B0B0] mb-8 max-w-3xl mx-auto leading-relaxed">
            Powerful and easy to use drag and drop website builder for blogs, presentation or ecommerce stores.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Free Download!
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 transform hover:scale-105">
              Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#282828] rounded-lg p-8 text-center hover:bg-[#323232] transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-[#B0B0B0] text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Editor Showcase */}
      <CodeShowcase />

      {/* Additional Sections */}
      <section className="py-20 px-4 bg-[#202020]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Ready to build your next website?
          </h2>
          <p className="text-[#B0B0B0] text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers and designers who trust our platform to create stunning websites.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Building Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] py-12 px-4 border-t border-[#404040]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
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
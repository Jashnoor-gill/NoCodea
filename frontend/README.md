# NoCodea Website Builder - Enhanced Frontend

A modern, feature-rich website builder with a stunning landing page and powerful code editor capabilities.

## 🚀 Features

### Landing Page
- **Modern Dark Theme**: Sleek dark design with cosmic background effects
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive Navigation**: Fixed header with dropdown menus and mobile hamburger menu
- **Hero Section**: Eye-catching hero with gradient buttons and cosmic glow effects
- **Feature Showcase**: Four key features with hover animations
- **Code Editor Demo**: Interactive code editor showcase with multiple language support

### Code Editor
- **Multi-language Support**: HTML, CSS, JavaScript, and JSON
- **Live Preview**: Real-time preview of HTML code
- **Syntax Highlighting**: Dark and light theme support
- **Code Formatting**: Automatic code formatting for better readability
- **Copy & Run**: Easy code copying and HTML execution
- **Line Numbers**: Professional editor with line numbering

### Website Builder
- **Drag & Drop Interface**: Visual component building
- **Component Library**: Pre-built components for quick development
- **Property Panel**: Real-time property editing
- **Template System**: Pre-designed website templates
- **Export/Import**: Save and load website configurations
- **Preview Mode**: Toggle between edit and preview modes

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **React DnD**: Drag and drop functionality
- **Vite**: Fast build tool and development server

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nocode_builder/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) to Purple (#8b5cf6) gradients
- **Background**: Dark charcoal (#1A1A1A) with lighter accents (#202020, #282828)
- **Text**: Pure white (#FFFFFF) for headings, light grey (#B0B0B0) for body text
- **Accents**: Blue (#007BFF) for primary actions, various gradients for visual appeal

### Typography
- **Font Family**: Inter (system fallbacks)
- **Headings**: Bold weights (700-800) with large sizes
- **Body Text**: Regular weight (400) with comfortable line heights

### Animations
- **Hover Effects**: Scale transforms and color transitions
- **Floating Elements**: Subtle floating animations for cosmic elements
- **Pulse Glow**: Breathing effect for glowing elements
- **Smooth Transitions**: 200-300ms transitions for all interactive elements

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Collapsible navigation menu
- Stacked button layouts
- Optimized touch targets
- Simplified component panels

## 🔧 Customization

### Adding New Components
1. Create component in `src/components/`
2. Add to ComponentPanel
3. Include in drag-and-drop system
4. Add property controls

### Modifying Themes
1. Update color variables in Tailwind config
2. Modify CSS custom properties
3. Update component styles accordingly

### Extending Code Editor
1. Add new language support in Editor component
2. Include syntax highlighting rules
3. Add language-specific formatting

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Optimized SVGs and compressed images
- **CSS Optimization**: Purged unused styles in production
- **Bundle Analysis**: Vite's built-in bundle analyzer

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Key Components

### LandingPage.jsx
The main landing page with:
- Fixed navigation header
- Hero section with cosmic background
- Feature showcase
- Code editor demonstration
- Footer with links

### Editor.jsx
Advanced code editor featuring:
- Multi-language support
- Live preview functionality
- Theme switching
- Code formatting
- Copy and run capabilities

### CodeShowcase.jsx
Interactive showcase of the code editor with:
- Tabbed interface
- Sample code snippets
- Feature highlights
- Call-to-action buttons

### App.jsx
Main application with:
- Routing between landing page and builder
- Drag and drop functionality
- Component management
- Template system

## 🔮 Future Enhancements

- **Real-time Collaboration**: Multi-user editing
- **Advanced Templates**: More pre-built templates
- **Plugin System**: Extensible component library
- **Cloud Storage**: Save projects to cloud
- **Advanced Code Editor**: Monaco Editor integration
- **AI Assistance**: Smart code suggestions
- **Version Control**: Git integration for projects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using React and Tailwind CSS**

# 🚀 NoCode Builder - Website Builder Platform

A powerful drag-and-drop website builder with a stunning cyberpunk opening animation featuring the NC logo formation.

## ✨ Features

### 🎬 Opening Animation
- **Cyberpunk Style**: Neon green/purple theme with glowing particles
- **NC Logo Formation**: Particles stream in from all sides to form your NC logo
- **Tech Vibe**: AI/Data Science aesthetic with flickering code lines
- **Smooth Transitions**: Seamless integration with your website

### 🛠️ Core Features
- **Drag & Drop Builder**: Intuitive interface for creating websites
- **Component Library**: Rich collection of pre-built components
- **Template Gallery**: Professional templates for various use cases
- **Real-time Preview**: See changes instantly as you build
- **Responsive Design**: Mobile-first approach
- **Authentication System**: User registration and login
- **Project Management**: Save, load, and manage multiple projects

### 🎨 Design System
- **Modern UI**: Clean, professional interface
- **Dark Theme**: Easy on the eyes
- **3D Effects**: Engaging visual elements
- **Animations**: Smooth transitions and interactions

## 🏗️ Architecture

### Frontend (React + Vite)
- **React 18**: Latest React features
- **Vite**: Fast development and build
- **Tailwind CSS**: Utility-first styling
- **Canvas API**: Custom animations
- **React DnD**: Drag and drop functionality

### Backend (Node.js + Express)
- **Express.js**: RESTful API
- **SQLite**: Lightweight database
- **JWT**: Authentication
- **Multer**: File uploads
- **CORS**: Cross-origin support

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nocode_builder
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example
   cd ../backend
   cp env.example .env
   ```

4. **Start Development Servers**
   ```bash
   # Start backend (from backend directory)
   npm run dev
   
   # Start frontend (from frontend directory)
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🎬 Opening Animation Details

The opening animation creates a memorable first impression with:

- **300 Glowing Particles**: Stream in from all screen edges
- **NC Logo Formation**: Particles assemble to form your brand logo
- **Cyberpunk Aesthetic**: Neon green (#00ff41) and purple (#bf00ff) theme
- **Tech Background**: Flickering code lines with AI/blockchain themes
- **Grid Overlay**: Animated cyberpunk grid effect
- **Scan Lines**: Authentic retro-futuristic feel

### Animation Sequence
1. **Initialization**: "INITIALIZING" text with neon flicker
2. **Particle Stream**: Particles flow from all directions
3. **Logo Assembly**: Particles converge to form NC logo
4. **Completion**: 2-second pause, then website transition

## 📁 Project Structure

```
nocode_builder/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── OpeningAnimation.jsx    # Main animation
│   │   │   ├── OpeningAnimation.css    # Animation styles
│   │   │   └── ...
│   │   ├── assets/          # Images, icons, animations
│   │   └── ...
│   └── package.json
├── backend/                  # Node.js backend
│   ├── routes/              # API routes
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   └── ...
└── README.md
```

## 🛠️ Development

### Adding New Components
1. Create component in `frontend/src/components/`
2. Add to `ComponentPanel.jsx`
3. Update `Canvas.jsx` for rendering
4. Add properties to `PropertyPanel.jsx`

### Customizing Animation
- Modify `OpeningAnimation.jsx` for particle behavior
- Update `logoPath` array for different logo shapes
- Adjust colors in `OpeningAnimation.css`
- Change timing in animation functions

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
cd backend
# Set environment variables
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the fast build tool
- Tailwind CSS for the utility-first approach
- Canvas API for the animation capabilities

---

**Built with ❤️ by NC Team** 
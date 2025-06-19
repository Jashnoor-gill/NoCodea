# 🚀 NoCodea Website Builder - Complete No-Code Platform

A modern, feature-rich website builder with drag-and-drop functionality, real-time preview, and powerful code editing capabilities. Built with React, Node.js, and MongoDB.

## ✨ Features

### 🎨 **Frontend (React + Vite)**
- **Stunning Landing Page**: Modern dark theme with cosmic background effects
- **Advanced Code Editor**: Multi-language support (HTML, CSS, JS, JSON) with live preview
- **Drag & Drop Interface**: Visual website building with real-time updates
- **Component Library**: Pre-built components for quick development
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Authentication System**: JWT + Google OAuth integration
- **Template System**: Pre-designed website templates
- **Project Management**: Create, save, and manage multiple projects
- **Export/Import**: Save and load website projects

### 🔧 **Backend (Node.js + Express)**
- **RESTful API**: Comprehensive endpoints for all functionality
- **MongoDB Integration**: Scalable database with Mongoose ODM
- **JWT Authentication**: Secure token-based authentication
- **Google OAuth**: Social login integration
- **File Upload**: Image and asset management
- **Rate Limiting**: API protection and security
- **Error Handling**: Comprehensive error management
- **Email System**: Password reset functionality

### 🗄️ **Database (MongoDB)**
- **User Management**: Complete user profiles and preferences
- **Project Storage**: Website projects with versioning
- **Template Library**: Reusable website templates
- **Collaboration**: Multi-user project sharing
- **Analytics**: Usage tracking and statistics

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **React DnD** - Drag and drop functionality
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens
- **Passport.js** - Authentication middleware
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd nocode_builder
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your configuration
# Update MongoDB URI, JWT secret, etc.
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
```

### 4. Database Setup
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env
```

## 🔧 Configuration

### Environment Variables (Backend)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/wvoo-builder
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/wvoo-builder

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Quick Start

### Option 1: Using Scripts (Recommended)

**Windows:**
```bash
# Double-click start-dev.bat
# OR run in PowerShell:
.\start-dev.ps1
```

**Manual Start:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Option 2: Manual Start

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on: `http://localhost:5000`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on: `http://localhost:5173`

3. **Access the Application**
   - Open `http://localhost:5173` in your browser
   - You'll see the stunning landing page
   - Click "Free Download!" or "Start Building Now" to access the builder

## 🎯 Using the Website Builder

### 1. Authentication
- Register a new account or login with existing credentials
- Google OAuth is also available
- Forgot password functionality is implemented

### 2. Creating a Website
- Choose from available templates or start from scratch
- Drag and drop components from the component panel
- Edit properties in the property panel
- Preview your website in real-time

### 3. Available Components
- **Layout**: Container, Row, Column, Section, Divider, Spacer
- **Content**: Heading, Paragraph, Image, Video, Button, Link
- **Forms**: Text, Email, Number, Textarea, Select, Checkbox, Radio, Date, File
- **Media**: Gallery, Carousel, Map, Social Links
- **Advanced**: Navigation, Footer, Sidebar, Card, Testimonial, Pricing

### 4. Code Editor
- Switch to code view for advanced editing
- Support for HTML, CSS, JavaScript, and JSON
- Live preview of code changes
- Syntax highlighting and formatting

### 5. Saving & Exporting
- Save your projects to the cloud
- Export as JSON files
- Import existing projects
- Share projects with collaborators

## 📁 Project Structure

```
nocode_builder/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Editor.jsx
│   │   │   └── ...
│   │   ├── contexts/         # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   └── App.jsx           # Main application
│   ├── package.json
│   └── README.md
├── backend/                  # Node.js backend application
│   ├── models/               # MongoDB models
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Template.js
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── templates.js
│   │   └── upload.js
│   ├── middleware/           # Custom middleware
│   ├── utils/                # Utility functions
│   ├── server.js             # Main server file
│   ├── package.json
│   └── README.md
├── start-dev.bat            # Windows startup script
├── start-dev.ps1            # PowerShell startup script
└── README.md                # This file
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: API protection against abuse
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Comprehensive validation on all inputs
- **Error Handling**: Secure error responses

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables for production
3. Deploy to Heroku, Vercel, or your preferred platform

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Update API endpoints to production URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify all environment variables are set
4. Check that both servers are running on correct ports

## 🎉 What's New

### Latest Updates
- ✅ Complete website building components
- ✅ Password reset functionality
- ✅ Project management system
- ✅ Drag & drop interface
- ✅ Real-time preview
- ✅ Export/Import functionality
- ✅ Responsive design
- ✅ Authentication system

### Coming Soon
- 🔄 Advanced code editor
- 🔄 Template marketplace
- 🔄 Collaboration features
- 🔄 Analytics dashboard
- 🔄 Custom domain support

---

**Happy Building! 🚀** 
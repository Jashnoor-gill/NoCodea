import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  PlusIcon, 
  FolderIcon, 
  ClockIcon, 
  StarIcon,
  CogIcon,
  UserIcon,
  ArrowRightIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAdminMenu } from '../contexts/AdminMenuContext';

const Dashboard = ({ onOpenProject, onCreateProject }) => {
  const { user, logout } = useAuth();
  const { menu: adminMenu, loading: menuLoading, error: menuError } = useAdminMenu();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    category: 'other'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/projects');
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/projects', newProject);
      setProjects(prev => [response.data.data, ...prev]);
      setShowCreateModal(false);
      setNewProject({ name: '', description: '', category: 'other' });
      
      // Open the new project in the builder
      if (onOpenProject) {
        onOpenProject(response.data.data._id);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
      setProjects(prev => prev.filter(p => p._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'business': return '🏢';
      case 'portfolio': return '🎨';
      case 'blog': return '📝';
      case 'ecommerce': return '🛒';
      case 'landing': return '🚀';
      default: return '📄';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <h2 className="text-lg font-bold mb-4">Admin Menu</h2>
        {menuLoading && <div>Loading menu...</div>}
        {menuError && <div className="text-red-500">Failed to load menu</div>}
        {adminMenu && (
          <ul className="space-y-2">
            {Object.entries(adminMenu).map(([key, item]) => (
              <li key={key}>
                <a href={item.url} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  {item.icon && <span className="text-xl">{item.icon}</span>}
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </aside>
      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 w-full">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">NC</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">NoCodea Dashboard</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Welcome,</span>
                  <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FolderIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <StarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Published</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.filter(p => p.status === 'published').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Drafts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.filter(p => p.status === 'draft').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Account</p>
                  <p className="text-2xl font-bold text-gray-900">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">My Projects</h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-500 mb-6">Create your first website to get started</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Create Your First Project</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getCategoryIcon(project.category)}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{project.name}</h3>
                            <p className="text-sm text-gray-500">{project.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => onOpenProject(project._id)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenProject(project._id)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Preview"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {project.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => onOpenProject(project._id)}
                        className="w-full mt-3 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <span>Open Project</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create New Project</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project name"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your project"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={newProject.category}
                    onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="business">Business</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="blog">Blog</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="landing">Landing Page</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 
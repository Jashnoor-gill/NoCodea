import React, { useRef, useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';

function AssetManager({ onSelect, onClose }) {
  const [assets, setAssets] = useState([
    // Sample assets for demonstration
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      name: 'Mountain Landscape',
      type: 'image',
      category: 'nature',
      size: '2.3MB',
      dimensions: '1920x1080'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
      name: 'Business Meeting',
      type: 'image',
      category: 'business',
      size: '1.8MB',
      dimensions: '1600x900'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
      name: 'Office Space',
      type: 'image',
      category: 'business',
      size: '3.1MB',
      dimensions: '2048x1152'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const categories = [
    { id: 'all', name: 'All Assets', icon: '📁' },
    { id: 'image', name: 'Images', icon: '🖼️' },
    { id: 'video', name: 'Videos', icon: '🎥' },
    { id: 'document', name: 'Documents', icon: '📄' },
    { id: 'icon', name: 'Icons', icon: '🎯' },
    { id: 'audio', name: 'Audio', icon: '🎵' }
  ];

  const [{ isOver }, drop] = useDrop({
    accept: 'FILE',
    drop: (item) => {
      // Handle dropped files
      console.log('Dropped file:', item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    try {
      const newAssets = await Promise.all(
        files.map(async (file, index) => {
          const url = URL.createObjectURL(file);
          const asset = {
            id: Date.now() + index,
            url,
            name: file.name,
            type: getFileType(file.type),
            category: getFileCategory(file.type),
            size: formatFileSize(file.size),
            dimensions: await getImageDimensions(url, file.type),
            file
          };
          return asset;
        })
      );
      
      setAssets(prev => [...prev, ...newAssets]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
    return 'other';
  };

  const getFileCategory = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
    return 'other';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getImageDimensions = async (url, mimeType) => {
    if (!mimeType.startsWith('image/')) return '';
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(`${img.width}x${img.height}`);
      };
      img.onerror = () => {
        resolve('');
      };
      img.src = url;
    });
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleDeleteAsset = (assetId) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderAsset = (asset) => {
    const isImage = asset.type === 'image';
    const isVideo = asset.type === 'video';
    const isDocument = asset.type === 'document';
    const isAudio = asset.type === 'audio';

    return (
      <div
        key={asset.id}
        className={`relative group cursor-pointer transition-all duration-200 ${
          viewMode === 'grid' 
            ? 'border rounded-lg p-2 hover:border-blue-400 hover:shadow-md' 
            : 'border-b border-gray-200 p-3 hover:bg-gray-50'
        }`}
        onClick={() => onSelect && onSelect(asset)}
      >
        {viewMode === 'grid' ? (
          <div className="space-y-2">
            <div className="relative aspect-square bg-gray-100 rounded overflow-hidden">
              {isImage && (
                <img 
                  src={asset.url} 
                  alt={asset.name} 
                  className="w-full h-full object-cover"
                />
              )}
              {isVideo && (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-4xl">🎥</div>
                </div>
              )}
              {isDocument && (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-4xl">📄</div>
                </div>
              )}
              {isAudio && (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-4xl">🎵</div>
                </div>
              )}
              
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAsset(asset.id);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete asset"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-600 truncate">{asset.name}</div>
            <div className="text-xs text-gray-400">{asset.size}</div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
              {isImage && <img src={asset.url} alt={asset.name} className="w-full h-full object-cover rounded" />}
              {isVideo && <div className="text-xl">🎥</div>}
              {isDocument && <div className="text-xl">📄</div>}
              {isAudio && <div className="text-xl">🎵</div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{asset.name}</div>
              <div className="text-xs text-gray-500">{asset.size} • {asset.dimensions}</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAsset(asset.id);
              }}
              className="p-1 text-gray-400 hover:text-red-500"
              title="Delete asset"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Asset Manager</h2>
            <p className="text-sm text-gray-600">Manage your website assets</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenFileDialog}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Upload</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          ref={drop}
          className={`flex-1 p-4 overflow-auto ${
            isOver ? 'bg-blue-50 border-2 border-dashed border-blue-400' : ''
          }`}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredAssets.map(renderAsset)}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredAssets.map(renderAsset)}
            </div>
          )}
          
          {filteredAssets.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-lg font-medium">No assets found</p>
              <p className="text-sm">Upload some files to get started</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredAssets.length} assets</span>
            <span>Drag and drop files here to upload</span>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}

export default AssetManager; 
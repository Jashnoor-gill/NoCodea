import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const UserDownloads = () => {
  const { t } = useTranslation();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState({});

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/downloads');
      setDownloads(response.data.data);
    } catch (error) {
      console.error('Error loading downloads:', error);
      toast.error(t('downloadsLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (download) => {
    try {
      setDownloading(prev => ({ ...prev, [download._id]: true }));
      
      const response = await axios.get(
        `http://localhost:5000/api/users/downloads/${download._id}/download`,
        { responseType: 'blob' }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', download.filename || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(t('downloadStarted'));
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error(t('downloadFailed'));
    } finally {
      setDownloading(prev => ({ ...prev, [download._id]: false }));
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📈';
      case 'zip':
      case 'rar':
        return '📦';
      case 'mp3':
      case 'wav':
        return '🎵';
      case 'mp4':
      case 'avi':
        return '🎬';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      default:
        return '📁';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-gray-700">{t('home')}</Link>
            <span>/</span>
            <Link to="/user" className="hover:text-gray-700">{t('account')}</Link>
            <span>/</span>
            <span className="text-gray-900">{t('downloads')}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900">{t('myDownloads')}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {downloads.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t('availableDownloads')}</h2>
              <p className="text-sm text-gray-600 mt-1">{t('downloadsDescription')}</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {downloads.map((download) => (
                <DownloadItem
                  key={download._id}
                  download={download}
                  onDownload={handleDownload}
                  downloading={downloading[download._id]}
                  getFileIcon={getFileIcon}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noDownloads')}</h3>
            <p className="text-gray-600 mb-6">{t('noDownloadsMessage')}</p>
            <Link
              to="/orders"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {t('viewOrders')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Download Item Component
const DownloadItem = ({ download, onDownload, downloading, getFileIcon, formatFileSize }) => {
  const { t } = useTranslation();

  const isExpired = new Date(download.expiresAt) < new Date();
  const remainingDownloads = download.maxDownloads - download.downloadCount;

  return (
    <div className="px-6 py-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">
            {getFileIcon(download.filename)}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {download.filename || t('digitalProduct')}
            </h3>
            
            {download.product && (
              <p className="text-sm text-gray-600">
                {t('fromOrder')}: {download.product.name}
              </p>
            )}
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              {download.fileSize && (
                <span>{formatFileSize(download.fileSize)}</span>
              )}
              <span>{t('downloadsRemaining')}: {remainingDownloads}</span>
              <span>{t('expires')}: {new Date(download.expiresAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {isExpired ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {t('expired')}
            </span>
          ) : remainingDownloads <= 0 ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {t('limitReached')}
            </span>
          ) : (
            <button
              onClick={() => onDownload(download)}
              disabled={downloading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('downloading')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('download')}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDownloads; 
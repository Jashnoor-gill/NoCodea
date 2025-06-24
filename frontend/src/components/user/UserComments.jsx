import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const UserComments = () => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews');

  useEffect(() => {
    loadComments();
  }, [activeTab]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users/comments`, {
        params: { type: activeTab }
      });
      setComments(response.data.data);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error(t('commentsLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm(t('confirmDeleteComment'))) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`);
      toast.success(t('commentDeletedSuccess'));
      loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(t('commentDeleteFailed'));
    }
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
            <span className="text-gray-900">{t('comments')}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900">{t('myComments')}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'reviews', label: t('reviews'), icon: '⭐' },
                { key: 'questions', label: t('questions'), icon: '❓' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                type={activeTab}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              {activeTab === 'reviews' ? '⭐' : '❓'}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'reviews' ? t('noReviews') : t('noQuestions')}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'reviews' 
                ? t('noReviewsMessage') 
                : t('noQuestionsMessage')
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Comment Card Component
const CommentCard = ({ comment, type, onDelete }) => {
  const { t } = useTranslation();

  const getCommentLink = () => {
    if (type === 'reviews') {
      return `/products/${comment.product?.slug}`;
    } else {
      return `/products/${comment.product?.slug}`;
    }
  };

  const getCommentIcon = () => {
    return type === 'reviews' ? '⭐' : '❓';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCommentIcon()}</span>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {comment.product?.name || t('product')}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(comment._id)}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          {t('delete')}
        </button>
      </div>
      
      {type === 'reviews' && comment.rating && (
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {comment.rating}/5
          </span>
        </div>
      )}
      
      {comment.title && (
        <h4 className="font-medium text-gray-900 mb-2">{comment.title}</h4>
      )}
      
      <p className="text-gray-600 mb-4">{comment.content}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Link
          to={getCommentLink()}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {t('viewProduct')}
        </Link>
        
        <span className="text-xs text-gray-500 capitalize">
          {type === 'reviews' ? t('review') : t('question')}
        </span>
      </div>
    </div>
  );
};

export default UserComments; 
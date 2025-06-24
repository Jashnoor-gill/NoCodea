import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const ProductDetail = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/products/slug/${slug}`);
      const productData = response.data.data;
      setProduct(productData);
      
      // Load related data
      loadReviews(productData._id);
      loadQuestions(productData._id);
      loadRelatedProducts(productData._id, productData.category);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error(t('productLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews`, {
        params: { product: productId, type: 'product_review' }
      });
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadQuestions = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/questions`, {
        params: { product: productId }
      });
      setQuestions(response.data.data);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const loadRelatedProducts = async (productId, categoryId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products`, {
        params: { 
          category: categoryId, 
          exclude: productId,
          limit: 4 
        }
      });
      setRelatedProducts(response.data.data);
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  const handleAddToCart = () => {
    toast.success(t('addedToCart'));
  };

  const handleAddToWishlist = () => {
    // TODO: Implement add to wishlist functionality
    toast.success(t('addedToWishlist'));
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('productNotFound')}</h1>
          <p className="text-gray-600 mb-6">{t('productNotFoundMessage')}</p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('backToProducts')}
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-700">{t('home')}</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-gray-700">{t('products')}</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link to={`/categories/${product.category.slug}`} className="hover:text-gray-700">
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg mb-4">
              <img
                src={images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageClick(index)}
                    className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-lg border-2 ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {product.manufacturer && (
              <p className="text-gray-600 mb-4">
                {t('by')} <Link to={`/manufacturers/${product.manufacturer.slug}`} className="text-blue-600 hover:underline">
                  {product.manufacturer.name}
                </Link>
              </p>
            )}

            {/* Price */}
            <div className="mb-6">
              {product.salePrice ? (
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-red-600">${product.salePrice}</span>
                  <span className="text-xl text-gray-500 line-through">${product.price}</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% {t('off')}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                  {t('inStock')} ({product.stock} {t('available')})
                </span>
              ) : (
                <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
                  {t('outOfStock')}
                </span>
              )}
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-gray-600 mb-4">
                <span className="font-medium">{t('sku')}:</span> {product.sku}
              </p>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('quantity')}
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-10 border border-gray-300 rounded-md text-center"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {t('addToCart')}
              </button>
              <button
                onClick={handleAddToWishlist}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('overview')}</h3>
                <p className="text-gray-600">{product.shortDescription}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['description', 'specifications', 'reviews', 'questions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t(tab)}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div>
                {product.specifications && product.specifications.length > 0 ? (
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    {product.specifications.map((spec, index) => (
                      <div key={index}>
                        <dt className="text-sm font-medium text-gray-500">{spec.name}</dt>
                        <dd className="mt-1 text-sm text-gray-900">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-gray-500">{t('noSpecifications')}</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('reviews')} ({reviews.length})
                  </h3>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t('writeReview')}
                  </button>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">{t('noReviews')}</p>
                )}
              </div>
            )}

            {/* Questions Tab */}
            {activeTab === 'questions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('questions')} ({questions.length})
                  </h3>
                  <button
                    onClick={() => setShowQuestionForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t('askQuestion')}
                  </button>
                </div>

                {questions.length > 0 ? (
                  <div className="space-y-6">
                    {questions.map((question) => (
                      <QuestionCard key={question._id} question={question} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">{t('noQuestions')}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => {
  const { t } = useTranslation();

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {review.user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{review.user?.name || t('anonymous')}</p>
            <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
      <p className="text-gray-600">{review.content}</p>
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ question }) => {
  const { t } = useTranslation();

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {question.user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{question.user?.name || t('anonymous')}</p>
            <p className="text-sm text-gray-500">{new Date(question.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      <h4 className="font-medium text-gray-900 mb-2">{question.title}</h4>
      <p className="text-gray-600">{question.content}</p>
      
      {question.answer && (
        <div className="mt-4 pl-4 border-l-4 border-blue-200">
          <p className="text-sm text-gray-500 mb-1">{t('answer')}:</p>
          <p className="text-gray-700">{question.answer}</p>
        </div>
      )}
    </div>
  );
};

// Product Card Component (reused from ProductCategory)
const ProductCard = ({ product }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
          <img
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.shortDescription}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  ${product.salePrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>
          
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {t('inStock')}
            </span>
          ) : (
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
              {t('outOfStock')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowLeft, RefreshCw, MessageSquare, Award, CheckCircle, Tag, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { getImageUrl } from '../utils/image';

const ProductDetail = () => {
  const { slug, identifier: paramIdentifier } = useParams(); // Support both route formats
  const identifier = slug || paramIdentifier;
  const { addToCart } = useCart();

  // Component States
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('desc');
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Slider & Lightbox States
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  
  // Coupon States
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');

  // Fetch active coupons on mount
  useEffect(() => {
    API.get('/coupons')
      .then(res => setActiveCoupons(res.data))
      .catch(err => console.error('Failed to load active coupons:', err.message));
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };


  // Review Form States
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Fetch product detail & reviews
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${identifier}`);
        const productData = res.data;
        setProduct(productData);
        setSelectedImage(productData.image_url);
        setQuantity(1);
        setReviewSuccess(false);
        setReviewError('');

        // Fetch related products (same category, limit 4)
        if (productData.category_id) {
          const relatedRes = await API.get(`/products?category=${productData.category_id}&limit=5`);
          // Filter out current product
          const filtered = relatedRes.data.filter(item => item.id !== productData.id).slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        console.error('Fetch product detail failed:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [identifier]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewError('Please fill out your name and review message.');
      return;
    }
    
    setReviewSubmitting(true);
    setReviewError('');
    try {
      const res = await API.post(`/products/${product.id}/reviews`, {
        userName: reviewName,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment
      });

      // Append new review locally
      setProduct(prev => ({
        ...prev,
        reviews: [res.data, ...prev.reviews],
        review_count: (prev.review_count || 0) + 1
      }));

      // Reset form
      setReviewName('');
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);
      setReviewSuccess(true);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating) ? 'fill-brand-yellow text-brand-yellow' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="animate-spin text-brand-blue" size={32} />
        <p className="text-brand-grey dark:text-gray-455 text-sm font-semibold uppercase tracking-wider font-heading">
          Loading clinical formulation details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <h2 className="text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
          Formulation Not Found
        </h2>
        <p className="text-sm text-brand-grey dark:text-gray-400 max-w-sm mx-auto">
          The product you are trying to view does not exist in our dermatology database.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-brand-blue text-white rounded-md font-bold font-heading text-xs uppercase tracking-wider hover:bg-brand-blue-dark transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Parse details safety check
  const details = product.details || {};

  // Unique list of product gallery images to prevent duplicates
  const galleryImages = [
    product.image_url,
    product.secondary_image_url,
    ...(Array.isArray(product.images) ? product.images : [])
  ].filter((img, index, self) => img && self.indexOf(img) === index);

  const currentImageIndex = galleryImages.indexOf(selectedImage);

  const handleNextImage = () => {
    if (galleryImages.length <= 1) return;
    const nextIndex = (currentImageIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  };

  const handlePrevImage = () => {
    if (galleryImages.length <= 1) return;
    const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNextImage();
    } else if (distance < -minSwipeDistance) {
      handlePrevImage();
    }
    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Extract SEO elements
  const seoTitle = details.meta_title || product.name;
  const seoDescription = details.meta_description || product.description;
  const seoKeywords = details.meta_keywords || `${product.name}, ${product.categories?.name || 'Skincare'}, dermatologist tested`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={product.image_url}
      />
      {/* Back to catalog button */}
      <div>
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-dark uppercase tracking-wider font-heading border-b border-transparent hover:border-brand-blue transition-all"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>

      {/* 1. Main Product Panel (Gallery + Buy Details) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Left Side: Images Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
          {/* Thumbnails Column - Vertical on desktop, Horizontal scroll on mobile */}
          {galleryImages.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-none md:max-h-[500px] py-1 md:py-0 w-full md:w-24 shrink-0 scrollbar-thin select-none justify-start">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 bg-brand-bg-grey dark:bg-zinc-900 rounded-lg border p-1.5 flex items-center justify-center shrink-0 transition-all hover:scale-105 hover:shadow-sm ${
                    selectedImage === img 
                      ? 'border-brand-blue ring-2 ring-brand-blue-light dark:ring-brand-blue/30 dark:border-brand-blue shadow-md' 
                      : 'border-brand-border dark:border-zinc-800 hover:border-brand-blue/40'
                  }`}
                >
                  <img src={getImageUrl(img)} alt={`gallery-${idx}`} className="max-h-full max-w-full object-contain rounded-md" />
                </button>
              ))}
            </div>
          )}

          {/* Main Image Container */}
          <div 
            className="flex-1 aspect-square bg-brand-bg-grey dark:bg-zinc-900 rounded-xl border border-brand-border dark:border-zinc-800 p-6 flex items-center justify-center overflow-hidden relative group select-none touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Image Zoom Container */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
              <img 
                src={getImageUrl(selectedImage)} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-110"
                onError={(e) => {
                  e.target.src = '/assets/products/placeholder.png';
                }}
              />
            </div>

            {/* Top Right Counter Indicator */}
            {galleryImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-brand-dark/75 dark:bg-zinc-800/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md z-10 select-none">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            )}

            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-zinc-800/90 text-brand-dark dark:text-white hover:bg-brand-blue hover:text-white dark:hover:bg-brand-blue p-2 sm:p-2.5 rounded-full shadow-lg transition-all duration-300 md:opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-blue z-10"
                  aria-label="Previous product image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-zinc-800/90 text-brand-dark dark:text-white hover:bg-brand-blue hover:text-white dark:hover:bg-brand-blue p-2 sm:p-2.5 rounded-full shadow-lg transition-all duration-300 md:opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-blue z-10"
                  aria-label="Next product image"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Maximize Button indicator on Hover */}
            <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-zinc-800/80 text-brand-dark dark:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md">
              <Maximize2 size={14} />
            </div>
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            {/* Category Breadcrumb */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {product.all_categories && product.all_categories.length > 0 ? (
                product.all_categories.map((cat, idx) => (
                  <React.Fragment key={cat.id || idx}>
                    {idx > 0 && <span className="text-[10px] text-brand-grey dark:text-zinc-500 font-bold">•</span>}
                    <Link
                      to={`/shop?category=${cat.slug}`}
                      className="text-[10px] font-extrabold text-brand-blue hover:text-brand-blue-dark uppercase tracking-widest font-heading hover:underline transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </React.Fragment>
                ))
              ) : (
                <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-widest font-heading">
                  {product.categories?.name || 'Skincare Treatment'}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white leading-tight font-heading uppercase">
              {product.name}
            </h1>
            
            {/* Rating Stars Summary */}
            <div className="flex items-center gap-2">
              <div className="flex text-brand-yellow">{renderStars(product.rating ?? 0)}</div>
              <span className="text-xs font-bold text-brand-dark dark:text-gray-200">{Number(product.rating ?? 0).toFixed(1)}</span>
              <span className="text-xs text-brand-grey dark:text-gray-400 font-medium">({product.review_count ?? product.reviews?.length ?? 0} customer reviews)</span>
            </div>
          </div>

          <div className="border-y border-brand-border dark:border-zinc-800 py-4 space-y-4">
            {/* Pricing Info */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-brand-blue dark:text-brand-blue-light">₹{parseFloat(product.price)}</span>
              {product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price) && (
                <>
                  <span className="text-sm text-brand-grey dark:text-gray-400 line-through font-semibold">
                    ₹{parseFloat(product.compare_price)}
                  </span>
                  <span className="bg-brand-accent text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    {Math.round(((parseFloat(product.compare_price) - parseFloat(product.price)) / parseFloat(product.compare_price)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-[10px] text-brand-grey dark:text-gray-405 font-semibold uppercase tracking-wider font-heading">Inclusive of all taxes</p>

            {/* Coupons Card list */}
            {activeCoupons.length > 0 && (
              <div className="pt-2 border-t border-brand-border/40 dark:border-zinc-800/40 space-y-2">
                <span className="block text-[9px] font-bold text-brand-blue dark:text-brand-blue-light uppercase tracking-widest font-heading">
                  🎁 Active Offers & Coupons:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeCoupons.map((coupon) => (
                    <div 
                      key={coupon.code}
                      onClick={() => handleCopyCode(coupon.code)}
                      className="border border-dashed border-brand-blue/30 dark:border-zinc-700 bg-brand-blue-light/30 dark:bg-zinc-900/40 rounded-lg p-2.5 flex items-center justify-between gap-3 hover:bg-brand-blue-light/50 dark:hover:bg-zinc-900/70 hover:border-brand-blue transition-all cursor-pointer group select-none"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Tag size={12} className="text-brand-blue dark:text-brand-blue-light" />
                          <span className="text-xs font-black font-heading text-brand-dark dark:text-white uppercase">
                            {coupon.code}
                          </span>
                        </div>
                        <p className="text-[10px] text-brand-grey dark:text-gray-400 font-medium">
                          {coupon.description || `Save ${coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`} on your order.`}
                        </p>
                      </div>
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-1 rounded tracking-wider shrink-0 transition-all ${
                        copiedCode === coupon.code
                          ? 'bg-green-500 text-white'
                          : 'bg-white dark:bg-zinc-800 text-brand-blue border border-brand-blue/20 group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue'
                      }`}>
                        {copiedCode === coupon.code ? 'Copied!' : 'Copy'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key clinical highlights */}
          <div className="space-y-2.5 text-xs font-semibold text-brand-dark dark:text-gray-200">
            <div className="flex items-center gap-2">
              <CheckCircle size={15} className="text-brand-blue animate-pulse" />
              <span>Dermatologically Tested & Non-Comedogenic</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle size={15} className="text-brand-blue" />
              <span>Net Weight / Volume: <span className="text-brand-blue font-bold">{product.weight || '50g'}</span></span>
            </div>
          </div>

          {/* Brief Overview */}
          <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-350 leading-relaxed font-medium">
            {product.description}
          </p>

          {/* Add to Cart Controls */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-brand-border/60 dark:border-zinc-800">
            {/* Quantity select */}
            <div className="flex items-center border border-brand-border dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2 px-3 text-brand-grey dark:text-gray-400 hover:text-brand-dark dark:hover:text-white transition-colors font-bold"
              >
                -
              </button>
              <span className="px-4 text-xs font-extrabold text-brand-dark dark:text-white">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="p-2 px-3 text-brand-grey dark:text-gray-400 hover:text-brand-dark dark:hover:text-white transition-colors font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              className="flex-1 min-w-[200px] py-3.5 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-md font-bold font-heading text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingBag size={18} /> Add to shopping cart
            </button>
          </div>
        </div>
      </section>

      {/* 2. Clinical Specification Tabs (Desc, Use, Ingredients, FAQ) */}
      <section className="border border-brand-border dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-brand-border dark:border-zinc-800 bg-brand-bg-grey dark:bg-zinc-850 overflow-x-auto">
          {[
            { id: 'desc', label: 'Description' },
            { id: 'use', label: 'How To Use' },
            { id: 'ingredients', label: 'Ingredients' },
            { id: 'faq', label: 'Clinical FAQ' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider font-heading transition-all border-b-2 border-transparent select-none whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-brand-blue text-brand-blue bg-white dark:bg-zinc-900' 
                  : 'text-brand-grey dark:text-gray-400 hover:text-brand-dark dark:hover:text-white hover:bg-brand-blue-light/30 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 text-xs sm:text-sm text-brand-grey dark:text-gray-350 leading-relaxed font-medium">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <h4 className="font-bold text-brand-dark dark:text-white uppercase text-xs tracking-wider font-heading">Product Overview</h4>
              <p>{details.description || product.description}</p>
            </div>
          )}
          {activeTab === 'use' && (
            <div className="space-y-4">
              <h4 className="font-bold text-brand-dark dark:text-white uppercase text-xs tracking-wider font-heading">Directions for Application</h4>
              <p className="whitespace-pre-line">{details.how_to_use || 'Cleanse skin thoroughly. Apply a thin layer to the affected area or as directed by a dermatologist.'}</p>
            </div>
          )}
          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <h4 className="font-bold text-brand-dark dark:text-white uppercase text-xs tracking-wider font-heading">Active & Inactive Components</h4>
              <p className="font-mono bg-brand-bg-grey dark:bg-zinc-850 p-4 rounded-lg border border-brand-border/60 dark:border-zinc-800">
                {details.ingredients || 'Aqua, Glycerin, Propylene Glycol, Caprylic/Capric Triglyceride, Phenoxyethanol, Ethylhexylglycerin.'}
              </p>
            </div>
          )}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <h4 className="font-bold text-brand-dark dark:text-white uppercase text-xs tracking-wider font-heading">Frequently Asked Questions</h4>
              {details.faqs && details.faqs.length > 0 ? (
                <div className="space-y-4">
                  {details.faqs.map((faq, idx) => (
                    <div key={idx} className="border-b border-brand-border/45 dark:border-zinc-800/80 pb-3 last:border-b-0">
                      <p className="font-bold text-brand-dark dark:text-gray-200 text-xs sm:text-sm font-heading">Q: {faq.question}</p>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No questions submitted yet. Ask us anything relative to this formulation.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 3. Customer Reviews Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Review Form */}
        <div className="bg-brand-bg-grey dark:bg-zinc-900 p-6 rounded-xl border border-brand-border dark:border-zinc-800 space-y-4 self-start">
          <h3 className="text-base font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide flex items-center gap-2">
            <MessageSquare size={18} className="text-brand-blue" /> Share Your Experience
          </h3>
          <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
            Your review helps other users make scientific skincare choices. Submit your honest opinion.
          </p>

          {reviewSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900 text-green-700 dark:text-green-400 text-xs font-semibold rounded-md animate-fade-in">
              ✓ Review submitted and approved successfully! Thank you.
            </div>
          )}

          {reviewError && (
            <div className="p-3 bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900 text-brand-accent dark:text-red-400 text-xs font-semibold rounded-md animate-fade-in">
              ⚠ {reviewError}
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                placeholder="e.g. Rahul Verma"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Rating *</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 font-semibold focus:outline-none focus:border-brand-blue"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                <option value="3">⭐⭐⭐ (3 - Average)</option>
                <option value="2">⭐⭐ (2 - Poor)</option>
                <option value="1">⭐ (1 - Terrible)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Review Title</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                placeholder="e.g. Highly effective, love it!"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Review Comment *</label>
              <textarea
                rows="4"
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                placeholder="Tell others what you think about this formulation..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="w-full py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-base font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-3">
            Customer Reviews ({product.reviews?.length || 0})
          </h3>

          {product.reviews?.length === 0 ? (
            <div className="text-center p-8 bg-brand-bg-grey dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 border-dashed rounded-lg">
              <p className="text-xs text-brand-grey dark:text-gray-400 font-medium">No reviews yet for this product. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews?.map((review) => (
                <div key={review.id} className="border border-brand-border dark:border-zinc-800 rounded-lg p-5 space-y-2 bg-white dark:bg-zinc-900 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-dark dark:text-gray-200">{review.user_name}</span>
                    <span className="text-[10px] text-brand-grey dark:text-gray-400 font-medium">
                      {new Date(review.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-brand-yellow">{renderStars(review.rating)}</div>
                    {review.title && <h4 className="text-xs font-bold text-brand-dark dark:text-white">{review.title}</h4>}
                  </div>

                  <p className="text-xs text-brand-grey dark:text-gray-350 leading-relaxed font-medium">
                    {review.comment}
                  </p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {review.images.map((imgUrl, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-md border border-brand-border dark:border-zinc-800 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                          <img 
                            src={imgUrl} 
                            alt={`Review photo ${idx + 1}`} 
                            className="w-full h-full object-cover"
                            onClick={() => window.open(imgUrl, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

      {/* 4. Related Products row */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 border-t border-brand-border dark:border-zinc-800 pt-12">
          <h3 className="text-lg font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide">
            Related Formulations
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 sm:p-8 transition-opacity duration-300">
          {/* Close button */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-all z-50 focus:outline-none"
          >
            <X size={24} />
          </button>

          {/* Main Lightbox Content */}
          <div className="relative max-w-4xl w-full h-full max-h-[80vh] flex items-center justify-center">
            {/* Lightbox Image */}
            <img 
              src={getImageUrl(selectedImage)} 
              alt={`${product.name} large view`} 
              className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-350"
            />

            {/* Lightbox Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  className="absolute left-0 sm:-left-16 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all focus:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={28} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  className="absolute right-0 sm:-right-16 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all focus:outline-none"
                  aria-label="Next image"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Lightbox Counter */}
            {galleryImages.length > 1 && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-xs font-semibold">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

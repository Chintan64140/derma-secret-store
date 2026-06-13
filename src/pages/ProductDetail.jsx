import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowLeft, RefreshCw, MessageSquare, Award, CheckCircle, Tag, ChevronLeft, ChevronRight, Maximize2, X, Sparkles, ShieldCheck } from 'lucide-react';
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
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  
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

  const parsedHighlights = Array.isArray(details.highlights) ? details.highlights : [];

  const getBenefitIcon = (idx) => {
    const icons = [
      <Sparkles className="text-brand-blue shrink-0" size={22} />,
      <ShieldCheck className="text-brand-blue shrink-0" size={22} />,
      <Award className="text-brand-blue shrink-0" size={22} />
    ];
    return icons[idx % icons.length];
  };

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

  const handleTabClick = (e, tabId) => {
    setActiveTab(tabId);
    if (e.currentTarget) {
      e.currentTarget.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
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

            {product.weight && (
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-brand-blue" />
                <span>Net Weight / Volume: <span className="text-brand-blue font-bold">{product.weight}</span></span>
              </div>
            )}
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

      {/* Key Benefits Section: Why You'll Love This */}
      {parsedHighlights.length > 0 && (
        <section className="space-y-8 animate-fade-in border border-brand-border dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
              Why You'll Love This
            </h2>
            <div className="w-12 h-[3px] bg-brand-blue mx-auto rounded-full"></div>
            <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium">
              Formulated with clinically-proven actives to target your skin concerns effectively:
            </p>
          </div>

          <div className={`grid grid-cols-1 gap-6 pt-2 max-w-5xl mx-auto ${
            parsedHighlights.length === 1 ? 'md:grid-cols-1 max-w-md' :
            parsedHighlights.length === 2 ? 'md:grid-cols-2 max-w-3xl' :
            'md:grid-cols-3'
          }`}>
            {parsedHighlights.map((hl, idx) => (
              <div 
                key={idx}
                className="bg-[#f9fafb] dark:bg-zinc-900/40 p-5 rounded-xl border border-brand-border dark:border-zinc-800 flex items-start gap-4 hover:border-brand-blue/30 hover:scale-[1.01] hover:shadow-md transition-all duration-300"
              >
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-xl bg-brand-blue-light/20 dark:bg-brand-blue/10 flex items-center justify-center shrink-0 border border-brand-blue/10 shadow-inner">
                  {getBenefitIcon(idx)}
                </div>

                {/* Text */}
                <div className="space-y-1">
                  <h4 className="font-heading font-black text-xs sm:text-sm text-brand-dark dark:text-white uppercase tracking-wider leading-snug">
                    {hl.title}
                  </h4>
                  <p className="text-xs text-brand-grey dark:text-zinc-400 font-medium leading-relaxed">
                    {hl.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Combo Contents Section: What does it contain? */}
      {Array.isArray(details.combo_items) && details.combo_items.length > 0 && (
        <section className="space-y-6 animate-fade-in border border-brand-border dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
              What does it contain?
            </h2>
            <div className="w-12 h-[3px] bg-brand-blue mx-auto rounded-full"></div>
            <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium">
              This combo pack is scientifically curated with premium individual formulations:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 max-w-4xl mx-auto justify-center">
            {details.combo_items.map((item, idx) => (
              <div 
                key={idx}
                className="bg-brand-bg-grey dark:bg-zinc-900/45 p-4 rounded-xl border border-brand-border dark:border-zinc-800 flex items-center gap-4 hover:border-brand-blue/40 hover:scale-[1.01] hover:shadow-md transition-all duration-300 group"
              >
                {/* Product Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-zinc-950 rounded-lg border border-brand-border dark:border-zinc-800 p-2 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={getImageUrl(item.image_url)} 
                    alt={item.name} 
                    className="max-h-full max-w-full object-contain rounded"
                    onError={(e) => { e.target.src = '/assets/products/placeholder.png'; }}
                  />
                </div>

                {/* Product Text */}
                <div className="space-y-1">
                  <span className="bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-blue-light text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    Included
                  </span>
                  <h4 className="font-heading font-black text-xs sm:text-sm text-brand-dark dark:text-white uppercase tracking-wider leading-snug pt-0.5">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-brand-grey dark:text-zinc-400 font-bold">
                    Qty/Size: <span className="text-brand-blue dark:text-brand-blue-light">{item.qty}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Clinical Specification Tabs */}
      <section className="border border-brand-border dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-brand-border dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900 overflow-x-auto scrollbar-none">
          {[
            { id: 'desc', label: 'Product Details' },
            { id: 'ingredients', label: 'Ingredient' },
            { id: 'use', label: 'How to use' },
            { id: 'faq', label: 'FAQ' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => handleTabClick(e, tab.id)}
              className={`flex-1 min-w-[125px] py-4 text-center text-xs font-heading font-extrabold uppercase tracking-wider transition-all select-none border-r border-b-[3px] border-r-brand-border dark:border-r-zinc-800 last:border-r-0 ${
                activeTab === tab.id 
                  ? 'text-brand-blue-dark dark:text-brand-blue-light bg-white dark:bg-zinc-800 border-b-brand-blue-dark dark:border-b-brand-blue font-black' 
                  : 'text-zinc-400 dark:text-zinc-500 bg-[#f9fafb] dark:bg-zinc-900/60 border-b-transparent hover:text-zinc-650 dark:hover:text-zinc-350 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-10 text-xs sm:text-sm text-brand-grey dark:text-gray-350 leading-relaxed font-medium">
          {activeTab === 'desc' && (
            <div className="space-y-6">
              <div className="space-y-2.5">
                <h4 className="font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-brand-dark dark:text-white mb-2">
                  PRODUCT DETAILS
                </h4>
                <div 
                  className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed font-medium prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: details.description || product.description }}
                />
              </div>

              {/* Product Guarantees Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-brand-border/60 dark:border-zinc-850">
                <div className="p-4 bg-[#f9fafb] dark:bg-zinc-900 rounded-lg border border-brand-border dark:border-zinc-800 flex items-start gap-3 transition-transform hover:scale-[1.02]">
                  <Award className="text-brand-blue shrink-0 mt-0.5" size={16} />
                  <div>
                    <h5 className="font-bold text-brand-dark dark:text-white text-xs uppercase tracking-wide mb-1">Dermatologist Formulated</h5>
                    <p className="text-[10px] sm:text-[11px] text-brand-grey dark:text-zinc-400 font-medium">Developed by clinical skincare professionals for maximum efficacy.</p>
                  </div>
                </div>
                <div className="p-4 bg-[#f9fafb] dark:bg-zinc-900 rounded-lg border border-brand-border dark:border-zinc-800 flex items-start gap-3 transition-transform hover:scale-[1.02]">
                  <CheckCircle className="text-brand-blue shrink-0 mt-0.5" size={16} />
                  <div>
                    <h5 className="font-bold text-brand-dark dark:text-white text-xs uppercase tracking-wide mb-1">Clean Science</h5>
                    <p className="text-[10px] sm:text-[11px] text-brand-grey dark:text-zinc-400 font-medium">Free from parabens, mineral oils, and harmful synthetic toxins.</p>
                  </div>
                </div>
                <div className="p-4 bg-[#f9fafb] dark:bg-zinc-900 rounded-lg border border-brand-border dark:border-zinc-800 flex items-start gap-3 transition-transform hover:scale-[1.02]">
                  <RefreshCw className="text-brand-blue shrink-0 mt-0.5" size={16} />
                  <div>
                    <h5 className="font-bold text-brand-dark dark:text-white text-xs uppercase tracking-wide mb-1">Targeted Treatment</h5>
                    <p className="text-[10px] sm:text-[11px] text-brand-grey dark:text-zinc-400 font-medium">Optimized pH levels and concentration to target specific concerns.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'use' && (() => {
            const directions = details.how_to_use;
            const suitableItems = Array.isArray(details.suitable_for) ? details.suitable_for : [];

            if (!directions && suitableItems.length === 0) {
              return (
                <div className="text-center py-6">
                  <p className="text-xs sm:text-sm text-brand-grey dark:text-zinc-400 font-medium">No directions or suitability guidelines available for this formulation.</p>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                {directions && (
                  <div>
                    <h4 className="font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-brand-dark dark:text-white mb-4">
                      DIRECTIONS FOR APPLICATION
                    </h4>
                    {Array.isArray(directions) ? (
                      <div className="flex flex-col gap-4 max-w-2xl">
                        {directions.map((step, idx) => (
                          <div key={idx} className="flex gap-4 items-start p-4 bg-[#f9fafb] dark:bg-zinc-900/60 border border-brand-border dark:border-zinc-800 rounded-xl hover:border-brand-blue/30 transition-all duration-300">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue/10 dark:bg-brand-blue/25 text-brand-blue dark:text-brand-blue-light font-black text-xs shrink-0">
                              {step.no || (idx + 1)}
                            </span>
                            <div className="space-y-1">
                              <h5 className="font-heading font-black text-xs sm:text-sm text-brand-dark dark:text-white uppercase tracking-wider">
                                {step.title}
                              </h5>
                              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                {step.details}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed font-medium">
                        {directions}
                      </p>
                    )}
                  </div>
                )}

                {suitableItems.length > 0 && (
                  <div>
                    <h5 className="font-bold text-brand-dark dark:text-white text-xs sm:text-sm mb-3 uppercase tracking-wide">
                      Suitable For:
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium pl-1">
                      {suitableItems.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === 'ingredients' && (() => {
            const keyActivesList = Array.isArray(details.key_actives) ? details.key_actives : [];
            const rawIngredients = details.ingredients;
            const ingredientsArray = Array.isArray(rawIngredients)
              ? rawIngredients
              : (rawIngredients ? rawIngredients.split(/[;,]/).map(item => item.trim()).filter(Boolean) : []);

            if (keyActivesList.length === 0 && ingredientsArray.length === 0) {
              return (
                <div className="text-center py-6">
                  <p className="text-xs sm:text-sm text-brand-grey dark:text-zinc-400 font-medium">No ingredients or key actives defined for this formulation.</p>
                </div>
              );
            }

            return (
              <div className="space-y-8 animate-fade-in">
                {/* Visual Key Actives List */}
                {keyActivesList.length > 0 && (
                  <div className="space-y-6">
                    {keyActivesList.map((active, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        {/* Powder Pile Icon Box */}
                        <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200/60 dark:border-zinc-700 shadow-inner">
                          <svg viewBox="0 0 100 100" className="w-8 h-8 opacity-80" fill="currentColor">
                            <path d="M50 22 C64 52, 78 72, 78 77 C78 82, 22 82, 22 77 C22 72, 36 52, 50 22 Z" className="text-zinc-300 dark:text-zinc-600" />
                            <path d="M50 35 C58 55, 68 68, 68 72 C68 76, 32 76, 32 72 C32 68, 42 55, 50 35 Z" className="text-zinc-400 dark:text-zinc-500" />
                          </svg>
                        </div>
                        
                        {/* Details */}
                        <div className="space-y-1">
                          <div className="relative pb-1 inline-block">
                            <h5 className="font-heading font-black text-sm sm:text-base text-brand-dark dark:text-white uppercase tracking-wider">
                              {active.name}
                            </h5>
                            {/* Short green/teal underline under first few letters */}
                            <div className="absolute bottom-0 left-0 w-8 h-[2.5px] bg-brand-blue rounded-full"></div>
                          </div>
                          <p className="text-xs sm:text-sm text-brand-grey dark:text-zinc-400 font-medium">
                            {active.benefit}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Full Ingredients List Divider / Numbered List */}
                {ingredientsArray.length > 0 && (
                  <div className="  border-brand-border/60 dark:border-zinc-850 space-y-4">
                    <h6 className="font-bold text-[10px] text-brand-grey dark:text-zinc-550 uppercase tracking-widest font-heading">
                      Ingredients List:
                    </h6>
                    <div className=" rounded-lg  max-w-xl">
                      <div className="flex flex-col gap-2.5">
                        {ingredientsArray.map((ing, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-3 text-xs sm:text-sm text-brand-dark dark:text-zinc-200 font-semibold bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-lg border border-brand-border dark:border-zinc-800 shadow-2xs transition-all hover:border-brand-blue hover:translate-x-0.5 duration-200"
                          >
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-blue-light font-black text-xs shrink-0">
                              {idx + 1}
                            </span>
                            <span>{ing}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === 'faq' && (() => {
            const faqs = details.faqs || [];
            
            if (faqs.length === 0) {
              return (
                <div className="text-center py-6">
                  <p className="text-xs sm:text-sm text-brand-grey dark:text-zinc-400 font-medium">No clinical FAQs available for this formulation. Ask us anything.</p>
                </div>
              );
            }

            return (
              <div className="space-y-5">
                <h4 className="font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-brand-dark dark:text-white mb-2">
                  FREQUENTLY ASKED CLINICAL QUESTIONS
                </h4>
                <div className="divide-y divide-brand-border dark:divide-zinc-800 border border-brand-border dark:border-zinc-800 rounded-xl overflow-hidden bg-[#f9fafb]/40 dark:bg-zinc-955/20">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="transition-all duration-300">
                        <button 
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full px-5 py-4 text-left font-bold text-brand-dark dark:text-white text-xs sm:text-sm font-heading flex items-center justify-between gap-4 hover:bg-brand-blue-light/10 dark:hover:bg-zinc-900 transition-colors focus:outline-none"
                        >
                          <span className="uppercase tracking-wide">Q: {faq.question}</span>
                          <span className={`text-brand-blue font-bold text-lg transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-96 border-t border-brand-border/40 dark:border-zinc-800/40 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <p className="px-5 py-4 text-xs sm:text-sm text-brand-grey dark:text-zinc-400 leading-relaxed font-medium bg-white dark:bg-zinc-900">
                            <strong>A:</strong> {faq.answer}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
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

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/image';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  // Calculate discount percentage if not already defined
  const price = parseFloat(product.price);
  const comparePrice = product.compare_price ? parseFloat(product.compare_price) : price;
  const discountPercent = product.discount_percent || 
    (comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0);

  // Render stars based on rating
  const renderStars = (rating = 0.0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={13} className="fill-brand-yellow text-brand-yellow" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <div key={i} className="relative inline-block">
            <Star size={13} className="text-gray-300" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star size={13} className="fill-brand-yellow text-brand-yellow" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={13} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="group relative bg-white border border-brand-border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-brand-blue flex flex-col h-full dark:bg-[#1a1a1a] dark:border-zinc-800 dark:hover:border-brand-blue">
      {/* Badges (Discount, Best Seller, New) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discountPercent > 0 && (
          <span className="bg-brand-accent text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {discountPercent}% OFF
          </span>
        )}
        {product.rating >= 4.8 && (
          <span className="bg-brand-blue text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Best Seller
          </span>
        )}
      </div>

      {/* Product Image Panel */}
      <div className="relative pt-[100%] bg-brand-bg-grey overflow-hidden border-b border-brand-border flex items-center justify-center dark:bg-zinc-900/50 dark:border-zinc-800">
        <Link to={`/products/${product.slug}`} className="absolute inset-0 flex items-center justify-center p-4">
          <img
            src={getImageUrl(product.image_url)}
            alt={product.name}
            className={`max-h-full max-w-full object-contain transition-all duration-500 ease-in-out ${
              product.secondary_image_url ? 'group-hover:opacity-0 group-hover:scale-95' : 'group-hover:scale-105'
            }`}
            onError={(e) => {
              e.target.src = '/assets/products/placeholder.png';
            }}
          />
          {product.secondary_image_url && (
            <img
              src={getImageUrl(product.secondary_image_url)}
              alt={`${product.name} Alternate`}
              className="absolute inset-0 max-h-full max-w-full object-contain p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </Link>
        
        {/* Quick View overlay on hover */}
        <div className="absolute inset-0 bg-brand-blue-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto z-10">
          <Link
            to={`/products/${product.slug}`}
            className="p-2.5 bg-white text-brand-blue-dark hover:bg-brand-blue hover:text-white rounded-full shadow-md transition-all transform hover:scale-110 pointer-events-auto"
            title="Quick View"
          >
            <Eye size={18} />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Category/Concern Subtitle */}
          <p className="text-[10px] font-bold text-brand-grey uppercase tracking-wider font-heading dark:text-zinc-400">
            {product.category_name || 'Dermatological Care'}
          </p>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-brand-dark hover:text-brand-blue transition-colors line-clamp-2 h-10 font-heading dark:text-zinc-200 dark:hover:text-brand-blue">
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 py-1">
            <div className="flex">{renderStars(product.rating ?? 0)}</div>
            <span className="text-[11px] font-bold text-brand-grey dark:text-zinc-400">({product.review_count ?? 0})</span>
          </div>

          {/* Sizes / Key details */}
          <p className="text-xs text-brand-grey italic truncate dark:text-zinc-400">
            {product.weight || '50g'} • Dermatologically Tested
          </p>
        </div>

        {/* Pricing and CTA with hover slide-up interaction */}
        <div className="relative mt-3 pt-2 sm:mt-4 sm:pt-3 border-t border-brand-border/60 h-14 overflow-hidden dark:border-zinc-800">
          {/* Price & Size display (slides up and away on hover) */}
          <div className="flex items-center justify-between h-full transition-transform duration-300 group-hover:-translate-y-full">
            <div className="flex flex-col justify-center">
              {comparePrice > price && (
                <span className="text-[10px] text-brand-grey line-through font-semibold leading-none dark:text-zinc-500">₹{comparePrice}</span>
              )}
              <span className="text-base font-extrabold text-brand-blue dark:text-white leading-tight">₹{price}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold bg-brand-blue-light text-brand-blue px-2 py-0.5 rounded dark:bg-zinc-800 dark:text-brand-blue-light">
                {product.weight || '50g'}
              </span>
            </div>
          </div>

          {/* Add to Cart button (slides up from bottom into place on hover) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
            className="absolute inset-x-0 bottom-0 h-full bg-brand-accent hover:bg-brand-accent/90 text-white rounded-md font-bold font-heading text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform duration-300 translate-y-full group-hover:translate-y-0 shadow-md cursor-pointer"
          >
            <ShoppingCart size={15} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

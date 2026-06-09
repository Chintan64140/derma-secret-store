import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/image';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCompareTotal, cartDiscount } = useCart();
  const drawerRef = useRef(null);
  const navigate = useNavigate();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        ref={drawerRef}
        className="w-full max-w-md bg-white dark:bg-zinc-900 border-l dark:border-zinc-800 h-full flex flex-col shadow-2xl animate-slide-left transition-colors duration-300"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-brand-blue" size={22} />
            <h2 className="text-lg font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide">
              Your Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-brand-grey dark:text-gray-400 hover:bg-brand-bg-grey dark:hover:bg-zinc-800 hover:text-brand-dark dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="p-4 bg-brand-blue-light dark:bg-brand-blue/10 rounded-full text-brand-blue">
                <ShoppingBag size={48} />
              </div>
              <p className="text-brand-grey dark:text-gray-400 font-medium">Your shopping cart is empty</p>
              <button 
                onClick={() => { onClose(); navigate('/shop'); }}
                className="px-6 py-2.5 bg-brand-blue text-white rounded-md font-semibold font-heading text-sm uppercase tracking-wider hover:bg-brand-blue-dark transition-colors cursor-pointer"
              >
                Shop Our Products
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 py-3 border-b border-brand-border dark:border-zinc-800/80 last:border-b-0">
                {/* Product Image */}
                <div className="w-20 h-20 bg-brand-bg-grey dark:bg-zinc-800 rounded-md overflow-hidden flex-shrink-0 border border-brand-border dark:border-zinc-850 flex items-center justify-center">
                  <img 
                    src={getImageUrl(item.image_url)} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/products/placeholder.png';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="text-sm font-bold text-brand-dark dark:text-white hover:text-brand-blue transition-colors truncate">
                      <Link to={`/products/${item.slug}`} onClick={onClose}>
                        {item.name}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-brand-blue">₹{item.price}</span>
                      {item.compare_price > item.price && (
                        <span className="text-xs text-brand-grey dark:text-gray-400 line-through">₹{item.compare_price}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-brand-border dark:border-zinc-850 rounded-md bg-white dark:bg-zinc-800">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 px-2 text-brand-grey dark:text-gray-400 hover:text-brand-dark dark:hover:text-white hover:bg-brand-bg-grey dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-xs font-bold text-brand-dark dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 px-2 text-brand-grey dark:text-gray-400 hover:text-brand-dark dark:hover:text-white hover:bg-brand-bg-grey dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-brand-grey dark:text-gray-400 hover:text-brand-accent p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-brand-border dark:border-zinc-800 bg-brand-bg-grey dark:bg-zinc-950 px-6 py-5 space-y-4 transition-colors duration-300">
            <div className="space-y-2 text-sm font-medium text-brand-dark dark:text-gray-200">
              {cartDiscount > 0 && (
                <>
                  <div className="flex justify-between text-brand-grey dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{cartCompareTotal}</span>
                  </div>
                  <div className="flex justify-between text-brand-accent dark:text-red-400 font-semibold">
                    <span>Discount Savings</span>
                    <span>-₹{cartDiscount}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-base font-bold text-brand-dark dark:text-white pt-1 border-t border-brand-border/60 dark:border-zinc-800/80">
                <span>Total Amount</span>
                <span className="text-brand-blue text-lg">₹{cartTotal}</span>
              </div>
              <p className="text-[11px] text-brand-grey dark:text-gray-400 text-center italic">
                Taxes & shipping calculated at checkout. Free shipping on orders over ₹449!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-md font-bold font-heading text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Proceed To Checkout <ArrowRight size={16} />
              </button>
              <button
                onClick={() => { onClose(); navigate('/cart'); }}
                className="w-full py-2.5 bg-transparent border border-brand-blue text-brand-blue dark:text-brand-blue hover:bg-brand-blue hover:text-white rounded-md font-bold font-heading text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                View Detailed Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

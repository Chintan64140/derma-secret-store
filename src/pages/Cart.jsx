import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/image';
import SEO from '../components/SEO';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, cartCompareTotal, cartDiscount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEO 
        title="Shopping Cart"
        description="Review the formulations in your shopping cart. Verify prices, discounts, and proceed to checkout securely."
        keywords="shopping cart, checkout, skincare purchase"
      />
      {/* Page Header */}
      <div className="border-b border-brand-border dark:border-zinc-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
          Your Shopping Cart
        </h1>
        <p className="text-xs font-semibold text-brand-grey dark:text-gray-400 uppercase tracking-wider font-heading mt-1">
          Review your selected dermatological solutions
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-brand-bg-grey dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 border-dashed rounded-xl">
          <div className="p-5 bg-brand-blue-light dark:bg-brand-blue/10 rounded-full text-brand-blue">
            <ShoppingBag size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-brand-dark dark:text-white font-heading uppercase">Your Cart is Empty</h3>
            <p className="text-xs text-brand-grey dark:text-gray-400 max-w-xs mx-auto">
              You haven't added any clinical formulations to your shopping cart yet.
            </p>
          </div>
          <Link
            to="/shop"
            className="px-6 py-3 bg-brand-blue text-white rounded-md font-bold font-heading text-xs uppercase tracking-wider hover:bg-brand-blue-dark transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Clear Cart control */}
            <div className="flex justify-between items-center bg-brand-bg-grey dark:bg-zinc-900 p-4 border border-brand-border dark:border-zinc-800 rounded-lg">
              <span className="text-xs font-bold text-brand-dark dark:text-gray-300">Item Details</span>
              <button 
                onClick={clearCart}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-accent hover:text-red-700 transition-colors uppercase"
              >
                <RotateCcw size={13} /> Clear Entire Cart
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row gap-4 p-4 border border-brand-border dark:border-zinc-850 rounded-lg bg-white dark:bg-zinc-900 shadow-xs"
                >
                  {/* Image */}
                  <div className="w-24 h-24 bg-brand-bg-grey dark:bg-zinc-850 rounded-md border border-brand-border dark:border-zinc-800 p-2 flex items-center justify-center flex-shrink-0 self-center sm:self-auto">
                    <img 
                      src={getImageUrl(item.image_url)} 
                      alt={item.name} 
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.src = '/assets/products/placeholder.png';
                      }}
                    />
                  </div>

                  {/* Info and controls */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-brand-dark dark:text-gray-200 hover:text-brand-blue dark:hover:text-brand-blue transition-colors line-clamp-2 font-heading">
                          <Link to={`/products/${item.slug}`}>{item.name}</Link>
                        </h3>
                        <p className="text-[10px] text-brand-grey dark:text-gray-400 font-semibold mt-1">₹{item.price} each</p>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-brand-grey dark:text-gray-400 hover:text-brand-accent p-1 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-4 pt-3 border-t border-brand-border/40 dark:border-zinc-800/80 gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-brand-border dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2.5 text-brand-grey dark:text-gray-400 hover:text-brand-dark dark:hover:text-white hover:bg-brand-bg-grey dark:hover:bg-zinc-800 transition-colors font-bold text-xs"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="px-3.5 text-xs font-bold text-brand-dark dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 px-2.5 text-brand-grey dark:text-gray-400 hover:text-brand-dark dark:hover:text-white hover:bg-brand-bg-grey dark:hover:bg-zinc-800 transition-colors font-bold text-xs"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      {/* Total price for item */}
                      <div className="text-right">
                        {item.compare_price > item.price && (
                          <span className="text-[10px] text-brand-grey dark:text-gray-450 line-through block font-semibold">
                            ₹{item.compare_price * item.quantity}
                          </span>
                        )}
                        <span className="text-sm sm:text-base font-extrabold text-brand-blue">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Pricing Summary */}
          <div className="bg-brand-bg-grey dark:bg-zinc-900 p-6 rounded-xl border border-brand-border dark:border-zinc-800 space-y-6 self-start">
            <h3 className="text-base font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-3">
              Order Pricing Summary
            </h3>
            
            <div className="space-y-3.5 text-xs font-medium text-brand-dark dark:text-gray-300">
              <div className="flex justify-between text-brand-grey dark:text-gray-400">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items)</span>
                <span>₹{cartCompareTotal}</span>
              </div>
              
              {cartDiscount > 0 && (
                <div className="flex justify-between text-brand-accent font-semibold animate-fade-in">
                  <span>Dermatology Discount Savings</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}
              
              <div className="flex justify-between text-brand-grey dark:text-gray-400">
                <span>Estimated Shipping Charges</span>
                <span className="font-semibold text-brand-blue">
                  {cartTotal >= 449 ? 'FREE SHIPPING' : '₹50.00'}
                </span>
              </div>

              <div className="border-t border-brand-border/60 dark:border-zinc-800 pt-4 flex justify-between items-baseline text-brand-dark dark:text-gray-200">
                <span className="font-bold text-sm">Estimated Total</span>
                <div className="text-right">
                  <span className="text-xl font-black text-brand-blue">
                    ₹{cartTotal + (cartTotal >= 449 ? 0 : 50)}
                  </span>
                  <p className="text-[10px] text-brand-grey dark:text-gray-450 font-semibold mt-0.5 uppercase tracking-wider font-heading">Inclusive of GST</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-md font-bold font-heading text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              
              <Link
                to="/shop"
                className="block text-center mt-3 text-xs font-bold text-brand-blue hover:underline uppercase tracking-wider font-heading"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

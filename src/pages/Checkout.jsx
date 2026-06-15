import React from 'react';
import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CheckoutProvider, useCheckout } from '../context/CheckoutContext';
import SEO from '../components/SEO';
import RazorpayModal from '../components/RazorpayModal';

const CheckoutLayout = () => {
  const { cartItems, cartTotal } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const isSuccessPage = location.pathname.endsWith('/success');

  const {
    couponCode, setCouponCode,
    couponDiscountAmount,
    appliedCoupon,
    couponError,
    couponSuccess,
    couponValidating,
    handleApplyCoupon,
    handleRemoveCoupon,
    isAddressValid,
    isPaymentValid,
    errorMsg,
    isRazorpayModalOpen,
    setIsRazorpayModalOpen,
    razorpayOrderDetails,
    finalizeOrder,
    shippingSettings
  } = useCheckout();

  // Redirect logic for empty cart (except on success page)
  if (cartItems.length === 0 && !isSuccessPage) {
    return <Navigate to="/cart" replace />;
  }

  if (isSuccessPage) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SEO 
          title="Order Confirmed"
          description="Thank you for your purchase from Derma Secret. Your order has been placed successfully."
          keywords="order success, confirmed"
        />
        <Outlet />
      </div>
    );
  }

  const steps = [
    { label: 'Cart', path: '/cart' },
    { label: 'Address', path: '/checkout/address' },
    { label: 'Payment', path: '/checkout/payment' },
    { label: 'Confirm', path: '/checkout/confirm' },
  ];

  const getActiveStep = () => {
    if (location.pathname.includes('/address')) return 1;
    if (location.pathname.includes('/payment')) return 2;
    if (location.pathname.includes('/confirm')) return 3;
    return 1;
  };

  const activeStep = getActiveStep();

  const handleStepClick = (stepIndex) => {
    if (stepIndex === 0) {
      navigate('/cart');
    } else if (stepIndex === 1) {
      navigate('/checkout/address');
    } else if (stepIndex === 2 && isAddressValid()) {
      navigate('/checkout/payment');
    } else if (stepIndex === 3 && isAddressValid() && isPaymentValid()) {
      navigate('/checkout/confirm');
    }
  };

  const netPayableTotal = Math.max(0, cartTotal - couponDiscountAmount); 
  const shippingFee = netPayableTotal >= shippingSettings.free_shipping_threshold ? 0 : shippingSettings.shipping_fee;
  const finalTotal = netPayableTotal + shippingFee;


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEO 
        title="Secure Checkout"
        description="Verify your delivery details, apply coupon codes, choose payment method, and complete your skincare purchase."
        keywords="checkout, secure checkout, purchase skincare"
      />
      
      {/* Page Title */}
      <div className="border-b border-brand-border dark:border-zinc-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
          Clinical Checkout
        </h1>
        <p className="text-xs font-semibold text-brand-grey dark:text-gray-400 uppercase tracking-wider font-heading mt-1">
          Complete shipping details to release formulation dispatch
        </p>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 relative px-4">
        {/* Connection Line Background */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-zinc-800 z-0" />
        {/* Connection Line Active */}
        <div 
          className="absolute top-4 left-0 h-0.5 bg-brand-blue z-0 transition-all duration-500" 
          style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;
          const isClickable = idx === 0 || (idx === 1) || (idx === 2 && isAddressValid()) || (idx === 3 && isAddressValid() && isPaymentValid());
          
          return (
            <div key={idx} className="flex flex-col items-center z-10">
              <button
                type="button"
                onClick={() => isClickable && handleStepClick(idx)}
                disabled={!isClickable}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-brand-blue text-white shadow-md' 
                    : isActive 
                      ? 'bg-brand-accent text-white ring-4 ring-brand-accent/20 scale-110 shadow-lg' 
                      : 'bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-gray-500'
                } ${isClickable ? 'cursor-pointer hover:border-brand-blue' : 'cursor-not-allowed'}`}
              >
                {isCompleted ? '✓' : idx + 1}
              </button>
              <span className={`text-[10px] uppercase font-bold tracking-wider mt-2 transition-colors duration-300 ${
                isActive ? 'text-brand-accent' : isCompleted ? 'text-brand-blue' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-brand-accent dark:text-red-400 text-xs font-semibold rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left Column: Sub-Page Outlet */}
        <div className="lg:col-span-3">
          <Outlet />
        </div>

        {/* Right Column: Checkout Summary Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-bg-grey dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-5 space-y-6 self-start animate-fade-in">
            <h3 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-3">
              Order Dispatch Summary
            </h3>

            {/* Cart Items list summary */}
            <div className="space-y-3.5 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 justify-between items-center text-xs font-semibold text-brand-dark dark:text-gray-200">
                  <div className="flex gap-2 items-center min-w-0">
                    <span className="bg-brand-blue text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {item.quantity}
                    </span>
                    <span className="truncate max-w-[150px]">{item.name}</span>
                  </div>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-border/60 dark:border-zinc-800 pt-4 space-y-3">
              <span className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-widest font-heading">Have a Promo Code?</span>
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyCoupon(e);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 border border-brand-border dark:border-zinc-800 bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 rounded text-xs focus:outline-none focus:border-brand-blue"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponValidating}
                    className="px-4 py-1.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 flex items-center justify-between gap-3 animate-fade-up">
                  <div className="space-y-0.5">
                    <span className="block text-xs font-extrabold text-green-700 dark:text-green-400 font-heading">
                      ✓ {appliedCoupon.code} APPLIED
                    </span>
                    <span className="block text-[10px] text-green-600 font-medium">
                      ₹{couponDiscountAmount.toFixed(2)} discount applied
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-brand-accent hover:text-red-650 uppercase tracking-wider cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[10px] font-semibold text-brand-accent dark:text-red-400 flex items-center gap-1 animate-fade-in">
                  <AlertCircle size={12} /> {couponError}
                </p>
              )}
              {couponSuccess && !appliedCoupon && (
                <p className="text-[10px] font-semibold text-green-600 flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 size={12} /> {couponSuccess}
                </p>
              )}
            </div>

            {/* Calculation Totals */}
            <div className="border-t border-brand-border/60 dark:border-zinc-800 pt-4 space-y-3 text-xs font-medium text-brand-dark dark:text-gray-300">
              <div className="flex justify-between text-brand-grey dark:text-gray-400">
                <span>Items Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              {couponDiscountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-bold dark:text-green-400">
                  <span>Coupon Savings ({appliedCoupon.code})</span>
                  <span>-₹{couponDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-grey dark:text-gray-400">
                <span>Shipping Charges</span>
                <span className="font-semibold text-brand-blue">
                  {netPayableTotal >= shippingSettings.free_shipping_threshold ? 'FREE' : `₹${shippingSettings.shipping_fee.toFixed(2)}`}
                </span>
              </div>
              
              <div className="border-t border-brand-border/60 dark:border-zinc-855 pt-4 flex justify-between items-baseline font-bold text-brand-dark dark:text-gray-200">
                <span>Net Payable</span>
                <span className="text-lg font-black text-brand-blue">₹{finalTotal}</span>
              </div>
            </div>

            <p className="text-[10px] text-brand-grey dark:text-gray-450 text-center leading-relaxed">
              Checkout progress is saved automatically. Click steps above to navigate back if needed.
            </p>
          </div>
        </div>
      </div>

      {/* Razorpay Simulation Modal */}
      <RazorpayModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        amount={razorpayOrderDetails?.amount || 0}
        orderId={razorpayOrderDetails?.id || ''}
        onSuccess={async (verificationData) => {
          await finalizeOrder(verificationData);
        }}
        onError={(err) => {
          alert(`Payment Error: ${err}`);
        }}
      />
    </div>
  );
};

const Checkout = () => {
  return (
    <CheckoutProvider>
      <CheckoutLayout />
    </CheckoutProvider>
  );
};

export default Checkout;

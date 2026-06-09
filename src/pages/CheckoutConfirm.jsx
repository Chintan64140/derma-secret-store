import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCheckout } from '../context/CheckoutContext';
import { useCart } from '../context/CartContext';

const CheckoutConfirm = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const {
    name, email, phone, address, city, state, zip,
    paymentMethod,
    submitting,
    handlePlaceOrder
  } = useCheckout();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 space-y-6">
        <h2 className="text-sm sm:text-base font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-2">
          Review Your Order Details
        </h2>

        {/* Shipping Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-brand-dark dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <MapPin size={16} className="text-brand-blue" /> Shipping Information
          </h3>
          <div className="bg-brand-bg-grey dark:bg-zinc-950 p-4 border border-brand-border dark:border-zinc-850 rounded-lg text-xs space-y-2 text-brand-dark dark:text-gray-300">
            <div className="grid grid-cols-3">
              <span className="text-brand-grey dark:text-gray-400">Name:</span>
              <span className="col-span-2 font-bold">{name}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-brand-grey dark:text-gray-400">Contact:</span>
              <span className="col-span-2">{phone} | {email}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-brand-grey dark:text-gray-400">Address:</span>
              <span className="col-span-2">{address}, {city}, {state} - {zip}</span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-brand-dark dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <CreditCard size={16} className="text-brand-blue" /> Payment Method
          </h3>
          <div className="bg-brand-bg-grey dark:bg-zinc-950 p-4 border border-brand-border dark:border-zinc-850 rounded-lg text-xs space-y-2 text-brand-dark dark:text-gray-300">
            <div className="grid grid-cols-3">
              <span className="text-brand-grey dark:text-gray-400">Method:</span>
              <span className="col-span-2 font-bold uppercase text-brand-blue flex items-center gap-1.5 font-semibold">
                {paymentMethod === 'RAZORPAY' ? (
                  <>
                    <ShieldCheck size={14} className="text-brand-blue" /> Online Payment (Razorpay)
                  </>
                ) : (
                  'Cash on Delivery (COD)'
                )}
              </span>
            </div>
            {paymentMethod === 'RAZORPAY' && (
              <div className="grid grid-cols-3">
                <span className="text-brand-grey dark:text-gray-400">Payment Modes:</span>
                <span className="col-span-2 text-gray-400">UPI, Cards, Netbanking, Wallets</span>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Buttons */}
        <div className="pt-4 flex justify-between border-t border-brand-border dark:border-zinc-800">
          <button
            type="button"
            onClick={() => navigate('/checkout/payment')}
            disabled={submitting}
            className="px-5 py-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 text-brand-dark dark:text-gray-200 hover:bg-brand-bg-grey dark:hover:bg-zinc-800 rounded font-bold font-heading text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            Back to Payment
          </button>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={submitting || cartItems.length === 0}
            className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white rounded font-bold font-heading text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Initiating Gateway...' : (paymentMethod === 'RAZORPAY' ? 'Proceed to Pay' : 'Place Order')} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirm;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft, Smartphone, CreditCard } from 'lucide-react';
import { useCheckout } from '../context/CheckoutContext';

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const {
    paymentMethod, setPaymentMethod,
    isPaymentValid
  } = useCheckout();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPaymentValid()) {
      navigate('/checkout/confirm');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-2 flex items-center gap-2">
          <ShieldCheck size={18} className="text-brand-blue" /> Payment Options
        </h2>
        
        <div className="space-y-3">
          {/* Razorpay Online Option */}
          <label className={`flex items-start gap-3.5 p-4 border rounded-xl cursor-pointer select-none transition-all duration-300 ${
            paymentMethod === 'RAZORPAY' 
              ? 'border-brand-blue bg-blue-50/20 dark:bg-zinc-950 ring-2 ring-brand-blue/10' 
              : 'border-brand-border dark:border-zinc-850 bg-white dark:bg-zinc-900 hover:bg-brand-bg-grey dark:hover:bg-zinc-850'
          }`}>
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === 'RAZORPAY'}
              onChange={() => setPaymentMethod('RAZORPAY')}
              className="mt-1 w-4 h-4 text-brand-blue focus:ring-brand-blue"
            />
            <div className="space-y-1">
              <span className="block text-xs font-bold text-brand-dark dark:text-gray-200 uppercase tracking-wider font-heading">Online Payment (Razorpay Secure)</span>
              <span className="block text-[10px] text-brand-grey dark:text-gray-400 font-medium">Pay instantly using Cards, UPI, Netbanking, or Wallets. (Sandbox/Test Mode supported)</span>
              
              {/* Payment Type Badges */}
              <div className="flex gap-2 pt-2 text-[8px] font-extrabold tracking-wider text-brand-blue">
                <span className="bg-blue-100/60 dark:bg-blue-950/20 px-2 py-0.5 rounded uppercase flex items-center gap-1 font-semibold">
                  <CreditCard size={10} /> Cards
                </span>
                <span className="bg-blue-100/60 dark:bg-blue-950/20 px-2 py-0.5 rounded uppercase flex items-center gap-1 font-semibold">
                  <Smartphone size={10} /> UPI (GPay/PhonePe)
                </span>
              </div>
            </div>
          </label>

          {/* COD Option */}
          <label className={`flex items-start gap-3.5 p-4 border rounded-xl cursor-pointer select-none transition-all duration-300 ${
            paymentMethod === 'COD' 
              ? 'border-brand-blue bg-blue-50/20 dark:bg-zinc-950 ring-2 ring-brand-blue/10' 
              : 'border-brand-border dark:border-zinc-850 bg-white dark:bg-zinc-900 hover:bg-brand-bg-grey dark:hover:bg-zinc-850'
          }`}>
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === 'COD'}
              onChange={() => setPaymentMethod('COD')}
              className="mt-1 w-4 h-4 text-brand-blue focus:ring-brand-blue"
            />
            <div className="space-y-1">
              <span className="block text-xs font-bold text-brand-dark dark:text-gray-200 uppercase tracking-wider font-heading">Cash on Delivery (COD)</span>
              <span className="block text-[10px] text-brand-grey dark:text-gray-400 font-medium">Pay physically in cash upon parcel receipt. Shipping fees apply if subtotal is below ₹449.</span>
            </div>
          </label>
        </div>

        <div className="pt-4 flex justify-between border-t border-brand-border dark:border-zinc-800">
          <button
            type="button"
            onClick={() => navigate('/checkout/address')}
            className="px-5 py-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 text-brand-dark dark:text-gray-200 hover:bg-brand-bg-grey dark:hover:bg-zinc-800 rounded font-bold font-heading text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Address
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white rounded font-bold font-heading text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            Proceed to Review <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPayment;

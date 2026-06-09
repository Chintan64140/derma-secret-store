import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Check, Loader2 } from 'lucide-react';

const RazorpayModal = ({ isOpen, onClose, amount, orderId, onSuccess, onError }) => {
  const [method, setMethod] = useState('select'); // 'select', 'card', 'upi'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'processing', 'success'

  if (!isOpen) return null;

  const displayAmount = (amount / 100).toFixed(2);

  const handlePay = () => {
    if (method === 'card' && (!cardNumber || cardExpiry.length < 5 || cardCvv.length < 3)) {
      alert('Please enter valid test card details.');
      return;
    }
    if (method === 'upi' && (!upiId || !upiId.includes('@'))) {
      alert('Please enter a valid test UPI ID.');
      return;
    }

    setStatus('processing');
    
    // Simulate payment processing time
    setTimeout(() => {
      setStatus('success');
      
      setTimeout(() => {
        // Generate mock payment details
        const paymentId = `pay_${Math.random().toString(36).substring(2, 16)}`;
        const signature = `sig_${Math.random().toString(36).substring(2, 24)}`;
        
        onSuccess({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
          simulated: true
        });
        
        setStatus('idle');
        setMethod('select');
        onClose();
      }, 1500);
    }, 2000);
  };

  const handleUpiAppClick = (appName, defaultVpa) => {
    setUpiId(defaultVpa);
    setStatus('processing');
    
    // Simulate app payment authorization
    setTimeout(() => {
      setStatus('success');
      
      setTimeout(() => {
        const paymentId = `pay_${Math.random().toString(36).substring(2, 16)}`;
        const signature = `sig_${Math.random().toString(36).substring(2, 24)}`;
        
        onSuccess({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
          simulated: true
        });
        
        setStatus('idle');
        setMethod('select');
        onClose();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs animate-fade-in p-4">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col transition-colors duration-300">
        
        {/* Razorpay Brand Header */}
        <div className="bg-[#193f90] text-white p-5 flex justify-between items-center relative">
          <div className="space-y-0.5">
            <span className="text-[10px] text-blue-200 font-extrabold uppercase tracking-widest">Razorpay Secure</span>
            <h3 className="text-sm font-bold uppercase tracking-tight font-heading">Derma Secret Store</h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-blue-200 block uppercase font-medium">Amount to Pay</span>
            <span className="text-base font-extrabold">₹{displayAmount}</span>
          </div>
          {status === 'idle' && (
            <button 
              onClick={onClose}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Modal Main Body */}
        <div className="p-6 flex-1 min-h-[220px] flex flex-col justify-between">
          
          {/* 1. Idle state - Choosing payment type */}
          {status === 'idle' && method === 'select' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Preferred Payment Methods</h4>
              
              {/* UPI Option */}
              <button
                type="button"
                onClick={() => setMethod('upi')}
                className="w-full flex items-center justify-between p-3.5 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-blue-50/40 dark:hover:bg-zinc-850 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-950/40 text-blue-600 rounded-md">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-800 dark:text-gray-200">UPI / QR Codes</span>
                    <span className="block text-[10px] text-gray-400">Pay using Google Pay, PhonePe, UPI ID</span>
                  </div>
                </div>
                <span className="text-[9px] text-[#193f90] dark:text-blue-400 font-extrabold uppercase tracking-widest">Select</span>
              </button>

              {/* Card Option */}
              <button
                type="button"
                onClick={() => setMethod('card')}
                className="w-full flex items-center justify-between p-3.5 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-blue-50/40 dark:hover:bg-zinc-850 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-950/40 text-blue-600 rounded-md">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-800 dark:text-gray-200">Credit / Debit Card</span>
                    <span className="block text-[10px] text-gray-400">Visa, Mastercard, RuPay, Maestro</span>
                  </div>
                </div>
                <span className="text-[9px] text-[#193f90] dark:text-blue-400 font-extrabold uppercase tracking-widest">Select</span>
              </button>
            </div>
          )}

          {/* 2. Card input screen */}
          {status === 'idle' && method === 'card' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Card Details</h4>
                <button 
                  onClick={() => setMethod('select')}
                  className="text-[10px] text-[#193f90] dark:text-blue-400 font-bold hover:underline uppercase"
                >
                  Change Method
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Card Number (Test)</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="4111 1111 1111 1111"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 font-mono"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 font-mono"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePay}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs uppercase tracking-wider transition-colors shadow-md mt-2 cursor-pointer"
              >
                Pay ₹{displayAmount}
              </button>
            </div>
          )}

          {/* 3. UPI input screen */}
          {status === 'idle' && method === 'upi' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">UPI Payments</h4>
                <button 
                  onClick={() => setMethod('select')}
                  className="text-[10px] text-[#193f90] dark:text-blue-400 font-bold hover:underline uppercase"
                >
                  Change Method
                </button>
              </div>

              {/* Quick UPI App Selectors */}
              <div className="space-y-2">
                <span className="block text-[9px] text-gray-405 font-bold uppercase tracking-wider">Instant Pay via App</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpiAppClick('Google Pay', 'gpay@upi')}
                    className="flex flex-col items-center justify-center p-2.5 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-green-50/25 dark:hover:bg-zinc-850 transition-all cursor-pointer text-center group"
                  >
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 group-hover:scale-105 transition-transform font-heading">GPay</span>
                    <span className="text-[7px] text-gray-400 mt-1 uppercase font-semibold">Google Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpiAppClick('PhonePe', 'phonepe@upi')}
                    className="flex flex-col items-center justify-center p-2.5 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-purple-50/25 dark:hover:bg-zinc-850 transition-all cursor-pointer text-center group"
                  >
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform font-heading">PhonePe</span>
                    <span className="text-[7px] text-gray-400 mt-1 uppercase font-semibold">PhonePe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpiAppClick('Paytm', 'paytm@upi')}
                    className="flex flex-col items-center justify-center p-2.5 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-blue-50/25 dark:hover:bg-zinc-850 transition-all cursor-pointer text-center group"
                  >
                    <span className="text-xs font-bold text-blue-500 group-hover:scale-105 transition-transform font-heading">Paytm</span>
                    <span className="text-[7px] text-gray-400 mt-1 uppercase font-semibold">Paytm</span>
                  </button>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-250 dark:border-zinc-800"></div>
                <span className="flex-shrink mx-3 text-[9px] text-gray-400 font-bold uppercase">Or Enter UPI ID</span>
                <div className="flex-grow border-t border-gray-250 dark:border-zinc-800"></div>
              </div>

              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value.trim())}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-gray-800 dark:text-gray-150 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. success@upi"
                  />
                  <span className="block text-[8px] text-gray-400 mt-1 font-medium">Enter any mock address ending in @upi to complete payment.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePay}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
              >
                Pay ₹{displayAmount}
              </button>
            </div>
          )}

          {/* 4. Processing Payment State */}
          {status === 'processing' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-fade-in">
              <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={36} />
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  {upiId === 'gpay@upi' && 'Waiting for authorization on Google Pay...'}
                  {upiId === 'phonepe@upi' && 'Waiting for authorization on PhonePe...'}
                  {upiId === 'paytm@upi' && 'Waiting for authorization on Paytm...'}
                  {upiId !== 'gpay@upi' && upiId !== 'phonepe@upi' && upiId !== 'paytm@upi' && 'Verifying transaction...'}
                </p>
                <p className="text-[10px] text-gray-400">Do not refresh or close the page.</p>
              </div>
            </div>
          )}

          {/* 5. Success Animation State */}
          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-scale-up">
              <div className="p-3 bg-green-500 text-white rounded-full shadow-lg">
                <Check size={36} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Payment Successful!</p>
                <p className="text-[9px] text-gray-400">Finalizing order placement...</p>
              </div>
            </div>
          )}

        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-zinc-950 p-3 text-center border-t border-gray-150 dark:border-zinc-850">
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">PCI-DSS Compliant • 256-bit Encryption</span>
        </div>

      </div>
    </div>
  );
};

export default RazorpayModal;

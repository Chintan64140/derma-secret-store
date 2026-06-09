import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Truck } from 'lucide-react';
import { useCheckout } from '../context/CheckoutContext';
import { useAuth } from '../context/AuthContext';

const CheckoutSuccess = () => {
  const { orderSuccess } = useCheckout();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderSuccess) {
      navigate('/cart');
    }
  }, [orderSuccess, navigate]);

  if (!orderSuccess) return null;

  const { orderId, order } = orderSuccess;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8 animate-fade-in">
      <div className="inline-flex p-4 bg-green-50 dark:bg-green-950/20 rounded-full text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900 shadow-md">
        <CheckCircle2 size={54} className="animate-pulse" />
      </div>
      
      <div className="space-y-3">
        <span className="text-[10px] font-extrabold text-green-600 dark:text-green-400 uppercase tracking-widest font-heading">Formulation Booked</span>
        <h1 className="text-3xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-brand-grey dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          Thank you for choosing Derma Secret. Your order of clinical-grade formulations has been confirmed and sent to our laboratory warehouse.
        </p>
      </div>

      {/* Order Details Panel */}
      <div className="bg-brand-bg-grey dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 text-left max-w-md mx-auto space-y-4 shadow-sm animate-fade-up">
        <div className="flex justify-between border-b border-brand-border dark:border-zinc-800 pb-3 text-xs font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wider">
          <span>Order ID:</span>
          <span className="text-brand-blue">#DS-{orderId}</span>
        </div>
        <div className="space-y-2 text-xs font-medium text-brand-dark dark:text-gray-300">
          <div className="flex justify-between">
            <span className="text-brand-grey dark:text-gray-400">Shipped To:</span>
            <span>{order?.shipping_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-grey dark:text-gray-400">Delivery Address:</span>
            <span className="text-right max-w-[200px] truncate" title={order?.shipping_address}>
              {order?.shipping_address}, {order?.shipping_city}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-grey dark:text-gray-400">Payment Method:</span>
            <span className="uppercase">{order?.payment_method === 'COD' ? 'Cash on Delivery' : 'Paid via Card'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-grey dark:text-gray-400">Amount Charged:</span>
            <span className="font-extrabold text-brand-blue">₹{parseFloat(order?.net_price)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Notice */}
      <div className="max-w-md mx-auto flex items-start gap-3 bg-brand-blue-light dark:bg-brand-blue/10 border border-brand-blue/20 dark:border-brand-blue/30 p-4 rounded-lg text-left">
        <Truck className="text-brand-blue mt-0.5 flex-shrink-0" size={18} />
        <div className="text-[11px] leading-relaxed text-brand-blue-dark dark:text-brand-blue-light font-medium">
          <strong>Estimated Dispatch:</strong> Within 24-48 Hours. A tracking link will be sent to <strong>{order?.shipping_email}</strong> as soon as the package leaves our warehouse.
        </div>
      </div>

      <div className="pt-4 flex justify-center gap-4">
        {user ? (
          <Link
            to={`/orders/${orderId}`}
            className="px-5 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Track My Order
          </Link>
        ) : (
          <Link
            to="/shop"
            className="px-5 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Continue Shopping
          </Link>
        )}
        <Link
          to="/"
          className="px-5 py-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 text-brand-dark dark:text-gray-200 hover:bg-brand-bg-grey dark:hover:bg-zinc-800 rounded font-bold font-heading text-xs uppercase tracking-wider transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

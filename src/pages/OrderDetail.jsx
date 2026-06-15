import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Truck, 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Package, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  Compass,
  CheckCircle,
  XCircle,
  Star,
  Camera,
  Trash2,
  X
} from 'lucide-react';
import { useAuth, API } from '../context/AuthContext';

const OrderDetail = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Return Flow States
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnComment, setReturnComment] = useState('');
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnError, setReturnError] = useState('');

  // Product Review States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const [reviewPhotoUploading, setReviewPhotoUploading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  const openReviewModal = (item) => {
    setReviewProduct(item);
    setReviewRating(5);
    setReviewTitle('');
    setReviewComment('');
    setReviewPhotos([]);
    setReviewError('');
    setReviewSuccessMsg('');
    setIsReviewModalOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setReviewError('Image must be smaller than 5MB.');
      return;
    }

    setReviewPhotoUploading(true);
    setReviewError('');
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await API.post('/products/reviews/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setReviewPhotos(prev => [...prev, res.data.imageUrl]);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to upload photo. Please try again.');
    } finally {
      setReviewPhotoUploading(false);
    }
  };

  const removeReviewPhoto = (indexToRemove) => {
    setReviewPhotos(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewRating) {
      setReviewError('Please select a star rating.');
      return;
    }

    setReviewSubmitting(true);
    setReviewError('');

    try {
      await API.post(`/products/${reviewProduct.product_id || reviewProduct.product_id}/reviews`, {
        userName: user.name || 'Anonymous Patient',
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        images: reviewPhotos
      });
      
      setReviewSuccessMsg('Your clinical review was submitted successfully! Thank you.');
      setTimeout(() => {
        setIsReviewModalOpen(false);
        setReviewProduct(null);
        setReviewSuccessMsg('');
      }, 3000);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returnReason) {
      setReturnError('Please select a reason for return.');
      return;
    }

    setReturnSubmitting(true);
    setReturnError('');
    try {
      const res = await API.post(`/orders/${order.id}/return`, {
        reason: returnReason,
        comment: returnComment
      });
      setOrder(res.data);
      setIsReturnModalOpen(false);
      setReturnReason('');
      setReturnComment('');
    } catch (err) {
      setReturnError(err.response?.data?.message || 'Failed to submit return request. Please try again.');
    } finally {
      setReturnSubmitting(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await API.post(`/orders/${order.id}/cancel`);
      setOrder(res.data);
      alert('Order cancelled successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order. Please try again.');
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=orders');
    }
  }, [user, authLoading, navigate]);

  // Fetch single order details
  useEffect(() => {
    if (user && id) {
      setLoading(true);
      setErrorMsg('');
      API.get(`/orders/${id}`)
        .then(res => {
          setOrder(res.data);
        })
        .catch(err => {
          console.error('Fetch order detail failed:', err.message);
          setErrorMsg(
            err.response?.status === 403 
              ? 'You are not authorized to view this order.' 
              : err.response?.status === 404
                ? 'Order not found.'
                : 'Failed to retrieve order details. Please try again.'
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, id]);

  const handlePrint = () => {
    window.print();
  };

  if (authLoading || (!user && loading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 animate-pulse">
        <RefreshCw className="animate-spin text-brand-blue" size={32} />
        <p className="text-sm text-brand-grey dark:text-gray-400 font-heading uppercase tracking-wider">Loading Order Details...</p>
      </div>
    );
  }

  if (!user) return null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
        <div className="h-24 bg-zinc-100 dark:bg-zinc-900 rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-zinc-100 dark:bg-zinc-900 rounded-xl"></div>
          <div className="h-96 bg-zinc-100 dark:bg-zinc-900 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="inline-flex p-4 bg-red-50 dark:bg-red-950/20 text-brand-accent dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-full">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
            Access Error
          </h1>
          <p className="text-sm text-brand-grey dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            {errorMsg || 'We were unable to locate or open the requested order record.'}
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            to="/orders"
            className="px-5 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Go to My Orders
          </Link>
          <Link
            to="/shop"
            className="px-5 py-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 text-brand-dark dark:text-gray-200 hover:bg-brand-bg-grey dark:hover:bg-zinc-800 rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  // Set up progress tracking steps based on status
  const currentStatus = order.shipping_status?.toLowerCase() || 'pending';
  const steps = [
    { key: 'placed', label: 'Placed', icon: Clock },
    { key: 'ready to ship', label: 'Ready to ship', icon: Compass },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  // Helper to determine status style
  const getStepStatus = (index) => {
    if (currentStatus === 'cancelled') return 'cancelled';
    
    const statusIndices = {
      'pending': 0,
      'processing': 1,
      'ready to ship': 1,
      'shipped': 2,
      'delivered': 3
    };
    
    const currentIndex = statusIndices[currentStatus] !== undefined ? statusIndices[currentStatus] : 0;
    
    if (index <= currentIndex) return 'completed';
    if (index === currentIndex + 1) return 'active';
    return 'upcoming';
  };

  const trackingNote = () => {
    switch (currentStatus) {
      case 'delivered':
        return 'The delivery agent confirmed receipt of this order. Thank you for choosing Derma Secret!';
      case 'shipped':
        return 'Your package is currently in transit. Use tracking details received via email to follow cargo logistics.';
      case 'cancelled':
        return 'This order has been cancelled and any paid funds are credited to your diagnostic wallet / original payment source.';
      default:
        return 'Our lab chemists are compiling your clinical formulations. Your dispatch estimate is 24-48 hours.';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in print:py-0">
      
      {/* 1. Header Navigation & Print Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800 pb-5 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="p-2 border border-brand-border dark:border-zinc-800 rounded-lg hover:bg-brand-bg-grey dark:hover:bg-zinc-800 text-brand-dark dark:text-gray-300 transition-colors"
            title="Back to Orders"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="text-[10px] font-extrabold text-brand-blue dark:text-brand-blue-light uppercase tracking-widest font-heading">Invoice Summary</span>
            <h1 className="text-xl sm:text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading mt-0.5">
              Order #DS-{order.id}
            </h1>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-brand-border dark:border-zinc-800 hover:bg-brand-bg-grey dark:hover:bg-zinc-800 text-brand-dark dark:text-gray-200 rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Printer size={14} /> Print Invoice
        </button>
      </div>

      {/* Print-only Invoice Header */}
      <div className="hidden print:block text-center border-b pb-6 space-y-2">
        <h1 className="text-2xl font-black font-heading uppercase text-[#01007A]">DERMA SECRET STORE</h1>
        <p className="text-xs text-gray-500 font-semibold">Clinical-Grade Formulations & Solutions</p>
        <div className="flex justify-between text-[10px] font-bold text-gray-600 pt-4">
          <span>INVOICE REFERENCE: #DS-{order.id}</span>
          <span>DATE: {new Date(order.created_at).toLocaleString()}</span>
        </div>
      </div>

      {/* 2. Order Stepper Tracker */}
      {currentStatus === 'cancelled' ? (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-5 flex items-start gap-4 animate-fade-up">
          <XCircle className="text-brand-accent flex-shrink-0 mt-0.5" size={24} />
          <div className="space-y-1">
            <h3 className="text-sm font-black text-brand-accent uppercase tracking-tight font-heading">
              Order Cancelled
            </h3>
            <p className="text-xs text-brand-dark dark:text-red-350 leading-relaxed font-semibold">
              This order transaction has been voided. Please contact our support panel if you believe this is a mistake.
            </p>
          </div>
        </div>
      ) : currentStatus === 'return requested' || currentStatus === 'returned' || order.return_status ? (
        <div className="bg-brand-blue-light/50 dark:bg-zinc-900 border border-brand-blue/30 dark:border-zinc-800 rounded-xl p-5 flex items-start gap-4 animate-fade-up">
          <RefreshCw className="text-brand-blue animate-spin duration-5000 flex-shrink-0 mt-0.5" size={24} />
          <div className="space-y-1">
            <h3 className="text-sm font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading flex items-center gap-2">
              Order Return Request: <span className="text-brand-blue">{order.return_status}</span>
            </h3>
            <p className="text-xs text-brand-grey dark:text-gray-300 leading-relaxed font-semibold">
              {currentStatus === 'return requested' 
                ? 'Your request to return this order is currently pending review by our dermatology panel.' 
                : `This order return request has been processed. Status: ${order.return_status}.`}
            </p>
            {order.return_reason && (
              <div className="text-xs text-brand-dark dark:text-gray-300 mt-3 bg-white dark:bg-zinc-850 p-4 rounded-lg border border-brand-border dark:border-zinc-800 space-y-1.5">
                <div>
                  <span className="font-extrabold uppercase text-[9px] block text-brand-blue">Reason for return:</span>
                  <span className="font-bold">{order.return_reason}</span>
                </div>
                {order.return_comment && (
                  <div>
                    <span className="font-extrabold uppercase text-[9px] block text-brand-grey dark:text-gray-400">Your comments:</span>
                    <p className="font-medium text-brand-grey dark:text-gray-350 leading-relaxed">{order.return_comment}</p>
                  </div>
                )}
                {order.return_admin_comment && (
                  <div className="pt-2 border-t border-brand-border/60 dark:border-zinc-800">
                    <span className="font-extrabold uppercase text-[9px] block text-brand-accent">Dermatology Panel Feedback:</span>
                    <p className="font-bold text-brand-dark dark:text-white mt-0.5">{order.return_admin_comment}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-6 animate-fade-up print:hidden">
          {/* Stepper visualization */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            {/* Connecting progress line */}
            <div className="absolute left-1/2 md:left-0 md:top-[18px] w-0.5 md:w-full h-full md:h-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-x-1/2 md:translate-x-0 z-0"></div>
            
            {/* Step bubbles */}
            {steps.map((step, idx) => {
              const stepStatus = getStepStatus(idx);
              const Icon = step.icon;
              
              let bubbleStyle = 'bg-zinc-100 border-zinc-200 text-zinc-400 dark:bg-zinc-850 dark:border-zinc-800 dark:text-zinc-650';
              let lineProgressClass = '';

              if (stepStatus === 'completed') {
                bubbleStyle = 'bg-brand-blue text-white border-brand-blue dark:bg-brand-blue dark:border-brand-blue shadow-sm';
              } else if (stepStatus === 'active') {
                bubbleStyle = 'bg-white border-brand-yellow text-brand-yellow dark:bg-zinc-900 border-2 animate-pulse';
              }

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center text-center space-y-2 md:w-1/4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${bubbleStyle}`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider font-heading ${
                    stepStatus === 'completed' 
                      ? 'text-brand-blue dark:text-brand-blue-light' 
                      : stepStatus === 'active' 
                        ? 'text-brand-yellow font-black' 
                        : 'text-brand-grey dark:text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stepper info banner */}
          <div className="bg-brand-blue-light dark:bg-brand-blue/10 border border-brand-blue/20 dark:border-brand-blue/30 rounded-lg p-4 flex items-start gap-3">
            <Truck className="text-brand-blue mt-0.5 flex-shrink-0" size={16} />
            <div className="text-[11px] leading-relaxed text-brand-blue-dark dark:text-brand-blue-light font-medium">
              <strong>Transit Status Update:</strong> {trackingNote()}
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Split Panel Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Bill breakdown and items */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dispatch Formulation Items Card */}
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-xs sm:text-sm font-black text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-3 flex items-center gap-2">
              <Package size={16} className="text-brand-blue" /> Dispatch Items
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-brand-dark dark:text-gray-200">
                <thead>
                  <tr className="border-b border-brand-border dark:border-zinc-800 text-[10px] text-brand-grey dark:text-gray-405 uppercase tracking-wider pb-2">
                    <th className="py-2">Formulation</th>
                    <th className="py-2 text-center">Price</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40 dark:divide-zinc-800/60">
                  {order.items?.map((item) => (
                    <tr key={item.id} className="py-3">
                      <td className="py-3 font-black text-brand-dark dark:text-white">
                        <div>{item.product_name}</div>
                        {order.shipping_status?.toLowerCase() === 'delivered' && (
                          <button
                            onClick={() => openReviewModal(item)}
                            className="mt-1.5 text-[10px] text-brand-blue hover:text-brand-blue-dark dark:text-brand-blue-light hover:underline uppercase font-extrabold tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <Star size={11} className="fill-amber-400 text-amber-400" /> Write a Product Review
                          </button>
                        )}
                      </td>
                      <td className="py-3 text-center text-brand-grey dark:text-gray-400">
                        ₹{parseFloat(item.price).toFixed(2)}
                      </td>
                      <td className="py-3 text-center text-brand-dark dark:text-gray-300">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right font-bold text-brand-blue dark:text-brand-blue-light">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing & Billing Details Table */}
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-xs sm:text-sm font-black text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-3 flex items-center gap-2">
              <CreditCard size={16} className="text-brand-blue" /> Financial Billing
            </h2>

            <div className="space-y-3 text-xs font-semibold text-brand-dark dark:text-gray-250">
              <div className="flex justify-between text-brand-grey dark:text-gray-400">
                <span>Items Gross Subtotal</span>
                <span>₹{(parseFloat(order.total_price) || 0).toFixed(2)}</span>
              </div>
              
              {parseFloat(order.discount_amount) > 0 && (
                <div className="flex justify-between text-brand-accent">
                  <span>Savings Applied (Coupon/Derm Savings)</span>
                  <span>-₹{parseFloat(order.discount_amount).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-brand-grey dark:text-gray-400">
                <span>Clinical Shipping & Handing</span>
                <span>
                  {(() => {
                    const rawShipping = (parseFloat(order.net_price) || 0) - ((parseFloat(order.total_price) || 0) - (parseFloat(order.discount_amount) || 0));
                    const shippingFeeCharged = Math.max(0, rawShipping);
                    return shippingFeeCharged === 0 ? (
                      <span className="text-brand-blue dark:text-brand-blue-light uppercase font-bold">Free</span>
                    ) : (
                      `₹${shippingFeeCharged.toFixed(2)}`
                    );
                  })()}
                </span>
              </div>

              <div className="border-t border-brand-border/60 dark:border-zinc-800/80 pt-3 flex justify-between items-baseline font-black text-brand-dark dark:text-white text-sm">
                <span>Net Total Payable</span>
                <span className="text-base font-black text-brand-blue dark:text-brand-blue-light">
                  ₹{parseFloat(order.net_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Cancel Order Action Panel */}
          {['pending', 'placed', 'ready to ship', 'processing'].includes(order.shipping_status?.toLowerCase()) && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-4 animate-fade-up">
              <h2 className="text-xs sm:text-sm font-black text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-3 flex items-center gap-2">
                <XCircle size={16} className="text-brand-accent" /> Cancel Order
              </h2>
              <p className="text-xs text-brand-grey dark:text-gray-405 leading-relaxed font-medium">
                If you made a mistake or want to modify your order, you can cancel it before it is dispatched/shipped from our lab.
              </p>
              <button
                onClick={handleCancelOrder}
                className="w-full py-3 bg-brand-accent hover:bg-brand-accent/90 text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Cancel Order
              </button>
            </div>
          )}

          {/* Return Request Action Panel */}
          {order.shipping_status?.toLowerCase() === 'delivered' && !order.return_status && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-4 animate-fade-up">
              <h2 className="text-xs sm:text-sm font-black text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-3 flex items-center gap-2">
                <RefreshCw size={16} className="text-brand-accent" /> Order Return Request
              </h2>
              <p className="text-xs text-brand-grey dark:text-gray-405 leading-relaxed font-medium">
                You can request a return for this formulation within 7 days of delivery. If you experienced an allergic reaction or received a damaged/incorrect product, please initiate a return.
              </p>
              <button
                onClick={() => setIsReturnModalOpen(true)}
                className="w-full py-3 bg-brand-accent hover:bg-brand-accent/90 text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Request Order Return
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Customer Shipping & Assistance Info */}
        <div className="space-y-6">
          
          {/* Shipping Recipient Details Card */}
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-xs sm:text-sm font-black text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-3 flex items-center gap-2">
              <MapPin size={16} className="text-brand-blue" /> Delivery Recipient
            </h2>

            <div className="space-y-4 text-xs font-semibold text-brand-dark dark:text-gray-200">
              <div className="flex items-start gap-3">
                <User size={15} className="text-brand-grey dark:text-gray-450 mt-0.5" />
                <div>
                  <span className="block text-[9px] text-brand-grey dark:text-gray-455 uppercase tracking-wider">Recipient Name</span>
                  <span className="font-bold">{order.shipping_name}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={15} className="text-brand-grey dark:text-gray-455 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[9px] text-brand-grey dark:text-gray-455 uppercase tracking-wider">Email Address</span>
                  <span className="block truncate">{order.shipping_email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={15} className="text-brand-grey dark:text-gray-455 mt-0.5" />
                <div>
                  <span className="block text-[9px] text-brand-grey dark:text-gray-455 uppercase tracking-wider">Contact Phone</span>
                  <span>{order.shipping_phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-brand-grey dark:text-gray-455 mt-0.5" />
                <div>
                  <span className="block text-[9px] text-brand-grey dark:text-gray-455 uppercase tracking-wider">Shipping Destination</span>
                  <p className="font-medium text-brand-dark dark:text-gray-250 leading-relaxed">
                    {order.shipping_address}<br />
                    {order.shipping_city}, {order.shipping_state} - {order.shipping_zip}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Transaction Info Card */}
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-xs sm:text-sm font-black text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-brand-blue" /> Transaction Authenticity
            </h2>

            <div className="space-y-3.5 text-xs font-semibold text-brand-dark dark:text-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="block text-[9px] text-brand-grey dark:text-gray-455 uppercase tracking-wider">Payment Method</span>
                  <span>{order.payment_method === 'COD' ? 'Cash on Delivery (COD)' : 'Card Payment'}</span>
                </div>
                <span className="bg-brand-bg-grey dark:bg-zinc-850 px-2 py-1 border border-brand-border dark:border-zinc-800 rounded text-[9px] uppercase tracking-wider font-extrabold text-brand-dark dark:text-gray-300">
                  {order.payment_method}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="block text-[9px] text-brand-grey dark:text-gray-455 uppercase tracking-wider">Clearance Status</span>
                  <span>{order.payment_status}</span>
                </div>
                <span className={`px-2 py-1 rounded text-[9px] uppercase tracking-wider font-extrabold border ${
                  order.payment_status?.toLowerCase() === 'paid'
                    ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40'
                    : 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/40'
                }`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Support Widget print:hidden */}
          <div className="bg-brand-bg-grey dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-5 shadow-xs space-y-3 print:hidden">
            <h3 className="text-xs font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wider flex items-center gap-2">
              <HelpCircle size={15} className="text-brand-blue" /> Skincare Support
            </h3>
            <p className="text-[11px] font-medium text-brand-grey dark:text-gray-400 leading-relaxed">
              If you experience side-effects or have questions about daily integration protocols, contact our dermatological lab immediately.
            </p>
            <a 
              href="mailto:support@dermasecret.com"
              className="w-full text-center py-2 bg-white dark:bg-zinc-850 hover:bg-brand-bg-grey dark:hover:bg-zinc-800 border border-brand-border dark:border-zinc-850 text-brand-dark dark:text-gray-200 rounded font-bold font-heading text-[10px] uppercase tracking-wider transition-colors block shadow-xs"
            >
              Contact Support
            </a>
          </div>

        </div>

      </div>

      {/* Return Request Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl w-full max-w-md shadow-2xl animate-fade-up">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border dark:border-zinc-800">
              <h2 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide">
                Initiate Order Return
              </h2>
              <button 
                onClick={() => setIsReturnModalOpen(false)} 
                className="text-brand-grey dark:text-zinc-400 hover:text-brand-dark dark:hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Form */}
            <form onSubmit={handleReturnSubmit} className="p-6 space-y-4">
              {returnError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-brand-accent dark:text-red-400 text-xs font-semibold rounded-md">
                  ⚠ {returnError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-brand-grey dark:text-zinc-405 uppercase tracking-wider mb-1">Reason for Return *</label>
                <select
                  required
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border dark:border-zinc-700 bg-white dark:bg-zinc-800 text-brand-dark dark:text-white rounded text-xs focus:outline-none focus:border-brand-blue cursor-pointer"
                >
                  <option value="">Select a reason...</option>
                  <option value="Allergic Reaction">Allergic Reaction / Skin Irritation</option>
                  <option value="Damaged Product">Damaged Product on Arrival</option>
                  <option value="Incorrect Item Received">Wrong Item Received</option>
                  <option value="Quality Issue">Quality Issue / Product Expired</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-grey dark:text-zinc-405 uppercase tracking-wider mb-1">Detailed Explanation</label>
                <textarea
                  rows="4"
                  value={returnComment}
                  onChange={(e) => setReturnComment(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border dark:border-zinc-700 bg-white dark:bg-zinc-800 text-brand-dark dark:text-white rounded text-xs focus:outline-none focus:border-brand-blue"
                  placeholder="Explain why you are requesting a return. If you had an allergic reaction, please specify side effects..."
                ></textarea>
              </div>

              {/* Footer controls */}
              <div className="border-t border-brand-border dark:border-zinc-800 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-4 py-2 bg-brand-bg-grey dark:bg-zinc-800 hover:bg-brand-border dark:hover:bg-zinc-700 text-brand-dark dark:text-zinc-200 rounded text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={returnSubmitting}
                  className="px-5 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white rounded text-xs font-bold uppercase transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {returnSubmitting ? 'Submitting...' : 'Submit Return'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Product Review Modal */}
      {isReviewModalOpen && reviewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl w-full max-w-md shadow-2xl animate-fade-up">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border dark:border-zinc-800">
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide">
                  Review & Rate Product
                </h2>
                <p className="text-[10px] text-brand-grey dark:text-gray-405 font-semibold truncate max-w-[320px] mt-0.5">
                  {reviewProduct.product_name}
                </p>
              </div>
              <button 
                onClick={() => setIsReviewModalOpen(false)} 
                className="text-brand-grey dark:text-zinc-400 hover:text-brand-dark dark:hover:text-white p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Form */}
            {reviewSuccessMsg ? (
              <div className="p-8 text-center space-y-3">
                <div className="inline-flex p-3 bg-green-50 dark:bg-green-950/20 rounded-full text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/40">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-sm font-bold text-brand-dark dark:text-white uppercase tracking-tight font-heading">
                  Review Submitted!
                </h3>
                <p className="text-xs text-brand-grey dark:text-gray-405">
                  {reviewSuccessMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
                {reviewError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-brand-accent dark:text-red-400 text-xs font-semibold rounded-md">
                    ⚠ {reviewError}
                  </div>
                )}

                {/* Rating Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-brand-grey dark:text-zinc-405 uppercase tracking-wider mb-2">Overall Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= reviewRating;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star 
                            size={24} 
                            className={`${
                              active 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-zinc-350 dark:text-zinc-700'
                            }`} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold text-brand-grey dark:text-zinc-405 uppercase tracking-wider mb-1">Review Title</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-border dark:border-zinc-700 bg-white dark:bg-zinc-800 text-brand-dark dark:text-white rounded text-xs focus:outline-none focus:border-brand-blue"
                    placeholder="e.g. Highly recommend this formulation! / Good but greasy"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-[10px] font-bold text-brand-grey dark:text-zinc-405 uppercase tracking-wider mb-1">Detailed Review *</label>
                  <textarea
                    rows="4"
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-border dark:border-zinc-700 bg-white dark:bg-zinc-800 text-brand-dark dark:text-white rounded text-xs focus:outline-none focus:border-brand-blue"
                    placeholder="Describe your experience with this formulation, side-effects, texture, or results..."
                  ></textarea>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-brand-grey dark:text-zinc-405 uppercase tracking-wider mb-1">Add Photos</label>
                  
                  {/* Image List grid */}
                  {reviewPhotos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {reviewPhotos.map((url, idx) => (
                        <div key={idx} className="relative aspect-square border border-brand-border dark:border-zinc-800 rounded overflow-hidden group">
                          <img 
                            src={url} 
                            alt={`Review upload ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeReviewPhoto(idx)}
                            className="absolute top-1 right-1 p-0.5 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Trigger Button */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-brand-border dark:border-zinc-750 hover:border-brand-blue dark:hover:border-zinc-500 rounded bg-brand-bg-grey dark:bg-zinc-800 text-brand-dark dark:text-zinc-200 cursor-pointer transition-colors text-xs font-bold">
                      <Camera size={14} />
                      {reviewPhotoUploading ? 'Uploading...' : 'Choose Image'}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={reviewPhotoUploading}
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-brand-grey dark:text-zinc-500 font-semibold">
                      Max 5MB per image. WebP/JPG/PNG.
                    </span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="border-t border-brand-border dark:border-zinc-800 pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 bg-brand-bg-grey dark:bg-zinc-800 hover:bg-brand-border dark:hover:bg-zinc-700 text-brand-dark dark:text-zinc-200 rounded text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting || reviewPhotoUploading}
                    className="px-5 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white rounded text-xs font-bold uppercase transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default OrderDetail;

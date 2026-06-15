import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth, API } from './AuthContext';

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // Default to online payment: 'RAZORPAY', 'COD'

  // Status States
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null); // Will hold the completed order details

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponValidating, setCouponValidating] = useState(false);

  // Razorpay Integration States
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [razorpayOrderDetails, setRazorpayOrderDetails] = useState(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setState(user.state || '');
      setZip(user.zip || '');
    }
  }, [user]);

  // Recalculate coupon discount when cart total changes
  useEffect(() => {
    if (appliedCoupon) {
      const total = parseFloat(cartTotal);
      const minVal = parseFloat(appliedCoupon.min_cart_value || 0);

      if (total < minVal) {
        setAppliedCoupon(null);
        setCouponDiscountAmount(0);
        setCouponCode('');
        setCouponSuccess('');
        setCouponError(`Coupon ${appliedCoupon.code} removed because cart total fell below ₹${minVal.toFixed(2)}.`);
        return;
      }

      let discount = 0;
      const val = parseFloat(appliedCoupon.discountValue || appliedCoupon.discount_value || 0);
      const discountType = appliedCoupon.discountType || appliedCoupon.discount_type;

      if (discountType === 'percentage') {
        discount = (total * val) / 100;
        if (appliedCoupon.max_discount_amount) {
          const maxDisc = parseFloat(appliedCoupon.max_discount_amount);
          if (discount > maxDisc) discount = maxDisc;
        }
      } else if (discountType === 'fixed') {
        discount = val;
      }

      if (discount > total) {
        discount = total;
      }

      setCouponDiscountAmount(discount);
    }
  }, [cartTotal, appliedCoupon]);

  const handleApplyCoupon = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponValidating(true);
    setCouponError('');
    setCouponSuccess('');
    
    try {
      const res = await API.post('/coupons/validate', {
        code: couponCode.trim(),
        cartTotal: cartTotal
      });
      
      setAppliedCoupon(res.data);
      setCouponDiscountAmount(res.data.discountAmount);
      setCouponSuccess(res.data.message || 'Coupon applied successfully!');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code.');
      setAppliedCoupon(null);
      setCouponDiscountAmount(0);
    } finally {
      setCouponValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountAmount(0);
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
  };

  // Helper to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Finalize order by sending validated payment info to backend
  const finalizeOrder = async (verificationData) => {
    setSubmitting(true);
    setErrorMsg('');

    const shippingDetails = { name, email, phone, address, city, state, zip };

    try {
      const res = await API.post('/orders', {
        shippingDetails,
        cartItems,
        paymentMethod: 'RAZORPAY',
        discountAmount: couponDiscountAmount,
        paymentVerification: verificationData
      });

      setOrderSuccess(res.data);
      clearCart();
      navigate('/checkout/success');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error processing payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (cartItems.length === 0) return;

    setSubmitting(true);
    setErrorMsg('');

    // 1. Cash on Delivery (COD) Flow
    if (paymentMethod === 'COD') {
      const shippingDetails = { name, email, phone, address, city, state, zip };
      try {
        const res = await API.post('/orders', {
          shippingDetails,
          cartItems,
          paymentMethod: 'COD',
          discountAmount: couponDiscountAmount
        });

        setOrderSuccess(res.data);
        clearCart();
        navigate('/checkout/success');
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Error processing checkout. Please try again.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // 2. Razorpay Flow
    if (paymentMethod === 'RAZORPAY') {
      try {
        const netPayableTotal = Math.max(0, cartTotal - couponDiscountAmount);
        const finalTotal = netPayableTotal + (netPayableTotal >= 449 ? 0 : 50);
        const amountInPaise = Math.round(finalTotal * 100);

        // Create Razorpay Order on backend using the new generic endpoint
        const res = await API.post('/create-order', {
          amount: amountInPaise,
          currency: 'INR',
          receipt: `receipt_order_${Math.random().toString(36).substring(2, 10)}`
        });

        const orderData = res.data;
        const localKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        const simulated = !localKey || localKey.includes('your-') || localKey === '';

        setRazorpayOrderDetails({
          id: orderData.order_id,
          amount: orderData.amount,
          currency: orderData.currency,
          simulated: simulated
        });

        if (simulated) {
          // Open simulated modal
          setIsRazorpayModalOpen(true);
          setSubmitting(false);
        } else {
          if (!window.Razorpay) {
            setErrorMsg('Razorpay SDK failed to load. Please check your network connection.');
            setSubmitting(false);
            return;
          }

          const options = {
            key: localKey,
            amount: orderData.amount,
            currency: orderData.currency || 'INR',
            name: 'Derma Secret Store',
            description: 'Clinical Skincare Order Payment',
            order_id: orderData.order_id,
            handler: async function (response) {
              try {
                // Verify signature on backend using verify-payment endpoint
                const verifyRes = await API.post('/verify-payment', {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });

                if (verifyRes.data.success) {
                  const verificationData = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    simulated: false
                  };
                  await finalizeOrder(verificationData);
                } else {
                  setErrorMsg('Payment verification failed.');
                  setSubmitting(false);
                }
              } catch (verifyErr) {
                console.error('Signature verification failed:', verifyErr);
                setErrorMsg(verifyErr.response?.data?.message || 'Payment verification failed.');
                setSubmitting(false);
              }
            },
            prefill: {
              name,
              email,
              contact: phone
            },
            theme: {
              color: '#193f90'
            },
            modal: {
              ondismiss: function () {
                setSubmitting(false);
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response) {
            setErrorMsg(`Payment failed: ${response.error.description}`);
            setSubmitting(false);
          });
          rzp.open();
        }
      } catch (err) {
        console.error('Razorpay payment initiation error:', err);
        setErrorMsg(err.response?.data?.message || 'Failed to initiate Razorpay online payment.');
        setSubmitting(false);
      }
    }
  };

  const isAddressValid = () => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      phone.trim().length > 0 &&
      address.trim().length > 0 &&
      city.trim().length > 0 &&
      state.trim().length > 0 &&
      zip.trim().length > 0
    );
  };

  const isPaymentValid = () => {
    return paymentMethod === 'COD' || paymentMethod === 'RAZORPAY';
  };

  return (
    <CheckoutContext.Provider value={{
      name, setName,
      email, setEmail,
      phone, setPhone,
      address, setAddress,
      city, setCity,
      state, setState,
      zip, setZip,
      paymentMethod, setPaymentMethod,
      submitting, setSubmitting,
      errorMsg, setErrorMsg,
      orderSuccess, setOrderSuccess,
      couponCode, setCouponCode,
      couponDiscountAmount, setCouponDiscountAmount,
      appliedCoupon, setAppliedCoupon,
      couponError, setCouponError,
      couponSuccess, setCouponSuccess,
      couponValidating, setCouponValidating,
      isRazorpayModalOpen, setIsRazorpayModalOpen,
      razorpayOrderDetails,
      handleApplyCoupon,
      handleRemoveCoupon,
      handlePlaceOrder,
      finalizeOrder,
      isAddressValid,
      isPaymentValid
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);

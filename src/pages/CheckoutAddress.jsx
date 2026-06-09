import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ArrowRight } from 'lucide-react';
import { useCheckout } from '../context/CheckoutContext';

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const {
    name, setName,
    email, setEmail,
    phone, setPhone,
    address, setAddress,
    city, setCity,
    state, setState,
    zip, setZip,
    isAddressValid
  } = useCheckout();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAddressValid()) {
      navigate('/checkout/payment');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-2 flex items-center gap-2">
          <Truck size={18} className="text-brand-blue" /> Shipping Information
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
              placeholder="e.g. Amit Sharma"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
              placeholder="e.g. amit@example.com"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Contact Phone *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
              placeholder="e.g. +91 9876543210"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Street Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
              placeholder="Apartment, suite, building, street address"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">City *</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
              placeholder="e.g. Gurugram"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                placeholder="Haryana"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">ZIP/Pincode *</label>
              <input
                type="text"
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                placeholder="122001"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white rounded font-bold font-heading text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            Proceed to Payment <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutAddress;

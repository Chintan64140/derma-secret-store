import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ShieldAlert, CheckCircle2, ArrowLeft, Save, RefreshCw, Phone, MapPin, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UpdateProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setState(user.state || '');
      setZip(user.zip || '');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Name and email are required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim()
    });

    if (res.success) {
      setSuccessMsg('Profile updated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } else {
      setErrorMsg(res.message || 'Failed to update profile.');
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back to Profile */}
      <div>
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-dark uppercase tracking-wider font-heading"
        >
          <ArrowLeft size={14} /> Back to Profile
        </Link>
      </div>

      {/* Page Header */}
      <div className="border-b border-brand-border dark:border-zinc-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
          Update Profile
        </h1>
        <p className="text-xs font-semibold text-brand-grey dark:text-gray-400 uppercase tracking-wider font-heading mt-1">
          Modify contact details and shipping address formulations
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-brand-accent dark:text-red-400 text-xs font-semibold rounded-lg flex items-center gap-2">
          <ShieldAlert size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-850 pb-2 flex items-center gap-2">
          <User size={16} className="text-brand-blue" /> Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Full Name *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey dark:text-gray-400">
                <User size={14} />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                placeholder="Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Email Address *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey dark:text-gray-400">
                <Mail size={14} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                placeholder="Email Address"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Contact Phone</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey dark:text-gray-400">
                <Phone size={14} />
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                placeholder="Phone Number"
              />
            </div>
          </div>
        </div>

        <h2 className="text-sm font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-850 pb-2 flex items-center gap-2 pt-2">
          <MapPin size={16} className="text-brand-blue" /> Default Shipping Address
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
              placeholder="Apartment, suite, building, street address"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
              placeholder="City"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">ZIP / Pincode</label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                placeholder="ZIP Code"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-brand-border dark:border-zinc-800 pt-6 flex justify-end gap-3">
          <Link
            to="/profile"
            className="px-5 py-2.5 bg-white dark:bg-zinc-850 border border-brand-border dark:border-zinc-800 text-brand-dark dark:text-gray-300 hover:bg-brand-bg-grey dark:hover:bg-zinc-800 rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            {loading ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />} Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;

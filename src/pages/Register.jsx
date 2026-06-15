import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirect = new URLSearchParams(location.search).get('redirect') || 'profile';
      navigate(redirect.startsWith('/') ? redirect : `/${redirect}`);
    }
  }, [user, navigate, location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await register(name, email, password);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20 space-y-8">
      <SEO 
        title="Register New Account"
        description="Register a new customer account on Derma Secret to begin saving, ordering clinical formulations, and tracking shipment logs."
        keywords="register, create account, customer signup"
      />
      {/* Visual Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-brand-blue-light dark:bg-brand-blue/10 text-brand-blue rounded-full mb-2">
          <UserPlus size={32} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
          Create An Account
        </h1>
        <p className="text-xs font-semibold text-brand-grey dark:text-gray-400 uppercase tracking-wider font-heading">
          Join us for clinical skincare solutions
        </p>
      </div>

      {/* Registration Card Panel */}
      <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-md space-y-6 transition-all duration-300">
        
        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-brand-accent dark:text-red-400 text-xs font-semibold rounded-md flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Full Name *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey dark:text-gray-400">
                <User size={16} />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-brand-border dark:border-zinc-850 dark:bg-zinc-800 text-brand-dark dark:text-white rounded-md text-xs focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                placeholder="Amit Sharma"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Email Address *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey dark:text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-brand-border dark:border-zinc-850 dark:bg-zinc-800 text-brand-dark dark:text-white rounded-md text-xs focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                placeholder="amit@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Password *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey dark:text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-brand-border dark:border-zinc-850 dark:bg-zinc-800 text-brand-dark dark:text-white rounded-md text-xs focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                placeholder="Minimum 6 characters"
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-grey hover:text-brand-dark dark:text-gray-400"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>



          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus size={15} /> {loading ? 'Registering account...' : 'Create Account'}
          </button>
        </form>

        <div className="border-t border-brand-border dark:border-zinc-800 pt-4 text-center">
          <p className="text-xs text-brand-grey dark:text-gray-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-blue dark:text-brand-blue font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

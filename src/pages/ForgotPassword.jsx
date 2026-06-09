import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { API } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await API.post('/auth/forgot-password', { email });
      setSuccessMsg(res.data.message || 'If that email is registered, a password reset link has been sent.');
      setEmail('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send reset email. Please verify your email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      {/* Visual Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-brand-blue-light dark:bg-brand-blue/10 text-brand-blue dark:text-brand-blue rounded-full mb-2">
          <Mail size={32} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
          Forgot Password
        </h1>
        <p className="text-xs font-semibold text-brand-grey dark:text-gray-400 uppercase tracking-wider font-heading">
          Reset your credentials to access your account
        </p>
      </div>

      {/* Forgot Password Card Panel */}
      <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-md space-y-6 transition-all duration-300">
        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-brand-accent dark:text-red-400 text-xs font-semibold rounded-md flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 text-xs font-semibold rounded-md flex items-start gap-2.5">
              <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5 text-green-600 dark:text-green-500" />
              <div>
                <p className="font-bold mb-1">Check your inbox</p>
                <p className="font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                  {successMsg}
                </p>
              </div>
            </div>
            
            <Link
              to="/login"
              className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs text-brand-grey dark:text-gray-400 leading-relaxed">
              Enter the email address associated with your account and we'll send you a secure link to reset your password.
            </p>

            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">
                Email Address *
              </label>
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-brand-grey dark:text-gray-400 font-bold hover:text-brand-blue hover:underline">
                <ArrowLeft size={13} /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

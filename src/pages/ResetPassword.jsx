import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { API } from '../context/AuthContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  // Form States
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setErrorMsg('No reset token provided. Please request a new password reset link.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await API.post('/auth/reset-password', { token, password });
      setSuccessMsg(res.data.message || 'Your password has been reset successfully!');
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Token is invalid or has expired. Please request a new link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      {/* Visual Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-brand-blue-light dark:bg-brand-blue/10 text-brand-blue dark:text-brand-blue rounded-full mb-2">
          <Lock size={32} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
          Reset Password
        </h1>
        <p className="text-xs font-semibold text-brand-grey dark:text-gray-400 uppercase tracking-wider font-heading">
          Enter your new password below
        </p>
      </div>

      {/* Card Panel */}
      <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-md space-y-6 transition-all duration-300">
        {!token && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-brand-accent dark:text-red-400 text-xs font-semibold rounded-md flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>Missing password reset token in the URL. Please verify your link or request a new one.</span>
          </div>
        )}

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
                <p className="font-bold mb-1">Success!</p>
                <p className="font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                  {successMsg} Redirecting to the Login page in a few seconds...
                </p>
              </div>
            </div>
            <Link
              to="/login"
              className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">
                New Password *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey dark:text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={!token}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-brand-border dark:border-zinc-850 dark:bg-zinc-800 text-brand-dark dark:text-white rounded-md text-xs focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue disabled:opacity-50"
                  placeholder="••••••••"
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

            {/* Confirm New Password */}
            <div>
              <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey dark:text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  disabled={!token}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-brand-border dark:border-zinc-850 dark:bg-zinc-800 text-brand-dark dark:text-white rounded-md text-xs focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-grey hover:text-brand-dark dark:text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? 'Resetting password...' : 'Update Password'}
            </button>
          </form>
        )}

        {!successMsg && (
          <div className="border-t border-brand-border dark:border-zinc-800 pt-4 text-center">
            <Link to="/login" className="text-xs text-brand-blue dark:text-brand-blue font-bold hover:underline">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

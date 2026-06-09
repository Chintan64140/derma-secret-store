import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, ArrowLeft, RefreshCw, KeyRound, Eye, EyeOff, Save } from 'lucide-react';
import { useAuth, API } from '../context/AuthContext';

const ChangePassword = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Change Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    setPwLoading(true);
    setPwError('');
    setPwSuccess('');

    try {
      const res = await API.post('/auth/update-password', {
        currentPassword,
        newPassword
      });
      setPwSuccess(res.data.message || 'Password updated successfully! Redirecting...');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
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
          Change Password
        </h1>
        <p className="text-xs font-semibold text-brand-grey dark:text-gray-400 uppercase tracking-wider font-heading mt-1">
          Maintain your account access security configuration
        </p>
      </div>

      {pwError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-brand-accent dark:text-red-400 text-xs font-semibold rounded-lg flex items-center gap-2">
          <ShieldAlert size={16} />
          <span>{pwError}</span>
        </div>
      )}

      {pwSuccess && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-600" />
          <span>{pwSuccess}</span>
        </div>
      )}

      <form onSubmit={handlePasswordUpdate} className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm text-left">
        <h2 className="text-sm font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-850 pb-2 flex items-center gap-2">
          <KeyRound size={16} className="text-brand-blue" /> Access Credentials
        </h2>

        <div>
          <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Current Password *</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-grey hover:text-brand-dark dark:text-gray-400"
            >
              {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">New Password *</label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-grey hover:text-brand-dark dark:text-gray-400"
            >
              {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Confirm New Password *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-grey hover:text-brand-dark dark:text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
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
            disabled={pwLoading}
            className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            {pwLoading ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />} Save Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;

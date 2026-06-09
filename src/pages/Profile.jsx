import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Package, Calendar, Tag, ShieldAlert, RefreshCw, KeyRound, CheckCircle2, Phone, MapPin, Mail, Edit, ChevronRight, ArrowRight } from 'lucide-react';
import { useAuth, API } from '../context/AuthContext';
import SEO from '../components/SEO';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch user orders on mount
  useEffect(() => {
    if (user) {
      setLoading(true);
      API.get('/orders/myorders')
        .then(res => {
          setOrders(res.data);
        })
        .catch(err => {
          console.error('Fetch user orders failed:', err.message);
          setErrorMsg('Failed to load order history. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40';
      case 'shipped':
        return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40';
      case 'cancelled':
        return 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40';
      default:
        return 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/40';
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEO 
        title="Customer Profile & Dashboard"
        description="Access your account details, order history, shipping addresses, and security configurations in your Derma Secret dashboard."
        keywords="customer profile, order history, derma secret dashboard"
      />
      {/* 1. Account Header Banner */}
      <div className="bg-brand-blue-dark dark:bg-zinc-900 text-white border dark:border-zinc-800 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-md relative overflow-hidden transition-all duration-300">
        {/* Background circle decoration */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
            <User size={32} className="text-brand-yellow" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-heading uppercase">{user.name}</h1>
            <p className="text-xs text-gray-300 font-medium">{user.email} • {user.role === 'admin' ? 'Administrator' : 'Customer Account'}</p>
          </div>
        </div>

        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-brand-accent hover:text-white border border-white/20 rounded font-bold font-heading text-xs uppercase tracking-wider transition-all relative z-10 cursor-pointer"
        >
          <LogOut size={14} /> Log Out
        </button>
      </div>

      {/* 2. Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Settings */}
        <div className="space-y-6 self-start">
          {/* Profile Details Card */}
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-xs transition-colors duration-300">
            <div className="flex justify-between items-center border-b border-brand-border dark:border-zinc-800 pb-2">
              <h2 className="text-sm font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide flex items-center gap-2">
                <User size={16} className="text-brand-blue" /> Profile Details
              </h2>
              <Link
                to="/profile/edit"
                className="text-xs text-brand-blue hover:text-brand-blue-dark font-bold font-heading uppercase flex items-center gap-1 cursor-pointer"
              >
                <Edit size={12} /> Edit Details
              </Link>
            </div>

            <div className="space-y-4 text-xs font-semibold text-brand-dark dark:text-gray-200">
              <div className="flex items-start gap-2.5">
                <User size={15} className="text-brand-grey dark:text-gray-450 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] text-brand-grey dark:text-gray-405 uppercase tracking-wider">Full Name</span>
                  <span className="text-sm font-bold block">{user.name}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail size={15} className="text-brand-grey dark:text-gray-450 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] text-brand-grey dark:text-gray-405 uppercase tracking-wider">Email Address</span>
                  <span className="block truncate">{user.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone size={15} className="text-brand-grey dark:text-gray-450 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] text-brand-grey dark:text-gray-405 uppercase tracking-wider">Phone Number</span>
                  <span className="block">{user.phone || <span className="text-brand-grey dark:text-gray-500 font-normal italic">No phone added</span>}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-brand-grey dark:text-gray-450 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] text-brand-grey dark:text-gray-405 uppercase tracking-wider">Shipping Address</span>
                  {user.address ? (
                    <div className="text-brand-dark dark:text-gray-250 font-medium leading-relaxed">
                      <p>{user.address}</p>
                      <p>{user.city}, {user.state} - {user.zip}</p>
                    </div>
                  ) : (
                    <span className="text-brand-grey dark:text-gray-500 font-normal italic">No address added</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security & Access Settings Card */}
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-xs transition-colors duration-300">
            <h2 className="text-sm font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide border-b border-brand-border dark:border-zinc-800 pb-2 flex items-center gap-2">
              <KeyRound size={16} className="text-brand-blue" /> Security Settings
            </h2>
            <div className="space-y-4 text-xs font-semibold text-brand-dark dark:text-gray-200">
              <p className="text-[11px] font-medium text-brand-grey dark:text-gray-400 leading-relaxed">
                Manage your credentials to ensure your account security configurations are maintained.
              </p>
              <Link
                to="/profile/change-password"
                className="w-full py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <KeyRound size={14} /> Change Password
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section: Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-brand-border dark:border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide flex items-center gap-2">
              <Package size={18} className="text-brand-blue" /> Recent Orders
            </h2>
            {orders.length > 0 && (
              <Link
                to="/orders"
                className="text-xs text-brand-blue hover:text-brand-blue-dark font-bold font-heading uppercase flex items-center gap-1 transition-colors cursor-pointer"
              >
                View All ({orders.length}) <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3 animate-pulse">
              <RefreshCw className="animate-spin text-brand-blue" size={24} />
              <p className="text-xs text-brand-grey dark:text-gray-400">Retrieving order database...</p>
            </div>
          ) : errorMsg ? (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-brand-accent dark:text-red-400 text-xs font-semibold rounded-lg flex items-center gap-2">
              <ShieldAlert size={16} />
              <span>{errorMsg}</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center p-12 bg-brand-bg-grey dark:bg-zinc-900/50 border border-brand-border dark:border-zinc-800 border-dashed rounded-lg space-y-4 transition-colors duration-300">
              <Package size={36} className="text-brand-grey dark:text-gray-500 mx-auto" />
              <p className="text-xs text-brand-grey dark:text-gray-400 font-medium">You haven't placed any orders yet.</p>
              <Link
                to="/shop"
                className="inline-block px-5 py-2 bg-brand-blue text-white rounded font-bold font-heading text-xs uppercase tracking-wider hover:bg-brand-blue-dark transition-all"
              >
                Browse Formulations
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div 
                  key={order.id} 
                  className="border border-brand-border dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-4 shadow-xs hover:border-brand-blue dark:hover:border-zinc-700 hover:shadow-xs transition-all duration-305 flex justify-between items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-brand-dark dark:text-white font-heading uppercase">
                        Order #DS-{order.id}
                      </span>
                      <span className={`px-2 py-0.5 text-[8px] uppercase font-extrabold rounded-full border ${getStatusColor(order.shipping_status)}`}>
                        {order.shipping_status || 'Pending'}
                      </span>
                    </div>
                    <div className="text-[10px] text-brand-grey dark:text-gray-450 font-medium flex items-center gap-1">
                      <Calendar size={10} />
                      <span>
                        {new Date(order.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="mx-1">•</span>
                      <span>{order.items?.length || 0} items</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block text-[8px] text-brand-grey dark:text-gray-400 uppercase tracking-wider font-bold">Total</span>
                      <span className="text-xs font-black text-brand-blue dark:text-brand-blue-light block">₹{parseFloat(order.net_price)}</span>
                    </div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="p-1.5 border border-brand-border dark:border-zinc-800 hover:bg-brand-blue hover:text-white rounded-lg transition-all dark:text-gray-300 dark:hover:bg-zinc-800"
                      title="Track Order"
                    >
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
              
              {orders.length > 3 && (
                <Link
                  to="/orders"
                  className="block text-center py-2.5 bg-brand-bg-grey dark:bg-zinc-850 hover:bg-brand-blue-light hover:text-brand-blue dark:hover:bg-zinc-800 border border-brand-border dark:border-zinc-850 rounded text-xs font-bold font-heading uppercase tracking-wider transition-colors dark:text-gray-200"
                >
                  See all {orders.length} orders
                </Link>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;

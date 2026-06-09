import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  Tag, 
  Search, 
  Filter, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle, 
  ShoppingBag, 
  ChevronRight, 
  CreditCard,
  Truck
} from 'lucide-react';
import { useAuth, API } from '../context/AuthContext';
import SEO from '../components/SEO';

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'shipped', 'delivered', 'cancelled'

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=orders');
    }
  }, [user, authLoading, navigate]);

  // Fetch user orders on mount
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = () => {
    setLoading(true);
    setErrorMsg('');
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

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchQuery) ||
      order.items?.some(item => item.product_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.shipping_name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      order.shipping_status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate order stats
  const totalSpent = orders
    .filter(o => o.shipping_status?.toLowerCase() !== 'cancelled')
    .reduce((sum, o) => sum + parseFloat(o.net_price), 0);

  const activeDeliveries = orders.filter(o => 
    ['pending', 'shipped'].includes(o.shipping_status?.toLowerCase())
  ).length;

  if (authLoading || (!user && loading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <RefreshCw className="animate-spin text-brand-blue" size={32} />
        <p className="text-sm text-brand-grey dark:text-gray-400 font-heading uppercase tracking-wider">Authenticating session...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <SEO 
        title="My Orders Portfolio"
        description="Monitor and track the delivery statuses of your Derma Secret clinical-grade formulations."
        keywords="order portfolio, order tracking, skin prescription tracking"
      />
      {/* Page Header */}
      <div className="border-b border-brand-border dark:border-zinc-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-brand-blue dark:text-brand-blue-light uppercase tracking-widest font-heading">Patient Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading mt-1">
            Order Portfolio
          </h1>
          <p className="text-xs font-semibold text-brand-grey dark:text-gray-400 uppercase tracking-wider font-heading mt-0.5">
            Track and manage your diagnostic skincare formulations
          </p>
        </div>
        
        {/* Quick Stats Panel */}
        <div className="grid grid-cols-3 gap-3 md:w-auto w-full">
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg p-3 text-center min-w-[90px] shadow-xs">
            <span className="block text-[8px] sm:text-[9px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider">Total Orders</span>
            <span className="block text-sm sm:text-base font-black text-brand-blue dark:text-brand-blue-light mt-0.5">{orders.length}</span>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg p-3 text-center min-w-[90px] shadow-xs">
            <span className="block text-[8px] sm:text-[9px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider">Active Transit</span>
            <span className="block text-sm sm:text-base font-black text-brand-yellow mt-0.5">{activeDeliveries}</span>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg p-3 text-center min-w-[90px] shadow-xs">
            <span className="block text-[8px] sm:text-[9px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider">Total Invested</span>
            <span className="block text-sm sm:text-base font-black text-brand-accent mt-0.5">₹{totalSpent.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-brand-bg-grey dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by Order ID, product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-brand-border dark:border-zinc-850 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey dark:text-gray-450" size={14} />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
          {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded text-[10px] font-extrabold uppercase tracking-wider border font-heading transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-brand-blue text-white border-brand-blue dark:bg-brand-blue dark:border-brand-blue shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-brand-dark dark:text-gray-300 border-brand-border dark:border-zinc-800 hover:bg-brand-bg-grey dark:hover:bg-zinc-850'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="space-y-4">
          {/* Skeleton Loaders */}
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-5 space-y-4 animate-pulse">
              <div className="flex justify-between border-b border-brand-border/40 dark:border-zinc-800/40 pb-3">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
              </div>
              <div className="flex justify-between pt-2">
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-20"></div>
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : errorMsg ? (
        <div className="p-5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-brand-accent dark:text-red-400 text-xs font-semibold rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <div className="flex-1">
            <p className="font-bold">Database Error</p>
            <p className="font-medium mt-0.5">{errorMsg}</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="px-3 py-1 bg-brand-accent hover:bg-brand-accent/90 text-white rounded text-[10px] uppercase font-bold tracking-wider transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl space-y-5 shadow-xs">
          <div className="inline-flex p-4 bg-brand-blue-light dark:bg-brand-blue/10 rounded-full text-brand-blue border border-brand-blue-light/50">
            <ShoppingBag size={40} className="stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-brand-dark dark:text-white font-heading uppercase tracking-wide">
              No Formulations Found
            </h3>
            <p className="text-xs text-brand-grey dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
              {orders.length === 0 
                ? "You haven't initiated any clinical order transactions yet." 
                : "No orders match your active search filters."}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Browse Formulations <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="border border-brand-border dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs hover:border-brand-blue dark:hover:border-zinc-700 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between p-5 gap-5"
            >
              {/* Left Segment: ID, Date, and Items */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xs sm:text-sm font-black text-brand-dark dark:text-white font-heading uppercase">
                    Order <span className="text-brand-blue dark:text-brand-blue-light">#DS-{order.id}</span>
                  </h3>
                  
                  {/* Shipping status badge */}
                  <span className={`px-2.5 py-0.5 text-[9px] uppercase font-extrabold rounded-full border tracking-wider ${getStatusColor(order.shipping_status)}`}>
                    {order.shipping_status || 'Pending'}
                  </span>

                  {/* Payment status badge */}
                  <span className={`px-2 py-0.5 text-[8px] uppercase font-bold rounded border tracking-wider ${
                    order.payment_status?.toLowerCase() === 'paid'
                      ? 'bg-green-500/10 text-green-600 border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                  }`}>
                    {order.payment_method === 'COD' ? 'COD' : 'Card'} • {order.payment_status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-brand-grey dark:text-gray-400 font-semibold">
                  <Calendar size={12} />
                  <span>
                    Ordered on {new Date(order.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* Items Summary list */}
                <div className="space-y-1.5 pt-1">
                  <span className="block text-[9px] font-bold text-brand-grey dark:text-gray-450 uppercase tracking-widest">Formulations Dispatching:</span>
                  <div className="flex flex-wrap gap-2">
                    {order.items?.map((item, index) => (
                      <span 
                        key={item.id || index}
                        className="inline-flex items-center gap-1.5 bg-brand-bg-grey dark:bg-zinc-850 px-2.5 py-1 rounded-md text-[10px] font-bold text-brand-dark dark:text-gray-300 border border-brand-border dark:border-zinc-800"
                      >
                        <Package size={10} className="text-brand-blue" />
                        <span>{item.product_name}</span>
                        <span className="text-brand-grey dark:text-gray-450 font-medium">x{item.quantity}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Segment: Price and Action Button */}
              <div className="flex md:flex-col justify-between items-center md:items-end border-t md:border-t-0 border-brand-border/60 dark:border-zinc-800/80 pt-4 md:pt-0 gap-3">
                <div className="text-left md:text-right">
                  <span className="block text-[9px] text-brand-grey dark:text-gray-400 uppercase tracking-wider font-bold">Total Amount Charged</span>
                  <span className="text-lg font-black text-brand-blue dark:text-brand-blue-light block">₹{parseFloat(order.net_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-[10px] uppercase tracking-wider transition-colors shadow-xs"
                >
                  Track Dispatch <ChevronRight size={12} />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

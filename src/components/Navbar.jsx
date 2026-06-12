import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, LogOut, ChevronDown, Menu, X, Settings, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import { API } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [concerns, setConcerns] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll event listener to apply premium sticky styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location]);

  // Fetch categories and concerns for dropdown menus
  useEffect(() => {
    API.get('/products/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Navbar categories load failed:', err.message));
      
    API.get('/products/concerns')
      .then(res => setConcerns(res.data))
      .catch(err => console.error('Navbar concerns load failed:', err.message));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const showBanner = 
    location.pathname === '/' || 
    location.pathname === '/shop' || 
    location.pathname.startsWith('/category/') || 
    location.pathname === '/categories';

  return (
    <>
      {/* Top Banner should show only in home page , product list page , categiry page */}
      {showBanner && (
        <div className="bg-brand-blue-dark text-white text-center py-2 text-xs font-semibold tracking-wider font-heading uppercase">
          ⚡ Order above ₹449 & Get Free Shipping + 15% OFF ⚡
        </div>
      )}

      {/* Main Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md border-b border-brand-border/85 dark:bg-[#1a1a1a] dark:shadow-black/25 dark:border-zinc-800/85' 
          : 'bg-white/95 backdrop-blur-md border-b border-brand-border dark:bg-[#121212]/95 dark:border-zinc-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 gap-4 ${
            isScrolled ? 'h-16' : 'h-20'
          }`}>
            
            {/* Mobile menu toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden text-brand-dark hover:text-brand-blue focus:outline-none transition-colors p-1 dark:text-zinc-200 dark:hover:text-brand-blue"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/assets/Logo.png" 
                alt="Derma Secret Logo" 
                className={`w-auto transition-all duration-300 hover:scale-105 dark:hidden ${isScrolled ? 'h-8 sm:h-9' : 'h-10 sm:h-12'}`}
              />
              <img 
                src="/assets/Logo-Light.png" 
                alt="Derma Secret Logo" 
                className={`w-auto transition-all duration-300 hover:scale-105 hidden dark:block ${isScrolled ? 'h-8 sm:h-9' : 'h-10 sm:h-12'}`}
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-3 xl:space-x-6">
              {/* Shop By Category */}
              <div className="relative group py-2">
                <button className="flex items-center text-xs xl:text-sm font-semibold tracking-wide text-brand-dark hover:text-brand-blue transition-colors uppercase font-heading dark:text-zinc-200 dark:hover:text-brand-blue">
                  Shop Categories <ChevronDown size={14} className="ml-1 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out bg-white border border-brand-border rounded-md shadow-xl py-2 w-56 z-50 dark:bg-[#1a1a1a] dark:border-zinc-800 dark:shadow-black/40">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="block px-4 py-2 text-sm text-brand-dark hover:bg-brand-blue-light hover:text-brand-blue transition-colors font-medium dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-brand-border my-1 dark:border-zinc-800"></div>
                  <Link to="/categories" className="block px-4 py-2 text-sm text-brand-blue font-semibold hover:bg-brand-blue-light transition-colors dark:text-brand-blue-light dark:hover:bg-zinc-800">
                    Categories Hub
                  </Link>
                  <Link to="/shop" className="block px-4 py-2 text-sm text-brand-blue font-semibold hover:bg-brand-blue-light transition-colors dark:text-brand-blue-light dark:hover:bg-zinc-800">
                    View All Products
                  </Link>
                </div>
              </div>

              {/* Shop By Concern */}
              <div className="relative group py-2">
                <button className="flex items-center text-xs xl:text-sm font-semibold tracking-wide text-brand-dark hover:text-brand-blue transition-colors uppercase font-heading dark:text-zinc-200 dark:hover:text-brand-blue">
                  Shop Concerns <ChevronDown size={14} className="ml-1 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out bg-white border border-brand-border rounded-md shadow-xl py-2 w-56 z-50 dark:bg-[#1a1a1a] dark:border-zinc-800 dark:shadow-black/40">
                  {concerns.map((con) => (
                    <Link
                      key={con.id}
                      to={`/shop?concern=${con.slug}`}
                      className="block px-4 py-2 text-sm text-brand-dark hover:bg-brand-blue-light hover:text-brand-blue transition-colors font-medium dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
                    >
                      {con.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Best Sellers */}
              <Link 
                to="/shop?filter=best-sellers" 
                className="text-xs xl:text-sm font-semibold tracking-wide text-brand-dark hover:text-brand-blue transition-colors uppercase font-heading dark:text-zinc-200 dark:hover:text-brand-blue"
              >
                Best Sellers
              </Link>

              {/* About Us */}
              <Link 
                to="/about" 
                className="text-xs xl:text-sm font-semibold tracking-wide text-brand-dark hover:text-brand-blue transition-colors uppercase font-heading dark:text-zinc-200 dark:hover:text-brand-blue"
              >
                About Science
              </Link>

              {/* Contact Us */}
              <Link 
                to="/contact" 
                className="text-xs xl:text-sm font-semibold tracking-wide text-brand-dark hover:text-brand-blue transition-colors uppercase font-heading dark:text-zinc-200 dark:hover:text-brand-blue"
              >
                Consultation Hub
              </Link>
            </nav>

            {/* Search, Account, Cart controls */}
            <div className="flex items-center justify-end flex-1 sm:flex-initial gap-2.5 sm:gap-3.5">
              
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-36 lg:w-44 xl:w-56 focus-within:w-48 lg:focus-within:w-60 xl:focus-within:w-72 transition-all duration-300">
                <input
                  type="text"
                  placeholder="Search solutions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-1.5 border border-brand-border rounded-full text-xs bg-brand-bg-grey focus:outline-none focus:border-brand-blue focus:bg-white transition-all duration-300 font-medium dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:bg-zinc-900"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-grey hover:text-brand-blue transition-colors dark:text-zinc-400 dark:hover:text-brand-blue">
                  <Search size={16} />
                </button>
              </form>

              {/* Search Icon (mobile only) */}
              <button 
                onClick={() => navigate('/shop')} 
                className="md:hidden p-1.5 rounded-full hover:bg-brand-bg-grey text-brand-dark hover:text-brand-blue transition-colors dark:hover:bg-zinc-800 dark:text-zinc-200 dark:hover:text-brand-blue"
              >
                <Search size={20} />
              </button>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-full hover:bg-brand-bg-grey text-brand-dark hover:text-brand-blue transition-colors focus:outline-none dark:hover:bg-zinc-800 dark:text-zinc-200 dark:hover:text-brand-blue"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center gap-1 p-1.5 rounded-full hover:bg-brand-bg-grey text-brand-dark hover:text-brand-blue transition-colors focus:outline-none dark:hover:bg-zinc-800 dark:text-zinc-200 dark:hover:text-brand-blue"
                    >
                      <User size={20} />
                      <span className="hidden sm:inline text-sm font-semibold text-brand-dark dark:text-zinc-200">{user.name.split(' ')[0]}</span>
                    </button>
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 bg-white border border-brand-border rounded-md shadow-xl py-2 w-48 z-50 animate-fade-up dark:bg-[#1a1a1a] dark:border-zinc-800 dark:shadow-black/40">
                        <div className="px-4 py-2 border-b border-brand-border dark:border-zinc-800">
                          <p className="text-xs text-brand-grey dark:text-zinc-400">Logged in as</p>
                          <p className="text-sm font-bold text-brand-dark truncate dark:text-zinc-200">{user.email}</p>
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-brand-dark hover:bg-brand-blue-light hover:text-brand-blue transition-colors font-medium dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
                        >
                          <User size={16} /> My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-brand-dark hover:bg-brand-blue-light hover:text-brand-blue transition-colors font-medium dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
                        >
                          <ShoppingBag size={16} className="text-brand-blue dark:text-brand-blue-light" /> My Orders
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-brand-accent hover:bg-red-50 transition-colors font-medium dark:hover:bg-red-950/30"
                        >
                          <LogOut size={16} /> Log Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 text-sm font-semibold text-brand-dark hover:text-brand-blue transition-colors dark:text-zinc-200 dark:hover:text-brand-blue"
                  >
                    <User size={20} />
                    <span className="hidden sm:inline uppercase tracking-wide font-heading dark:text-zinc-200">Login</span>
                  </Link>
                )}
              </div>

              {/* Shopping Cart Bag */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full bg-brand-blue text-white shadow-md hover:bg-brand-blue-dark transition-all transform hover:scale-105 focus:outline-none dark:bg-brand-blue dark:hover:bg-brand-blue-dark"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-accent text-white text-[10px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#121212] animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-brand-border bg-white px-4 pt-4 pb-6 space-y-4 shadow-inner dark:bg-[#1a1a1a] dark:border-zinc-800">
            <div className="space-y-1">
              <p className="px-2 text-xs font-bold text-brand-grey uppercase tracking-wider font-heading dark:text-zinc-400">Shop Categories</p>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="block px-3 py-2 text-sm text-brand-dark hover:bg-brand-blue-light hover:text-brand-blue rounded-md font-medium dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-brand-blue"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-brand-border my-2 dark:border-zinc-800"></div>
            <div className="space-y-1">
              <p className="px-2 text-xs font-bold text-brand-grey uppercase tracking-wider font-heading dark:text-zinc-400">Shop Concerns</p>
              {concerns.map((con) => (
                <Link
                  key={con.id}
                  to={`/shop?concern=${con.slug}`}
                  className="block px-3 py-2 text-sm text-brand-dark hover:bg-brand-blue-light hover:text-brand-blue rounded-md font-medium dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-brand-blue"
                >
                  {con.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-brand-border my-2 dark:border-zinc-800"></div>
            <div className="flex flex-col gap-2">
              <Link
                to="/shop?filter=best-sellers"
                className="block px-3 py-2 text-sm font-bold text-brand-dark hover:text-brand-blue dark:text-zinc-200 dark:hover:text-brand-blue"
              >
                Best Sellers
              </Link>
              <Link
                to="/categories"
                className="block px-3 py-2 text-sm font-bold text-brand-blue dark:text-brand-blue-light"
              >
                Categories Index
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-sm font-bold text-brand-dark hover:text-brand-blue dark:text-zinc-200 dark:hover:text-brand-blue"
              >
                About Science
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-sm font-bold text-brand-dark hover:text-brand-blue dark:text-zinc-200 dark:hover:text-brand-blue"
              >
                Consultation Hub
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Slider Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;

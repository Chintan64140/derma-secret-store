import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, HeartPulse } from 'lucide-react';
import { API } from '../context/AuthContext';

const defaultCategories = [
  { id: 1, name: 'Sun Protection', slug: 'sun-protection' },
  { id: 2, name: 'Acne & Acne Scars', slug: 'acne-care' },
  { id: 3, name: 'Face Care', slug: 'face-care' },
  { id: 4, name: 'Body Care', slug: 'body-care' },
  { id: 5, name: 'Hair & Scalp Care', slug: 'hair-care' },
  { id: 6, name: 'Mommy & Baby', slug: 'mommy-care' }
];

const defaultConcerns = [
  { id: 1, name: 'Acne Breakouts', slug: 'acne-breakouts' },
  { id: 2, name: 'Pigmentation & Dark Spots', slug: 'hyperpigmentation' },
  { id: 3, name: 'Tan & Sun Damage', slug: 'sun-damage' },
  { id: 4, name: 'Dry, Damaged Skin', slug: 'dryness-dehydration' },
  { id: 5, name: 'Wrinkles & Fine Lines', slug: 'anti-aging' },
  { id: 6, name: 'Hair Thinning & Dandruff', slug: 'hair-fall' }
];

const Footer = () => {
  const [categories, setCategories] = useState(defaultCategories);
  const [concerns, setConcerns] = useState(defaultConcerns);

  useEffect(() => {
    API.get('/products/categories')
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch(err => console.error('Footer categories load failed:', err.message));

    API.get('/products/concerns')
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setConcerns(res.data);
        }
      })
      .catch(err => console.error('Footer concerns load failed:', err.message));
  }, []);
  return (
    <footer className="bg-brand-blue-dark dark:bg-zinc-950 text-white border-t border-brand-border dark:border-zinc-900 transition-colors duration-300">
      {/* Upper Feature Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-white/10 dark:border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <ShieldCheck size={28} className="text-brand-yellow flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm font-heading">Dermatologist Formulated</h4>
              <p className="text-xs text-gray-300">Clinically proven formulations</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <HeartPulse size={28} className="text-brand-yellow flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm font-heading">Science-Backed Results</h4>
              <p className="text-xs text-gray-300">Active ingredients at active levels</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Phone size={28} className="text-brand-yellow flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm font-heading">Expert Guidance</h4>
              <p className="text-xs text-gray-300">Free tele-consultation: +91 7990952840</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Mail size={28} className="text-brand-yellow flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm font-heading">Secure Payments</h4>
              <p className="text-xs text-gray-300">100% safe & encrypted payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <img 
              src="/assets/Logo-Light.png" 
              alt="Derma Secret Logo" 
              className="h-10 w-auto bg-white/10 p-1.5 rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              Derma Secret is a leading dermatology-based skincare brand that manufactures high-quality clinical formulations. Our mission is to provide effective, scientifically backed solutions for all dermatological conditions.
            </p>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-brand-yellow" />
                <span>+91 7990952840</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-brand-yellow" />
                <span>support@dermasecret.shop</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-brand-yellow" />
                <span>F-3 Liberty nine , Mota Varachha , Surat - 394101</span>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="font-bold text-sm font-heading text-brand-yellow uppercase tracking-wider mb-4">Shop Categories</h3>
            <ul className="space-y-2 text-xs text-gray-300 font-medium">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="hover:text-brand-yellow transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Concerns */}
          <div>
            <h3 className="font-bold text-sm font-heading text-brand-yellow uppercase tracking-wider mb-4">Shop By Concern</h3>
            <ul className="space-y-2 text-xs text-gray-300 font-medium">
              {concerns.slice(0, 6).map((con) => (
                <li key={con.id}>
                  <Link to={`/shop?concern=${con.slug}`} className="hover:text-brand-yellow transition-colors">
                    {con.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links / Admin Access */}
          <div>
            <h3 className="font-bold text-sm font-heading text-brand-yellow uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-xs text-gray-300 font-medium">
              <li><Link to="/shop" className="hover:text-brand-yellow transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="hover:text-brand-yellow transition-colors">Categories Hub</Link></li>
              <li><Link to="/about" className="hover:text-brand-yellow transition-colors">About Science</Link></li>
              <li><Link to="/contact" className="hover:text-brand-yellow transition-colors">Consultation Hub</Link></li>
              <li><Link to="/profile" className="hover:text-brand-yellow transition-colors">My Account</Link></li>
              <li><Link to="/login" className="hover:text-brand-yellow transition-colors">Login / Register</Link></li>

            </ul>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer & Copyright */}
      <div className="bg-black/30 border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-[10px] text-gray-400 max-w-4xl mx-auto leading-relaxed">
            <strong>Disclaimer:</strong> Derma Secret clinical formulations are dermatologically created. The product details provided are for informational purposes and not a substitute for professional medical advice, diagnosis, or treatment. Consult a licensed dermatologist for any persistent skin or hair conditions.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-400 gap-2 border-t border-white/5 pt-4">
            <p>© {new Date().getFullYear()} Derma Secret Skincare. All rights reserved. Created for demonstration purposes.</p>
            <div className="flex gap-4">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-services" className="hover:text-white transition-colors">Terms of Use</Link>
              <Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link>
              <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartPulse, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { API } from '../context/AuthContext';
import SEO from '../components/SEO';
import { getImageUrl } from '../utils/image';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const catRes = await API.get('/products/categories');
        setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load categories catalog:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 dark:bg-[#121212] transition-colors duration-300">
      <SEO 
        title="Dermatology Categories & Formulations"
        description="Browse our skincare range categorized by clinical formulation types (sunscreens, acne cleansers, body care, and hair care)."
        keywords="skincare categories, dermatologist list, broad-spectrum sunscreen, anti-hair loss lotion"
      />
      
      {/* 1. Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[11px] font-extrabold text-brand-blue dark:text-brand-blue-light uppercase tracking-widest font-heading bg-brand-blue-light dark:bg-brand-blue/10 px-3.5 py-1.5 rounded-full">
          Dermatology Index
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white font-heading uppercase tracking-tight">
          Shop By Clinical Spec
        </h1>
        <div className="w-16 h-1 bg-brand-blue mx-auto rounded-full"></div>
        <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
          Navigate our formulations curated specifically by therapeutic category. Science-backed, dermatologist-proven.
        </p>
      </div>

      {/* 2. Shop Categories Grid */}
      <section className="space-y-8">
        <ScrollReveal>
          <div className="border-b border-brand-border dark:border-zinc-800 pb-4">
            <h2 className="text-lg sm:text-xl font-black text-brand-dark dark:text-white font-heading uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-brand-blue" size={22} /> Formulation Categories
            </h2>
            <p className="text-[10px] text-brand-grey dark:text-gray-400 font-semibold uppercase tracking-wider mt-1">
              Select a specialized category to view prescription-grade products
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-150 dark:bg-zinc-850 border border-brand-border dark:border-zinc-800 rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <ScrollReveal key={cat.id} delay={idx % 3 === 0 ? '' : idx % 3 === 1 ? 'delay-100' : 'delay-200'}>
                <Link
                  to={`/category/${cat.slug}`}
                  className="group relative flex flex-col h-full bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs hover:shadow-lg hover:border-brand-blue dark:hover:border-brand-blue transition-all duration-350"
                >
                  {/* Category Image Cover */}
                  <div className="relative aspect-video w-full bg-brand-bg-grey dark:bg-zinc-850 overflow-hidden border-b border-brand-border dark:border-zinc-800">
                    <img
                      src={getImageUrl(cat.image_url)}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/assets/categories/sun-protection.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="text-[9px] font-extrabold text-brand-yellow uppercase tracking-widest font-heading bg-black/45 px-2.5 py-1 rounded">
                        Formulation Lab
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-brand-dark dark:text-white font-heading uppercase group-hover:text-brand-blue dark:group-hover:text-brand-blue-light transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed line-clamp-3">
                        {cat.description || 'Clinical dermatological skincare solutions developed for optimal absorption, biological compatibility, and accelerated skin barrier recovery.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-black text-brand-blue dark:text-brand-blue-light uppercase tracking-wider font-heading group-hover:gap-2 transition-all">
                      <span>Explore Collection</span>
                      <ChevronRight size={13} className="mt-0.5" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>



      {/* 4. Professional Clinic Consultation Call */}
      <section className="bg-brand-blue-light dark:bg-brand-blue/10 border border-brand-blue/20 dark:border-brand-blue/35 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-base sm:text-lg font-black text-brand-blue dark:text-brand-blue-light uppercase tracking-tight font-heading flex items-center justify-center md:justify-start gap-2">
            <Sparkles size={20} className="animate-spin duration-3000" /> Not Sure Which Spec To Choose?
          </h3>
          <p className="text-xs sm:text-sm text-brand-blue-dark dark:text-gray-300 font-medium max-w-xl leading-relaxed">
            Get a scientific diagnosis from our certified dermatology panel. We'll analyze your skin profile and recommend a custom formulation regimen designed specifically for you.
          </p>
        </div>
        <Link
          to="/contact"
          className="px-6 py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg font-bold font-heading text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
        >
          Free Skincare Consulting
        </Link>
      </section>

    </div>
  );
};

export default Categories;

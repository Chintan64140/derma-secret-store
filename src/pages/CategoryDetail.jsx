import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, SlidersHorizontal, ShieldCheck, HeartPulse } from 'lucide-react';
import { API } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { getImageUrl } from '../utils/image';

const CategoryDetail = () => {
  const { slug } = useParams();
  
  // Data States
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch category info and all products for this category
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Fetch all categories to locate the matching one
        const catRes = await API.get('/products/categories');
        const allCats = catRes.data;
        setCategories(allCats);
        
        const currentCat = allCats.find(c => c.slug === slug);
        setCategory(currentCat);

        if (currentCat) {
          // Fetch products filtered by category ID
          const prodRes = await API.get(`/products?category=${currentCat.id}`);
          setProducts(prodRes.data);
        }
      } catch (err) {
        console.error('Failed to load category details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="animate-spin text-brand-blue" size={32} />
        <p className="text-brand-grey dark:text-gray-445 text-sm font-semibold uppercase tracking-wider font-heading">
          Loading clinical category formulations...
        </p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <h2 className="text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
          Category Not Found
        </h2>
        <p className="text-sm text-brand-grey dark:text-gray-400 max-w-sm mx-auto">
          The requested dermatology category does not exist in our active specifications index.
        </p>
        <Link
          to="/categories"
          className="inline-block px-6 py-3 bg-brand-blue text-white rounded-md font-bold font-heading text-xs uppercase tracking-wider hover:bg-brand-blue-dark transition-colors"
        >
          Return to Categories Index
        </Link>
      </div>
    );
  }

  const filteredProducts = products;

  // Determine Category Banner URL
  const bannerMap = {
    'sun-protection': '/assets/banners/sunscreen_banner.jpg',
    'acne-care': '/assets/banners/acne_banner.jpg',
    'face-care': '/assets/banners/face_care_banner.jpg'
  };
  const categoryBanner = bannerMap[category.slug] || category.image_url;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 dark:bg-[#121212] transition-colors duration-300">
      <SEO 
        title={`${category.name} Range`}
        description={category.description || `Browse our science-backed formulations for ${category.name}.`}
        keywords={`${category.name}, clinical skincare, dermatologist recommended, ${category.sku || ''}`}
        image={category.image_url}
      />
      
      {/* Back button */}
      <div>
        <Link 
          to="/categories" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-dark dark:text-brand-blue-light uppercase tracking-wider font-heading border-b border-transparent hover:border-brand-blue transition-all"
        >
          <ArrowLeft size={14} /> Back to Index
        </Link>
      </div>

      {/* Category Hero Block */}
      <section className="relative rounded-2xl overflow-hidden border border-brand-border dark:border-zinc-800 shadow-sm bg-brand-dark min-h-[300px] flex items-center p-6 sm:p-10 lg:p-14">
        {/* Banner Image Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl(categoryBanner)} 
            alt={category.name} 
            className="w-full h-full object-cover opacity-35 dark:opacity-25"
            onError={(e) => {
              e.target.src = '/assets/categories/sun-protection.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Text Overlay */}
        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="text-[10px] font-extrabold text-brand-yellow uppercase tracking-widest font-heading bg-brand-yellow/15 border border-brand-yellow/30 px-3 py-1 rounded">
            Clinical Category Code: 0{category.id}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading uppercase tracking-tight leading-none text-white">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
            {category.description || 'Scientifically formulated dermatology solutions. Developed in sterile laboratory conditions with clinically proven active levels to repair the skin barrier, boost collagen, or protect against environmental stressors.'}
          </p>
        </div>
      </section>

      {/* Layout Controls: Formulations Count */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-y border-brand-border dark:border-zinc-800/80 py-4">
        <span className="text-[11px] font-extrabold text-brand-grey dark:text-gray-400 uppercase tracking-wider font-heading">
          {filteredProducts.length} Formulations Found
        </span>
      </section>

      {/* Main Formulations Grid */}
      <section className="min-h-[300px]">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-16 bg-brand-bg-grey dark:bg-zinc-900 border border-dashed border-brand-border dark:border-zinc-800 rounded-xl space-y-3">
            <HeartPulse className="text-brand-accent animate-pulse" size={36} />
            <h3 className="text-base font-bold text-brand-dark dark:text-gray-200 font-heading uppercase">No active formulations</h3>
            <p className="text-xs text-brand-grey dark:text-gray-400 max-w-sm">
              We couldn't find any products in this specific category at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Category Bottom Index Jumper */}
      <section className="border-t border-brand-border dark:border-zinc-800 pt-10 flex flex-col items-center space-y-4">
        <h3 className="text-xs font-extrabold text-brand-grey dark:text-gray-400 uppercase tracking-widest font-heading text-center">
          Jump to Another Clinical Category
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.filter(c => c.slug !== slug).map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="px-4 py-2 border border-brand-border dark:border-zinc-800 text-[10px] font-bold text-brand-dark dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light hover:border-brand-blue rounded-md uppercase tracking-wider transition-all font-heading"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};

export default CategoryDetail;

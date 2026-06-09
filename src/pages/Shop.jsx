import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, RotateCcw, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { API } from '../context/AuthContext';
import SEO from '../components/SEO';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedConcern, setSelectedConcern] = useState(searchParams.get('concern') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filterType, setFilterType] = useState(searchParams.get('filter') || ''); // 'best-sellers' or 'new-arrivals'

  // Mobile Filter Drawer
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Update filter states when URL search parameters change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedConcern(searchParams.get('concern') || '');
    setSortOption(searchParams.get('sort') || '');
    setSearchQuery(searchParams.get('search') || '');
    setFilterType(searchParams.get('filter') || '');
  }, [searchParams]);

  // Fetch filter metadata (categories/concerns) once
  useEffect(() => {
    Promise.all([
      API.get('/products/categories'),
      API.get('/products/concerns')
    ])
      .then(([catRes, conRes]) => {
        setCategories(catRes.data);
        setConcerns(conRes.data);
      })
      .catch(err => console.error('Shop page filter metadata load failed:', err.message));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let endpoint = '/products?';
        
        if (selectedCategory) endpoint += `category=${selectedCategory}&`;
        if (selectedConcern) endpoint += `concern=${selectedConcern}&`;
        if (searchQuery) endpoint += `search=${encodeURIComponent(searchQuery)}&`;
        if (sortOption) endpoint += `sort=${sortOption}&`;
        
        if (filterType === 'best-sellers') {
          endpoint += 'bestSeller=true&';
        } else if (filterType === 'new-arrivals') {
          endpoint += 'newArrival=true&';
        }

        const res = await API.get(endpoint);
        setProducts(res.data);
      } catch (err) {
        console.error('Fetch products catalog failed:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedConcern, searchQuery, sortOption, filterType]);

  // Handle setting parameters in URL
  const updateParams = (newParams) => {
    const current = {};
    for (const [key, value] of searchParams.entries()) {
      current[key] = value;
    }
    
    const updated = { ...current, ...newParams };
    
    // Remove empty parameters
    Object.keys(updated).forEach(key => {
      if (!updated[key]) delete updated[key];
    });

    setSearchParams(updated);
  };

  const handleCategoryChange = (slug) => {
    const val = selectedCategory === slug ? '' : slug;
    updateParams({ category: val });
  };

  const handleConcernChange = (slug) => {
    const val = selectedConcern === slug ? '' : slug;
    updateParams({ concern: val });
  };

  const handleSortChange = (e) => {
    updateParams({ sort: e.target.value });
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setIsMobileFiltersOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchQuery });
  };

  // Dynamic SEO variables
  let pageTitle = 'Shop Skincare Formulations';
  let pageDesc = 'Explore our clinical skincare catalog containing science-backed formulations, category-tested by dermatologists.';
  let pageKeywords = 'clinical shop, buy dermatological sunscreen, acne care products, body creams';

  if (filterType === 'best-sellers') {
    pageTitle = 'Best Selling Formulations';
    pageDesc = 'Shop our top-rated, best-selling dermatologist verified formulations for premium results.';
  } else if (filterType === 'new-arrivals') {
    pageTitle = 'New Skincare Arrivals';
    pageDesc = 'Discover our latest scientifically advanced clinical skincare product launches.';
  } else if (selectedCategory) {
    const catObj = categories.find(c => c.slug === selectedCategory);
    if (catObj) {
      pageTitle = `${catObj.name} Catalog`;
      pageDesc = catObj.description || pageDesc;
      pageKeywords = `${catObj.name}, ${pageKeywords}`;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <SEO 
        title={pageTitle}
        description={pageDesc}
        keywords={pageKeywords}
      />
      {/* 1. Shop Header Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-brand-border dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white uppercase tracking-tight font-heading">
            {filterType === 'best-sellers' && 'Best Sellers'}
            {filterType === 'new-arrivals' && 'New Arrivals'}
            {!filterType && selectedCategory && `${categories.find(c => c.slug === selectedCategory)?.name || 'Skincare'}`}
            {!filterType && !selectedCategory && 'Clinical Catalog'}
          </h1>
          <p className="text-xs font-semibold text-brand-grey dark:text-gray-400 uppercase tracking-wider font-heading mt-1">
            {products.length} Products Found
          </p>
        </div>

        {/* Catalog Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-sm">
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 border border-brand-border dark:border-zinc-800 rounded-lg text-sm bg-brand-bg-grey dark:bg-zinc-900 text-brand-dark dark:text-gray-100 focus:outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-zinc-850 transition-all font-medium"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-grey dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors">
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* 2. Controls & Active Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-brand-border dark:border-zinc-800 rounded-md text-sm font-bold text-brand-dark dark:text-gray-200 hover:bg-brand-bg-grey dark:hover:bg-zinc-800 transition-colors"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider font-heading">Sort By:</span>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="border border-brand-border dark:border-zinc-800 rounded-md px-3 py-2 text-xs font-bold text-brand-dark dark:text-gray-200 focus:outline-none focus:border-brand-blue bg-white dark:bg-zinc-900"
          >
            <option value="">Default sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {(selectedCategory || selectedConcern || searchQuery || filterType) && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-blue-light dark:bg-brand-blue/10 hover:bg-brand-blue hover:text-white rounded-md text-xs font-bold text-brand-blue transition-all"
          >
            <RotateCcw size={13} /> Reset Filters
          </button>
        )}
      </div>

      {/* 3. Catalog Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filter Column (Desktop only) */}
        <aside className="hidden lg:block space-y-6 self-start sticky top-24">
          
          {/* Categories List */}
          <div className="border border-brand-border dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 p-5 space-y-4">
            <h3 className="font-bold text-sm text-brand-dark dark:text-gray-200 font-heading uppercase tracking-wider border-b border-brand-border dark:border-zinc-800 pb-2">
              Categories
            </h3>
            <div className="space-y-2.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`flex items-center justify-between w-full text-left text-xs font-bold font-heading uppercase tracking-wider transition-colors ${
                    selectedCategory === cat.slug 
                      ? 'text-brand-blue font-extrabold dark:text-brand-blue' 
                      : 'text-brand-dark dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue'
                  }`}
                >
                  <span>{cat.name}</span>
                  <div className={`w-4 h-4 border rounded flex items-center justify-center border-brand-border dark:border-zinc-700 ${
                    selectedCategory === cat.slug ? 'bg-brand-blue border-brand-blue' : 'bg-white dark:bg-zinc-800'
                  }`}>
                    {selectedCategory === cat.slug && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Concerns List */}
          <div className="border border-brand-border dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 p-5 space-y-4">
            <h3 className="font-bold text-sm text-brand-dark dark:text-gray-200 font-heading uppercase tracking-wider border-b border-brand-border dark:border-zinc-800 pb-2">
              Concerns
            </h3>
            <div className="space-y-2.5">
              {concerns.map((con) => (
                <button
                  key={con.id}
                  onClick={() => handleConcernChange(con.slug)}
                  className={`flex items-center justify-between w-full text-left text-xs font-bold font-heading uppercase tracking-wider transition-colors ${
                    selectedConcern === con.slug 
                      ? 'text-brand-blue font-extrabold dark:text-brand-blue' 
                      : 'text-brand-dark dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue'
                  }`}
                >
                  <span>{con.name}</span>
                  <div className={`w-4 h-4 border rounded flex items-center justify-center border-brand-border dark:border-zinc-700 ${
                    selectedConcern === con.slug ? 'bg-brand-blue border-brand-blue' : 'bg-white dark:bg-zinc-800'
                  }`}>
                    {selectedConcern === con.slug && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Badges filter shortcuts */}
          <div className="border border-brand-border dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 p-5 space-y-4">
            <h3 className="font-bold text-sm text-brand-dark dark:text-gray-200 font-heading uppercase tracking-wider border-b border-brand-border dark:border-zinc-800 pb-2">
              Collections
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => updateParams({ filter: filterType === 'best-sellers' ? '' : 'best-sellers' })}
                className={`text-left text-xs font-bold font-heading uppercase px-3 py-2 rounded-md transition-all ${
                  filterType === 'best-sellers'
                    ? 'bg-brand-blue text-white'
                    : 'bg-brand-bg-grey dark:bg-zinc-800 text-brand-dark dark:text-gray-300 hover:bg-brand-blue-light dark:hover:bg-brand-blue/20 hover:text-brand-blue dark:hover:text-brand-blue'
                }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => updateParams({ filter: filterType === 'new-arrivals' ? '' : 'new-arrivals' })}
                className={`text-left text-xs font-bold font-heading uppercase px-3 py-2 rounded-md transition-all ${
                  filterType === 'new-arrivals'
                    ? 'bg-brand-blue text-white'
                    : 'bg-brand-bg-grey dark:bg-zinc-800 text-brand-dark dark:text-gray-300 hover:bg-brand-blue-light dark:hover:bg-brand-blue/20 hover:text-brand-blue dark:hover:text-brand-blue'
                }`}
              >
                New Arrivals
              </button>
            </div>
          </div>

        </aside>

        {/* Right Product Grid Column */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-zinc-800 border border-brand-border dark:border-zinc-800 rounded-lg h-96 animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-12 bg-brand-bg-grey dark:bg-zinc-900 rounded-xl border border-dashed border-brand-border dark:border-zinc-800 space-y-4">
              <div className="p-4 bg-brand-blue-light dark:bg-brand-blue/10 rounded-full text-brand-blue dark:text-brand-blue">
                <SlidersHorizontal size={40} />
              </div>
              <h3 className="text-lg font-bold text-brand-dark dark:text-gray-200 font-heading uppercase">No Formulations Found</h3>
              <p className="text-xs text-brand-grey dark:text-gray-400 max-w-sm">
                We couldn't find any products matching your specific selection. Try resetting filters or searching with a different term.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-brand-blue text-white rounded-md font-bold font-heading text-xs uppercase tracking-wider hover:bg-brand-blue-dark transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* 4. Collapsible Mobile Filter Sidebar Drawer overlay */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white dark:bg-zinc-900 h-full flex flex-col p-6 space-y-6 shadow-2xl animate-slide-left overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-border dark:border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-brand-dark dark:text-gray-100 font-heading uppercase">Filter Catalog</h2>
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-brand-grey dark:text-gray-400 hover:text-brand-dark dark:hover:text-gray-250 font-bold text-xs uppercase tracking-wider"
              >
                Close
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-brand-dark dark:text-gray-200 font-heading uppercase tracking-wider">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`flex items-center justify-between w-full text-left text-xs font-bold font-heading transition-colors ${
                      selectedCategory === cat.slug ? 'text-brand-blue font-extrabold dark:text-brand-blue' : 'text-brand-dark dark:text-gray-300'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`w-3.5 h-3.5 border rounded-full ${
                      selectedCategory === cat.slug ? 'bg-brand-blue border-brand-blue' : 'bg-white dark:bg-zinc-800 border-brand-border dark:border-zinc-700'
                    }`}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Concerns */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-brand-dark dark:text-gray-200 font-heading uppercase tracking-wider">Concerns</h3>
              <div className="space-y-2">
                {concerns.map((con) => (
                  <button
                    key={con.id}
                    onClick={() => handleConcernChange(con.slug)}
                    className={`flex items-center justify-between w-full text-left text-xs font-bold font-heading transition-colors ${
                      selectedConcern === con.slug ? 'text-brand-blue font-extrabold dark:text-brand-blue' : 'text-brand-dark dark:text-gray-300'
                    }`}
                  >
                    <span>{con.name}</span>
                    <span className={`w-3.5 h-3.5 border rounded-full ${
                      selectedConcern === con.slug ? 'bg-brand-blue border-brand-blue' : 'bg-white dark:bg-zinc-800 border-brand-border dark:border-zinc-700'
                    }`}></span>
                  </button>
                ))}
              </div>
            </div>



            {/* Filter pills */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-brand-dark dark:text-gray-200 font-heading uppercase tracking-wider">Collections</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { updateParams({ filter: filterType === 'best-sellers' ? '' : 'best-sellers' }); setIsMobileFiltersOpen(false); }}
                  className={`text-center text-xs font-bold font-heading uppercase py-2 rounded-md border ${
                    filterType === 'best-sellers' ? 'bg-brand-blue text-white' : 'bg-white dark:bg-zinc-800 border-brand-border dark:border-zinc-850 text-brand-dark dark:text-gray-300'
                  }`}
                >
                  Best Sellers
                </button>
                <button
                  onClick={() => { updateParams({ filter: filterType === 'new-arrivals' ? '' : 'new-arrivals' }); setIsMobileFiltersOpen(false); }}
                  className={`text-center text-xs font-bold font-heading uppercase py-2 rounded-md border ${
                    filterType === 'new-arrivals' ? 'bg-brand-blue text-white' : 'bg-white dark:bg-zinc-800 border-brand-border dark:border-zinc-850 text-brand-dark dark:text-gray-300'
                  }`}
                >
                  New Arrivals
                </button>
              </div>
            </div>

            {/* CTA controls */}
            <div className="pt-6 border-t border-brand-border dark:border-zinc-800 flex gap-4">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 bg-brand-bg-grey dark:bg-zinc-800 hover:bg-brand-blue-light dark:hover:bg-brand-blue/15 hover:text-brand-blue text-brand-dark dark:text-gray-350 text-center text-xs font-bold uppercase rounded-md transition-all"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white text-center text-xs font-bold uppercase rounded-md shadow-md transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;

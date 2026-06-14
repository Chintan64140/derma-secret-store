import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { API } from '../context/AuthContext';
import { getImageUrl } from '../utils/image';

const defaultBanners = [
  {
    id: 1,
    image: '/assets/banners/Window/baner-1.png',
    mobileImage: '/assets/banners/Mobile/baner-1.png',
    title: 'Advanced Dermatological Care',
    subtitle: 'Clinical Formulation Solutions',
    description: 'Dermatologist recommended skincare range designed with active ingredients to restore and nourish your skin barrier.',
    link: '/shop',
    badge: 'New Launch'
  },
  {
    id: 2,
    image: '/assets/banners/Window/baner-2.png',
    mobileImage: '/assets/banners/Mobile/baner-2.png',
    title: 'Science-Backed Protection',
    subtitle: 'Broad Spectrum Shadow Series',
    description: 'Guard your skin against harmful UV radiation with our non-greasy, invisible formulation sunscreen line.',
    link: '/shop?category=sun-protection',
    badge: 'Best Seller'
  }
];

const HeroBanner = () => {
  const [banners, setBanners] = useState(defaultBanners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await API.get('/products/cms/hero');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setBanners(res.data);
        }
      } catch (err) {
        console.error('Failed to load hero banners from CMS:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  // useEffect(() => {
  //   if (banners.length <= 1) return;
  //   const timer = setInterval(nextSlide, 6000);
  //   return () => clearInterval(timer);
  // }, [banners.length]);

  return (
    <div className="relative w-full aspect-[195/227] sm:aspect-[41/14] bg-brand-blue-light overflow-hidden shadow-inner">
      {/* Slides */}
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => {
          const isActive = currentIndex === index;
          return (
            <div key={banner.id || index} className="w-full h-full flex-shrink-0 relative">
              {/* Background Image with Dark Gradient Overlay */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-dark/85 via-brand-blue-dark/50 to-transparent z-10"></div> */}
              <picture 
                className={`w-full h-full block ${banner.link ? 'cursor-pointer' : ''}`}
                onClick={() => banner.link && navigate(banner.link)}
              >
                <source media="(max-width: 639px)" srcSet={getImageUrl(banner.mobileImage || banner.image)} />
                <img 
                  src={getImageUrl(banner.image)} 
                  alt={banner.title} 
                  className="w-full h-full object-fill object-center animate-fade-in"
                />
              </picture>
              
              {/* Content Container */}
              {/* <div className="absolute inset-0 z-20 flex items-center max-w-7xl mx-auto px-4 sm:px-12 lg:px-24">
                {isActive && (
                  <div className="bg-brand-blue-dark/50 dark:bg-black/45 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl border border-white/15 shadow-2xl max-w-md sm:max-w-lg md:max-w-xl text-white space-y-3 sm:space-y-4 md:space-y-5 animate-[fade-up_0.5s_ease-out_both]">
                    {banner.badge && (
                      <span className="inline-block bg-brand-accent text-white text-[10px] sm:text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        {banner.badge}
                      </span>
                    )}
                    
                    <div className="space-y-1 sm:space-y-2">
                      {banner.subtitle && (
                        <h2 className="text-xs sm:text-sm font-bold text-brand-yellow uppercase tracking-wider font-heading">
                          {banner.subtitle}
                        </h2>
                      )}
                      <h1 className="text-xl sm:text-3xl md:text-4xl font-black font-heading leading-tight tracking-tight drop-shadow-sm">
                        {banner.title}
                      </h1>
                    </div>
                    
                    {banner.description && (
                      <p className="text-[11px] sm:text-xs md:text-sm text-gray-200 leading-relaxed font-medium max-w-sm sm:max-w-md">
                        {banner.description}
                      </p>
                    )}
                    
                    {banner.link && (
                      <div className="pt-1 sm:pt-2">
                        <button 
                          onClick={() => navigate(banner.link)}
                          className="px-4 py-2 sm:px-6 sm:py-3 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-md font-bold font-heading text-[10px] sm:text-xs uppercase tracking-wider transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer"
                        >
                          Explore Range
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div> */}
            </div>
          );
        })}
      </div>

      {/* Slide Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-brand-blue transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-brand-blue transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-1">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1 h-1 rounded-full transition-all ${
                currentIndex === index ? 'bg-brand-yellow w-3' : 'bg-white/55 hover:bg-white'
              }`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;

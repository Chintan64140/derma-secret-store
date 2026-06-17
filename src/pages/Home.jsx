import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Award,
  HelpCircle,
  Shield,
  Check,
  Flame,
  Heart,
  Info,
  Gift,
  Coffee,
  Bookmark,
  Activity,
  Smile,
  BadgeAlert,
  ShoppingBag,
} from "lucide-react";
import HeroBanner from "../components/HeroBanner";
import ProductCard from "../components/ProductCard";
import ScrollReveal from "../components/ScrollReveal";
import { API } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getImageUrl } from "../utils/image";
import SEO from "../components/SEO";

const iconMap = {
  ShieldCheck,
  HeartPulse,
  Award,
  Sparkles,
  Shield,
  Check,
  Flame,
  Heart,
  Info,
  Gift,
  Coffee,
  Bookmark,
  Activity,
  Smile,
  BadgeAlert,
};

const DynamicIcon = ({ name, size = 24, className }) => {
  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent size={size} className={className} />;
};

const getConcernImage = (slug) => {
  const mapping = {
    "acne-breakouts": "/assets/concerns/acne.jpg",
    "sun-damage": "/assets/concerns/sun-damage.jpg",
    hyperpigmentation: "/assets/concerns/hyperpigmentation.jpg",
    "hair-fall": "/assets/concerns/hair-fall.jpg",
    "dryness-dehydration": "/assets/concerns/dryness.jpg",
    "anti-aging": "/assets/concerns/anti-aging.jpg",
  };
  return mapping[slug] || "/assets/concerns/acne.jpg";
};

const Home = () => {
  const { addToCart } = useCart();

  const [latestProducts, setLatestProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [trustCards, setTrustCards] = useState([
    {
      id: 1,
      icon: "ShieldCheck",
      title: "Dermatologist Verified",
      description:
        "Every formulation undergoes stringent clinical trials and dermatological assessments to guarantee complete efficacy and skin safety.",
    },
    {
      id: 2,
      icon: "HeartPulse",
      title: "Science-Backed Actives",
      description:
        "We use scientifically advanced ingredients like Retinol, Salicylic Acid, and Bio-Peptides at clinically active percentages for real visible improvements.",
    },
    {
      id: 3,
      icon: "Award",
      title: "Clinical Skincare Pedigree",
      description:
        "Trusted by thousands of dermatologists globally, our formulations bridge the gap between beauty cosmetics and prescription medicine.",
    },
  ]);

  const [certifications, setCertifications] = useState([
    {
      title: "Dermatologist Tested",
      desc: "Evaluated by experts for highest safety.",
    },
    { title: "Non-Comedogenic", desc: "Formulated to not clog pores." },
    { title: "Paraben Free", desc: "No harmful preservatives." },
    { title: "Cruelty Free", desc: "Never tested on animals." },
    { title: "Clinically Proven", desc: "Tested & proven active ingredients." },
  ]);

  const [ngoBanner, setNgoBanner] = useState({
    banner_image: "/assets/banners/about_ngo_banner.jpg",
    small_title: "FIX MY LIFE • NGO INITIATIVE",
    heading: "Derma Secret's Pledge to Restore Confidence",
    description:
      'Our "Fix My Life" initiative is dedicated to helping individuals with severe skin disorders who cannot afford clinical treatments. We partner with NGOs globally to provide free consultations, medications, and therapeutic procedures to restore skin health and self-esteem.',
    button_label: "See Our Impact",
    button_link: "/shop",
  });

  const [newsletter, setNewsletter] = useState({
    small_title: "Exclusive Updates",
    heading: "GET ON THE LIST",
    description:
      "Subscribe to receive special offers, dermatologist advice, early access to new product launches, and 10% off your first order.",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch static/standard store collections
        const [latestRes, bestSellersRes, categoriesRes, concernsRes] =
          await Promise.all([
            API.get("/products?sort=latest&limit=8"),
            API.get("/products?bestSeller=true&limit=8"),
            API.get("/products/categories"),
            API.get("/products/concerns"),
          ]);
        setLatestProducts(latestRes.data);
        setBestSellers(bestSellersRes.data);
        setCategories(categoriesRes.data);
        setConcerns(concernsRes.data);
      } catch (err) {
        console.error("Home page data fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const marketplaces = [
    {
      name: "Amazon",
      url: "https://www.amazon.in",
      logo: "./assets/Platforms/amazon.svg",
      buttonText: "Shop on Amazon",
      delay: "delay-100",
      logoClass: "h-8 sm:h-10 md:h-12",
    },
    {
      name: "Flipkart",
      url: "https://www.flipkart.com",
      logo: "./assets/Platforms/flipkart.svg",
      buttonText: "Shop on Flipkart",
      delay: "delay-200",
      logoClass: "h-8 sm:h-10 md:h-12 -my-4 sm:-my-6 md:-my-8",
    },
    {
      name: "Flipkart",
      url: "https://www.flipkart.com",
      logo: "./assets/Platforms/meesho.png",
      buttonText: "Shop on Flipkart",
      delay: "delay-300",
      logoClass: "h-8 sm:h-10 md:h-12 -my-4 sm:-my-6 md:-my-8",
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-16 pb-10 sm:pb-16 dark:bg-[#121212] transition-colors duration-300">
      <SEO
        title="Dermatological & Clinical Skincare Store"
        description="Science-backed dermatological formulations for healthy, radiant skin. Shop our best-selling sunscreens, acne care cleansers, body care, and hair care products."
        keywords="derma secret, skincare, dermatologist tested, clinical sunscreen, acne cleanser, body cream, stretch mark cream"
      />
      {/* 1. Hero Carousel */}
      <HeroBanner />

      {/* 2. Shop By Concern */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark dark:text-white font-heading tracking-tight">
              Find the right product for you
            </h2>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center space-y-4 animate-pulse w-[130px] sm:w-[180px]"
              >
                <div className="w-28 h-28 sm:w-40 sm:h-40 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mx-auto">
            {concerns.map((concern, index) => {
              const delays = [
                "",
                "delay-75",
                "delay-100",
                "delay-150",
                "delay-200",
                "delay-300",
              ];
              return (
                <ScrollReveal
                  key={concern.id}
                  delay={delays[index % 6]}
                  className="w-[130px] sm:w-[180px]"
                >
                  <Link
                    to={`/shop?concern=${concern.slug}`}
                    className="group flex flex-col items-center text-center space-y-4 max-w-[180px] mx-auto"
                  >
                    <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-sm transition-transform duration-300 transform group-hover:scale-105">
                      <img
                        src={getImageUrl(concern.image_url)}
                        alt={concern.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = getConcernImage(concern.slug);
                        }}
                      />
                      {/* Subtle hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-brand-dark dark:text-zinc-200 group-hover:text-brand-blue dark:group-hover:text-brand-blue transition-colors font-heading leading-tight line-clamp-2">
                      {concern.name}
                    </h3>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Latest Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[11px] font-extrabold text-brand-accent uppercase tracking-widest font-heading">
                Dermatologist Favourites
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white font-heading uppercase tracking-tight">
                Latest Products
              </h2>
              <div className="w-16 h-1 bg-brand-blue rounded-full mx-auto sm:mx-0"></div>
            </div>
            <Link
              to="/shop?sort=latest"
              className="flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-dark uppercase tracking-wider font-heading border-b-2 border-brand-blue/30 pb-0.5 hover:border-brand-blue-dark transition-all dark:text-brand-blue-light dark:hover:text-white"
            >
              View All Products <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg border border-brand-border h-[400px] animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {latestProducts.map((product, index) => {
              const delays = ["", "delay-100", "delay-200", "delay-300"];
              return (
                <ScrollReveal key={product.id} delay={delays[index % 4]}>
                  <ProductCard product={product} />
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </section>
      {/* 3. Clinical Trust Section */}
      <section className="bg-brand-blue-light py-12 border-y border-brand-border dark:bg-zinc-900/60 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {trustCards.map((card, idx) => {
              const delays = ["", "delay-150", "delay-300"];
              return (
                <ScrollReveal
                  key={card.id || idx}
                  delay={delays[idx % 3]}
                  className="h-full"
                >
                  <div className="space-y-3 bg-white p-6 rounded-lg border border-brand-border shadow-xs h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-brand-blue/30 dark:bg-[#1a1a1a] dark:border-zinc-800">
                    <div className="w-12 h-12 bg-brand-blue-light text-brand-blue flex items-center justify-center rounded-full mx-auto md:mx-0 dark:bg-zinc-800 dark:text-brand-blue-light">
                      <DynamicIcon name={card.icon} size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark dark:text-white font-heading">
                      {card.title}
                    </h3>
                    <p className="text-xs text-brand-grey dark:text-zinc-400 leading-relaxed font-medium">
                      {card.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4.1. Our Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[11px] font-extrabold text-brand-accent uppercase tracking-widest font-heading">
                Top Rated Formulations
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white font-heading uppercase tracking-tight">
                Our Best Sellers
              </h2>
              <div className="w-16 h-1 bg-brand-blue rounded-full mx-auto sm:mx-0"></div>
            </div>
            <Link
              to="/shop?filter=best-sellers"
              className="flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-dark uppercase tracking-wider font-heading border-b-2 border-brand-blue/30 pb-0.5 hover:border-brand-blue-dark transition-all dark:text-brand-blue-light dark:hover:text-white"
            >
              View All Best Sellers <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg border border-brand-border h-[400px] animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map((product, index) => {
              const delays = ["", "delay-100", "delay-200", "delay-300"];
              return (
                <ScrollReveal key={product.id} delay={delays[index % 4]}>
                  <ProductCard product={product} />
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </section>

      {/* 4.5. Our Certifications (Clinical Trust Badges) */}
      <section className="bg-brand-bg-grey py-12 border-y border-brand-border dark:bg-zinc-900/60 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="text-[11px] font-extrabold text-brand-accent uppercase tracking-widest font-heading">
                Our Promises
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white font-heading uppercase tracking-tight">
                Our Certifications
              </h2>
              <div className="w-16 h-1 bg-brand-blue mx-auto rounded-full"></div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {certifications.map((cert, idx) => {
              const delays = [
                "",
                "delay-75",
                "delay-100",
                "delay-150",
                "delay-200",
              ];
              return (
                <ScrollReveal
                  key={idx}
                  delay={delays[idx % 5]}
                  className="flex flex-col items-center p-4 bg-white rounded-lg border border-brand-border hover:shadow-md transition-shadow dark:bg-[#1a1a1a] dark:border-zinc-800"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold text-sm mb-3 dark:bg-zinc-800 dark:text-brand-blue-light">
                    ✓
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white font-heading">
                    {cert.title}
                  </h4>
                  <p className="text-[10px] text-brand-grey dark:text-zinc-400 font-medium mt-1 leading-tight">
                    {cert.desc}
                  </p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Shop By Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10 space-y-2">
            <span className="text-[11px] font-extrabold text-brand-accent uppercase tracking-widest font-heading">
              Explore Formulations
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-brand-dark dark:text-white font-heading uppercase tracking-tight">
              Shop By Category
            </h2>
            <div className="w-16 h-1 bg-brand-blue mx-auto rounded-full"></div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center space-y-3 animate-pulse w-[130px] sm:w-[150px]"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {categories.map((category, index) => {
              const delays = [
                "",
                "delay-75",
                "delay-100",
                "delay-150",
                "delay-200",
                "delay-300",
              ];
              return (
                <ScrollReveal
                  key={category.id}
                  delay={delays[index % 6]}
                  className="w-[130px] sm:w-[150px]"
                >
                  <Link
                    to={`/shop?category=${category.slug}`}
                    className="group flex flex-col items-center text-center space-y-3 max-w-[150px] mx-auto"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-brand-border dark:border-zinc-800 group-hover:border-brand-blue dark:group-hover:border-brand-blue group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105">
                      <img
                        src={getImageUrl(category.image_url)}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "/assets/categories/sun-protection.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-brand-blue-dark/5 dark:bg-black/10 group-hover:bg-transparent transition-all"></div>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-zinc-200 group-hover:text-brand-blue dark:group-hover:text-brand-blue transition-colors font-heading leading-tight line-clamp-2">
                      {category.name}
                    </h3>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </section>

      {/* 7. Available on Favorite Platforms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
            <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-extrabold text-brand-grey dark:text-zinc-500 uppercase tracking-widest font-heading">
              <div className="w-6 sm:w-8 h-[2px] bg-brand-blue rounded-full"></div>
              <span>Available On</span>
              <div className="w-6 sm:w-8 h-[2px] bg-brand-blue rounded-full"></div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-brand-dark dark:text-white font-heading text-center uppercase tracking-tight max-w-lg leading-tight mt-1">
              Shop on Your <span className="text-brand-blue">Favorite</span>{" "}
              Platforms
            </h2>

            <p className="text-[11px] sm:text-xs md:text-sm text-brand-grey dark:text-zinc-400 text-center font-medium max-w-md leading-relaxed">
              Our products are available on India's leading marketplaces.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-3 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto mt-6 sm:mt-8">
          {marketplaces.map((marketplace) => (
            <ScrollReveal
              key={marketplace.name}
              delay={marketplace.delay}
              className="h-full"
            >
              <div className="group flex flex-col bg-white border border-brand-border dark:bg-zinc-900/40 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-lg hover:border-brand-blue/30 transition-all duration-300 h-full">
                <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-[90px] sm:min-h-[120px] md:min-h-[140px] bg-white dark:bg-zinc-900/20 overflow-hidden">
                  <img
                    src={marketplace.logo}
                    alt={marketplace.name}
                    className={`${marketplace.logoClass} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
                  />
                </div>

                {/* <div className="py-2.5 sm:py-4 border-t border-brand-border/60 dark:border-zinc-800 flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold text-brand-dark dark:text-zinc-300 group-hover:text-brand-blue transition-colors font-heading uppercase tracking-wider">
                  <span>{marketplace.buttonText}</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div> */}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Footer Trust Row */}
        <ScrollReveal delay="delay-300">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-10">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-blue-light text-brand-blue flex items-center justify-center dark:bg-zinc-800 dark:text-brand-blue-light shrink-0">
              <ShoppingBag size={14} className="sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="h-5 sm:h-6 w-[1px] bg-brand-border dark:bg-zinc-850"></div>
            <p className="text-[10px] sm:text-xs md:text-sm text-brand-grey dark:text-zinc-400 font-semibold tracking-wide">
              Trusted Products. Happy Customers.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. GET ON THE LIST / Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="reveal-scale-up">
          <div className="bg-brand-blue-dark dark:bg-[#152e3b] text-white rounded-2xl p-8 sm:p-12 md:p-16 text-center space-y-6 relative overflow-hidden border border-brand-blue/30 shadow-xl">
            {/* Background design */}
            <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-brand-blue-light/5 border border-brand-blue-light/10"></div>
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-brand-blue-light/5 border border-brand-blue-light/10"></div>

            <div className="max-w-lg mx-auto space-y-4">
              <span className="text-[11px] font-extrabold text-brand-yellow uppercase tracking-widest font-heading block">
                {newsletter.small_title || "Exclusive Updates"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-tight">
                {newsletter.heading}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
                {newsletter.description}
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-md text-sm text-brand-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all font-medium placeholder-gray-400 dark:bg-zinc-800 dark:text-white dark:border-zinc-750 dark:focus:ring-brand-yellow"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-md font-bold font-heading text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default Home;

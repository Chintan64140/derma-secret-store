import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartPulse, Award, Beaker, Users, Calendar } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import SEO from '../components/SEO';

const About = () => {
  const stats = [
    { icon: <Calendar className="text-brand-blue" size={24} />, value: '15+', label: 'Years of Formulation Research' },
    { icon: <Users className="text-brand-blue" size={24} />, value: '10k+', label: 'Dermatologist Partners' },
    { icon: <Beaker className="text-brand-blue" size={24} />, value: '30+', label: 'Dermatology Formulations' },
    { icon: <Award className="text-brand-blue" size={24} />, value: '100%', label: 'Non-Comedogenic & Cruelty Free' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 dark:bg-[#121212] transition-colors duration-300">
      <SEO 
        title="About Our Clinical Skincare Philosophy"
        description="Learn about Derma Secret's medical skincare pedigree. We synthesize high-efficacy dermatological products in WHO-GMP certified laboratories."
        keywords="about derma secret, WHO-GMP skincare, dermatologist approved safety, active skincare ingredients"
      />
      
      {/* 1. Scientific Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] font-extrabold text-brand-accent uppercase tracking-widest font-heading bg-brand-accent/10 px-3.5 py-1.5 rounded-full">
          Dermatology Science Pedigree
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-dark dark:text-white font-heading uppercase tracking-tight leading-none">
          Skincare Backed By Real Medicine
        </h1>
        <div className="w-16 h-1 bg-brand-blue mx-auto rounded-full"></div>
        <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed max-w-xl mx-auto">
          At Derma Secret, we build high-efficacy clinical solutions to restore and protect skin health, bridging the critical gap between cosmetic beauty and prescription therapeutics.
        </p>
      </section>

      {/* 2. Brand Narrative Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <ScrollReveal>
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark dark:text-white font-heading uppercase tracking-tight">
              Our Formulation Philosophy
            </h2>
            <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 leading-relaxed font-medium">
              Every formula we synthesize is designed in sterile, state-of-the-art dermatology laboratories. We avoid heavy fragrances, harsh parabens, and generic fillers. Instead, we use clinically active molecules at exact therapeutic percentages to ensure guaranteed results.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-4 border border-brand-border dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs hover:shadow-xs transition-shadow">
                <Beaker className="text-brand-blue shrink-0 mt-1" size={20} />
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white uppercase font-heading">
                    Active Ingredient Integrity
                  </h4>
                  <p className="text-xs text-brand-grey dark:text-gray-400 leading-normal font-medium">
                    We use premium molecules like Salicylic Acid, Kojic Acid Dipalmitate, and Bio-Peptides tested strictly for biological compatibility and shelf stability.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 border border-brand-border dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs hover:shadow-xs transition-shadow">
                <ShieldCheck className="text-brand-blue shrink-0 mt-1" size={20} />
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white uppercase font-heading">
                    Dermatologically Approved Safety
                  </h4>
                  <p className="text-xs text-brand-grey dark:text-gray-400 leading-normal font-medium">
                    All formulations are tested strictly on human skin panels by leading dermatologists. Our products are 100% non-comedogenic and hypoallergenic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay="delay-150">
          <div className="relative rounded-2xl overflow-hidden border border-brand-border dark:border-zinc-800 shadow-md aspect-video bg-zinc-100">
            <img 
              src="/assets/banners/about_ngo_banner.jpg" 
              alt="Dermatology Laboratory" 
              className="w-full h-full object-cover grayscale-30 dark:grayscale-50 group-hover:scale-103 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/10 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white space-y-1">
              <span className="text-[9px] font-extrabold text-brand-yellow uppercase tracking-widest font-heading">
                Sterile Clean Room
              </span>
              <h3 className="text-sm font-extrabold uppercase font-heading">Derma Secret Clinical Lab</h3>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Clinical Research Stats Grid */}
      <section className="bg-brand-bg-grey dark:bg-zinc-900 border-y border-brand-border dark:border-zinc-800 py-12 px-4 rounded-2xl">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center justify-items-center">
          {stats.map((stat, idx) => (
            <ScrollReveal key={idx} delay={idx === 0 ? '' : `delay-${idx * 75}`}>
              <div className="space-y-2 max-w-[200px]">
                <div className="w-12 h-12 bg-white dark:bg-zinc-850 rounded-full border border-brand-border dark:border-zinc-800 flex items-center justify-center mx-auto shadow-xs">
                  {stat.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white font-heading tracking-tight uppercase leading-none">
                  {stat.value}
                </h3>
                <p className="text-[10px] text-brand-grey dark:text-gray-400 font-semibold uppercase tracking-wider leading-relaxed">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. Trust Seals & Standards */}
      <section className="space-y-10">
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark dark:text-white font-heading uppercase tracking-tight">
              Safety & Certification Standards
            </h2>
            <div className="w-16 h-1 bg-brand-blue mx-auto rounded-full"></div>
            <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium">
              We operate under WHO-GMP certified manufacturing practices, keeping our formulations safe and standard.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ScrollReveal>
            <div className="p-6 border border-brand-border dark:border-zinc-800/80 rounded-xl space-y-3 bg-white dark:bg-zinc-900 text-center shadow-2xs">
              <Award className="text-brand-yellow mx-auto" size={32} />
              <h3 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white uppercase font-heading">
                WHO-GMP Certified
              </h3>
              <p className="text-xs text-brand-grey dark:text-gray-400 leading-relaxed font-medium">
                Our sterile production lines fully comply with World Health Organization Good Manufacturing Practices for complete sterile integrity.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay="delay-75">
            <div className="p-6 border border-brand-border dark:border-zinc-800/80 rounded-xl space-y-3 bg-white dark:bg-zinc-900 text-center shadow-2xs">
              <ShieldCheck className="text-brand-blue mx-auto" size={32} />
              <h3 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white uppercase font-heading">
                Dermatologist Recommended
              </h3>
              <p className="text-xs text-brand-grey dark:text-gray-400 leading-relaxed font-medium">
                We are actively prescribed by over 10,000 certified dermatologists in India and globally for managing severe acne, melasma, and eczema.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay="delay-150">
            <div className="p-6 border border-brand-border dark:border-zinc-800/80 rounded-xl space-y-3 bg-white dark:bg-zinc-900 text-center shadow-2xs">
              <HeartPulse className="text-brand-accent mx-auto animate-pulse" size={32} />
              <h3 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white uppercase font-heading">
                100% Recyclable Packaging
              </h3>
              <p className="text-xs text-brand-grey dark:text-gray-400 leading-relaxed font-medium">
                All our tubes, pump caps, and shipping boxes are entirely plastic-neutral and 100% recyclable, safeguarding both your skin and our ecology.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-brand-blue-dark dark:bg-zinc-950 p-8 sm:p-12 rounded-2xl text-center space-y-6 shadow-md text-white">
        <h3 className="text-xl sm:text-2xl font-black font-heading uppercase tracking-tight text-white leading-none">
          Experience Dermatological Care
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed font-medium">
          Start your clinical skincare journey with our expert dermatology formulations today. Order above ₹449 and enjoy free delivery and 15% automatic discount.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/shop"
            className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            Shop Clinical Catalog
          </Link>
          <Link
            to="/categories"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-all border border-white/20 cursor-pointer"
          >
            Explore Categories
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;

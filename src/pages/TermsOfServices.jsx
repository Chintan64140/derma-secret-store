import React, { useState } from 'react';
import { FileText, UserCheck, ShieldAlert, Scale, Edit3, ShoppingBag, Eye, Ban, HelpCircle, Mail, Phone, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

const TermsOfServices = () => {
  const [activeSection, setActiveSection] = useState('welcome');

  const sections = [
    { id: 'welcome', label: 'Welcome & Eligibility' },
    { id: 'ip', label: 'Intellectual Property' },
    { id: 'conditions', label: 'General Conditions' },
    { id: 'products', label: 'Product & Pricing' },
    { id: 'billing', label: 'Orders & Billing' },
    { id: 'prohibited', label: 'Prohibited Activities' },
    { id: 'disclaimer', label: 'Liability & Disclaimer' },
    { id: 'governing', label: 'Governing Law' }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-grey dark:bg-zinc-950 transition-colors duration-300">
      <SEO 
        title="Terms & Conditions"
        description="Read the Derma Secret Terms and Conditions. Understand eligibility, intellectual property rules, order billing policies, and governing law."
        keywords="terms and conditions, terms of service, user agreement, website eligibility, e-commerce terms"
      />

      {/* Hero Banner Section */}
      <div className="bg-gradient-to-r from-brand-blue-dark via-brand-blue to-indigo-900 text-white py-16 px-4 relative overflow-hidden border-b border-brand-border dark:border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-brand-yellow font-heading text-xs font-semibold uppercase tracking-wider">
            <Scale size={12} /> Agreement & Guidelines
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading uppercase tracking-tight">
            Terms & Conditions
          </h1>
          <div className="w-16 h-1 bg-brand-yellow mx-auto rounded-full"></div>
          <p className="text-xs sm:text-sm text-gray-200 max-w-xl mx-auto font-medium">
            Please read these Terms carefully before using our website or purchasing our products.
          </p>
          <p className="text-[11px] text-gray-300 font-semibold uppercase tracking-wider">
            Last Updated: June 2026
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sticky Sidebar Navigation */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-zinc-800 p-6 shadow-xs space-y-4">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-brand-dark dark:text-white border-b border-brand-border dark:border-zinc-800 pb-3 flex items-center gap-2">
                <FileText size={14} className="text-brand-blue" /> Document Outline
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 uppercase tracking-wide flex items-center gap-2 ${
                      activeSection === section.id
                        ? 'bg-brand-blue text-white dark:bg-brand-blue dark:text-white shadow-sm'
                        : 'text-brand-grey hover:text-brand-dark hover:bg-brand-blue-light/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${activeSection === section.id ? 'bg-brand-yellow' : 'bg-transparent'}`}></span>
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Terms content column */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-zinc-800 p-6 sm:p-10 shadow-xs space-y-12">
            
            {/* Welcome & Eligibility */}
            <section id="welcome" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <UserCheck size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Welcome & Eligibility
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                Welcome to <strong>Derma Secret</strong>. Throughout this website, the terms &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;, and &ldquo;Derma Secret&rdquo; refer to Derma Secret. By accessing our website, browsing our content, or purchasing products from us, you agree to be bound by these Terms & Conditions.
              </p>
              <div className="p-5 border border-brand-border dark:border-zinc-800 rounded-xl bg-brand-bg-grey dark:bg-zinc-850 space-y-3">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-brand-dark dark:text-white">
                  User Eligibility
                </h4>
                <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-normal">
                  By using our website, you confirm that:
                </p>
                <ul className="text-xs text-brand-dark dark:text-gray-300 font-semibold space-y-1.5 list-disc pl-4">
                  <li>You are at least 18 years of age, or</li>
                  <li>You are using the website under the supervision and consent of a parent or legal guardian.</li>
                </ul>
                <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                  If you do not agree to these Terms & Conditions, you should not access or use our website. Your use of our website is also governed by our Privacy Policy.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section id="ip" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <Eye size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Intellectual Property Rights
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                All content available on the Derma Secret website, including but not limited to logos, product images, graphics, text, designs, videos, product descriptions, and website layout, is the property of Derma Secret and is protected under applicable intellectual property laws.
              </p>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                You may not copy, reproduce, distribute, modify, publish, or exploit any content without our prior written permission.
              </p>
            </section>

            {/* General Conditions */}
            <section id="conditions" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <ShieldAlert size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  General Conditions
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                We reserve the right to:
              </p>
              <ul className="text-xs text-brand-dark dark:text-gray-300 font-semibold space-y-2 list-disc pl-4">
                <li>Refuse service to anyone for any reason at any time.</li>
                <li>Limit or cancel orders placed by customers at our sole discretion.</li>
                <li>Modify or discontinue products, prices, or website features without prior notice.</li>
                <li>Restrict access to certain areas of the website.</li>
              </ul>
              <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                We shall not be liable to you or any third party for any modifications, price changes, suspensions, or interruptions of the website or services.
              </p>
            </section>

            {/* Product & Pricing */}
            <section id="products" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Product Details & Pricing
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                We strive to provide highly accurate details regarding product descriptions, ingredients, pricing, and stock availability. However, we do not warrant that all descriptions are complete, error-free, or current. Product packaging images are for illustrative purposes and actual shapes or color details may vary slightly.
              </p>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed font-bold">
                All prices on the portal are shown in Indian Rupees (INR) and are subject to change without notice.
              </p>
            </section>

            {/* Orders & Billing */}
            <section id="billing" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <Edit3 size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Orders & Billing Information
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                By placing an order, you agree to provide accurate, complete, and current billing and shipping details. We reserve the right to verify payment details, request additional information, or limit quantities on orders that appear to be placed by dealers, resellers, or distributors.
              </p>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                If an order is cancelled or modified after payment, refunds will be processed in accordance with our Refund & Replacement Policy.
              </p>
            </section>

            {/* Prohibited Activities */}
            <section id="prohibited" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <Ban size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Prohibited Activities
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                You are strictly prohibited from using the website or its content for:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-brand-dark dark:text-gray-300 font-semibold pl-4 list-disc space-y-1 md:space-y-0">
                <li>Any unlawful or fraudulent purpose</li>
                <li>Soliciting others to perform unlawful acts</li>
                <li>Uploading viruses, malware, or malicious code</li>
                <li>Harassing, abusing, insulting, or defaming others</li>
                <li>Violating intellectual property rights</li>
                <li>Collecting personal data of other users</li>
                <li>Spamming, phishing, crawling, or scraping data</li>
              </ul>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                Violation of these terms may result in immediate suspension or termination of your access to our services.
              </p>
            </section>

            {/* Liability & Disclaimer */}
            <section id="disclaimer" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <HelpCircle size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Warranties & Liability Limits
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                All products, services, and content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. Derma Secret does not guarantee that the website will run uninterrupted or error-free.
              </p>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                Individual skincare results may vary depending on skin type, active issues, compatibility, and lifestyle. Information is not a substitute for professional dermatologist consultation.
              </p>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                To the maximum extent permitted by law, Derma Secret shall not be liable for any direct, indirect, incidental, or consequential damages. Our total liability shall not exceed the amount paid by you for the relevant order.
              </p>
            </section>

            {/* Governing Law */}
            <section id="governing" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 border-t border-brand-border dark:border-zinc-800 pt-8">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <Scale size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Governing Law & Disputes
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                These Terms & Conditions shall be governed and interpreted in accordance with the laws of India. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts located in Gujarat, India.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="flex items-center gap-3 p-4 border border-brand-border dark:border-zinc-800 rounded-xl bg-brand-bg-grey dark:bg-zinc-850">
                  <Mail className="text-brand-blue shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] text-brand-grey uppercase tracking-wider font-heading">Support Email</p>
                    <a href="mailto:support@dermasecret.shop" className="text-brand-dark dark:text-white hover:text-brand-blue transition-colors">support@dermasecret.shop</a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-brand-border dark:border-zinc-800 rounded-xl bg-brand-bg-grey dark:bg-zinc-850">
                  <Phone className="text-brand-blue shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] text-brand-grey uppercase tracking-wider font-heading">Call Support</p>
                    <span className="text-brand-dark dark:text-white">+91 7990952840</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-brand-border dark:border-zinc-800 rounded-xl bg-brand-bg-grey dark:bg-zinc-850">
                  <MapPin className="text-brand-blue shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] text-brand-grey uppercase tracking-wider font-heading">Region</p>
                    <span className="text-brand-dark dark:text-white">Surat, Gujarat, India</span>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServices;

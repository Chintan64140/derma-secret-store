import React, { useState } from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, AlertCircle, Mail, Phone, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', label: 'Introduction' },
    { id: 'collection', label: 'Information We Collect' },
    { id: 'usage', label: 'How We Use Your Information' },
    { id: 'sharing', label: 'Sharing of Information' },
    { id: 'cookies', label: 'Cookies & Tracking' },
    { id: 'security', label: 'Data Security' },
    { id: 'rights', label: 'Your Rights' },
    { id: 'contact', label: 'Contact Us' }
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
        title="Privacy Policy"
        description="Learn how Derma Secret collects, uses, stores, and protects your personal and automatically collected data."
        keywords="privacy policy, data protection, personal information security, cookies, user rights, Derma Secret"
      />

      {/* Hero Banner Section */}
      <div className="bg-gradient-to-r from-brand-blue-dark via-brand-blue to-indigo-900 text-white py-16 px-4 relative overflow-hidden border-b border-brand-border dark:border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-brand-yellow font-heading text-xs font-semibold uppercase tracking-wider">
            <Lock size={12} /> Privacy & Trust
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading uppercase tracking-tight">
            Privacy Policy
          </h1>
          <div className="w-16 h-1 bg-brand-yellow mx-auto rounded-full"></div>
          <p className="text-xs sm:text-sm text-gray-200 max-w-xl mx-auto font-medium">
            At Derma Secret, we respect your privacy and are committed to protecting your personal information.
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

          {/* Privacy content column */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-zinc-800 p-6 sm:p-10 shadow-xs space-y-12">
            
            {/* Introduction */}
            <section id="intro" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <Shield size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Introduction
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                At <strong>Derma Secret</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website, purchase our products, or interact with our services.
              </p>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                By accessing our website, placing an order, subscribing to our communications, or otherwise interacting with our services, you consent to the collection, use, and disclosure of your information as described in this Privacy Policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section id="collection" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <Eye size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Information We Collect
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                We may collect the following types of information:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 border border-brand-border dark:border-zinc-800 rounded-xl bg-brand-bg-grey dark:bg-zinc-850 space-y-3">
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-blue dark:text-brand-yellow flex items-center gap-2">
                    <CheckCircle2 size={14} /> Personal Information
                  </h3>
                  <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-normal">
                    When you place an order, create an account, subscribe to our newsletter, or contact us, we may collect:
                  </p>
                  <ul className="text-xs text-brand-dark dark:text-gray-300 font-semibold space-y-1.5 list-disc pl-4">
                    <li>Full Name</li>
                    <li>Email Address</li>
                    <li>Phone Number</li>
                    <li>Billing and Shipping Address</li>
                    <li>Payment Information</li>
                    <li>Order History</li>
                  </ul>
                </div>

                <div className="p-5 border border-brand-border dark:border-zinc-800 rounded-xl bg-brand-bg-grey dark:bg-zinc-850 space-y-3">
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-blue dark:text-brand-yellow flex items-center gap-2">
                    <CheckCircle2 size={14} /> Automatically Collected
                  </h3>
                  <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-normal">
                    When you browse our website, we may automatically collect:
                  </p>
                  <ul className="text-xs text-brand-dark dark:text-gray-300 font-semibold space-y-1.5 list-disc pl-4">
                    <li>IP Address</li>
                    <li>Browser Type & Operating System</li>
                    <li>Device Information</li>
                    <li>Website Usage & Navigation Data</li>
                    <li>Cookies and Similar Tracking Technologies</li>
                  </ul>
                  <p className="text-[11px] text-brand-grey dark:text-gray-500 font-medium leading-normal">
                    This information helps us improve our website performance, user experience, and security.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section id="usage" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <FileText size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  How We Use Your Information
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                We use the information collected to:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-brand-dark dark:text-gray-300 font-semibold pl-4 list-disc space-y-1 md:space-y-0">
                <li>Process and fulfill orders</li>
                <li>Provide order confirmations & shipping updates</li>
                <li>Process payments securely</li>
                <li>Respond to customer inquiries and support requests</li>
                <li>Send promotional emails and product updates (with consent)</li>
                <li>Improve our products, services, and website experience</li>
                <li>Analyze website traffic and customer behavior</li>
                <li>Prevent fraud and enhance website security</li>
                <li>Comply with legal obligations and regulatory requirements</li>
              </ul>
            </section>

            {/* Sharing of Information */}
            <section id="sharing" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <AlertCircle size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Sharing of Information
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                <strong>We do not sell, rent, or trade your personal information to third parties.</strong>
              </p>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                We may share your information with trusted third-party service providers that assist us in:
              </p>
              <ul className="text-xs text-brand-dark dark:text-gray-300 font-semibold space-y-1.5 list-disc pl-4">
                <li>Payment Processing & Gateways</li>
                <li>Order Fulfillment and Shipping Logistics</li>
                <li>Email Marketing & Communication Services</li>
                <li>Website Analytics & Optimization</li>
                <li>Customer Support Services</li>
              </ul>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                These partners are required to maintain the confidentiality and security of your information. We may also disclose information when required by law, court order, or to protect our legal rights.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section id="cookies" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <Shield size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Cookies & Tracking Technologies
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                Our website uses cookies and similar technologies to remember your preferences, improve website functionality, analyze website traffic, and deliver personalized content and promotions.
              </p>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                You may disable cookies through your browser settings; however, some website features may not function properly.
              </p>
            </section>

            {/* Data Security */}
            <section id="security" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <Lock size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Data Security
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                We implement industry-standard security measures to protect your personal information. Our website utilizes Secure Socket Layer (SSL) encryption and secure payment gateways to safeguard sensitive information during transmission.
              </p>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                While we strive to use commercially acceptable means to protect your data, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            {/* Your Rights */}
            <section id="rights" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <CheckCircle2 size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Your Rights & Options
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                You have the right to:
              </p>
              <ul className="text-xs text-brand-dark dark:text-gray-300 font-semibold space-y-1.5 list-disc pl-4">
                <li>Access your personal information that we hold</li>
                <li>Correct or update inaccurate information</li>
                <li>Request deletion of your data from our systems</li>
                <li>Withdraw marketing consent at any time (via unsubscribe link or contacting support)</li>
                <li>Request information about how your data is processed and used</li>
              </ul>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                Withdrawal of consent will not affect the legality of data processing conducted before consent was withdrawn.
              </p>
            </section>

            {/* Contact Us */}
            <section id="contact" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 border-t border-brand-border dark:border-zinc-800 pt-8">
                <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
                  <Mail size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
                  Contact Us
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                If you have any questions regarding this Privacy Policy or the handling of your personal information, please reach out to us:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="flex items-center gap-3 p-4 border border-brand-border dark:border-zinc-800 rounded-xl bg-brand-bg-grey dark:bg-zinc-850">
                  <Mail className="text-brand-blue shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] text-brand-grey uppercase tracking-wider font-heading">Email Support</p>
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
                    <p className="text-[10px] text-brand-grey uppercase tracking-wider font-heading">Address</p>
                    <span className="text-brand-dark dark:text-white">F-3 Liberty nine, Mota Varachha, Surat - 394101</span>
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

export default PrivacyPolicy;

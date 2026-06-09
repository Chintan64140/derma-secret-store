import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, HeartPulse, RefreshCw } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import SEO from '../components/SEO';

const Contact = () => {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all mandatory fields (*).');
      return;
    }

    setSubmitting(true);
    setError('');
    
    // Simulate API delay
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      // Reset fields
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1200);
  };

  const contactDetails = [
    { icon: <Phone className="text-brand-blue" size={20} />, title: 'Dermatology Tele-Consult', info: '1800-102-345 (Toll Free)', desc: 'Mon - Sat: 9 AM to 6 PM IST' },
    { icon: <Mail className="text-brand-blue" size={20} />, title: 'Support & Queries', info: 'support@dermasecret.com', desc: 'Average response: under 12 hours' },
    { icon: <MapPin className="text-brand-blue" size={20} />, title: 'Clinical HQ Address', info: 'Derma Secret Laboratory', desc: 'Sector-44, Gurugram, HR - 122003' }
  ];

  const faqs = [
    { q: 'Are consultations completely free?', a: 'Yes! Our clinical dermatology consultation program is 100% free of charge. Simply fill out the skin profile form or dial our toll-free number.' },
    { q: 'How long does shipping take?', a: 'Orders are dispatched within 24 hours from our laboratories. Delivery typically takes 2-4 business days across India.' },
    { q: 'Can I cancel or modify my order?', a: 'You can cancel or change your order details within 2 hours of placement. Contact support at support@dermasecret.com or dial +91 1800-102-345.' },
    { q: 'What is the return policy for allergic reactions?', a: 'Though our products are highly hypoallergenic, if you experience an adverse reaction, contact our support team. We offer full refund guarantees on dermatologist-certified reaction logs.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 dark:bg-[#121212] transition-colors duration-300">
      <SEO 
        title="Contact Us & Free Skin Consultation"
        description="Get in touch with Derma Secret customer support or submit your digital skincare profile for a free consultation with our certified dermatologists."
        keywords="contact derma secret, skin consult helpline, free dermatologist consultation, skincare support"
      />
      
      {/* 1. Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[11px] font-extrabold text-brand-blue dark:text-brand-blue-light uppercase tracking-widest font-heading bg-brand-blue-light dark:bg-brand-blue/10 px-3.5 py-1.5 rounded-full">
          Dermatology Support Hub
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white font-heading uppercase tracking-tight">
          Connect With Skincare Experts
        </h1>
        <div className="w-16 h-1 bg-brand-blue mx-auto rounded-full"></div>
        <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
          Need clinical advice or have a question about your order? Send us a message or schedule a free telephone consultation.
        </p>
      </div>

      {/* 2. Main Contact Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* Left Column: Direct info & contact cards */}
        <div className="lg:col-span-2 space-y-6">
          <ScrollReveal>
            <div className="bg-brand-bg-grey dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-sm sm:text-base font-bold text-brand-dark dark:text-white uppercase font-heading tracking-wide border-b border-brand-border dark:border-zinc-800 pb-2">
                Expert Hotlines
              </h2>

              <div className="space-y-5">
                {contactDetails.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-white dark:bg-zinc-850 rounded-full border border-brand-border dark:border-zinc-800 flex items-center justify-center shrink-0 shadow-2xs">
                      {item.icon}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-brand-dark dark:text-gray-250 uppercase font-heading">{item.title}</h4>
                      <p className="text-xs sm:text-sm font-extrabold text-brand-blue dark:text-brand-blue-light">{item.info}</p>
                      <p className="text-[10px] text-brand-grey dark:text-gray-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Working Hours Alert */}
              <div className="flex gap-3 bg-brand-blue-light dark:bg-brand-blue/10 border border-brand-blue/20 dark:border-brand-blue/35 p-4 rounded-xl">
                <Clock className="text-brand-blue shrink-0 mt-0.5" size={16} />
                <p className="text-[11px] leading-relaxed text-brand-blue-dark dark:text-brand-blue-light font-medium">
                  <strong>Consultation Hours:</strong> 9:00 AM to 6:00 PM IST (GMT+5:30) Monday through Saturday. Intake forms submitted outside these hours will be handled immediately the next morning.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Intake Skincare Form */}
        <div className="lg:col-span-3">
          <ScrollReveal delay="delay-100">
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-sm sm:text-base font-bold text-brand-dark dark:text-white uppercase font-heading tracking-wide border-b border-brand-border dark:border-zinc-800 pb-2 flex items-center gap-2">
                <MessageSquare className="text-brand-blue" size={18} /> Digital Skincare Profile Intake
              </h2>

              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
                  <ShieldCheck size={18} />
                  <div>
                    <strong>✓ Profile Queued Successfully!</strong> Your request has been logged. A certified Derma Secret dermatologist will review it and reply within 12 hours.
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-brand-accent dark:text-red-400 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in">
                  <HeartPulse className="text-brand-accent animate-pulse" size={16} />
                  <span>⚠ {error}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                    placeholder="e.g. Rahul Verma"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                    placeholder="e.g. rahul@example.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                    placeholder="e.g. +91 9876543210"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Describe Skin Condition / Support Message *</label>
                  <textarea
                    rows="4"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                    placeholder="Include details about active treatments, your skin type, or order support questions..."
                  ></textarea>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="animate-spin" size={14} /> Queuing Profile...
                      </>
                    ) : (
                      'Request Dermatologist Review'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </ScrollReveal>
        </div>

      </section>

      {/* 3. Skincare Support FAQs */}
      <section className="space-y-8 border-t border-brand-border dark:border-zinc-800 pt-16">
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark dark:text-white font-heading uppercase tracking-tight">
              Clinical Support FAQs
            </h2>
            <div className="w-16 h-1 bg-brand-blue mx-auto rounded-full"></div>
            <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium">
              Find quick answers to typical support and consultation queries.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {faqs.map((faq, idx) => (
            <ScrollReveal key={idx} delay={idx % 2 === 0 ? '' : 'delay-75'}>
              <div className="p-5 border border-brand-border dark:border-zinc-800 rounded-xl space-y-2 bg-white dark:bg-zinc-900 shadow-2xs h-full">
                <h4 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white uppercase font-heading flex items-start gap-2 leading-snug">
                  <span className="text-brand-blue font-extrabold text-sm font-heading mt-[-2px]">Q.</span> {faq.q}
                </h4>
                <p className="text-xs text-brand-grey dark:text-gray-400 leading-relaxed font-medium pl-4 border-l-2 border-brand-blue-light dark:border-zinc-850">
                  {faq.a}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Contact;

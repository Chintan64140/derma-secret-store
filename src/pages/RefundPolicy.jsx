import React from 'react';
import { RefreshCw, Ban, AlertTriangle, AlertCircle, Play, Mail, FileCheck } from 'lucide-react';
import SEO from '../components/SEO';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-brand-bg-grey dark:bg-zinc-950 transition-colors duration-300">
      <SEO 
        title="Refund & Replacement Policy"
        description="Review Derma Secret's Refund and Replacement Policy. Learn about non-returnable products, replacement eligibility, and mandatory unboxing video requirements."
        keywords="refund policy, replacement policy, unboxing video requirement, damaged product replacement, non-returnable skincare"
      />

      {/* Hero Banner Section */}
      <div className="bg-gradient-to-r from-brand-blue-dark via-brand-blue to-indigo-900 text-white py-16 px-4 relative overflow-hidden border-b border-brand-border dark:border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-brand-yellow font-heading text-xs font-semibold uppercase tracking-wider">
            <RefreshCw size={12} className="animate-spin-slow" /> Care & Support
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading uppercase tracking-tight">
            Refund & Replacement
          </h1>
          <div className="w-16 h-1 bg-brand-yellow mx-auto rounded-full"></div>
          <p className="text-xs sm:text-sm text-gray-200 max-w-xl mx-auto font-medium">
            Please read our refund, cancellation, and replacement guidelines carefully before placing an order.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Important Warning Banner */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 sm:p-8 flex items-start gap-4 shadow-2xs">
          <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-xl text-brand-accent shrink-0">
            <Ban size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-red-800 dark:text-red-400">
              Important Notice
            </h3>
            <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 font-bold uppercase tracking-wide">
              All products are non-returnable.
            </p>
            <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
              Due to the clinical, sanitary, and hygiene nature of skincare and dermatological formulations, we do not accept returns once products have been delivered. However, we offer replacements under specific circumstances outlined below.
            </p>
          </div>
        </div>

        {/* Replacement Eligibility Cards */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-zinc-800 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-brand-border dark:border-zinc-800 pb-4">
            <div className="p-2 bg-brand-blue-light dark:bg-brand-blue/10 rounded-lg text-brand-blue">
              <FileCheck size={20} />
            </div>
            <h2 className="text-base sm:text-lg font-black font-heading text-brand-dark dark:text-white uppercase tracking-tight">
              Replacements will be approved only if:
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-brand-border dark:border-zinc-800/80 rounded-xl bg-brand-bg-grey dark:bg-zinc-850 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
              <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-brand-dark dark:text-white">Damaged Product</h4>
                <p className="text-[11px] text-brand-grey dark:text-gray-400 font-medium mt-1">You received a physically damaged or broken product package.</p>
              </div>
            </div>

            <div className="p-4 border border-brand-border dark:border-zinc-800/80 rounded-xl bg-brand-bg-grey dark:bg-zinc-850 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
              <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-brand-dark dark:text-white">Wrong Product</h4>
                <p className="text-[11px] text-brand-grey dark:text-gray-400 font-medium mt-1">The product received does not match the items in your order invoice.</p>
              </div>
            </div>

            <div className="p-4 border border-brand-border dark:border-zinc-800/80 rounded-xl bg-brand-bg-grey dark:bg-zinc-850 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
              <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-brand-dark dark:text-white">Used or Tampered</h4>
                <p className="text-[11px] text-brand-grey dark:text-gray-400 font-medium mt-1">The product seal is broken, or the container shows obvious signs of use.</p>
              </div>
            </div>

            <div className="p-4 border border-brand-border dark:border-zinc-800/80 rounded-xl bg-brand-bg-grey dark:bg-zinc-850 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
              <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-brand-dark dark:text-white">Incomplete Order</h4>
                <p className="text-[11px] text-brand-grey dark:text-gray-400 font-medium mt-1">Items are missing from your package compared to your packing list.</p>
              </div>
            </div>
          </div>

          <div className="p-5 border border-brand-yellow/30 rounded-xl bg-brand-yellow/5 space-y-2 mt-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-amber-700 dark:text-brand-yellow flex items-center gap-1.5">
              <AlertCircle size={14} /> Near Expiry Shelf Life
            </h4>
            <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
              If the product delivered has **less than 30 days of shelf life remaining** from the date of delivery (i.e., the expiry date on the product is within 30 days of the delivery date), a refund or replacement will be provided.
            </p>
          </div>
        </div>

        {/* Video Requirement Warning Card */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-brand-yellow/30 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-yellow/20 rounded-xl text-amber-600 dark:text-brand-yellow shrink-0">
              <Play size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-amber-800 dark:text-brand-yellow">
                Mandatory Unboxing Video
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider">
                A clear unboxing video is required for all claims.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed pl-1 sm:pl-14">
            The video must show the package being opened, a clear view of the shipping label, and the exact condition of the product, including a clear view of the expiry date. Claims without a valid unboxing video will not be processed.
          </p>
        </div>

        {/* Cancellation, Claims, and Gifts */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-zinc-800 p-6 sm:p-10 shadow-xs space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-brand-dark dark:text-white flex items-center gap-2">
                <AlertTriangle size={16} className="text-brand-blue" /> Order Cancellation
              </h3>
              <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                Orders **cannot be cancelled once shipped**. Orders that have not yet been dispatched from our warehouse may be cancelled.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-brand-dark dark:text-white flex items-center gap-2">
                <Mail size={16} className="text-brand-blue" /> 5-Day Claim Window
              </h3>
              <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                To request a replacement, email <a href="mailto:customercare@dermatouch.com" className="text-brand-blue dark:text-brand-yellow font-bold underline">customercare@dermatouch.com</a> within **5 days of delivery**. Requests raised after 5 days from the delivery date will not be accepted.
              </p>
            </div>
          </div>

          <div className="border-t border-brand-border dark:border-zinc-800 pt-6 space-y-3">
            <h3 className="font-heading font-black text-xs uppercase tracking-wider text-brand-dark dark:text-white">
              Free Gifts & Promotional Products
            </h3>
            <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
              **Note:** All free gifts, complimentary items, and promotional products are provided on a non-commercial basis and are strictly non-returnable, non-refundable, and non-replaceable under any circumstances. No exchanges, credits, or claims will be accepted for such items.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RefundPolicy;

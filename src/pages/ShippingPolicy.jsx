import React from 'react';
import { Truck, Package, MapPin, Clock, Search, ShieldCheck, AlertCircle, Mail } from 'lucide-react';
import SEO from '../components/SEO';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-brand-bg-grey dark:bg-zinc-950 transition-colors duration-300">
      <SEO 
        title="Shipping Policy"
        description="Learn about Derma Secret's packaging standards, delivery coverage (India only), estimated delivery timelines, and free shipping terms."
        keywords="shipping policy, free shipping India, track order, delivery timeline, secure packaging, Derma Secret"
      />

      {/* Hero Banner Section */}
      <div className="bg-gradient-to-r from-brand-blue-dark via-brand-blue to-indigo-900 text-white py-16 px-4 relative overflow-hidden border-b border-brand-border dark:border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-brand-yellow font-heading text-xs font-semibold uppercase tracking-wider">
            <Truck size={12} /> Shipping & Fulfillment
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading uppercase tracking-tight">
            Shipping Policy
          </h1>
          <div className="w-16 h-1 bg-brand-yellow mx-auto rounded-full"></div>
          <p className="text-xs sm:text-sm text-gray-200 max-w-xl mx-auto font-medium">
            Read about our delivery timelines, premium packaging, tracking options, and nationwide coverage.
          </p>
          <p className="text-[11px] text-gray-300 font-semibold uppercase tracking-wider">
            Last Updated: June 2026
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Upper Grid: Delivery and Packaging */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-brand-border dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-blue-light dark:bg-brand-blue/10 rounded-xl text-brand-blue">
                <Truck size={20} />
              </div>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-brand-dark dark:text-white">
                How Does Delivery Work?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
              Every order goes through a strict quality inspection before dispatch. Once confirmed, our team checks each product to ensure it meets our clinical standards.
            </p>
            <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
              After inspection, your products are securely packed and handed over to our trusted logistics partners. The courier partner may contact you directly if there are issues locating your delivery address.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-brand-border dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-blue-light dark:bg-brand-blue/10 rounded-xl text-brand-blue">
                <Package size={20} />
              </div>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-brand-dark dark:text-white">
                Premium Packaging
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
              We believe great skincare deserves great packaging. All Derma Secret products are carefully packed using secure, durable materials to prevent damage during transit.
            </p>
            <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
              Products are placed inside premium protective boxes and then enclosed in sturdy shipping cartons to ensure they arrive safely and in excellent condition.
            </p>
          </div>
        </div>

        {/* Highlight Card: Coverage and Cost */}
        <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-brand-border dark:divide-zinc-800">
            
            {/* Left side: Coverage */}
            <div className="space-y-4 pb-6 md:pb-0 md:pr-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-blue-light dark:bg-brand-blue/10 rounded-xl text-brand-blue">
                  <MapPin size={20} />
                </div>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-brand-dark dark:text-white">
                  Shipping Coverage
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                Derma Secret currently ships **only within India**. We deliver to most cities, towns, and serviceable pin codes across the nation. At this time, we do not offer international shipping.
              </p>
            </div>

            {/* Right side: Charges */}
            <div className="space-y-4 pt-6 md:pt-0 md:pl-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-blue-light dark:bg-brand-blue/10 rounded-xl text-brand-blue">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-brand-dark dark:text-white">
                  Shipping Charges
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 rounded-xl text-emerald-850 dark:text-emerald-450 font-heading font-bold text-xs uppercase tracking-wider text-center">
                FREE Shipping Across India
              </div>
              <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                We offer **FREE shipping across India** on all orders placed through the Derma Secret website. No additional charges will be applied during checkout.
              </p>
            </div>

          </div>
        </div>

        {/* Grid: Delivery Time & Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-brand-border dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-blue-light dark:bg-brand-blue/10 rounded-xl text-brand-blue">
                <Clock size={20} />
              </div>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-brand-dark dark:text-white">
                Estimated Delivery Time
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
              Orders are generally delivered within **2–6 business days** from the date of order confirmation. Timelines may vary depending on:
            </p>
            <ul className="text-xs text-brand-dark dark:text-gray-300 font-semibold space-y-1.5 list-disc pl-4">
              <li>Delivery location accessibility</li>
              <li>Courier partner routing and availability</li>
              <li>Extreme weather conditions or public holidays</li>
              <li>Unexpected logistical delays or disruptions</li>
            </ul>
            <p className="text-[11px] text-brand-grey dark:text-gray-500 font-medium">
              During festive seasons or periods of high order volume, deliveries may take an additional 2–3 business days. Business days exclude Sundays and public holidays.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-brand-border dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-blue-light dark:bg-brand-blue/10 rounded-xl text-brand-blue">
                <Search size={20} />
              </div>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-brand-dark dark:text-white">
                Order Tracking & Shipments
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
              Once your order is shipped, you will receive a confirmation via SMS and/or email containing your **Tracking Number, Courier Details, and a Direct Tracking Link**.
            </p>
            <p className="text-xs sm:text-sm text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
              You can track your order status directly on our portal.
            </p>
            <div className="border-t border-brand-border dark:border-zinc-800 pt-4 space-y-2">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-brand-dark dark:text-white">
                Multiple Shipments
              </h4>
              <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                Items within the same order may occasionally be shipped separately if they dispatch from different warehouse locations. You will receive separate tracking details for each shipment.
              </p>
            </div>
          </div>

        </div>

        {/* Delivery Delays & Address Information */}
        <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-3">
              <h4 className="font-heading font-black text-xs uppercase tracking-wider text-brand-dark dark:text-white flex items-center gap-2">
                <AlertCircle size={16} className="text-brand-blue" /> Unforeseen Delivery Delays
              </h4>
              <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                While we strive to meet all estimated timelines, delays may occasionally occur due to circumstances beyond our control (e.g. natural disasters, extreme weather, strikes, government restrictions, or major courier backlog).
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-heading font-black text-xs uppercase tracking-wider text-brand-dark dark:text-white flex items-center gap-2">
                <AlertCircle size={16} className="text-brand-blue" /> Address Accuracy
              </h4>
              <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
                Customers are responsible for providing correct shipping coordinates. Derma Secret is not liable for delivery failures or extra shipping fees resulting from incorrect or incomplete address inputs.
              </p>
            </div>

          </div>
        </div>

        {/* Contact/Support */}
        <div className="bg-brand-blue-light dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-2xl p-8 text-center space-y-4 max-w-xl mx-auto">
          <h3 className="font-heading font-black text-sm uppercase tracking-wider text-brand-dark dark:text-white">
            Need Shipping Assistance?
          </h3>
          <p className="text-xs text-brand-grey dark:text-gray-400 font-medium leading-relaxed">
            For any shipping-related questions or assistance, please contact our support team.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-brand-blue dark:text-brand-yellow">
            <Mail size={14} />
            <a href="mailto:support@dermasecret.shop">support@dermasecret.shop</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ShippingPolicy;

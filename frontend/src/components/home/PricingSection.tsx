"use client";

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

const TIERS = [
  {
    name: "Starter",
    price: "0",
    desc: "Perfect for small teams just getting started.",
    features: ["Up to 10 employees", "Basic leave tracking", "Attendance logs", "Community support"],
    cta: "Start for free",
    popular: false
  },
  {
    name: "Pro",
    price: "199",
    desc: "Advanced features for growing organizations.",
    features: ["Unlimited employees", "Smart scheduling AI", "Document storage (10GB)", "Priority support", "Full AI analytics"],
    cta: "Try Pro free",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Customized solutions for large-scale operations.",
    features: ["Dedicated account manager", "Custom API integrations", "Unlimited storage", "SLA guarantees", "Advanced RBAC"],
    cta: "Contact sales",
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-400 dark:text-gray-400 max-w-2xl mx-auto text-lg font-normal">
            Choose the plan that fits your team size and complexity. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TIERS.map((tier, i) => (
            <motion.div 
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl border ${
                tier.popular 
                  ? 'border-[#185FA5] bg-white dark:bg-gray-900 shadow-2xl scale-105 z-10' 
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#185FA5] text-white text-[10px] font-medium uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-medium text-gray-900 dark:text-white">
                  {tier.price !== "Custom" && tier.price !== "0" && <span className="text-lg">MAD </span>}
                  {tier.price === "0" ? "Free" : tier.price}
                </span>
                {tier.price !== "Custom" && tier.price !== "0" && <span className="text-gray-400 text-sm font-medium">/month</span>}
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-400 mb-8 font-medium">{tier.desc}</p>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-400 font-medium">
                    <Check size={16} className="text-[#185FA5] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link 
                href={tier.price === "Custom" ? "mailto:sales@smarthr.com" : "/register"}
                className={`w-full block text-center py-3 rounded-xl font-medium transition-all ${
                  tier.popular 
                    ? 'bg-[#185FA5] text-white shadow-lg shadow-[#185FA5]/30 hover:bg-[#185FA5]/90' 
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

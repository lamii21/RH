"use client";

import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    quote: "SmartHR has completely transformed how we handle leave requests. What used to take hours now happens in minutes with automated balances.",
    author: "Amin Benjelloun",
    role: "HR Director",
    company: "Atlas Technologies",
    initials: "AB"
  },
  {
    quote: "The AI churn prediction is a game changer. We've been able to proactively address employee concerns before they become issues.",
    author: "Sara Mansouri",
    role: "CEO",
    company: "Sahara Digital",
    initials: "SM"
  },
  {
    quote: "Document management was a nightmare until we started using SmartHR. Having everything in a secure vault is exactly what we needed.",
    author: "Youssef Alaoui",
    role: "Operations Manager",
    company: "Maghreb Logistics",
    initials: "YA"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white mb-4">
            Trusted by Moroccan enterprises
          </h2>
          <p className="text-gray-400 dark:text-gray-400 max-w-2xl mx-auto text-lg font-normal">
            Join hundreds of forward-thinking companies already using SmartHR to empower their workforce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div 
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm relative"
            >
              <div className="text-[#185FA5] text-5xl font-serif absolute top-4 left-6 opacity-10">"</div>
              <p className="text-sm text-gray-400 dark:text-gray-400 leading-relaxed italic mb-8 relative z-10 font-normal">
                {t.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#185FA5] to-blue-400 text-white font-medium flex items-center justify-center shadow-md">
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t.author}</h4>
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{t.role} • {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

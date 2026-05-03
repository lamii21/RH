"use client";

import { motion } from 'framer-motion';

const SECTION_TITLE = "How It Works";
const STEPS = [
  {
    number: "01",
    title: "Create your account",
    desc: "Register and set up your company profile in minutes."
  },
  {
    number: "02",
    title: "Add your team",
    desc: "Import employees, assign departments and specific roles."
  },
  {
    number: "03",
    title: "Manage everything",
    desc: "Leaves, attendance, documents, and AI insights in one place."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white mb-16">{SECTION_TITLE}</h2>
        
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-[4rem]" />
          
          {STEPS.map((step, i) => (
            <motion.div 
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center max-w-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#185FA5] text-white flex items-center justify-center text-2xl font-medium mb-6 shadow-xl shadow-[#185FA5]/20">
                {step.number}
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 dark:text-gray-400 font-normal leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

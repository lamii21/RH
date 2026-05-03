"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CtaBanner() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden relative">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-x-4 sm:inset-x-8 top-0 bottom-0 bg-[#185FA5] rounded-[40px] -z-10 shadow-2xl shadow-[#185FA5]/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center text-white">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-medium mb-6 leading-tight"
        >
          Ready to modernize your HR?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto font-normal"
        >
          Join 200+ companies streamlining their operations with SmartHR. Start your 14-day free trial today.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/register" 
            className="w-full sm:w-auto bg-white text-[#185FA5] px-8 py-4 rounded-2xl font-medium text-lg hover:bg-gray-50 transition-all active:scale-95"
          >
            Create free account
          </Link>
          <Link 
            href="mailto:sales@smarthr.com" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-medium text-lg border-2 border-white/30 hover:bg-white/10 transition-all active:scale-95"
          >
            Talk to sales
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

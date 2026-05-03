"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] bg-brand-green flex items-center pt-20 overflow-hidden">
      {/* Decorative Gold SVG Curve */}
      <div className="absolute bottom-0 left-0 w-full leading-[0] overflow-hidden">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120H1440V40C1200 120 720 0 0 100V120Z" fill="#F5F5F0" />
          <path d="M0 90C720 -10 1200 110 1440 30" stroke="#C9A84C" strokeWidth="2" strokeOpacity="0.5" />
        </svg>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            Votre investissement <br />
            <span className="text-brand-gold italic font-light">en toute confiance</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-brand-gold text-3xl md:text-4xl font-bold mb-4 tracking-wider" dir="rtl">
              استثمارك في أمان تام
            </p>
            <p className="text-white/80 text-lg max-w-xl leading-relaxed">
              Lotissement Annassim 2 vous propose des lots résidentiels de qualité 
              à Jorf El Melha, dans un cadre de vie serein et bien desservi. 
              Titres fonciers sécurisés et emplacement stratégique.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              href="#nos-lots" 
              className="bg-brand-gold text-brand-green px-8 py-4 rounded-md font-black uppercase tracking-widest text-sm hover:bg-white transition-all text-center"
            >
              Découvrir nos lots
            </Link>
            <Link 
              href="#contact" 
              className="border-2 border-brand-gold text-brand-gold px-8 py-4 rounded-md font-black uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-green transition-all text-center"
            >
              Nous contacter
            </Link>
          </motion.div>
        </div>

        <div className="hidden md:flex justify-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full max-w-md aspect-square rounded-[40px] border-2 border-brand-gold/30 p-4"
          >
            <div className="w-full h-full bg-brand-gold/10 rounded-[28px] flex items-center justify-center p-8 border border-brand-gold/20 backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Architecture" 
                className="w-full h-full object-cover rounded-xl grayscale brightness-75 hover:grayscale-0 transition-all duration-700 shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

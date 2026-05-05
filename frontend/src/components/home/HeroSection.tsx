"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-brand-green flex items-center pt-20 overflow-hidden">
      {/* Dynamic Animated Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-gold rounded-full mix-blend-screen filter blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-dark rounded-full mix-blend-multiply filter blur-[120px] animate-float" />
      </div>

      {/* Decorative Geometry */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 right-1/4 w-[800px] h-[800px] border-[1px] border-white/5 rounded-full z-0 pointer-events-none" 
      />
      <motion.div 
        animate={{ rotate: -360 }} 
        transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-1/3 w-[600px] h-[600px] border-[1px] border-brand-gold/10 rounded-full z-0 pointer-events-none" 
      />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="text-white space-y-8">
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl font-black leading-[0.9]"
            >
              Votre <br />investissement
            </motion.h1>
          </div>
          
          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl text-brand-gold italic font-light tracking-tight"
            >
              en toute confiance.
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-6"
          >
            <p className="text-brand-gold text-3xl md:text-4xl font-bold tracking-wider" dir="rtl">
              استثمارك في أمان تام
            </p>
            <p className="text-white/70 text-lg md:text-xl max-w-xl leading-relaxed font-light">
              Lotissement Annassim 2 vous propose des lots résidentiels de très haute qualité 
              à Jorf El Melha. Titres fonciers sécurisés, urbanisme de pointe et emplacement stratégique.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 pt-4"
          >
            <Link 
              href="#nos-lots" 
              className="group relative overflow-hidden bg-brand-gold text-brand-green px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-sm text-center transition-all hover:scale-105"
            >
              <span className="relative z-10">Découvrir nos lots</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out z-0"></div>
            </Link>
            <Link 
              href="#contact" 
              className="group border border-white/20 hover:border-brand-gold bg-white/5 backdrop-blur-sm text-white px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-sm text-center transition-all hover:bg-brand-gold/10"
            >
              Nous contacter
            </Link>
          </motion.div>
        </div>

        <div className="hidden lg:flex justify-center relative">
          {/* Main Floating Image */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg aspect-[4/5] z-20 animate-float"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/20 to-transparent rounded-[40px] -m-4 blur-xl"></div>
            <div className="w-full h-full glass-panel-dark rounded-[40px] overflow-hidden p-2">
              <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Architecture de prestige" 
                className="w-full h-full object-cover rounded-[32px] hover:scale-110 transition-transform duration-1000 ease-out"
              />
            </div>
            
            {/* Floating Glass Badge */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute -right-12 bottom-20 glass-panel-dark px-8 py-6 rounded-2xl animate-float-slow"
            >
              <p className="text-3xl font-black text-white mb-1">100+</p>
              <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">Lots Disponibles</p>
            </motion.div>

            {/* Floating Glass Badge 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -left-12 top-20 glass-panel px-8 py-6 rounded-2xl animate-float-slow"
              style={{ animationDelay: '1s' }}
            >
              <p className="text-3xl font-black text-brand-green mb-1">100%</p>
              <p className="text-[10px] uppercase tracking-widest text-brand-green font-bold">Titres Sécurisés</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Modern Wave Transition */}
      <div className="absolute bottom-0 left-0 w-full leading-[0] overflow-hidden">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120H1440V40C1000 160 400 -40 0 40V120Z" fill="#F5F5F0" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

"use client";

import { motion } from 'framer-motion';

const StatsBar = () => {
  const stats = [
    { label: 'Lots résidentiels', value: '100+', sub: 'Disponibles' },
    { label: 'Familles installées', value: '50+', sub: 'Confiance' },
    { label: "Années d'expérience", value: '15+', sub: 'Savoir-faire' },
    { label: 'Titres fonciers', value: '100%', sub: 'Sécurisés' },
  ];

  return (
    <div className="relative z-20 -mt-16 container mx-auto px-6">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="glass-panel bg-white/90 rounded-[24px] shadow-2xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-8 relative overflow-hidden group/bar"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/bar:opacity-100 group-hover/bar:animate-gradient-x transition-opacity duration-1000 z-0"></div>
        
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center group relative z-10"
          >
            <p className="text-brand-gold text-5xl font-black mb-2 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 drop-shadow-sm">{stat.value}</p>
            <p className="text-brand-green font-black uppercase tracking-widest text-xs mb-1">{stat.label}</p>
            <p className="text-brand-green/50 text-[10px] italic font-medium tracking-widest uppercase">{stat.sub}</p>
            
            {/* Divider */}
            {i < stats.length - 1 && (
              <div className="hidden lg:block absolute -right-4 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-brand-gold/30 to-transparent" />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default StatsBar;

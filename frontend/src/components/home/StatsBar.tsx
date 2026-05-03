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
    <div className="relative z-20 -mt-12 container mx-auto px-6">
      <div className="bg-white rounded-xl shadow-2xl border border-brand-gold/10 p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center group"
          >
            <p className="text-brand-gold text-4xl font-black mb-1 group-hover:scale-110 transition-transform">{stat.value}</p>
            <p className="text-brand-green font-black uppercase tracking-widest text-[10px] mb-1">{stat.label}</p>
            <p className="text-gray-400 text-[10px] italic font-medium">{stat.sub}</p>
            {i < stats.length - 1 && <div className="hidden lg:block absolute right-0 top-1/4 h-1/2 w-px bg-brand-stone" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;

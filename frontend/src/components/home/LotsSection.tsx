"use client";

import { motion } from 'framer-motion';

const LotsSection = () => {
  const lots = [
    { 
      title: 'Lots Individuels', 
      ar: 'بقع فردية',
      area: '80 – 150 m²', 
      price: '250 000 MAD',
      desc: 'Idéal pour la construction de maisons individuelles R+2.'
    },
    { 
      title: 'Lots Semi-Collectifs', 
      ar: 'بقع شبه جماعية',
      area: '150 – 300 m²', 
      price: '420 000 MAD',
      desc: 'Parfait pour des projets de petits immeubles ou duplex.'
    },
    { 
      title: 'Lots Commerciaux', 
      ar: 'بقع تجارية',
      area: '50 – 120 m²', 
      price: '350 000 MAD',
      desc: 'Emplacements premium pour vos activités commerciales.'
    },
  ];

  return (
    <section id="nos-lots" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h2 className="text-4xl font-black text-brand-green uppercase tracking-tighter">Nos Offres Résidentielles</h2>
            <span className="text-brand-gold text-2xl font-bold" dir="rtl">عروضنا السكنية</span>
          </div>
          <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {lots.map((lot, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-stone p-8 rounded-lg border-t-[3px] border-brand-gold hover:shadow-2xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-brand-green uppercase leading-tight mb-1">{lot.title}</h3>
                  <p className="text-brand-gold font-bold text-lg" dir="rtl">{lot.ar}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-brand-green/60">
                  <span>Superficie</span>
                  <span className="text-brand-green">{lot.area}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-brand-green/60 border-t border-brand-green/5 pt-4">
                  <span>À partir de</span>
                  <span className="text-brand-gold text-lg">{lot.price}</span>
                </div>
              </div>
              
              <p className="text-sm text-brand-dark leading-relaxed mb-8 opacity-80">{lot.desc}</p>
              
              <button className="w-full bg-brand-green group-hover:bg-brand-dark text-brand-gold font-black py-4 rounded-md transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                Demander un devis
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LotsSection;

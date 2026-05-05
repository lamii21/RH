"use client";

import { motion } from 'framer-motion';

const LotsSection = () => {
  const lots = [
    { 
      title: 'Lots Individuels', 
      ar: 'بقع فردية',
      area: '80 – 150 m²', 
      price: '250 000 MAD',
      desc: 'Idéal pour la construction de maisons individuelles R+2.',
      bgImg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    { 
      title: 'Lots Semi-Collectifs', 
      ar: 'بقع شبه جماعية',
      area: '150 – 300 m²', 
      price: '420 000 MAD',
      desc: 'Parfait pour des projets de petits immeubles ou duplex.',
      bgImg: 'https://images.unsplash.com/photo-1502672260266-1c1c2c31e67c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    { 
      title: 'Lots Commerciaux', 
      ar: 'بقع تجارية',
      area: '50 – 120 m²', 
      price: '350 000 MAD',
      desc: 'Emplacements premium pour vos activités commerciales.',
      bgImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="nos-lots" className="py-32 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-stone/30 transform skew-x-[-15deg] origin-top z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="flex flex-col items-center gap-2 mb-6">
            <h2 className="text-5xl font-black text-brand-green uppercase tracking-tighter">Nos Offres Résidentielles</h2>
            <span className="text-brand-gold text-3xl font-bold tracking-widest" dir="rtl">عروضنا السكنية</span>
          </div>
          <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full"></div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {lots.map((lot, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative h-[450px] rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              {/* Background Image & Overlay */}
              <div className="absolute inset-0">
                <img src={lot.bgImg} alt={lot.title} className="w-full h-full object-cover grayscale brightness-[0.4] group-hover:grayscale-0 group-hover:brightness-[0.6] transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green via-brand-green/80 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full p-8 flex flex-col justify-end text-white">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-brand-gold font-bold text-xl mb-1" dir="rtl">{lot.ar}</p>
                  <h3 className="text-2xl font-black uppercase leading-tight mb-4">{lot.title}</h3>
                  
                  <div className="space-y-3 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/70">
                      <span>Superficie</span>
                      <span className="text-brand-gold">{lot.area}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/70 border-t border-white/20 pt-3">
                      <span>À partir de</span>
                      <span className="text-brand-gold text-lg">{lot.price}</span>
                    </div>
                    <p className="text-sm font-light leading-relaxed pt-2">{lot.desc}</p>
                  </div>
                  
                  <button className="w-full bg-brand-gold text-brand-green font-black py-4 rounded-xl transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-white glow-border">
                    Demander un devis
                  </button>
                </div>
              </div>
              
              {/* Animated Border Reveal on Hover */}
              <div className="absolute inset-0 border-2 border-brand-gold rounded-[30px] opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-500 z-20 pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LotsSection;

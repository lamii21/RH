"use client";

import { motion } from 'framer-motion';
import AnnassimLogo from '@/components/ui/AnnassimLogo';

const AboutSection = () => {
  return (
    <section id="a-propos" className="py-32 bg-brand-stone relative overflow-hidden">
      {/* Abstract Background Element */}
      <motion.div 
        animate={{ y: [0, -30, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[80px] pointer-events-none"
      />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left: Branding box - overlapping layout */}
        <motion.div 
          initial={{ opacity: 0, x: -50, rotate: -5 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 relative"
        >
          <div className="bg-gradient-to-br from-brand-green to-brand-dark w-full aspect-[4/5] rounded-[40px] flex items-center justify-center shadow-2xl relative z-10 overflow-hidden group">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <AnnassimLogo variant="icon-only" size={240} />
            
            {/* Animated Corner Accents */}
            <div className="absolute top-8 left-8 border-l-2 border-t-2 border-brand-gold/30 w-16 h-16 rounded-tl-[20px] transition-all duration-500 group-hover:w-24 group-hover:h-24"></div>
            <div className="absolute bottom-8 right-8 border-r-2 border-b-2 border-brand-gold/30 w-16 h-16 rounded-br-[20px] transition-all duration-500 group-hover:w-24 group-hover:h-24"></div>
          </div>
          
          {/* Floating Decor Box */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute -bottom-10 -right-10 glass-panel p-6 rounded-2xl z-20 hidden md:block"
          >
            <p className="text-4xl font-black text-brand-green">15+</p>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Années d'expertise</p>
          </motion.div>
        </motion.div>

        {/* Right: Text */}
        <div className="lg:col-span-7 flex flex-col lg:pl-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 mb-8"
          >
            <h2 className="text-5xl font-black text-brand-green uppercase tracking-tighter">Qui sommes-nous ?</h2>
            <span className="text-brand-gold text-3xl font-bold" dir="rtl">من نحن؟</span>
          </motion.div>
          
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 bg-brand-gold mb-12 rounded-full"
          />
          
          <div className="space-y-8 text-brand-dark leading-relaxed font-medium text-lg">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              Sous la direction de <span className="text-brand-green font-black uppercase text-sm tracking-widest">M. Eljabri Azouz</span>, 
              le projet <span className="font-bold text-brand-green">Lotissement Annassim 2</span> incarne une vision moderne et exigeante de l'immobilier au Maroc. 
              Notre mission est d'offrir des espaces de vie harmonieux et sécurisés à nos clients.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              Forts de plus de 15 ans d'expérience dans le secteur, nous nous engageons sur la qualité 
              absolue et la transparence de chaque transaction. Chaque lot est minutieusement préparé pour 
              garantir une viabilisation optimale et un cadre de vie serein.
            </motion.p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Lots 100% viabilisés et titrés",
              "Emplacement stratégique et accessible",
              "Suivi personnalisé de chaque client",
              "Infrastructures de haute qualité"
            ].map((bullet, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-brand-gold/10 hover:border-brand-gold hover:shadow-md transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-gold text-sm font-black">✓</span>
                </div>
                <span className="text-brand-dark font-black uppercase tracking-widest text-[10px]">{bullet}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

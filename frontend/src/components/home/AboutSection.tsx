"use client";

import { motion } from 'framer-motion';
import AnnassimLogo from '@/components/ui/AnnassimLogo';

const AboutSection = () => {
  return (
    <section id="a-propos" className="py-24 bg-brand-stone overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* Left: Branding box */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-brand-green w-full aspect-square rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
            <AnnassimLogo variant="icon-only" size={200} />
            <div className="absolute top-6 left-6 border-l-2 border-t-2 border-brand-gold/30 w-24 h-24 rounded-tl-2xl"></div>
            <div className="absolute bottom-6 right-6 border-r-2 border-b-2 border-brand-gold/30 w-24 h-24 rounded-br-2xl"></div>
          </div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl"></div>
        </motion.div>

        {/* Right: Text */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-4xl font-black text-brand-green uppercase tracking-tighter">Qui sommes-nous ?</h2>
            <span className="text-brand-gold text-2xl font-bold" dir="rtl">من نحن؟</span>
          </div>
          
          <div className="w-20 h-1.5 bg-brand-gold mb-8 rounded-full"></div>
          
          <div className="space-y-6 text-brand-dark leading-relaxed font-medium">
            <p>
              Sous la direction de <span className="text-brand-green font-bold italic">M. Eljabri Azouz</span>, 
              le projet <span className="font-bold">Lotissement Annassim 2</span> incarne une vision moderne de l'immobilier au Maroc. 
              Notre mission est d'offrir des espaces de vie harmonieux et sécurisés à nos clients.
            </p>
            <p>
              Forts de plus de 15 ans d'expérience dans le secteur, nous nous engageons sur la qualité 
              et la transparence de chaque transaction. Chaque lot est minutieusement préparé pour 
              garantir une viabilisation optimale.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {[
              "Lots viabilisés et titrés",
              "Emplacement stratégique proche des axes principaux",
              "Suivi personnalisé de chaque client"
            ].map((bullet, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-brand-green font-black uppercase tracking-widest text-xs"
              >
                <span className="text-brand-gold text-lg">✦</span>
                {bullet}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

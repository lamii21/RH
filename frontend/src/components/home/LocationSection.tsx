"use client";

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

const LocationSection = () => {
  return (
    <section className="py-24 bg-brand-stone">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h2 className="text-4xl font-black text-brand-green uppercase tracking-tighter">Notre emplacement</h2>
            <span className="text-brand-gold text-2xl font-bold" dir="rtl">موقعنا</span>
          </div>
          <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-xl shadow-xl border-l-[6px] border-brand-green"
          >
            <h3 className="text-2xl font-black text-brand-green uppercase mb-8">Coordonnées</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-stone rounded-md text-brand-gold">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-1">Adresse</p>
                  <p className="text-brand-dark font-bold">Avenue Hay Riyad, Jorf El Melha</p>
                  <p className="text-sm text-brand-green/70">Rabat-Salé-Kénitra, Maroc</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-stone rounded-md text-brand-gold">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-1">Téléphone</p>
                  <p className="text-brand-dark font-bold text-lg">06 68 44 39 91</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-stone rounded-md text-brand-gold">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-1">E-mail</p>
                  <p className="text-brand-dark font-bold">lotisementannasim2@gmail.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[400px] rounded-xl overflow-hidden shadow-2xl border-2 border-white"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13204.425574443912!2d-5.520448!3d34.488344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9a43a067a21349%3A0x6b77247a3e792c3a!2sJorf%20El%20Melha!5e0!3m2!1sen!2sma!4v1714567890123!5m2!1sen!2sma" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(0.5) contrast(1.1)' }} 
              allowFullScreen={true} 
              loading="lazy"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;

"use client";

import { motion } from 'framer-motion';

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="bg-brand-green rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Info Card */}
          <div className="md:w-1/3 p-12 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-black uppercase mb-4">Contactez-nous</h2>
              <div className="w-16 h-1 bg-brand-gold mb-8"></div>
              <p className="text-white/70 text-sm mb-12">
                Notre équipe est à votre écoute pour vous accompagner dans votre projet d'acquisition.
              </p>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-1">Horaires</p>
                  <p className="text-sm font-bold">Lundi – Samedi</p>
                  <p className="text-sm text-white/60">08h00 – 18h00</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-1">Siège Social</p>
                  <p className="text-sm font-bold">Jorf El Melha</p>
                  <p className="text-sm text-white/60">Lotissement Annassim 2</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-xs italic text-brand-gold font-medium leading-relaxed" dir="rtl">
                "نحن هنا لخدمتكم وتوجيهكم في كل خطوة"
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:w-2/3 bg-brand-stone p-12">
            <form action="mailto:lotisementannasim2@gmail.com" method="post" encType="text/plain" className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-green uppercase tracking-widest">Nom complet</label>
                <input type="text" name="name" className="input bg-white border-transparent focus:border-brand-gold focus:ring-0 shadow-sm" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-green uppercase tracking-widest">Téléphone</label>
                <input type="tel" name="phone" className="input bg-white border-transparent focus:border-brand-gold focus:ring-0 shadow-sm" required />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-brand-green uppercase tracking-widest">E-mail</label>
                <input type="email" name="email" className="input bg-white border-transparent focus:border-brand-gold focus:ring-0 shadow-sm" required />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-brand-green uppercase tracking-widest">Message</label>
                <textarea name="message" rows={5} className="input bg-white border-transparent focus:border-brand-gold focus:ring-0 shadow-sm resize-none" required></textarea>
              </div>
              
              <div className="md:col-span-2 flex justify-end mt-4">
                <button type="submit" className="bg-brand-green hover:bg-brand-dark text-brand-gold px-12 py-4 rounded-md font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-brand-green/20">
                  Envoyer le message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

"use client";

import Link from 'next/link';
import AnnassimLogo from '@/components/ui/AnnassimLogo';
import { Phone, Mail, MapPin } from 'lucide-react';

const HomeFooter = () => {
  return (
    <footer className="bg-brand-green text-white border-t-2 border-brand-gold">
      <div className="container mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          {/* Brand */}
          <div className="flex flex-col">
            <AnnassimLogo variant="dark" size={50} className="mb-6" />
            <p className="text-brand-gold text-lg italic mb-6">"Votre investissement en toute confiance"</p>
            <p className="text-white/50 text-xs leading-relaxed max-w-xs">
              Le Lotissement Annassim 2 est un projet d'excellence situé à Jorf El Melha, 
              dédié à offrir des terrains résidentiels de qualité supérieure.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-brand-gold font-black uppercase tracking-[0.2em] text-xs mb-8 border-b border-white/10 pb-4">Navigation</h4>
            <div className="grid grid-cols-1 gap-4 text-sm font-bold uppercase tracking-widest text-white/70">
              <Link href="#" className="hover:text-brand-gold transition-colors">Accueil</Link>
              <Link href="#a-propos" className="hover:text-brand-gold transition-colors">À propos</Link>
              <Link href="#nos-lots" className="hover:text-brand-gold transition-colors">Nos Lots</Link>
              <Link href="#contact" className="hover:text-brand-gold transition-colors">Contact</Link>
              <Link href="/login" className="text-brand-gold hover:text-white transition-colors">Connexion RH</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-brand-gold font-black uppercase tracking-[0.2em] text-xs mb-8 border-b border-white/10 pb-4">Contact Info</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-brand-gold" />
                <span className="text-sm font-bold">06 68 44 39 91</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-brand-gold" />
                <span className="text-sm font-bold">lotisementannasim2@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-gold" />
                <span className="text-sm font-bold leading-tight">Ave Hay Riyad, Jorf El Melha, Rabat-Salé-Kénitra, Maroc</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            Tous droits réservés — Lotissement Annassim 2 © 2024
          </p>
          <div className="flex gap-4">
            <span className="text-[10px] text-brand-gold font-bold italic" dir="rtl">
              "استثمارك في أمان تام"
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;

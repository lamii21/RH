"use client";

import { useState, useEffect } from 'react';
import { Bell, UserCircle, LogOut, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotifications } from './NotificationProvider';

export default function Topbar() {
  const router = useRouter();
  const { unreadCount, markAllAsRead } = useNotifications();
  const [lang, setLang] = useState<'fr' | 'ar'>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'fr' | 'ar';
    if (savedLang) {
      setLang(savedLang);
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLang;
    }
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'fr' ? 'ar' : 'fr';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    window.location.reload(); // Reload to apply translations globally
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  return (
    <header className="topbar bg-white border-b border-brand-stone h-[var(--header-height)] px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-black text-brand-green uppercase tracking-tighter">
          Annassim 2 RH <span className="text-brand-gold text-sm ml-2" dir="rtl">{lang === 'ar' ? 'لوحة القيادة' : ''}</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleLang}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-stone text-brand-green text-xs font-bold hover:bg-brand-gold hover:text-white transition-all"
        >
          <Globe size={14} />
          {lang === 'fr' ? 'FR | ع' : 'ع | FR'}
        </button>

        <button className="relative text-brand-green hover:text-brand-gold transition-colors" onClick={markAllAsRead}>
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gold text-brand-green text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-4 border-l border-brand-stone pl-6">
          <div className="text-right">
            <p className="text-xs font-black text-brand-green leading-none">M. Eljabri</p>
            <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mt-1">Directeur Général</p>
          </div>
          <UserCircle size={32} className="text-brand-green" />
          <button onClick={handleLogout} className="text-rose-500 hover:text-rose-700 transition-colors" title="Déconnexion">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

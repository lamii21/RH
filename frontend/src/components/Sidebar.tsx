"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Calendar, Clock, FileText, Settings, Bot, Briefcase } from 'lucide-react';
import AnnassimLogo from './ui/AnnassimLogo';

const NAV_ITEMS = [
  { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Employés', path: '/employees', icon: Users },
  { name: 'Congés', path: '/leaves', icon: Calendar },
  { name: 'Présences', path: '/attendance', icon: Clock },
  { name: 'Documents', path: '/documents', icon: FileText },
  { name: 'Recrutement', path: '/recruitment', icon: Briefcase },
  { name: 'Copilote IA', path: '/copilot', icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar bg-brand-green text-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none -mt-10 -mr-10"></div>
      
      <div className="sidebar-header border-b border-white/5 pb-6 relative z-10">
        <AnnassimLogo variant="dark" size={32} />
      </div>
      
      <nav className="sidebar-nav mt-8 relative z-10 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);
          return (
            <Link key={item.path} href={item.path} className={`relative flex items-center gap-3 py-3 px-4 rounded-xl transition-colors duration-300 group ${isActive ? 'text-brand-gold font-bold' : 'text-white/60 hover:text-white'}`}>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white/5 border border-brand-gold/20 rounded-xl shadow-[inset_0_0_20px_rgba(201,168,76,0.1)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3 w-full">
                <Icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-brand-gold drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]' : ''}`} />
                <span className="tracking-wide text-sm">{item.name}</span>
                {isActive && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_#C9A84C]" 
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="sidebar-footer mt-auto pt-6 border-t border-white/5 relative z-10">
        <div className="px-4 mb-4 bg-white/5 py-3 rounded-lg border border-white/5">
          <p className="text-[10px] text-brand-gold uppercase tracking-widest font-black mb-1">Lotissement</p>
          <p className="text-xs text-white/80 leading-tight font-medium">Annassim 2, Jorf El Melha</p>
        </div>
        <Link href="/profile" className="relative flex items-center gap-3 py-3 px-4 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group">
          <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          <span className="tracking-wide text-sm font-medium">Paramètres</span>
        </Link>
      </div>
    </aside>
  );
}

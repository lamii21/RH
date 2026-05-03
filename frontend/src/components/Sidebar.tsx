"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, Clock, FileText, Settings, Bot } from 'lucide-react';
import AnnassimLogo from './ui/AnnassimLogo';

const NAV_ITEMS = [
  { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Employés', path: '/employees', icon: Users },
  { name: 'Congés', path: '/leaves', icon: Calendar },
  { name: 'Présences', path: '/attendance', icon: Clock },
  { name: 'Documents', path: '/documents', icon: FileText },
  { name: 'Copilote IA', path: '/copilot', icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar bg-brand-green text-white">
      <div className="sidebar-header border-b border-white/10 pb-6">
        <AnnassimLogo variant="dark" size={32} />
      </div>
      <nav className="sidebar-nav mt-6">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);
          return (
            <Link key={item.path} href={item.path} className={`sidebar-link flex items-center gap-3 py-3 px-4 rounded-lg transition-all ${isActive ? 'bg-white/10 text-brand-gold' : 'text-white/70 hover:text-white'}`}>
              <Icon size={20} className={isActive ? 'text-brand-gold' : ''} />
              <span className="font-medium">{item.name}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_#C9A84C]" />}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer mt-auto pt-6 border-t border-white/10">
        <div className="px-4 mb-4">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Localisation</p>
          <p className="text-[10px] text-white/60 leading-tight mt-1">Ave Hay Riyad, Jorf El Melha</p>
        </div>
        <Link href="/profile" className={`sidebar-link flex items-center gap-3 py-3 px-4 text-white/70 hover:text-white`}>
          <Settings size={20} />
          <span>Paramètres</span>
        </Link>
      </div>
    </aside>
  );
}

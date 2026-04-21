"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, Clock, FileText, Settings } from 'lucide-react';
import './components.css'; 

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Employees', path: '/employees', icon: Users },
  { name: 'Leaves', path: '/leaves', icon: Calendar },
  { name: 'Attendance', path: '/attendance', icon: Clock },
  { name: 'Documents', path: '/documents', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>SMART HR</h2>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);
          return (
            <Link key={item.path} href={item.path} className={`sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <Link href="/profile" className="sidebar-link">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}

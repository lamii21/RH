"use client";

import { Bell, UserCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './components.css';

export default function Topbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-search">
        <input type="text" placeholder="Search..." className="input search-input" />
      </div>
      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <div className="user-menu flex items-center gap-2">
          <UserCircle size={24} className="color-primary" />
          <span className="font-medium text-sm">User</span>
          <button onClick={handleLogout} className="icon-btn color-danger ml-2" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./components.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    
    if (!token && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }
  }, [pathname, router]);

  const isAuthPage = pathname === '/login' || pathname === '/register';

  // We still want to avoid rendering the full dashboard on server/initial hydrate if not mounted
  // but we should render children consistently if possible.
  
  if (isAuthPage) {
    return <div className="animate-fade-in">{children}</div>;
  }

  return (
    <div className="dashboard-layout animate-fade-in">
      {mounted && <Sidebar />}
      <main className="main-content">
        {mounted && <Topbar />}
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
}

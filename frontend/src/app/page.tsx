"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import CompanyPulse from '@/components/home/CompanyPulse';
import AboutSection from '@/components/home/AboutSection';
import TeamSection from '@/components/home/TeamSection';
import LotsSection from '@/components/home/LotsSection';
import LocationSection from '@/components/home/LocationSection';
import ContactSection from '@/components/home/ContactSection';
import HomeFooter from '@/components/home/HomeFooter';
import ChatWidget from '@/components/ChatWidget';

export default function HomePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (!mounted) return null;

  if (checkingAuth) {
    return (
      <div className="fixed inset-0 bg-brand-stone flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-green border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-stone selection:bg-brand-gold/30 selection:text-brand-green">
      <Navbar />
      <main>
        <HeroSection />
        <CompanyPulse />
        <AboutSection />
        <TeamSection />
        <LotsSection />
        <LocationSection />
        <ContactSection />
      </main>
      <HomeFooter />
      <ChatWidget />
    </div>
  );
}

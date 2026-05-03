"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnnassimLogo from '@/components/ui/AnnassimLogo';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#' },
    { name: 'À propos', href: '#a-propos' },
    { name: 'Nos Lots', href: '#nos-lots' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md border-b border-brand-gold/20 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/">
          <AnnassimLogo variant="light" size={40} className={scrolled ? '' : 'brightness-0 invert'} />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                scrolled ? 'text-brand-green hover:text-brand-gold' : 'text-white hover:text-brand-gold'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/login" 
            className={`px-6 py-2.5 rounded-md text-xs font-black uppercase tracking-widest transition-all ${
              scrolled 
                ? 'bg-brand-green text-brand-gold hover:bg-brand-dark' 
                : 'bg-brand-gold text-brand-green hover:bg-white'
            }`}
          >
            Espace RH
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className={scrolled ? 'text-brand-green' : 'text-white'} /> : <Menu className={scrolled ? 'text-brand-green' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-green p-6 absolute top-full left-0 w-full shadow-2xl animate-fade-in">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-white font-bold uppercase tracking-widest text-lg"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/login" 
              className="bg-brand-gold text-brand-green font-black py-4 rounded-md text-center uppercase tracking-widest"
              onClick={() => setIsOpen(false)}
            >
              Connexion Espace RH
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

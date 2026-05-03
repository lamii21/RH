"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import AnnassimLogo from '@/components/ui/AnnassimLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/authenticate', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', 'ADMIN'); 
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Brand */}
      <div className="md:w-1/2 bg-brand-green flex flex-col items-center justify-center p-12 text-center">
        <AnnassimLogo variant="dark" size={80} className="mb-8" />
        <h2 className="text-brand-gold text-2xl font-light italic mb-2">"Votre investissement en toute confiance"</h2>
        <h2 className="text-brand-gold/80 text-xl font-light leading-relaxed tracking-wider mb-8" dir="rtl">"استثمارك في أمان تام"</h2>
        <div className="w-24 h-px bg-brand-gold/30"></div>
      </div>

      {/* Right side: Form */}
      <div className="md:w-1/2 bg-brand-stone flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-xl animate-fade-in border border-brand-green/5">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-brand-green uppercase tracking-tighter">Connexion</h1>
            <p className="text-brand-stone bg-brand-green/10 text-brand-green px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block mt-2">Espace Ressources Humaines</p>
          </div>
          
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 mb-6 text-rose-800 text-sm animate-shake">
              <p className="font-bold">Erreur</p>
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="m-0 text-xs font-bold text-brand-green uppercase tracking-wider">Email Address</label>
                <span className="text-[10px] text-brand-gold font-bold" dir="rtl">البريد الإلكتروني</span>
              </div>
              <input 
                type="email" 
                className="input border-brand-stone focus:border-brand-gold focus:ring-brand-gold/20" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="m-0 text-xs font-bold text-brand-green uppercase tracking-wider">Password</label>
                <span className="text-[10px] text-brand-gold font-bold" dir="rtl">كلمة المرور</span>
              </div>
              <input 
                type="password" 
                className="input border-brand-stone focus:border-brand-gold focus:ring-brand-gold/20" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-brand-green hover:bg-brand-dark text-brand-gold font-black py-4 rounded-md transition-all shadow-lg shadow-brand-green/20 uppercase tracking-widest text-sm flex items-center justify-center gap-2" 
              disabled={loading}
            >
              {loading ? 'Authentification...' : 'Se Connecter'}
              <span className="text-[10px] opacity-50" dir="rtl">تسجيل الدخول</span>
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-brand-stone pt-6">
            <p className="text-xs text-brand-green/60 font-medium italic">© 2024 Lotissement Annassim 2. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

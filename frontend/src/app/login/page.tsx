"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-brand-dark">
      {/* Dynamic Animated Mesh Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-brand-gold rounded-full mix-blend-screen filter blur-[150px]" 
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-brand-green rounded-full mix-blend-screen filter blur-[150px]" 
        />
      </div>

      <div className="w-full max-w-[1000px] flex flex-col md:flex-row items-stretch relative z-10 mx-6">
        
        {/* Left Side: Logo & Messaging */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-1/2 p-12 flex flex-col justify-center text-white"
        >
          <AnnassimLogo variant="dark" size={100} className="mb-10 drop-shadow-2xl" />
          <h2 className="text-4xl font-black mb-4 leading-tight">Accès <br/><span className="text-brand-gold">Plateforme RH</span></h2>
          <p className="text-brand-gold/80 text-xl font-light leading-relaxed tracking-wider mb-6" dir="rtl">تسجيل الدخول</p>
          <div className="w-24 h-px bg-brand-gold/30 mb-8"></div>
          <p className="text-sm font-light text-white/60">Veuillez vous authentifier pour accéder à votre espace de gestion sécurisé.</p>
        </motion.div>

        {/* Right Side: Glass Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="md:w-1/2 relative"
        >
          {/* Decorative floating blur behind the card */}
          <div className="absolute inset-0 bg-brand-gold/20 rounded-[32px] blur-2xl transform translate-x-4 translate-y-4"></div>
          
          <div className="relative glass-panel-dark rounded-[32px] p-10 md:p-12 h-full shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Connexion</h1>
              <div className="w-12 h-1 bg-brand-gold rounded-full"></div>
            </div>
            
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/50 p-4 rounded-xl mb-6 text-rose-200 text-sm animate-shake backdrop-blur-md">
                <p className="font-bold uppercase tracking-widest text-[10px] mb-1">Erreur</p>
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <label className="m-0 text-[10px] font-black text-white/70 uppercase tracking-widest">Email Address</label>
                  <span className="text-[10px] text-brand-gold font-bold" dir="rtl">البريد الإلكتروني</span>
                </div>
                <div className="relative">
                  <input 
                    type="email" 
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold transition-all" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required 
                  />
                  <div className="absolute bottom-0 left-0 h-[2px] bg-brand-gold w-0 group-focus-within:w-full transition-all duration-300"></div>
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <label className="m-0 text-[10px] font-black text-white/70 uppercase tracking-widest">Password</label>
                  <span className="text-[10px] text-brand-gold font-bold" dir="rtl">كلمة المرور</span>
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold transition-all" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required 
                  />
                  <div className="absolute bottom-0 left-0 h-[2px] bg-brand-gold w-0 group-focus-within:w-full transition-all duration-300"></div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full mt-8 relative overflow-hidden bg-brand-gold text-brand-dark font-black py-4 rounded-xl transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 group/btn hover:scale-[1.02] active:scale-[0.98]" 
                disabled={loading}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? 'Authentification...' : 'Se Connecter'}
                  {!loading && <span className="text-[10px] opacity-70 border-l border-brand-dark/20 pl-2" dir="rtl">دخول</span>}
                </span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500 ease-out z-0"></div>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

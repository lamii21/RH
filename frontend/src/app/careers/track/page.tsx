"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Navbar from '@/components/home/Navbar';
import HomeFooter from '@/components/home/HomeFooter';
import { Search, Loader2, CheckCircle2, Clock, Send, FileText, AlertCircle } from 'lucide-react';

interface Application {
  id: number;
  fullName: string;
  jobPosting: { title: string };
  status: string;
  appliedAt: string;
  notes: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any; step: number }> = {
  RECEIVED: { label: 'Candidature Reçue', color: 'text-blue-500', icon: Send, step: 1 },
  REVIEWING: { label: 'En Cours de Review', color: 'text-amber-500', icon: Search, step: 2 },
  INTERVIEW: { label: 'Entretien Programmé', color: 'text-purple-500', icon: Clock, step: 3 },
  ACCEPTED: { label: 'Candidature Acceptée', color: 'text-emerald-500', icon: CheckCircle2, step: 4 },
  REJECTED: { label: 'Non Retenu', color: 'text-rose-500', icon: AlertCircle, step: 4 }
};

export default function TrackPage() {
  const [email, setEmail] = useState('');
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081') + `/api/v1/public/careers/track?email=${email}`);
      const data = await res.json();
      setApplications(data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-stone">
      <Navbar />

      <main className="pt-40 pb-32">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-brand-gold text-xs font-black uppercase tracking-[0.3em] mb-4">● SUIVI EN DIRECT</p>
            <h1 className="text-4xl md:text-5xl font-black text-brand-green uppercase tracking-tighter mb-4">
              Où en est votre <span className="text-brand-gold italic font-light">parcours</span> ?
            </h1>
            <p className="text-brand-dark/60 font-medium">
              Saisissez l'adresse email utilisée lors de votre candidature pour suivre son avancement en temps réel.
            </p>
          </motion.div>

          <form onSubmit={handleTrack} className="relative mb-16">
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@exemple.com"
              className="w-full pl-8 pr-40 py-6 bg-white rounded-[28px] border-none shadow-2xl shadow-brand-green/5 focus:ring-2 focus:ring-brand-gold text-lg font-bold"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 px-8 bg-brand-green text-brand-gold font-black uppercase tracking-widest rounded-2xl hover:bg-brand-dark transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              Suivre
            </button>
          </form>

          <AnimatePresence mode="wait">
            {searched && applications && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {applications.length === 0 ? (
                  <div className="text-center py-10 glass-panel rounded-[32px]">
                    <AlertCircle className="mx-auto text-brand-gold mb-4" size={40} />
                    <p className="text-brand-green font-black uppercase tracking-widest text-sm">Aucune candidature trouvée</p>
                    <p className="text-brand-dark/50 text-xs mt-2">Vérifiez l'orthographe de votre email ou postulez à une offre.</p>
                  </div>
                ) : (
                  applications.map((app) => {
                    const config = statusConfig[app.status] || statusConfig.RECEIVED;
                    const StatusIcon = config.icon;

                    return (
                      <div key={app.id} className="glass-panel rounded-[40px] overflow-hidden">
                        <div className="p-10">
                          <div className="flex justify-between items-start mb-10">
                            <div>
                              <h3 className="text-2xl font-black text-brand-green uppercase tracking-tighter mb-1">
                                {app.jobPosting.title}
                              </h3>
                              <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-[0.2em]">
                                Soumise le {new Date(app.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-brand-stone`}>
                              <StatusIcon size={16} className={config.color} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                                {config.label}
                              </span>
                            </div>
                          </div>

                          {/* Stepper */}
                          <div className="relative flex justify-between mb-12">
                            {/* Connecting Line */}
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-brand-stone -translate-y-1/2 z-0" />
                            <div 
                              className="absolute top-1/2 left-0 h-[2px] bg-brand-gold -translate-y-1/2 z-0 transition-all duration-1000" 
                              style={{ width: `${((config.step - 1) / 3) * 100}%` }}
                            />

                            {[1, 2, 3, 4].map((s) => (
                              <div key={s} className="relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                  s < config.step ? 'bg-brand-gold text-brand-green' : 
                                  s === config.step ? 'bg-brand-green text-brand-gold scale-125 ring-8 ring-brand-green/10' : 
                                  'bg-white text-brand-dark/20 border-2 border-brand-stone'
                                }`}>
                                  {s < config.step ? <CheckCircle2 size={20} /> : <span className="text-xs font-black">{s}</span>}
                                </div>
                              </div>
                            ))}
                          </div>

                          {app.notes && (
                            <div className="bg-brand-stone/50 rounded-2xl p-6 border-l-4 border-brand-gold">
                              <p className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest mb-2">Note de l'équipe RH</p>
                              <p className="text-sm font-medium text-brand-dark/70 italic">"{app.notes}"</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-brand-green py-4 px-10 flex justify-between items-center">
                          <p className="text-[10px] font-black text-brand-gold/60 uppercase tracking-widest">Référence: #APP-{app.id}</p>
                          <button className="text-[10px] font-black text-white uppercase tracking-widest hover:text-brand-gold transition-colors flex items-center gap-2">
                            <FileText size={14} /> Voir mon CV
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}

"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PulseData {
  totalEmployees: number;
  totalDepartments: number;
  growthPercent: number;
  companyMood: string;
  moodScore: number;
  openPositions: number;
}

const moodConfig: Record<string, { icon: string; label: string; color: string }> = {
  SUNNY: { icon: '☀️', label: 'Excellente', color: 'text-emerald-500' },
  PARTLY_CLOUDY: { icon: '🌤️', label: 'Bonne', color: 'text-amber-500' },
  CLOUDY: { icon: '⛅', label: 'Moyenne', color: 'text-orange-500' },
  RAINY: { icon: '🌧️', label: 'Difficile', color: 'text-rose-500' },
};

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}{suffix}</span>;
}

const CompanyPulse = () => {
  const [pulse, setPulse] = useState<PulseData | null>(null);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081') + '/api/v1/public/pulse')
      .then(res => res.json())
      .then(data => setPulse(data))
      .catch(() => {
        // Fallback data if backend is not running
        setPulse({
          totalEmployees: 65, totalDepartments: 8, growthPercent: 12,
          companyMood: 'SUNNY', moodScore: 85, openPositions: 3
        });
      });
  }, []);

  if (!pulse) return null;

  const mood = moodConfig[pulse.companyMood] || moodConfig.SUNNY;

  return (
    <section className="py-24 bg-brand-green relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-gold rounded-full filter blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-white rounded-full filter blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-brand-gold text-xs font-black uppercase tracking-[0.3em] mb-4">● PULSE VIVANT</p>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            L'entreprise en <span className="text-brand-gold italic font-light">temps réel</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto font-light">
            Des données actualisées qui reflètent le dynamisme de notre équipe.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {/* Company Mood */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="glass-panel-dark rounded-[24px] p-6 text-center group hover:border-brand-gold/40 transition-all"
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{mood.icon}</div>
            <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Météo RH</p>
            <p className={`text-xs font-bold ${mood.color}`}>{mood.label}</p>
          </motion.div>

          {/* Total Employees */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-panel-dark rounded-[24px] p-6 text-center group hover:border-brand-gold/40 transition-all"
          >
            <p className="text-4xl font-black text-brand-gold mb-3 group-hover:scale-110 transition-transform">
              <AnimatedCounter target={pulse.totalEmployees} suffix="+" />
            </p>
            <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Collaborateurs</p>
            <p className="text-emerald-400 text-xs font-bold">↑ {pulse.growthPercent}% croissance</p>
          </motion.div>

          {/* Departments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-panel-dark rounded-[24px] p-6 text-center group hover:border-brand-gold/40 transition-all"
          >
            <p className="text-4xl font-black text-brand-gold mb-3 group-hover:scale-110 transition-transform">
              <AnimatedCounter target={pulse.totalDepartments} />
            </p>
            <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Départements</p>
            <p className="text-white/50 text-xs font-bold">Actifs et opérationnels</p>
          </motion.div>

          {/* Open Positions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-panel-dark rounded-[24px] p-6 text-center group hover:border-brand-gold/40 transition-all"
          >
            <p className="text-4xl font-black text-brand-gold mb-3 group-hover:scale-110 transition-transform">
              <AnimatedCounter target={pulse.openPositions} />
            </p>
            <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Postes Ouverts</p>
            <p className="text-brand-gold/70 text-xs font-bold">Rejoignez-nous →</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CompanyPulse;

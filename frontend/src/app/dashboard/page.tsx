"use client";

import { useEffect, useState } from 'react';
import { Users, Building, FileClock, AlertTriangle, Clock, Play, Square, TrendingUp, Bot } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Moon, Sun, Bell } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { DashboardStats, RiskyEmployee } from '@/types';
import logger from '@/lib/logger';

// Helper to generate mock trend data for sparklines
const generateTrend = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    value: Math.floor(Math.random() * 20) + 10
  }));
};

import { translations, Language } from '@/lib/i18n';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [clocking, setClocking] = useState(false);
  const [status, setStatus] = useState<'IN' | 'OUT'>('OUT');
  const [lang, setLang] = useState<Language>('fr');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang) setLang(savedLang);

    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
        if (res.data.totalEmployees > 0) {
           const empRes = await api.get('/employees?size=1');
           if (empRes.data.content?.length > 0) {
             localStorage.setItem('demoEmployeeId', empRes.data.content[0].id);
           }
        }
      } catch (err) {
        logger.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAttendanceStatus = async () => {
      const empId = localStorage.getItem('demoEmployeeId') || '1';
      try {
        const res = await api.get(`/attendance/employee/${empId}`);
        if (res.data.length > 0) {
          const last = res.data[res.data.length - 1];
          setStatus(last.checkOut ? 'OUT' : 'IN');
        }
      } catch (err) {
        logger.error('Failed to load attendance status', err);
      }
    };

    fetchDashboard();
    fetchAttendanceStatus();
  }, []);

  const t = translations[lang];

  const handleClockAction = async () => {
    const empId = localStorage.getItem('demoEmployeeId');
    if (!empId) {
      alert('Veuillez d\'abord créer un employé dans la section Employés.');
      return;
    }
    setClocking(true);
    try {
      const action = status === 'IN' ? 'check-out' : 'check-in';
      await api.post(`/attendance/${empId}/${action}`);
      setStatus(status === 'IN' ? 'OUT' : 'IN');
    } catch (err) {
      alert('Échec de l\'action. Problème de synchronisation de la base de données.');
    } finally {
      setClocking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <div className="w-12 h-12 border-4 border-brand-green border-t-brand-gold rounded-full animate-spin" />
        <p className="text-sm font-bold text-brand-green uppercase tracking-widest">Chargement de l'intelligence RH...</p>
      </div>
    );
  }

  if (!data) return <div className="text-center mt-10">Impossible de charger les données.</div>;

  const chartData = Object.keys(data.employeesPerDepartment).map(dept => ({
    name: dept,
    count: data.employeesPerDepartment[dept]
  }));

  const stats = [
    { label: t.totalEmployees, value: data.totalEmployees, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: generateTrend() },
    { label: t.departments, value: data.totalDepartments, icon: Building, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: generateTrend() },
    { label: t.pendingLeaves, value: data.leavesPending, icon: FileClock, color: 'text-amber-600', bg: 'bg-amber-50', trend: generateTrend() },
    { label: t.absences, value: data.todayAbsences, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', trend: generateTrend() },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header flex justify-between items-end">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black text-brand-green uppercase tracking-tighter"
          >
            {t.dashboard} <span className="text-brand-gold text-sm ml-2">— Lotissement Annassim 2</span>
          </motion.h1>
          <p className="text-sm text-brand-green/60 font-medium italic mt-1" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {lang === 'ar' ? 'نظرة عامة على أداء الشركة في الوقت الفعلي' : 'Vue d\'ensemble en temps réel de la performance.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/copilot" className="btn bg-white border border-brand-green text-brand-green hover:bg-brand-green hover:text-white flex items-center gap-2">
            <Bot size={18} /> {t.copilot}
          </Link>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-md bg-white border border-brand-stone shadow-sm hover:shadow-md transition-all"
          >
            {theme === 'dark' ? <Sun size={20} className="text-brand-gold" /> : <Moon size={20} className="text-brand-green" />}
          </button>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex flex-col md:flex-row items-center justify-between gap-4 border-none shadow-xl bg-gradient-to-r from-brand-green to-brand-dark text-white p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-inner border border-white/20">
            <Clock size={40} className="text-brand-gold" />
          </div>
          <div>
            <h3 className="font-black text-2xl uppercase tracking-tight">{lang === 'ar' ? 'تتبع حالة العمل' : 'Pointage & Présence'}</h3>
            <p className="text-white/70 text-sm font-medium italic mt-1">
              {status === 'IN' ? 'Vous êtes actuellement présent.' : 'Prêt à commencer votre journée ?'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleClockAction}
          disabled={clocking}
          className={`px-12 py-4 rounded-md font-black text-sm uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-2xl relative z-10 ${
            status === 'IN' ? 'bg-rose-500 text-white' : 'bg-brand-gold text-brand-green'
          }`}
        >
          {clocking ? '...' : status === 'IN' ? 'Pointer Sortie' : 'Pointer Entrée'}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-brand-stone hover:border-brand-gold transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="h-10 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stat.trend}>
                    <Line type="monotone" dataKey="value" stroke={stat.color.includes('emerald') ? '#059669' : stat.color.includes('indigo') ? '#4f46e5' : stat.color.includes('amber') ? '#d97706' : '#e11d48'} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-brand-stone uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-brand-green tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-brand-stone lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl text-brand-green uppercase tracking-tight">{t.workforceDistribution}</h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
              <TrendingUp size={14} /> +4% ce mois
            </div>
          </div>
          <div className="w-full h-[350px]">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#1E4D35' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#1E4D35' }} />
                <Tooltip 
                  cursor={{ fill: '#F5F5F0' }} 
                  contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 10px 25px rgba(30,77,53,0.1)', fontWeight: '800', fontSize: '12px', color: '#1E4D35' }}
                />
                <Bar dataKey="count" fill="#C9A84C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm border border-brand-stone">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={24} className="text-brand-gold" />
            <h3 className="font-black text-xl text-brand-green uppercase tracking-tight">{t.riskAnalysis}</h3>
          </div>
          <p className="text-xs text-brand-stone/80 mb-8 font-medium italic">Identification des patterns de risque (IA).</p>
          
          <div className="space-y-5">
            {data.riskyEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-brand-stone rounded-xl">
                <TrendingUp size={32} className="text-emerald-500 mb-3" />
                <p className="text-xs font-black text-brand-stone uppercase tracking-widest">Aucun risque détecté</p>
              </div>
            ) : (
              data.riskyEmployees.map((emp: RiskyEmployee, i: number) => (
                <motion.div 
                  key={emp.employeeId} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg border border-brand-stone hover:border-brand-gold transition-colors group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-black text-brand-green uppercase text-sm leading-none mb-1">{emp.employeeName}</p>
                      <p className="text-[10px] text-brand-stone font-bold uppercase tracking-widest">{emp.absenceCount} Absences • {emp.lateCount} Retards</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${
                      emp.riskLevel === 'HIGH' ? 'bg-rose-500 text-white' : 'bg-brand-gold text-brand-green'
                    }`}>
                      {emp.riskLevel}
                    </span>
                  </div>
                  <div className="w-full bg-brand-stone h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${emp.riskLevel === 'HIGH' ? 'bg-rose-500' : 'bg-brand-gold'}`} style={{ width: emp.riskLevel === 'HIGH' ? '85%' : '45%' }} />
                  </div>
                </motion.div>
              ))
            )}
          </div>
          <button className="w-full mt-8 py-4 rounded-md border-2 border-brand-stone text-[10px] font-black text-brand-stone uppercase tracking-[0.2em] hover:bg-brand-stone hover:text-brand-green transition-all">
            Rapport Complet de Risque
          </button>
        </div>
      </div>
    </div>
  );
}

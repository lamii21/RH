"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { 
  Users, TrendingUp, Activity, Zap, ArrowUpRight, ArrowDownRight, 
  Target, Award, MessageSquare, Briefcase
} from "lucide-react";
import api from "@/lib/api";

const COLORS = ["#C9A84C", "#1B3B36", "#455A64", "#90A4AE", "#BDBDBD"];

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [pulse, setPulse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, pulseRes] = await Promise.all([
          api.get("/public/detailed"),
          api.get("/public/pulse")
        ]);
        setStats(statsRes.data);
        setPulse(pulseRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-green border-t-brand-gold rounded-full animate-spin"></div>
      </div>
    </DashboardLayout>
  );

  const deptData = stats?.departmentDistribution?.map(([name, count]: any) => ({ name, value: count })) || [];
  const trendData = stats?.hiringTrend || [];

  return (
    <DashboardLayout>
      <div className="page-header flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 text-brand-gold font-black text-[10px] uppercase tracking-[0.4em] mb-2">
            <Zap size={14} fill="currentColor" /> NEXUS Intelligence
          </div>
          <h1 className="page-title">Command Center</h1>
          <p className="page-subtitle">Vue panoramique sur la performance et la croissance d'Annassim 2.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-brand-stone flex items-center gap-6 shadow-sm">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest">Santé NEXUS</p>
            <p className="text-xl font-black text-brand-green">{pulse?.mood === 'EXCELLENT' ? 'OPTIMALE' : 'STABLE'}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-green/5 flex items-center justify-center text-emerald-500 ring-4 ring-emerald-500/10">
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Collaborateurs", val: pulse?.employeeCount, icon: Users, change: "+12%", up: true },
          { label: "Présence Live", val: `${Math.round((pulse?.presentToday / pulse?.employeeCount) * 100)}%`, icon: Activity, change: "+2.4%", up: true },
          { label: "Recrutements", val: "08", icon: Briefcase, change: "Stable", up: true },
          { label: "Croissance", val: `${pulse?.growthRate}%`, icon: TrendingUp, change: "+1.5%", up: true },
        ].map((item, i) => (
          <div key={i} className="card p-8 group hover:border-brand-gold transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-brand-stone/50 rounded-2xl text-brand-green group-hover:bg-brand-gold group-hover:text-brand-green transition-colors">
                <item.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${item.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                {item.change} {item.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </div>
            </div>
            <p className="text-3xl font-black text-brand-green mb-1">{item.val}</p>
            <p className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Hiring Trends Chart */}
        <div className="lg:col-span-2 card p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-brand-green uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-gold" /> Tendance de Recrutement
            </h3>
            <div className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-black rounded-lg uppercase">Prédiction: +12.0</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#1B3B3666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#1B3B3666' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="hires" stroke="#C9A84C" strokeWidth={3} fillOpacity={1} fill="url(#colorHires)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Distribution */}
        <div className="lg:col-span-1 card p-8">
          <h3 className="text-sm font-black text-brand-green uppercase tracking-widest mb-8">Force par Département</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deptData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {deptData.slice(0, 3).map((d: any, i: number) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-[10px] font-black text-brand-green uppercase truncate max-w-[120px]">{d.name}</span>
                </div>
                <span className="text-[10px] font-black text-brand-green">{d.value} pers.</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-8">
          <h3 className="text-sm font-black text-brand-green uppercase tracking-widest mb-8 flex items-center gap-2">
            <Activity size={16} className="text-brand-gold" /> Activité Récente NEXUS
          </h3>
          <div className="space-y-6">
            {[
              { type: 'HIRE', text: 'Nouvelle candidature reçue pour le poste Ingénieur.', time: 'Il y a 2h', icon: Briefcase },
              { type: 'LEAVE', text: '3 demandes de congés approuvées automatiquement.', time: 'Il y a 5h', icon: Calendar },
              { type: 'CHAT', text: 'NEXUS AI a répondu à 45 questions visiteurs aujourd\'hui.', time: 'En direct', icon: MessageSquare },
            ].map((act, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-brand-stone flex items-center justify-center shrink-0">
                  <act.icon size={14} className="text-brand-green" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-dark/80">{act.text}</p>
                  <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8 bg-brand-green text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl -mt-20 -mr-20"></div>
          <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2 relative z-10">
            <Target size={16} className="text-brand-gold" /> Objectifs Trimestriels
          </h3>
          <div className="space-y-8 relative z-10">
            {[
              { label: "Digitalisation RH", progress: 85 },
              { label: "Recrutement Lots 2024", progress: 60 },
              { label: "Formation NEXUS AI", progress: 45 },
            ].map((obj, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                  <span>{obj.label}</span>
                  <span className="text-brand-gold">{obj.progress}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gold transition-all duration-1000" style={{ width: `${obj.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center text-brand-green">
              <Award size={20} />
            </div>
            <p className="text-xs font-medium text-white/80">Félicitations ! Votre équipe a dépassé l'objectif d'assiduité de ce mois.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

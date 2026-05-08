"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Search, Filter, MoreVertical, CheckCircle, XCircle, Clock, Eye, Briefcase } from "lucide-react";
import api from "@/lib/api";

interface Application {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  status: string;
  appliedAt: string;
  jobPosting: { title: string };
  notes: string;
}

const statusColors: Record<string, string> = {
  RECEIVED: "bg-blue-100 text-blue-700 border-blue-200",
  REVIEWING: "bg-amber-100 text-amber-700 border-amber-200",
  INTERVIEW: "bg-purple-100 text-purple-700 border-purple-200",
  ACCEPTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function RecruitmentDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await api.get("/careers/applications");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/careers/applications/${id}/status?status=${status}`);
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredApplications = applications.filter(app => 
    app.fullName.toLowerCase().includes(search.toLowerCase()) || 
    app.jobPosting.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="page-header flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Briefcase className="text-brand-gold" />
            Gestion du Recrutement
          </h1>
          <p className="page-subtitle">Pilotez votre pipeline de talents et gérez les candidatures NEXUS.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} /> Filtres
          </button>
          <button className="btn-primary">Publier une offre</button>
        </div>
      </div>

      <div className="card mb-8">
        <div className="flex items-center gap-4 p-2 bg-brand-stone/30 rounded-2xl border border-brand-stone">
          <Search className="text-brand-dark/40 ml-4" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un candidat ou un poste..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-brand-green border-t-brand-gold rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] font-black text-brand-green/40 uppercase tracking-[0.2em] px-6">
                  <th className="pb-4 pl-6">Candidat</th>
                  <th className="pb-4">Poste</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Statut</th>
                  <th className="pb-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="group hover:scale-[1.01] transition-all">
                    <td className="py-5 pl-6 bg-white border-y border-l border-brand-stone rounded-l-[20px]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-black">
                          {app.fullName.substring(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-brand-green uppercase tracking-tight">{app.fullName}</p>
                          <p className="text-xs font-bold text-brand-dark/40">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 bg-white border-y border-brand-stone">
                      <p className="text-xs font-black text-brand-green uppercase tracking-widest">{app.jobPosting.title}</p>
                    </td>
                    <td className="py-5 bg-white border-y border-brand-stone">
                      <p className="text-xs font-bold text-brand-dark/60">{new Date(app.appliedAt).toLocaleDateString()}</p>
                    </td>
                    <td className="py-5 bg-white border-y border-brand-stone">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-5 pr-6 bg-white border-y border-r border-brand-stone rounded-r-[20px] text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-brand-stone rounded-xl transition-colors text-brand-dark/40 hover:text-brand-green">
                          <Eye size={18} />
                        </button>
                        <select 
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value)}
                          className="bg-brand-stone/50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-3 py-2 focus:ring-1 focus:ring-brand-gold"
                        >
                          <option value="RECEIVED">REÇU</option>
                          <option value="REVIEWING">REVIEW</option>
                          <option value="INTERVIEW">ENTRETIEN</option>
                          <option value="ACCEPTED">ACCEPTER</option>
                          <option value="REJECTED">REFUSER</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

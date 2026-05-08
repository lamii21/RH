"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Shield, Globe, Camera, Save, CheckCircle, Clock, Calendar, FileText } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/hooks/useToast';

interface EmployeeProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  departmentName: string;
  phone: string;
  leaveBalance: number;
  bio: string;
  avatarUrl: string;
  isPublicProfile: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    bio: '',
    isPublicProfile: false,
    avatarUrl: ''
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get('/employees/me');
      setProfile(res.data);
      setFormData({
        bio: res.data.bio || '',
        isPublicProfile: res.data.isPublicProfile || false,
        avatarUrl: res.data.avatarUrl || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/employees/me?bio=${encodeURIComponent(formData.bio)}&isPublicProfile=${formData.isPublicProfile}`);
      addToast('Profil mis à jour avec succès', 'success');
      fetchProfile();
    } catch (err) {
      addToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-green border-t-brand-gold rounded-full animate-spin"></div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="page-header mb-12">
        <h1 className="page-title flex items-center gap-3">
          <User className="text-brand-gold" />
          Mon Espace Personnel
        </h1>
        <p className="page-subtitle">Gérez votre présence sur NEXUS et suivez vos indicateurs RH.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Info & Stats */}
        <div className="lg:col-span-1 space-y-8">
          <div className="card text-center p-10">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-brand-green flex items-center justify-center text-brand-gold text-4xl font-black border-4 border-brand-stone shadow-xl">
                {profile?.firstName.substring(0, 1)}{profile?.lastName.substring(0, 1)}
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-brand-gold text-brand-green rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </div>
            <h2 className="text-2xl font-black text-brand-green uppercase tracking-tighter mb-1">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="text-brand-gold font-bold text-sm mb-1">{profile?.jobTitle}</p>
            <p className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest mb-6">
              {profile?.departmentName}
            </p>
            <div className="flex justify-center gap-4">
              <span className="px-4 py-1.5 bg-brand-stone rounded-full text-[10px] font-black text-brand-green uppercase tracking-widest flex items-center gap-2">
                <Shield size={12} className="text-brand-gold" /> Matricule #{profile?.id}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card p-6 text-center">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl inline-block mb-3">
                <Calendar size={20} />
              </div>
              <p className="text-2xl font-black text-brand-green">{profile?.leaveBalance}</p>
              <p className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest">Congés restants</p>
            </div>
            <div className="card p-6 text-center">
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl inline-block mb-3">
                <CheckCircle size={20} />
              </div>
              <p className="text-2xl font-black text-brand-green">98%</p>
              <p className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest">Assiduité (Mois)</p>
            </div>
          </div>
        </div>

        {/* Right Col: Edit Profile */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-10">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-brand-stone">
              <h3 className="text-lg font-black text-brand-green uppercase tracking-tight">Identité Publique</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest">
                  Profil {formData.isPublicProfile ? 'Public' : 'Privé'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.isPublicProfile}
                    onChange={(e) => setFormData({...formData, isPublicProfile: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-brand-stone peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Globe size={12} className="text-brand-gold" /> Ma Bio Professionnelle
                </label>
                <textarea 
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-stone/30 rounded-2xl border-none focus:ring-2 focus:ring-brand-gold text-sm font-bold resize-none"
                  placeholder="Écrivez quelques mots sur votre expertise et votre rôle chez Annassim 2..."
                />
                <p className="text-[10px] text-brand-dark/40 italic ml-4">Cette bio sera visible sur le site vitrine si votre profil est en mode "Public".</p>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 px-10"
                >
                  {saving ? <Clock className="animate-spin" size={18} /> : <Save size={18} />}
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>

          <div className="card p-10">
            <h3 className="text-lg font-black text-brand-green uppercase tracking-tight mb-8">Documents Personnels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-brand-stone rounded-2xl flex items-center justify-between hover:bg-brand-stone/20 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-stone rounded-xl group-hover:bg-brand-gold/20">
                    <FileText className="text-brand-gold" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-brand-green uppercase">Dernier Bulletin</p>
                    <p className="text-[10px] text-brand-dark/40 uppercase">Avril 2024</p>
                  </div>
                </div>
                <Clock size={16} className="text-brand-dark/20" />
              </div>
              <div className="p-4 border border-brand-stone rounded-2xl flex items-center justify-between hover:bg-brand-stone/20 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-stone rounded-xl group-hover:bg-brand-gold/20">
                    <FileText className="text-brand-gold" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-brand-green uppercase">Contrat de Travail</p>
                    <p className="text-[10px] text-brand-dark/40 uppercase">Signé en 2022</p>
                  </div>
                </div>
                <CheckCircle size={16} className="text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

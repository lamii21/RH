"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Navbar from '@/components/home/Navbar';
import HomeFooter from '@/components/home/HomeFooter';
import { Briefcase, MapPin, Clock, ChevronRight, X, Send, FileText } from 'lucide-react';
import api from '@/lib/api';

interface JobPosting {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  department: { name: string };
  requirements: string;
  salaryRange: string;
  location: string;
  type: string;
  deadline: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cvUrl: 'https://storage.example.com/cv/demo.pdf', // Placeholder
    coverLetter: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081') + '/api/v1/public/careers')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081') + `/api/v1/public/careers/${selectedJob?.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsApplying(false);
        setSelectedJob(null);
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-stone">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-brand-gold text-xs font-black uppercase tracking-[0.3em] mb-4">● OPPORTUNITÉS</p>
            <h1 className="text-5xl md:text-6xl font-black text-brand-green uppercase tracking-tighter mb-4">
              Rejoignez <span className="text-brand-gold italic font-light">l'aventure</span>
            </h1>
            <p className="text-brand-dark/60 max-w-2xl mx-auto font-medium">
              Bâtissons ensemble l'avenir de l'immobilier au Maroc. Découvrez nos postes ouverts et postulez en quelques clics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                layoutId={`job-${job.id}`}
                onClick={() => setSelectedJob(job)}
                whileHover={{ y: -5 }}
                className="glass-panel rounded-[32px] p-8 cursor-pointer group transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-brand-green/5 rounded-2xl group-hover:bg-brand-gold/10 transition-colors">
                    <Briefcase className="text-brand-gold" size={24} />
                  </div>
                  <span className="px-4 py-1.5 bg-brand-stone rounded-full text-[10px] font-black text-brand-green uppercase tracking-widest">
                    {job.type}
                  </span>
                </div>

                <h3 className="text-xl font-black text-brand-green uppercase tracking-tight mb-2">
                  {job.title}
                </h3>
                <p className="text-lg font-bold text-brand-gold/60 mb-4" dir="rtl">{job.titleAr}</p>

                <div className="flex flex-wrap gap-4 text-xs font-bold text-brand-dark/40 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} /> {job.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} /> Expire le {new Date(job.deadline).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-8 flex items-center text-brand-green font-black text-xs uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
                  Voir les détails <ChevronRight size={16} className="text-brand-gold" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && !isApplying && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              layoutId={`job-${selectedJob.id}`}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] bg-white rounded-[40px] z-[70] p-10 overflow-y-auto shadow-2xl"
            >
              <button 
                onClick={() => setSelectedJob(null)}
                className="absolute top-8 right-8 p-2 hover:bg-brand-stone rounded-full transition-colors"
              >
                <X size={24} className="text-brand-green" />
              </button>

              <span className="inline-block px-4 py-1.5 bg-brand-gold/10 rounded-full text-[10px] font-black text-brand-gold uppercase tracking-widest mb-6">
                {selectedJob.department.name}
              </span>

              <h2 className="text-3xl font-black text-brand-green uppercase tracking-tighter mb-2">
                {selectedJob.title}
              </h2>
              <p className="text-2xl font-bold text-brand-gold/60 mb-8" dir="rtl">{selectedJob.titleAr}</p>

              <div className="space-y-8 mb-10">
                <div>
                  <h4 className="text-[10px] font-black text-brand-green/40 uppercase tracking-[0.3em] mb-4">Description</h4>
                  <p className="text-sm font-medium text-brand-dark/70 leading-relaxed">
                    {selectedJob.description}
                  </p>
                  <p className="text-sm font-medium text-brand-dark/50 leading-relaxed mt-4 text-right" dir="rtl">
                    {selectedJob.descriptionAr}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-brand-green/40 uppercase tracking-[0.3em] mb-4">Pré-requis</h4>
                  <p className="text-sm font-medium text-brand-dark/70 leading-relaxed">
                    {selectedJob.requirements}
                  </p>
                </div>

                <div className="flex gap-10">
                  <div>
                    <h4 className="text-[10px] font-black text-brand-green/40 uppercase tracking-[0.3em] mb-2">Localisation</h4>
                    <p className="text-sm font-black text-brand-green uppercase">{selectedJob.location}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-brand-green/40 uppercase tracking-[0.3em] mb-2">Contrat</h4>
                    <p className="text-sm font-black text-brand-green uppercase">{selectedJob.type}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsApplying(true)}
                className="w-full py-5 bg-brand-green text-brand-gold font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-dark transition-all flex items-center justify-center gap-3"
              >
                Postuler maintenant <ChevronRight size={18} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Application Form Modal */}
      <AnimatePresence>
        {isApplying && selectedJob && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] bg-white rounded-[40px] z-[90] p-10 shadow-2xl"
            >
              {!submitted ? (
                <>
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black text-brand-green uppercase tracking-tighter">Candidature</h2>
                    <button onClick={() => setIsApplying(false)} className="p-2 hover:bg-brand-stone rounded-full transition-colors">
                      <X size={20} className="text-brand-green" />
                    </button>
                  </div>

                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest ml-4">Nom Complet</label>
                      <input 
                        required
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-6 py-4 bg-brand-stone rounded-2xl border-none focus:ring-2 focus:ring-brand-gold text-sm font-bold"
                        placeholder="Ex: Ahmed Benjelloun"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest ml-4">Email</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-6 py-4 bg-brand-stone rounded-2xl border-none focus:ring-2 focus:ring-brand-gold text-sm font-bold"
                        placeholder="ahmed@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest ml-4">CV (Lien ou Fichier)</label>
                      <div className="relative">
                        <input 
                          disabled
                          type="text" 
                          value="CV_Ahmed_Benjelloun.pdf"
                          className="w-full px-6 py-4 bg-brand-stone/50 rounded-2xl border-none text-sm font-bold text-brand-dark/40 italic"
                        />
                        <FileText className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-gold" size={18} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest ml-4">Motivation (Optionnel)</label>
                      <textarea 
                        rows={3}
                        value={formData.coverLetter}
                        onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                        className="w-full px-6 py-4 bg-brand-stone rounded-2xl border-none focus:ring-2 focus:ring-brand-gold text-sm font-bold resize-none"
                        placeholder="Parlez-nous un peu de vous..."
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-5 bg-brand-gold text-brand-green font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-dark hover:text-brand-gold transition-all flex items-center justify-center gap-3 mt-4"
                    >
                      Envoyer ma candidature <Send size={18} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="text-brand-gold" size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-brand-green uppercase tracking-tighter mb-4">C'est envoyé !</h2>
                  <p className="text-sm font-medium text-brand-dark/60">
                    Merci Ahmed ! Votre candidature a été transmise à notre équipe RH. Vous recevrez une réponse très bientôt.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <HomeFooter />
    </div>
  );
}

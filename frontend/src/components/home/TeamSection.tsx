"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  departmentName: string;
  avatarUrl: string | null;
  bio: string;
  initials: string;
}

// Generate a deterministic color from initials
function getAvatarColor(initials: string): string {
  const colors = [
    'from-emerald-400 to-teal-600',
    'from-amber-400 to-orange-600',
    'from-indigo-400 to-purple-600',
    'from-rose-400 to-pink-600',
    'from-cyan-400 to-blue-600',
    'from-lime-400 to-green-600',
  ];
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const TeamSection = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081') + '/api/v1/public/team')
      .then(res => res.json())
      .then(data => setTeam(data))
      .catch(() => {
        // Fallback data
        setTeam([
          { id: 1, firstName: 'Azouz', lastName: 'Eljabri', jobTitle: 'Directeur Général', departmentName: 'Direction Générale', avatarUrl: null, bio: "Plus de 20 ans d'expérience dans le secteur immobilier.", initials: 'AE' },
          { id: 2, firstName: 'Fatima', lastName: 'Benali', jobTitle: 'Responsable RH', departmentName: 'Administration & RH', avatarUrl: null, bio: 'Spécialiste en gestion des talents.', initials: 'FB' },
          { id: 3, firstName: 'Youssef', lastName: 'Tazi', jobTitle: 'Ingénieur Topographe', departmentName: 'Bureau Technique', avatarUrl: null, bio: 'Expert en cartographie et études techniques.', initials: 'YT' },
          { id: 4, firstName: 'Salma', lastName: 'Amrani', jobTitle: 'Responsable Commerciale', departmentName: 'Commercial & Ventes', avatarUrl: null, bio: 'Passionnée par la relation client.', initials: 'SA' },
          { id: 5, firstName: 'Karim', lastName: 'Idrissi', jobTitle: 'Comptable Senior', departmentName: 'Comptabilité & Finance', avatarUrl: null, bio: 'Certifié en normes comptables.', initials: 'KI' },
          { id: 6, firstName: 'Hassan', lastName: 'Moulay', jobTitle: 'Chef de Chantier', departmentName: 'Chantier & Travaux', avatarUrl: null, bio: 'Supervise les travaux de viabilisation.', initials: 'HM' },
        ]);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="equipe" className="py-32 bg-white relative overflow-hidden">
      {/* Decoration */}
      <div className="absolute bottom-0 left-0 w-1/4 h-full bg-brand-stone/20 transform skew-x-[15deg] origin-bottom z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <p className="text-brand-gold text-xs font-black uppercase tracking-[0.3em] mb-4">● NOTRE ÉQUIPE</p>
          <h2 className="text-4xl md:text-5xl font-black text-brand-green uppercase tracking-tighter mb-4">
            Les visages de <span className="text-brand-gold italic font-light">l'excellence</span>
          </h2>
          <p className="text-3xl font-bold text-brand-gold/60 tracking-widest" dir="rtl">فريقنا المتميز</p>
        </motion.div>

        {team.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-brand-green border-t-brand-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-brand-green/60 font-bold uppercase tracking-widest">Chargement de l'équipe...</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {team.map((member) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-[28px] p-8 border border-brand-stone hover:border-brand-gold shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[28px]" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Avatar with initials */}
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarColor(member.initials)} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <span className="text-2xl font-black text-white drop-shadow-sm">{member.initials}</span>
                  </div>

                  <h3 className="text-lg font-black text-brand-green uppercase tracking-tight mb-1">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-brand-gold font-bold text-sm mb-1">{member.jobTitle}</p>
                  <p className="text-[10px] font-black text-brand-green/40 uppercase tracking-widest mb-4">
                    {member.departmentName}
                  </p>
                  
                  {/* Bio — visible on hover */}
                  <div className="h-0 group-hover:h-16 overflow-hidden transition-all duration-500">
                    <p className="text-xs text-brand-dark/70 font-medium leading-relaxed italic">
                      "{member.bio}"
                    </p>
                  </div>
                </div>

                {/* Gold accent line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-[3px] bg-brand-gold rounded-full transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;

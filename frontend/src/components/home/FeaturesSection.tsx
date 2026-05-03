"use client";

import { motion } from 'framer-motion';
import { UserCheck, CalendarDays, Clock, FolderOpen, BrainCircuit, BellRing } from 'lucide-react';

const LABEL = "Platform Features";
const TITLE = "Everything you need to scale your team";
const SUBTITLE = "Powerful tools designed to simplify complex HR processes and empower your employees.";

const FEATURES = [
  {
    title: "Employee Management",
    desc: "Centralized database for all employee records, roles, and organizational hierarchies.",
    icon: UserCheck,
    color: "bg-blue-500",
  },
  {
    title: "Leave Tracking",
    desc: "Automated leave request workflows with real-time balance tracking and smart scheduling.",
    icon: CalendarDays,
    color: "bg-emerald-500",
  },
  {
    title: "Attendance Logs",
    desc: "Digital clock-in/out with automated reporting and anomaly detection.",
    icon: Clock,
    color: "bg-indigo-500",
  },
  {
    title: "Document Storage",
    desc: "Secure, encrypted cloud storage for contracts, IDs, and certifications.",
    icon: FolderOpen,
    color: "bg-amber-500",
  },
  {
    title: "AI HR Insights",
    desc: "Predictive turnover analysis and intelligent HR copilot powered by Gemini 2.0.",
    icon: BrainCircuit,
    color: "bg-purple-500",
  },
  {
    title: "Real-time Alerts",
    desc: "Stay updated with instant WebSocket notifications for all critical HR events.",
    icon: BellRing,
    color: "bg-rose-500",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-[#185FA5] uppercase tracking-widest bg-[#185FA5]/10 px-3 py-1 rounded-full mb-4 inline-block">
            {LABEL}
          </span>
          <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white mb-4">
            {TITLE}
          </h2>
          <p className="text-gray-400 dark:text-gray-400 max-w-2xl mx-auto text-lg font-normal">
            {SUBTITLE}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group p-8 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#185FA5] dark:hover:border-[#185FA5] transition-all shadow-sm hover:shadow-xl hover:shadow-[#185FA5]/5"
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-current/20`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3 group-hover:text-[#185FA5] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-400 leading-relaxed font-normal">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Plus, Calendar as CalendarIcon, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import LeaveRequestModal from '@/components/LeaveRequestModal';
import LeaveCalendar from '@/components/LeaveCalendar';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/leaves?page=${page}&size=${size}&sort=id,desc`);
      setLeaves(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [page, size]);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await api.put(`/leaves/${id}/${action}`);
      fetchLeaves();
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to ${action} leave`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title text-3xl font-black">Time Off Management</h1>
          <p className="page-subtitle">Process and monitor leave requests across the company.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-1 rounded-xl shadow-sm">
            <button 
              onClick={() => setView('table')}
              className={`p-2 rounded-lg transition-all ${view === 'table' ? 'bg-primary-color text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`p-2 rounded-lg transition-all ${view === 'calendar' ? 'bg-primary-color text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <CalendarIcon size={18} />
            </button>
          </div>
          <button className="btn btn-primary shadow-lg shadow-primary-color/20 flex items-center gap-2 px-6 py-2.5" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Request Leave
          </button>
        </div>
      </div>

      <LeaveRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchLeaves} 
      />

      <AnimatePresence mode="wait">
        {view === 'calendar' ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <LeaveCalendar leaves={leaves} />
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card p-0 overflow-hidden shadow-xl border-none"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-900/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Type & Reason</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Approval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-6 py-4"><div className="h-12 w-full bg-gray-100 dark:bg-slate-800 rounded-xl" /></td>
                      </tr>
                    ))
                  ) : leaves.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold">No leave requests found.</td>
                    </tr>
                  ) : (
                    leaves.map((leave, i) => (
                      <motion.tr 
                        key={leave.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-color transition-colors">{leave.employeeName}</p>
                          <p className="text-[11px] text-gray-400 font-medium">Emp ID: {leave.employeeId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{leave.startDate}</span>
                            <div className="w-4 h-[1px] bg-gray-300" />
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{leave.endDate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-indigo-500">{leave.type}</p>
                          <p className="text-[11px] text-gray-400 font-medium italic">"{leave.reason}"</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-tight ${
                            leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10' : 
                            leave.status === 'REJECTED' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10' : 
                            'bg-amber-100 text-amber-600 dark:bg-amber-500/10'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {leave.status === 'PENDING' ? (
                              <>
                                <button 
                                  className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all" 
                                  onClick={() => handleAction(leave.id, 'approve')}
                                  title="Approve"
                                >
                                  <CheckCircle size={20} />
                                </button>
                                <button 
                                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all" 
                                  onClick={() => handleAction(leave.id, 'reject')}
                                  title="Reject"
                                >
                                  <XCircle size={20} />
                                </button>
                              </>
                            ) : (
                              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Processed</p>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select className="input text-[10px] py-1 w-20" value={size} onChange={e => setSize(Number(e.target.value))}>
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-2 text-gray-400 hover:text-primary-color disabled:opacity-20 transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <span className="text-[11px] font-black text-gray-900 dark:text-white px-2">Page {page + 1} of {totalPages || 1}</span>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="p-2 text-gray-400 hover:text-primary-color disabled:opacity-20 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

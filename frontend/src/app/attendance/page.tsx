"use client";

import { useEffect, useState } from 'react';
import { Clock, LogIn, LogOut, ChevronLeft, ChevronRight, Grid, Table as TableIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import AttendanceHeatmap from '@/components/AttendanceHeatmap';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'table' | 'heatmap'>('table');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [employeeId] = useState(1); // Demo ID

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const attRes = await api.get(`/attendance?page=${page}&size=${size}&sort=date,desc`);
      setAttendance(attRes.data.content);
      setTotalPages(attRes.data.totalPages);

      if (employees.length === 0) {
        const empRes = await api.get('/employees?size=100');
        setEmployees(empRes.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [page, size]);

  const handleCheckIn = async () => {
    try {
      await api.post(`/attendance/${employeeId}/check-in`);
      fetchAttendance();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post(`/attendance/${employeeId}/check-out`);
      fetchAttendance();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to check out');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title text-3xl font-black">Attendance Logs</h1>
          <p className="page-subtitle">Track employee punctuality and daily work hours.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-1 rounded-xl shadow-sm mr-2">
            <button 
              onClick={() => setView('table')}
              className={`p-2 rounded-lg transition-all ${view === 'table' ? 'bg-primary-color text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <TableIcon size={18} />
            </button>
            <button 
              onClick={() => setView('heatmap')}
              className={`p-2 rounded-lg transition-all ${view === 'heatmap' ? 'bg-primary-color text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid size={18} />
            </button>
          </div>
          <button className="btn bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 flex items-center gap-2 px-6 py-2.5" onClick={handleCheckIn}>
            <LogIn size={18} /> Check In
          </button>
          <button className="btn bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 flex items-center gap-2 px-6 py-2.5" onClick={handleCheckOut}>
            <LogOut size={18} /> Check Out
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'heatmap' ? (
          <motion.div
            key="heatmap"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <AttendanceHeatmap data={attendance} employees={employees} />
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
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={6} className="px-6 py-6"><div className="h-6 w-full bg-gray-100 dark:bg-slate-800 rounded-lg" /></td>
                      </tr>
                    ))
                  ) : attendance.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold">No records found.</td>
                    </tr>
                  ) : (
                    attendance.map((log, i) => (
                      <motion.tr 
                        key={log.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-sm">{log.employeeName}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{log.date}</td>
                        <td className="px-6 py-4 font-mono text-xs">{log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : '--'}</td>
                        <td className="px-6 py-4 font-mono text-xs">{log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : '--'}</td>
                        <td className="px-6 py-4">
                          {log.workHours ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black">{log.workHours}h</span>
                              <div className="w-16 h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${Math.min((log.workHours / 8) * 100, 100)}%` }} />
                              </div>
                            </div>
                          ) : '--'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-tight ${
                            log.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10' : 
                            log.status === 'LATE' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/10' : 
                            'bg-rose-100 text-rose-600 dark:bg-rose-500/10'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
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

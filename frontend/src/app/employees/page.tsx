"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/employees?page=${page}&size=${size}&sort=id,desc`);
      setEmployees(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, size]);

  const deleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      alert('Failed to delete employee. Only administrators can perform this action.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title text-3xl font-black">Staff Directory</h1>
          <p className="page-subtitle">Manage company human resources and roles.</p>
        </div>
        <Link href="/employees/add" className="btn btn-primary flex items-center gap-2 shadow-lg shadow-primary-color/20 px-6 py-2.5">
          <Plus size={18} /> Add Employee
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or position..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 focus:border-primary-color transition-colors text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="btn btn-outline flex items-center gap-2 text-xs py-2">
            <Filter size={14} /> Filter
          </button>
          <select 
            className="input text-xs py-2 w-24" 
            value={size} 
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden shadow-xl border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-900/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Position & Dept</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: size }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-40 bg-gray-100 dark:bg-slate-800 rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-10 w-32 bg-gray-100 dark:bg-slate-800 rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 dark:bg-slate-800 rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 dark:bg-slate-800 rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-20 ml-auto bg-gray-100 dark:bg-slate-800 rounded-lg" /></td>
                  </tr>
                ))
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-sm font-bold text-gray-400">No records found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {employees.map((emp, i) => (
                    <motion.tr 
                      key={emp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-color/10 flex items-center justify-center text-primary-color font-black text-sm">
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-color transition-colors">
                              {emp.firstName} {emp.lastName}
                            </p>
                            <p className="text-[11px] text-gray-400 font-medium">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{emp.jobTitle}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{emp.departmentName || 'General'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-tight ${
                          emp.role === 'ADMIN' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10' : 'bg-primary-color/10 text-primary-color'
                        }`}>
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                          <span className="text-[11px] font-bold text-gray-500">Active</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-primary-color hover:bg-primary-color/10 rounded-lg transition-all"><Edit size={16} /></button>
                          <button 
                            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                            onClick={() => deleteEmployee(emp.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[11px] font-bold text-gray-400">
            Showing <span className="text-gray-900 dark:text-white">{employees.length}</span> of <span className="text-gray-900 dark:text-white">{totalElements}</span> resources
          </p>
          <div className="flex items-center gap-1">
            <button 
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="p-2 text-gray-400 hover:text-primary-color disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${
                  page === i ? 'bg-primary-color text-white shadow-lg shadow-primary-color/30' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="p-2 text-gray-400 hover:text-primary-color disabled:opacity-20 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

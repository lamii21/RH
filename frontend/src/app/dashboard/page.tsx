"use client";

import { useEffect, useState } from 'react';
import { Users, Building, FileClock, AlertTriangle, Clock, Play, Square } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Client } from '@stomp/stompjs';
import { useTheme } from 'next-themes';
import { Moon, Sun, Bell } from 'lucide-react';
import api from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clocking, setClocking] = useState(false);
  const [status, setStatus] = useState<'IN' | 'OUT'>('OUT');
  const [notifications, setNotifications] = useState<string[]>([]);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => {
        stompClient.subscribe('/topic/leaves', (message) => {
          if (message.body) {
            const leave = JSON.parse(message.body);
            setNotifications(prev => [`Leave updated for ${leave.employeeName}: ${leave.status}`, ...prev].slice(0, 3));
          }
        });
      }
    });
    stompClient.activate();

    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
        // Try to find a valid employee ID for demo purposes
        if (res.data.totalEmployees > 0) {
           const empRes = await api.get('/employees');
           if (empRes.data.length > 0) {
             localStorage.setItem('demoEmployeeId', empRes.data[0].id);
           }
        }
      } catch (err) {
        console.error('Failed to load dashboard', err);
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
          setStatus(last.timeOut ? 'OUT' : 'IN');
        }
      } catch (err) {
        console.error('Failed to load attendance status', err);
      }
    };

    fetchDashboard();
    fetchAttendanceStatus();
  }, []);

  const handleClockAction = async () => {
    const empId = localStorage.getItem('demoEmployeeId');
    if (!empId) {
      alert('Please create an employee first in the Employees section to use the Work Status features.');
      return;
    }
    setClocking(true);
    try {
      const action = status === 'IN' ? 'check-out' : 'check-in';
      await api.post(`/attendance/${empId}/${action}`);
      setStatus(status === 'IN' ? 'OUT' : 'IN');
    } catch (err) {
      alert('Action failed. Database synchronization issue.');
    } finally {
      setClocking(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading dashboard stats...</div>;
  }

  if (!data) {
    return <div className="text-center mt-10">Cannot load dashboard data.</div>;
  }

  const chartData = Object.keys(data.employeesPerDepartment).map(dept => ({
    name: dept,
    count: data.employeesPerDepartment[dept]
  }));

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-color to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-2">HR Overview</h1>
          <p className="page-subtitle text-gray-500 dark:text-gray-400">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
      
      {notifications.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-indigo-50 border border-indigo-200 dark:bg-slate-800 dark:border-slate-700">
          <h3 className="font-bold flex items-center gap-2 mb-2"><Bell size={18} /> Recent Notifications</h3>
          <ul className="text-sm space-y-1">
            {notifications.map((n, i) => <li key={i} className="text-indigo-700 dark:text-indigo-300">{n}</li>)}
          </ul>
        </div>
      )}

      <div className="card mb-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-indigo-50 border-indigo-100" style={{ background: 'rgba(79, 70, 229, 0.05)', borderColor: 'rgba(79, 70, 229, 0.1)' }}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${status === 'IN' ? 'bg-success text-white' : 'bg-gray-200 text-gray-500'}`} style={status === 'IN' ? { backgroundColor: 'var(--success-color)'} : {}}>
            <Clock size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Work Status</h3>
            <p className="text-sm color-secondary">
              {status === 'IN' ? 'Currently clocked in for the day.' : 'You are currently clocked out.'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleClockAction}
          disabled={clocking}
          className={`btn ${status === 'IN' ? 'btn-danger' : 'btn-primary'} flex items-center gap-2 px-8`}
          style={status === 'IN' ? { backgroundColor: 'var(--danger-color)', color: 'white'} : {}}
        >
          {clocking ? 'Processing...' : status === 'IN' ? <><Square size={18} fill="white" /> Clock Out</> : <><Play size={18} fill="currentColor" /> Clock In</>}
        </button>
      </div>

      <div className="dashboard-grid mb-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card flex items-center justify-between shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-800 dark:border-slate-700">
          <div>
            <p className="color-secondary text-sm font-medium mb-1 dark:text-slate-400">Total Employees</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalEmployees}</h3>
          </div>
          <div className="bg-success p-3 rounded-md shadow-sm" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
            <Users size={24} style={{ color: 'var(--secondary-color)' }} />
          </div>
        </motion.div>

        <div className="card flex items-center justify-between">
          <div>
            <p className="color-secondary text-sm font-medium mb-1">Departments</p>
            <h3 className="text-2xl font-bold">{data.totalDepartments}</h3>
          </div>
          <div className="bg-primary p-3 rounded-md" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
            <Building size={24} className="color-primary" />
          </div>
        </div>

        <div className="card flex items-center justify-between">
          <div>
            <p className="color-secondary text-sm font-medium mb-1">Leaves Pending</p>
            <h3 className="text-2xl font-bold">{data.leavesPending}</h3>
          </div>
          <div className="bg-warning p-3 rounded-md" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <FileClock size={24} style={{ color: 'var(--warning-color)' }} />
          </div>
        </div>

        <div className="card flex items-center justify-between">
          <div>
            <p className="color-secondary text-sm font-medium mb-1">Absent Today</p>
            <h3 className="text-2xl font-bold">{data.todayAbsences}</h3>
          </div>
          <div className="bg-danger p-3 rounded-md" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <AlertTriangle size={24} className="color-danger" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: '1 1 500px' }}>
          <h3 className="font-bold text-lg mb-4">Employees by Department</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Bar dataKey="count" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ flex: '1 1 300px' }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="color-danger" />
            Risky Employees
          </h3>
          <p className="text-sm color-secondary mb-4">Employees with extreme absence or late trends.</p>
          
          <div className="flex flex-col gap-4">
            {data.riskyEmployees.length === 0 ? (
              <p className="text-sm text-center py-6 rounded-md" style={{ border: '1px dashed var(--border-color)' }}>No risky patterns detected.</p>
            ) : (
              data.riskyEmployees.map((emp: any) => (
                <div key={emp.employeeId} className="flex justify-between items-center p-3 rounded-md" style={{ border: '1px solid var(--border-color)' }}>
                  <div>
                    <p className="font-medium">{emp.employeeName}</p>
                    <p className="text-sm color-secondary">{emp.absenceCount} absences • {emp.lateCount} lates</p>
                  </div>
                  <span className={`badge ${emp.riskLevel === 'HIGH' ? 'bg-danger text-white' : 'bg-warning text-white'}`}>
                    {emp.riskLevel}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { Users, Building, FileClock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

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
      <div className="page-header">
        <h1 className="page-title">HR Overview</h1>
        <p className="page-subtitle">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="dashboard-grid mb-6">
        <div className="card flex items-center justify-between">
          <div>
            <p className="color-secondary text-sm font-medium mb-1">Total Employees</p>
            <h3 className="text-2xl font-bold">{data.totalEmployees}</h3>
          </div>
          <div className="bg-success p-3 rounded-md" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <Users size={24} style={{ color: 'var(--secondary-color)' }} />
          </div>
        </div>

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

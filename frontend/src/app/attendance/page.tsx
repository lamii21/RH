"use client";

import { useEffect, useState } from 'react';
import { Clock, LogIn, LogOut } from 'lucide-react';
import api from '@/lib/api';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeeId] = useState(1); // Demo ID, normally extracted from JWT/session

  const fetchAttendance = async () => {
    try {
      const res = await api.get('/attendance');
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

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

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Attendance Tracking</h1>
          <p className="page-subtitle">Monitor employee daily check-ins and check-outs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn text-white" onClick={handleCheckIn} style={{ backgroundColor: 'var(--secondary-color)'}}>
            <LogIn size={18} /> Check In
          </button>
          <button className="btn btn-danger" onClick={handleCheckOut}>
            <LogOut size={18} /> Check Out
          </button>
        </div>
      </div>

      <div className="card table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Work Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 border-b-0 color-secondary">No attendance logs found.</td>
              </tr>
            ) : (
              attendance.map(log => (
                <tr key={log.id}>
                  <td className="font-medium">{log.employeeName}</td>
                  <td>{log.date}</td>
                  <td>{log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : '--'}</td>
                  <td>{log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : '--'}</td>
                  <td>{log.workHours ? `${log.workHours} hrs` : '--'}</td>
                  <td>
                    <span className={`badge ${log.status === 'LATE' || log.status === 'ABSENT' ? 'bg-danger text-white' : log.status === 'HALF_DAY' ? 'bg-warning text-white' : 'text-white'}`} style={log.status === 'PRESENT' ? { backgroundColor: 'var(--secondary-color)'} : {}}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

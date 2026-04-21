"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/leaves');
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await api.put(`/leaves/${id}/${action}`);
      fetchLeaves();
    } catch (err) {
      alert(`Failed to ${action} leave`);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Leave Requests</h1>
          <p className="page-subtitle">Review and manage time off requests.</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Request form modal opens')}>
          Request Leave
        </button>
      </div>

      <div className="card table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Dates</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 border-b-0 color-secondary">No leave requests found.</td>
              </tr>
            ) : (
              leaves.map(leave => (
                <tr key={leave.id}>
                  <td className="font-medium">{leave.employeeName}</td>
                  <td>{leave.startDate} to {leave.endDate}</td>
                  <td>{leave.type}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`badge ${leave.status === 'APPROVED' ? 'bg-success text-white' : leave.status === 'REJECTED' ? 'bg-danger text-white' : 'bg-warning text-white'}`} style={leave.status === 'PENDING' ? { backgroundColor: 'var(--warning-color)', color: 'white'} : {}}>
                      {leave.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {leave.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2">
                        <button className="icon-btn" style={{ color: 'var(--secondary-color)'}} onClick={() => handleAction(leave.id, 'approve')} title="Approve">
                          <CheckCircle size={18} />
                        </button>
                        <button className="icon-btn color-danger" onClick={() => handleAction(leave.id, 'reject')} title="Reject">
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
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

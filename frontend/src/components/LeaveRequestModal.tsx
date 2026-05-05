"use client";

import { useState } from 'react';
import { X, Send } from 'lucide-react';
import api from '@/lib/api';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeaveRequestModal({ isOpen, onClose, onSuccess }: LeaveRequestModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    type: 'ANNUAL',
    reason: '',
    employeeId: typeof window !== 'undefined' ? parseInt(localStorage.getItem('demoEmployeeId') || '1') : 1
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/leaves', formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-xl font-bold">Request Time Off</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input 
                type="date" required className="input" 
                value={formData.startDate} 
                onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input 
                type="date" required className="input" 
                value={formData.endDate} 
                onChange={e => setFormData({ ...formData, endDate: e.target.value })} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Leave Type</label>
            <select 
              className="input" 
              value={formData.type} 
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="ANNUAL">Annual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="MATERNITY">Maternity</option>
              <option value="PATERNITY">Paternity</option>
              <option value="UNPAID">Unpaid Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea 
              className="input min-h-[100px] py-2" 
              placeholder="Provide a brief reason for your request..."
              required
              value={formData.reason} 
              onChange={e => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button 
              type="button" onClick={onClose} 
              className="px-4 py-2 text-sm font-medium color-secondary hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              {loading ? 'Submitting...' : <><Send size={18} /> Submit Request</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

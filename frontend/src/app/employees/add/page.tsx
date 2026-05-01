"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import api from '@/lib/api';

export default function AddEmployeePage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'password123', // Default for new employees
    role: 'EMPLOYEE',
    jobTitle: '',
    phone: '',
    departmentId: ''
  });

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data);
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    };
    fetchDepts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/employees', {
        ...formData,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null
      });
      router.push('/employees');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-1 text-sm color-secondary hover:text-indigo-600 mb-2 transition-colors">
            <ArrowLeft size={16} /> Back to Directory
          </button>
          <h1 className="page-title">Add New Employee</h1>
          <p className="page-subtitle">Register a new member to the organization.</p>
        </div>
      </div>

      <div className="card max-w-2xl mx-auto mt-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input 
                type="text" name="firstName" required className="input" 
                value={formData.firstName} onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input 
                type="text" name="lastName" required className="input" 
                value={formData.lastName} onChange={handleChange} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input 
              type="email" name="email" required className="input" 
              value={formData.email} onChange={handleChange} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input 
                type="text" name="jobTitle" required className="input" 
                value={formData.jobTitle} onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input 
                type="text" name="phone" className="input" 
                value={formData.phone} onChange={handleChange} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select 
                name="departmentId" className="input" 
                value={formData.departmentId} onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select 
                name="role" className="input" 
                value={formData.role} onChange={handleChange}
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button 
              type="button" onClick={() => router.back()} 
              className="px-4 py-2 text-sm font-medium color-secondary hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              {loading ? 'Creating...' : <><UserPlus size={18} /> Create Employee</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

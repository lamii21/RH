"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '@/lib/api';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const deleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      alert('Failed to delete employee');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Employees Directory</h1>
          <p className="page-subtitle">Manage all company personnel.</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Add form goes here (Create separate page or modal)')}>
          <Plus size={18} /> Add Employee
        </button>
      </div>

      <div className="card table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Leave Bal.</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 border-b-0 color-secondary">No employees found.</td>
              </tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.id}>
                  <td className="font-medium">{emp.firstName} {emp.lastName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.departmentName || <span className="color-secondary">None</span>}</td>
                  <td><span className="badge" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)' }}>{emp.role}</span></td>
                  <td>{emp.leaveBalance} days</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-2">
                      <button className="icon-btn color-primary"><Edit size={16} /></button>
                      <button className="icon-btn color-danger" onClick={() => deleteEmployee(emp.id)}><Trash2 size={16} /></button>
                    </div>
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

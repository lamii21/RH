"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/authenticate', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box animate-fade-in">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Login to SMART HR to manage your team.</p>
        
        {error && <div style={{ padding: '0.75rem', marginBottom: '1rem', color: 'white', backgroundColor: 'var(--danger-color)', borderRadius: '0.375rem', fontSize: '0.875rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div>
            <label>Email Address</label>
            <input 
              type="email" 
              className="input" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              type="password" 
              className="input" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm color-secondary">
          Don't have an account? <Link href="/register" className="color-primary font-medium">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

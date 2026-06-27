'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Successful login, redirect to admin panel
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center px-3 bg-bg-primary text-white"
      style={{
        background: 'radial-gradient(circle at center, hsl(var(--bg-secondary)) 0%, hsl(var(--bg-primary)) 100%)'
      }}
    >
      <div 
        className="glass-panel p-5 w-100"
        style={{ maxWidth: '420px', border: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle mb-3 animate-float"
            style={{ width: '60px', height: '60px' }}
          >
            <Lock size={28} />
          </div>
          <h4 className="fw-bold m-0 text-white">Secure Access</h4>
          <p className="text-white text-opacity-50 mt-1" style={{ fontSize: '13px' }}>
            Enter administrator credentials to log in
          </p>
        </div>

        {error && (
          <div 
            className="alert alert-danger d-flex align-items-center gap-2 border-0 bg-danger bg-opacity-10 text-danger mb-4 py-2 px-3"
            style={{ fontSize: '13px', borderRadius: '8px' }}
          >
            <ShieldAlert size={16} className="flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label text-white text-opacity-70 fw-medium" style={{ fontSize: '12px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin Username"
              disabled={loading}
              required
              className="form-control text-white bg-dark bg-opacity-40 border-secondary-subtle py-2.5 px-3"
              style={{
                fontSize: '14px',
                borderColor: 'rgba(255, 255, 255, 0.15)'
              }}
            />
          </div>

          <div>
            <label className="form-label text-white text-opacity-70 fw-medium" style={{ fontSize: '12px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
              className="form-control text-white bg-dark bg-opacity-40 border-secondary-subtle py-2.5 px-3"
              style={{
                fontSize: '14px',
                borderColor: 'rgba(255, 255, 255, 0.15)'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="btn btn-success py-2.5 w-100 fw-bold text-black border-0 mt-2 d-flex align-items-center justify-content-center gap-2"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
              borderRadius: '8px',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)'
            }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              'Authenticate'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <a 
            href="/"
            className="text-white text-opacity-50 hover:text-white d-inline-flex align-items-center gap-1.5 border-0 bg-transparent p-0"
            style={{ fontSize: '12px' }}
          >
            <ArrowLeft size={14} /> Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

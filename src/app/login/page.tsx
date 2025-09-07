'use client';

import { useState } from 'react';
import Toast from '@/components/Toast';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.success) {
        console.log(data)
        setToast({ message: 'Login successful', type: 'success' });
        localStorage.setItem("userName",data?.user?.name)
        localStorage.setItem("userEmail",data?.user?.email)
        setTimeout(() => (window.location.href = '/tasks'), 1000);
      } else {
        setToast({ message: 'Login failed', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        className="login-input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        className="login-input-field"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button className="login-button" onClick={login} disabled={loading}>
        {loading ? <span className="login-spinner"></span> : 'Login'}
      </button>
      <p className="login-signup-text">
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

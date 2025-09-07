'use client';

import { useState } from 'react';
import Toast from '@/components/Toast';
import './signup.css'; 

export default function SignupPage() {
  const [name,setName]=useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const signup = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name,email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (data.success) {
        setToast({ message: 'Signup successful', type: 'success' });
        setTimeout(() => (window.location.href = '/login'), 1000);
      } else {
        setToast({ message: 'Signup failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <input
        className="signup-input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        className="signup-input-field"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        type="text"
        required
      />
      <input
        className="signup-input-field"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button className="signup-button" onClick={signup} disabled={loading}>
        {loading ? <span className="signup-spinner"></span> : 'Sign Up'}
      </button>
      <p className="signup-redirect-text">
        Already have an account? <a href="/login">Login</a>
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

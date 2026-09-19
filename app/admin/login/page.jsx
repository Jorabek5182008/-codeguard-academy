'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lockSeconds, setLockSeconds] = useState(0);
  const router = useRouter();
  const timerRef = useRef(null);

  useEffect(() => {
    if (lockSeconds <= 0) return;
    timerRef.current = setInterval(() => {
      setLockSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [lockSeconds]);

  function extractSeconds(message) {
    const match = message?.match(/(\d+)\s*soniya/);
    return match ? Number(match[1]) : 0;
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const secs = extractSeconds(data.error);
        if (secs > 0) setLockSeconds(secs);
        throw new Error(data.error || 'Login xato');
      }
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center-page">
      <form className="card login-card" onSubmit={submit}>
        <div className="icon">🔐</div>
        <h3>Administrator kirishi</h3>
        <div className="field">
          <label>Login</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required disabled={lockSeconds > 0} />
        </div>
        <div className="field">
          <label>Parol</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={lockSeconds > 0} />
        </div>
        {error && <div className="status-msg err">{error}</div>}
        <button className="btn btn-primary btn-full" disabled={loading || lockSeconds > 0}>
          {lockSeconds > 0 ? `Bloklangan — ${lockSeconds}s` : loading ? 'Tekshirilmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  );
}

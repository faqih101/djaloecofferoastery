'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/user/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const data = await res.json();
    setLoading(false);
    if (res.ok) setSent(true);
    else setError(data.error);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-txt">DJALOE</div>
        <span className="auth-logo-sub">Coffee Roastery</span>
        <h2 className="auth-title">Lupa Password</h2>
        <p className="auth-sub">Masukkan email untuk menerima link reset</p>

        {sent ? (
          <>
            <div className="auth-ok" style={{ marginBottom: '1.5rem' }}>
              Link reset sudah dikirim! Cek inbox kamu (termasuk folder spam).
            </div>
            <Link href="/auth/login" className="auth-btn" style={{ display: 'block', textAlign: 'center' }}>Kembali ke Login</Link>
          </>
        ) : (
          <form className="form-g" onSubmit={handleSubmit}>
            {error && <div className="auth-err">{error}</div>}
            <div>
              <label className="form-lbl">Email</label>
              <input className="form-inp" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="kamu@email.com" />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Mengirim...' : 'Kirim Link Reset'}</button>
          </form>
        )}

        <div className="auth-links" style={{ marginTop: '1.5rem' }}>
          <Link href="/auth/login" className="auth-link">← Kembali ke Login</Link>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!token) return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-err" style={{ marginBottom: '1rem' }}>Token tidak valid. Minta link reset baru.</div>
        <Link href="/auth/forgot-password" className="auth-btn" style={{ display: 'block', textAlign: 'center' }}>Minta Link Baru</Link>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Password tidak cocok.'); return; }
    setLoading(true); setError('');
    const res = await fetch('/api/user/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setSuccess(data.message);
      setTimeout(() => router.push('/auth/login'), 2000);
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-txt">DJALOE</div>
        <span className="auth-logo-sub">Coffee Roastery</span>
        <h2 className="auth-title">Password Baru</h2>
        <p className="auth-sub">Masukkan password baru kamu</p>

        {success && <div className="auth-ok" style={{ marginBottom: '1.25rem' }}>{success} Mengalihkan...</div>}
        {error && <div className="auth-err" style={{ marginBottom: '1.25rem' }}>{error}</div>}

        {!success && (
          <form className="form-g" onSubmit={handleSubmit}>
            <div>
              <label className="form-lbl">Password Baru</label>
              <input className="form-inp" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="Min. 8 karakter" />
            </div>
            <div>
              <label className="form-lbl">Konfirmasi Password</label>
              <input className="form-inp" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Ulangi password baru" />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan Password Baru'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

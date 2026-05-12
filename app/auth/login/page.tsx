'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(
    params.get('error') === 'unauthorized'
      ? 'Akses ditolak. Hanya admin yang dapat mengakses halaman tersebut.'
      : ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.push(params.get('callbackUrl') || '/');
      router.refresh();
    } else {
      setError('Email atau password salah.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-txt">DJALOE</div>
        <span className="auth-logo-sub">Coffee Roastery</span>

        <h2 className="auth-title">Selamat Datang</h2>
        <p className="auth-sub">Masuk ke akunmu</p>

        {error && (
          <div className="auth-err" style={{ marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form className="form-g" onSubmit={handleSubmit}>
          <div>
            <label className="form-lbl">Email</label>

            <input
              className="form-inp"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="kamu@email.com"
            />
          </div>

          <div>
            <label className="form-lbl">Password</label>

            <input
              className="form-inp"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <div style={{ textAlign: 'right', marginTop: '-.5rem' }}>
            <Link
              href="/auth/forgot-password"
              className="auth-link"
              style={{ fontSize: '.75rem' }}
            >
              Lupa password?
            </Link>
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Masuk...' : 'Masuk →'}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-div-line" />
          <span className="auth-div-txt">atau</span>
          <div className="auth-div-line" />
        </div>

        <button
          className="google-btn"
          onClick={() =>
            signIn('google', {
              callbackUrl: params.get('callbackUrl') || '/',
            })
          }
        >
          Masuk dengan Google
        </button>

        <div className="auth-links">
          <span
            style={{
              color: 'rgba(255,255,255,.38)',
              fontSize: '.8125rem',
            }}
          >
            Belum punya akun?{' '}
            <Link
              href="/auth/register"
              className="auth-link"
              style={{ display: 'inline' }}
            >
              Daftar sekarang
            </Link>
          </span>

          <Link href="/" className="auth-link">
            ← Kembali ke Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
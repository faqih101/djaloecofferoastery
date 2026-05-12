'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { getPublicUrl } from '@/lib/supabase';
import StarRating from '@/components/ui/StarRating';

interface Review { id: number; rating: number; comment: string; createdAt: string; user: { name: string; image: string | null } }
interface Product { id: number; name: string; productSlug: string }

export default function ReviewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch(`/api/reviews?productId=${product.id}`).then(r => r.json()).then(setReviews).catch(() => {});
  }, [product.id]);

  const submit = async () => {
    if (!session) { window.location.href = '/auth/login'; return; }
    setLoading(true); setMsg(null);
    const res = await fetch('/api/reviews', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, rating, comment }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMsg({ text: 'Review dikirim! Menunggu persetujuan admin.', ok: true });
      setComment(''); setRating(5);
    } else {
      setMsg({ text: data.error, ok: false });
    }
  };

  return (
    <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', color: 'var(--fg)', marginBottom: '.25rem' }}>Ulasan</h3>
        <p style={{ color: 'var(--muted-fg)', fontSize: '.875rem', marginBottom: '1.75rem' }}>{product.name}</p>

        {/* Existing reviews */}
        {reviews.length > 0 && (
          <div className="review-list" style={{ marginBottom: '2rem' }}>
            {reviews.map(r => (
              <div key={r.id} className="review-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.625rem' }}>
                  <div className="avatar" style={{ width: '2rem', height: '2rem', fontSize: '.875rem' }}>
                    {r.user.image ? <img src={getPublicUrl(r.user.image)} alt="" /> : r.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '.875rem', color: 'var(--fg)' }}>{r.user.name}</div>
                    <StarRating rating={r.rating} size={12} />
                  </div>
                  <span style={{ fontSize: '.6875rem', color: 'var(--muted-fg)', marginLeft: 'auto' }}>
                    {new Date(r.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p style={{ fontSize: '.875rem', color: 'var(--muted-fg)', fontStyle: 'italic' }}>&ldquo;{r.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
        {reviews.length === 0 && (
          <p style={{ color: 'var(--muted-fg)', fontSize: '.875rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>Belum ada ulasan untuk produk ini.</p>
        )}

        {/* Review form */}
        {session ? (
          <div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <p style={{ fontWeight: 500, fontSize: '.9375rem', color: 'var(--fg)', marginBottom: '1rem', fontFamily: 'var(--serif)' }}>Tulis Ulasanmu</p>
              <div className="star-row">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} className="star-btn"
                    style={{ color: s <= (hoverRating || rating) ? '#f59e0b' : 'var(--border)' }}
                    onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}>★</button>
                ))}
                <span style={{ fontSize: '.8125rem', color: 'var(--muted-fg)', marginLeft: '.5rem', alignSelf: 'center' }}>
                  {['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Luar Biasa!'][hoverRating || rating]}
                </span>
              </div>
              <textarea className="rev-textarea" placeholder="Ceritakan pengalamanmu dengan kopi ini..." value={comment} onChange={e => setComment(e.target.value)} style={{ marginBottom: '1rem' }} />
              {msg && <div className={msg.ok ? 'auth-ok' : 'auth-err'} style={{ marginBottom: '1rem' }}>{msg.text}</div>}
              <button className="btn-primary" onClick={submit} disabled={loading || !comment.trim()}>
                {loading ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem', border: '1px solid var(--border)', background: 'var(--card)' }}>
            <p style={{ color: 'var(--muted-fg)', marginBottom: '1rem', fontSize: '.875rem' }}>Login untuk memberikan ulasan produk ini.</p>
            <Link href="/auth/login" style={{ display: 'inline-block', background: 'var(--primary)', color: 'var(--primary-fg)', padding: '.75rem 2rem', fontWeight: 600, fontSize: '.875rem' }}>
              Login / Daftar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

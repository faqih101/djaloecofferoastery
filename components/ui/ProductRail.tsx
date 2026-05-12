'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { getPublicUrl } from '@/lib/supabase';

interface Product {
  id: number;
  productSlug: string;
  name: string;
  origin: string;
  roastLevel: string;
  image: string;
  notes: string[];
}

const RL: Record<string, string> = {
  Light: '#d97706', Medium: '#b45309', 'Medium-Dark': '#c2410c', Dark: '#b91c1c',
};

export default function ProductRail({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef  = useRef<number>(0);
  const posRef   = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || products.length === 0) return;

    const SPEED = 0.5;
    const singleWidth = track.scrollWidth / 2;

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED;
        if (posRef.current >= singleWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    const pause = () => { pausedRef.current = true; };
    const resume = () => { pausedRef.current = false; };
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', resume);

    return () => {
      cancelAnimationFrame(animRef.current);
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', resume);
    };
  }, [products]);

  // Duplicate for seamless loop
  const doubled = [...products, ...products];

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div
        ref={trackRef}
        style={{ display: 'flex', gap: '1.25rem', width: 'max-content', willChange: 'transform' }}
      >
        {doubled.map((p, i) => {
          const imgUrl = p.image ? getPublicUrl(p.image) : '';
          return (
            <Link
              key={`${p.id}-${i}`}
              href={`/origins/${p.productSlug}`}
              style={{
                flexShrink: 0,
                width: '260px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                textDecoration: 'none',
                transition: 'border-color 0.2s, transform 0.3s',
                display: 'block',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(120,72,30,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: '160px', overflow: 'hidden', background: 'var(--muted)' }}>
                {imgUrl
                  ? <img src={imgUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.07)'; }}
                      onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'none'; }}
                    />
                  : <div className={`bg-${p.productSlug}`} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '3rem', filter: 'grayscale(1) brightness(.8)' }}>☕</span>
                    </div>
                }
                <div style={{ position: 'absolute', top: '.625rem', right: '.625rem', fontSize: '.6rem', textTransform: 'uppercase', letterSpacing: '.08em', padding: '.125rem .5rem', border: '1px solid', color: RL[p.roastLevel] || '#b45309', borderColor: `${RL[p.roastLevel] || '#b45309'}66`, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
                  {p.roastLevel}
                </div>
              </div>
              {/* Info */}
              <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '.6rem', textTransform: 'uppercase', letterSpacing: '.2em', color: 'var(--primary)', marginBottom: '.375rem' }}>{p.origin}</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', color: 'var(--fg)', marginBottom: '.5rem', lineHeight: 1.25 }}>{p.name}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.25rem' }}>
                  {p.notes.slice(0, 2).map(n => (
                    <span key={n} style={{ fontSize: '.6rem', letterSpacing: '.06em', color: 'var(--muted-fg)', border: '1px solid var(--border)', padding: '.125rem .375rem', textTransform: 'uppercase' }}>{n}</span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

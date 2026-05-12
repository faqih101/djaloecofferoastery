'use client';
import { useEffect, useRef } from 'react';

export function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => el.classList.add('show'), delay);
        obs.unobserve(el);
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

export function ScrollReveal({ children, className = 'fade-up', delay = 0, style = {} }: {
  children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties;
}) {
  const ref = useScrollReveal(delay);
  return <div ref={ref} className={className} style={style}>{children}</div>;
}

export function initScrollReveal() {
  if (typeof window === 'undefined') return undefined;

  const SELECTORS = '.fade-up,.scroll-in,.fade-in,.slide-left,.slide-right,.prod-card,.testi-card';

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target as HTMLElement;
        const delay = parseFloat(el.dataset.delay || '0') * 1000;
        setTimeout(() => el.classList.add('show'), delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  // Only observe elements that haven't already been shown
  document.querySelectorAll<HTMLElement>(SELECTORS).forEach(el => {
    if (!el.classList.contains('show')) {
      obs.observe(el);
    }
  });

  return obs;
}

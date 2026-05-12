'use client';
import { useEffect, useState } from 'react';

export default function CoffeeCursor() {
  const [pos, setPos]     = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden]   = useState(false);

  useEffect(() => {
    // Only on desktop
    if (window.innerWidth < 768) return;

    let animId: number;
    let tx = -100, ty = -100;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      tx = e.clientX; ty = e.clientY;
    };
    const onDown = () => { setClicked(true); setTimeout(() => setClicked(false), 300); };
    const onEnter = () => setHidden(false);
    const onLeave = () => setHidden(true);

    const animate = () => {
      setTrail(prev => ({
        x: prev.x + (tx - prev.x) * 0.12,
        y: prev.y + (ty - prev.y) * 0.12,
      }));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div style={{
        position: 'fixed',
        left: pos.x - 5,
        top: pos.y - 5,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'var(--primary)',
        pointerEvents: 'none',
        zIndex: 99999,
        transform: clicked ? 'scale(2.5)' : 'scale(1)',
        opacity: hidden ? 0 : 0.9,
        transition: 'transform 0.15s ease, opacity 0.2s',
        mixBlendMode: 'multiply',
      }} />
      {/* Trail ring */}
      <div style={{
        position: 'fixed',
        left: trail.x - 18,
        top: trail.y - 18,
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '1.5px solid rgba(212,169,106,0.45)',
        pointerEvents: 'none',
        zIndex: 99998,
        opacity: hidden ? 0 : 1,
        transition: 'opacity 0.2s',
      }} />
    </>
  );
}

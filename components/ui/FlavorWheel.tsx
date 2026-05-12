'use client';
import { useEffect, useRef } from 'react';

interface Props { notes: string[]; roastLevel: string }

const NOTE_COLORS: Record<string, string> = {
  'Dark Chocolate': '#3d1f0a',
  'Rempah': '#8b2500',
  'Earthy': '#5c4033',
  'Floral': '#c0785a',
  'Karamel': '#d4a96a',
  'Nutty': '#a0714f',
  'Tembakau': '#6b4226',
  'Dark Cocoa': '#2d1400',
  'Bold': '#1a0a00',
  'Dried Fruit': '#c0392b',
  'Dark Berry': '#8e0038',
  'Winey': '#722f37',
  'Caramel': '#d4a96a',
  'Citrus': '#f39c12',
  'Clean': '#f8f4ef',
  'Bright': '#f1c40f',
};

export default function FlavorWheel({ notes, roastLevel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || notes.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const R  = Math.min(cx, cy) - 20;
    const slice = (Math.PI * 2) / notes.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    notes.forEach((note, i) => {
      const start = i * slice - Math.PI / 2;
      const end   = start + slice;
      const color = NOTE_COLORS[note] || '#8b7355';

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, start, end);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'var(--bg)' as string;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      const mid   = start + slice / 2;
      const lx    = cx + (R * 0.65) * Math.cos(mid);
      const ly    = cy + (R * 0.65) * Math.sin(mid);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(note.length > 10 ? note.slice(0, 8) + '…' : note, lx, ly);
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--card)' as string;
    ctx.fill();
    ctx.fillStyle = 'var(--primary)' as string;
    ctx.font = '8px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(roastLevel, cx, cy);
  }, [notes, roastLevel]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        width={180}
        height={180}
        style={{ display: 'block', margin: '0 auto', borderRadius: '50%' }}
      />
    </div>
  );
}

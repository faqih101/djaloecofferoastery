'use client';
import { useState } from 'react';

interface BrewMethod {
  name: string;
  icon: string;
  grind: string;
  ratio: string;
  temp: string;
  time: string;
  tip: string;
}

const methods: Record<string, BrewMethod[]> = {
  Light: [
    { name: 'V60 Pour Over', icon: '☕', grind: 'Medium-Fine', ratio: '1:15', temp: '93°C', time: '3–4 menit', tip: 'Bloom 30 detik dengan 2x berat kopi air, lalu tuang melingkar perlahan.' },
    { name: 'Chemex', icon: '⚗️', grind: 'Medium-Coarse', ratio: '1:15', temp: '92°C', time: '4–5 menit', tip: 'Gunakan filter tebal Chemex untuk body yang lebih bersih dan bright.' },
    { name: 'Aeropress', icon: '🔬', grind: 'Fine-Medium', ratio: '1:12', temp: '80°C', time: '2–3 menit', tip: 'Inverted method untuk ekstrasi lebih merata, press pelan selama 30 detik.' },
  ],
  Medium: [
    { name: 'Pour Over', icon: '☕', grind: 'Medium', ratio: '1:15', temp: '92°C', time: '3–4 menit', tip: 'Ideal untuk menonjolkan sweetness dan balance dari kopi medium roast.' },
    { name: 'French Press', icon: '🫗', grind: 'Coarse', ratio: '1:14', temp: '93°C', time: '4 menit', tip: 'Aduk setelah tuang air, plunge perlahan untuk body yang full dan rich.' },
    { name: 'Moka Pot', icon: '🏺', grind: 'Fine', ratio: '1:7', temp: '100°C', time: '5–7 menit', tip: 'Gunakan api kecil, angkat segera setelah kopi mulai keluar untuk menghindari bitter.' },
  ],
  'Medium-Dark': [
    { name: 'Espresso', icon: '⚡', grind: 'Fine', ratio: '1:2', temp: '92°C', time: '25–30 detik', tip: 'Target yield 36–40g dari 18g grounds. Adjust grind jika extraction terlalu cepat/lambat.' },
    { name: 'Moka Pot', icon: '🏺', grind: 'Fine-Medium', ratio: '1:7', temp: '95°C', time: '5–7 menit', tip: 'Sempurna untuk dasar es kopi susu. Tambahkan es dan susu segar untuk hasil terbaik.' },
    { name: 'Cold Brew', icon: '🧊', grind: 'Coarse', ratio: '1:8', temp: 'Dingin', time: '12–18 jam', tip: 'Rendam di kulkas overnight. Saring dua kali untuk hasil yang jernih dan smooth.' },
  ],
  Dark: [
    { name: 'Espresso', icon: '⚡', grind: 'Fine', ratio: '1:2', temp: '90°C', time: '25–30 detik', tip: 'Bold dan intens, cocok untuk cappuccino atau latte. Water temperature lebih rendah mengurangi bitter.' },
    { name: 'Tubruk', icon: '🥃', grind: 'Coarse', ratio: '1:10', temp: '95°C', time: '4 menit', tip: 'Cara tradisional paling tepat untuk Dark Roast. Tunggu ampas mengendap sebelum diminum.' },
    { name: 'Cold Brew', icon: '🧊', grind: 'Extra Coarse', ratio: '1:6', temp: 'Dingin', time: '18–24 jam', tip: 'Konsentrasi tinggi untuk dibuat kopi susu. Encerkan dengan susu/air dengan rasio 1:2.' },
  ],
};

export default function BrewingGuide({ roastLevel }: { roastLevel: string }) {
  const list = methods[roastLevel] || methods['Medium'];
  const [active, setActive] = useState(0);
  const m = list[active];

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.25rem' }}>☕</span>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', color: 'var(--fg)' }}>Brewing Guide</h3>
      </div>

      {/* Method tabs */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {list.map((method, i) => (
          <button
            key={method.name}
            onClick={() => setActive(i)}
            style={{
              padding: '.375rem .875rem',
              fontSize: '.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '.1em',
              border: '1px solid',
              borderColor: active === i ? 'var(--primary)' : 'var(--border)',
              background: active === i ? 'var(--primary)' : 'transparent',
              color: active === i ? 'var(--primary-fg)' : 'var(--muted-fg)',
              cursor: 'pointer',
              transition: 'all .2s',
            }}
          >
            {method.icon} {method.name}
          </button>
        ))}
      </div>

      {/* Method detail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Grind Size', value: m.grind },
          { label: 'Coffee : Air', value: m.ratio },
          { label: 'Suhu Air', value: m.temp },
          { label: 'Waktu Seduh', value: m.time },
        ].map(item => (
          <div key={item.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '.875rem' }}>
            <div style={{ fontSize: '.6rem', textTransform: 'uppercase', letterSpacing: '.15em', color: 'var(--muted-fg)', marginBottom: '.25rem' }}>{item.label}</div>
            <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--fg)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg)', borderLeft: '2px solid var(--primary)', padding: '.875rem 1rem', fontSize: '.875rem', color: 'var(--muted-fg)', lineHeight: 1.7 }}>
        <span style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--primary)', display: 'block', marginBottom: '.375rem' }}>Pro Tip</span>
        {m.tip}
      </div>
    </div>
  );
}

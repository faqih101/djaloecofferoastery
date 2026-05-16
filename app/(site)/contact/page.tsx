'use client';

import { useEffect, useState } from 'react';
import { initScrollReveal } from '@/components/ui/ScrollReveal';

interface Settings {
  [k: string]: string;
}

export default function ContactPage() {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    fetch('/api/data')
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const obs = initScrollReveal();
      return () => obs?.disconnect();
    }, 100);

    return () => clearTimeout(t);
  }, [settings]);

  const s = settings;

  const waNumber = '087872639755';

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />

        <div className="container" style={{ paddingTop: '2rem' }}>
          <span className="page-hero-label">Connect With Us</span>

          <h1 className="page-hero-title">
            Let&apos;s Talk
            <br />
            <span className="italic" style={{ color: 'var(--primary)' }}>
              Coffee.
            </span>
          </h1>

          <p className="page-hero-sub">
            {s.contact_desc ||
              'Tertarik berkolaborasi? Hubungi kami langsung.'}
          </p>
        </div>
      </section>

      {/* Contact grid */}
      <section className="contact bg-base">
        <div className="contact-hatch" />

        <div className="container">
          <div className="contact-grid">
            {/* Left — direct contact */}
            <div className="slide-left">
              <div
                className="vr"
                style={{ marginBottom: '2.5rem' }}
              >
                Hubungi Langsung
              </div>

              <div className="contact-list">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${+6287872639755}`}
                  target="_blank"
                  rel="noopener"
                  className="c-item c-item-link"
                >
                  <div className="c-icon c-icon-p">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.533 5.85L.057 23.177a.75.75 0 00.918.919l5.42-1.461A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.814 9.814 0 01-5.028-1.383l-.36-.214-3.718 1.002.992-3.628-.233-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                    </svg>
                  </div>

                  <div className="c-info">
                    <div className="c-title">WhatsApp Kami</div>
                    <div className="c-sub">+62 878 7263 9755</div>
                  </div>

                  <div className="c-arrow">→</div>
                </a>

                {/* Location */}
                <a
                  href="https://maps.app.goo.gl/Hj9HTyVRL3vw56CU9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="c-item c-item-link"
                >
                  <div className="c-icon c-icon-m">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                    </svg>
                  </div>

                  <div className="c-info">
                    <div className="c-title">Lokasi Roastery</div>
                    <div className="c-sub">{s.contact_location}</div>
                  </div>

                  <div className="c-arrow">→</div>
                </a>

            
              </div>
            </div>

            {/* Right — socials + stores */}
            <div className="slide-right">
              <div className="contact-card vf">
                <h3 className="contact-card-title">Find Us Online</h3>
                <p className="contact-card-sub">Ikuti kami di media sosial</p>
                <div className="social-grid">
                  <a href="https://www.instagram.com/djaloecoffeeroastery" target="_blank" rel="noopener" className="social-item">
                    <span className="social-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </span>
                    <span className="social-lbl">Instagram</span>
                  </a>
                  <a href="https://www.tiktok.com/@djaloecoffeeroastery1" target="_blank" rel="noopener" className="social-item">
                    <span className="social-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
                    </span>
                    <span className="social-lbl">TikTok</span>
                  </a>
                </div>
                <div className="store-sec">
                  <h4 className="store-title">Official Store</h4>
                  <div className="store-list">
                    {[
                      { href: 'https://tk.tokopedia.com/ZSH5Ws53L/', label: 'Tokopedia', color: '#42b549', path: 'M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 2c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm-.5 4v4.5H7v1h4.5V17h1v-4.5H17v-1h-4.5V7h-1z' },
                      { href: 'https://vt.tiktok.com/ZSH5WGEBe/?page=Mall', label: 'TikTok Shop', color: 'currentColor', path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z' },
                      { href: 'https://gofood.link/a/Gx3zyyh', label: 'GoFood', color: '#e4173e', path: 'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 2a8 8 0 110 16A8 8 0 0112 4zm0 2a6 6 0 100 12A6 6 0 0012 6zm0 2a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4z' },
                    ].map(st => (
                      <a key={st.label} href={st.href} target="_blank" rel="noopener" className="store-item">
                        <span className="store-inner">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, color: st.color }}><path d={st.path} /></svg>
                          <span>{st.label}</span>
                        </span>
                        <span>→</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
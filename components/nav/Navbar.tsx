'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') { setDark(true); document.documentElement.classList.add('dark'); }
    } catch {}
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
  };

  const links = [
    { href: '/', label: 'Home' },
    { href: '/story', label: 'Story' },
    { href: '/origins', label: 'Origins' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const ThemeIcon = () => mounted && dark
    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;

  return (
    <nav id="main-nav" className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <div className="nav-inner">

          {/* Logo */}
          <Link href="/" className="logo-btn">
            <div className="logo-wrap">
              <span className="logo-dash" />
              <span className="logo-txt">Djaloe</span>
              <span className="logo-txt">Coffee</span>
              <span className="logo-dash" />
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-links">
            {links.map(l => (
              <Link key={l.href} href={l.href} className={`nav-a${isActive(l.href) ? ' active' : ''}`}>{l.label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div className="nav-right">
            {/* Single theme button - always visible */}
            <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              <ThemeIcon />
            </button>

            {/* Desktop: login/CMS - hidden on mobile */}
            <div className="nav-auth-desktop">
              {session ? (
                <>
                  {(session.user as any).role === 'ADMIN' && (
                    <Link href="/admin" className="nav-cms-link">CMS</Link>
                  )}
                  <button className="btn-cta" onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
                </>
              ) : (
                <Link href="/auth/login" className="btn-cta">Login</Link>
              )}
            </div>

            {/* Mobile hamburger - hidden on desktop */}
            <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen
                  ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
                  : <><line x1="4" x2="20" y1="7" y2="7"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="17" y2="17"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {links.map(l => (
          <Link key={l.href} href={l.href} className={`mob-link${isActive(l.href) ? ' accent' : ''}`} onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
        {session ? (
          <>
            {(session.user as any).role === 'ADMIN' && (
              <Link href="/admin" className="mob-link accent" onClick={() => setMenuOpen(false)}>Admin CMS</Link>
            )}
            <button className="mob-link" style={{ color: '#ef4444', textAlign: 'left', letterSpacing: '.12em', textTransform: 'uppercase', fontSize: '.875rem', width: '100%' }}
              onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}>Logout</button>
          </>
        ) : (
          <Link href="/auth/login" className="mob-link accent" onClick={() => setMenuOpen(false)}>Login / Daftar</Link>
        )}
        <Link href="/contact" className="btn-cta" style={{ marginTop: '.75rem', textAlign: 'center', display: 'block', borderRadius: '9999px', padding: '.75rem 1.5rem' }} onClick={() => setMenuOpen(false)}>Visit Us</Link>
      </div>
    </nav>
  );
}

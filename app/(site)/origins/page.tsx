'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { initScrollReveal } from '@/components/ui/ScrollReveal';
import { getPublicUrl } from '@/lib/supabase';

interface Product { id:number; productSlug:string; name:string; origin:string; description:string; roastLevel:string; image:string; notes:string[] }

const RL: Record<string,string> = { Light:'rl-light', Medium:'rl-medium', 'Medium-Dark':'rl-medium-dark', Dark:'rl-dark' };
const FILTERS = ['Semua','Light','Medium','Medium-Dark','Dark'];

export default function OriginsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter]     = useState('Semua');
  const [search, setSearch]     = useState('');

  useEffect(()=>{
    fetch('/api/data').then(r=>r.json()).then(d=>setProducts(d.products||[]));
  },[]);

  useEffect(()=>{
    const t = setTimeout(()=>{ const obs=initScrollReveal(); return ()=>obs?.disconnect(); },100);
    return ()=>clearTimeout(t);
  },[products, filter, search]);

  const filtered = products
    .filter(p => filter==='Semua' || p.roastLevel===filter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.origin.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-bg"/>
        <div className="container" style={{paddingTop:'2rem'}}>
          <span className="page-hero-label">Our Selection</span>
          <h1 className="page-hero-title">Curated <span className="italic" style={{color:'var(--primary)'}}>Origins</span></h1>
          <p className="page-hero-sub">Pilihan biji kopi single origin terbaik dari penjuru Nusantara. Setiap kopi punya cerita dan karakter uniknya sendiri.</p>
        </div>
      </section>

      {/* Filter + Search bar */}
      <section style={{background:'var(--card)',borderBottom:'1px solid var(--border)',padding:'1.25rem 0',position:'sticky',top:'64px',zIndex:40,backdropFilter:'blur(12px)'}}>
        <div className="container" style={{display:'flex',gap:'1rem',alignItems:'center',flexWrap:'wrap'}}>
          {/* Search */}
          <div style={{position:'relative',flex:'1',minWidth:'180px',maxWidth:'260px'}}>
            <span style={{position:'absolute',left:'.75rem',top:'50%',transform:'translateY(-50%)',color:'var(--muted-fg)',fontSize:'.875rem'}}>🔍</span>
            <input
              type="text"
              placeholder="Cari kopi..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
              style={{width:'100%',paddingLeft:'2.25rem',paddingRight:'.75rem',paddingTop:'.5rem',paddingBottom:'.5rem',border:'1px solid var(--border)',borderRadius:'9999px',fontSize:'.8125rem',background:'var(--bg)',color:'var(--fg)',outline:'none',transition:'border-color .2s'}}
              onFocus={e=>e.target.style.borderColor='var(--primary)'}
              onBlur={e=>e.target.style.borderColor='var(--border)'}
            />
          </div>
          {/* Filters */}
          <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',alignItems:'center'}}>
            <span style={{fontSize:'.6rem',textTransform:'uppercase',letterSpacing:'.15em',color:'var(--muted-fg)'}}>Filter:</span>
            {FILTERS.map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{
                padding:'.375rem .875rem',fontSize:'.6875rem',textTransform:'uppercase',letterSpacing:'.1em',border:'1px solid',
                borderColor:filter===f?'var(--primary)':'var(--border)',
                background:filter===f?'var(--primary)':'transparent',
                color:filter===f?'var(--primary-fg)':'var(--muted-fg)',
                cursor:'pointer',transition:'all .2s',borderRadius:'2px',
              }}>{f}</button>
            ))}
          </div>
          <span style={{fontSize:'.75rem',color:'var(--muted-fg)',marginLeft:'auto'}}>{filtered.length} kopi</span>
        </div>
      </section>

      {/* Products grid */}
      <section style={{padding:'5rem 0 8rem',background:'var(--bg)'}}>
        <div className="container">
          <div className="origins-grid">
            {filtered.map((p,idx)=>{
              const imgUrl = p.image ? getPublicUrl(p.image) : '';
              return (
                <div key={p.id} className="origin-card scroll-in" data-delay={String(idx*0.07)}>
                  <div className="origin-card-img">
                    {imgUrl
                      ? <img src={imgUrl} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy"/>
                      : <div className={`bg-${p.productSlug}`} style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <span style={{fontSize:'4rem',filter:'grayscale(1) brightness(.8)'}}>☕</span>
                        </div>
                    }
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 50%)'}}/>
                    <div className={`prod-badge ${RL[p.roastLevel]||'rl-medium'}`} style={{position:'absolute',top:'.75rem',right:'.75rem'}}>{p.roastLevel}</div>
                  </div>
                  <div className="origin-card-body">
                    <div className="origin-card-origin">{p.origin}</div>
                    <h3 className="origin-card-name">{p.name}</h3>
                    <p className="origin-card-desc">{p.description}</p>
                    <div className="origin-card-notes">
                      {p.notes.map(n=><span key={n} className="origin-card-note">{n}</span>)}
                    </div>
                    <div className="origin-card-footer">
                      <span className="origin-card-roast">Roast: {p.roastLevel}</span>
                      <Link href={`/origins/${p.productSlug}`} className="origin-card-link">Detail <span>→</span></Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length===0 && (
            <div style={{textAlign:'center',padding:'4rem',color:'var(--muted-fg)'}}>
              <p style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:'1.125rem',marginBottom:'.5rem'}}>Tidak ada kopi ditemukan.</p>
              <button onClick={()=>{setFilter('Semua');setSearch('');}} style={{color:'var(--primary)',fontSize:'.875rem',textTransform:'uppercase',letterSpacing:'.1em',background:'none',border:'none',cursor:'pointer'}}>Reset Filter</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

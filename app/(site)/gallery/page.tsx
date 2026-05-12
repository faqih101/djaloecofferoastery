'use client';
import { useEffect, useState, useRef } from 'react';
import { initScrollReveal } from '@/components/ui/ScrollReveal';
import { getPublicUrl } from '@/lib/supabase';

interface GalleryItem { id:number; image:string; title:string; icon:string; sortOrder:number }

export default function GalleryPage() {
  const [items, setItems]       = useState<GalleryItem[]>([]);
  const [lightbox, setLightbox] = useState<{item:GalleryItem;idx:number}|null>(null);
  const touchStartX = useRef(0);

  useEffect(()=>{
    fetch('/api/data').then(r=>r.json()).then(d=>setItems(d.gallery||[]));
  },[]);

  useEffect(()=>{
    const t = setTimeout(()=>{ const obs=initScrollReveal(); return ()=>obs?.disconnect(); },100);
    return ()=>clearTimeout(t);
  },[items]);

  // Keyboard navigation for lightbox
  useEffect(()=>{
    const handler = (e:KeyboardEvent)=>{
      if (!lightbox) return;
      if (e.key==='Escape') setLightbox(null);
      if (e.key==='ArrowRight') navigate(1);
      if (e.key==='ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', handler);
    return ()=>window.removeEventListener('keydown', handler);
  },[lightbox]);

  const navigate = (dir:number)=>{
    if (!lightbox) return;
    const hasImgItems = items.filter(i=>i.image);
    const cur = hasImgItems.findIndex(i=>i.id===lightbox.item.id);
    const next = (cur+dir+hasImgItems.length)%hasImgItems.length;
    setLightbox({item:hasImgItems[next], idx:next});
  };

  const hasImg = (url:string) => !!url; // getPublicUrl returns '' if no image

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-bg"/>
        <div className="container" style={{paddingTop:'2rem'}}>
          <span className="page-hero-label">Atmosphere</span>
          <h1 className="page-hero-title">Visual <span className="italic" style={{color:'var(--primary)'}}>Stories</span></h1>
          <p className="page-hero-sub">Lebih dari sekadar secangkir kopi. Ini tentang proses, dedikasi, dan kultur Djaloe.</p>
        </div>
      </section>

      {/* Gallery grid */}
      <section style={{padding:'4rem 0 8rem',background:'var(--bg)'}}>
        <div className="container">
          {items.length>0 ? (
            <div className="gallery-page-grid">
              {items.map((item,idx)=>{
                const url = item.image ? getPublicUrl(item.image) : '';
                const imgOk = hasImg(url);
                return (
                  <div key={item.id} className="gal-page-item scroll-in" data-delay={String((idx%4)*0.07)}
                    onClick={()=>imgOk && setLightbox({item,idx})}
                    style={{cursor:imgOk?'zoom-in':'default'}}
                    onTouchStart={e=>{touchStartX.current=e.touches[0].clientX;}}
                    onTouchEnd={e=>{
                      const dx=e.changedTouches[0].clientX-touchStartX.current;
                      if (Math.abs(dx)>50 && lightbox) navigate(dx<0?1:-1);
                    }}
                  >
                    {imgOk
                      ? <img src={url} alt={item.title} loading="lazy"/>
                      : <div className={`g${(idx%4)+1}`} style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1rem'}}>
                          <span style={{fontSize:'4rem',filter:'grayscale(1) brightness(.75)'}}>{item.icon||'📷'}</span>
                          <span style={{color:'rgba(255,255,255,.5)',fontSize:'.75rem',textTransform:'uppercase',letterSpacing:'.15em'}}>{item.title}</span>
                        </div>
                    }
                    <div className="gal-page-overlay"/>
                    <div className="gal-page-meta">
                      <div className="gal-page-title">{item.title}</div>
                      {imgOk && <div style={{fontSize:'.625rem',color:'rgba(255,255,255,.5)',marginTop:'.25rem',textTransform:'uppercase',letterSpacing:'.1em'}}>Klik untuk perbesar</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'6rem 0'}}>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1px',background:'var(--border)',marginBottom:'3rem'}}>
                {[0,1,2,3,4,5,6,7].map(i=>(
                  <div key={i} className={`g${(i%4)+1}`} style={{aspectRatio:'3/4',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <span style={{fontSize:'3rem',filter:'grayscale(1) brightness(.6)',opacity:.7}}>📷</span>
                  </div>
                ))}
              </div>
              <p style={{color:'var(--muted-fg)',fontFamily:'var(--serif)',fontStyle:'italic'}}>Foto-foto akan segera hadir.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="modal-bg" onClick={()=>setLightbox(null)}
          style={{alignItems:'center',justifyContent:'center'}}
          onTouchStart={e=>{touchStartX.current=e.touches[0].clientX;}}
          onTouchEnd={e=>{const dx=e.changedTouches[0].clientX-touchStartX.current; if(Math.abs(dx)>50) navigate(dx<0?1:-1);}}
        >
          <div style={{position:'relative',maxWidth:'90vw',maxHeight:'90vh',display:'flex',flexDirection:'column',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
            <img src={getPublicUrl(lightbox.item.image)} alt={lightbox.item.title}
              style={{maxWidth:'90vw',maxHeight:'80vh',objectFit:'contain',display:'block',borderRadius:'2px'}}/>
            <div style={{padding:'.875rem 1.25rem',textAlign:'center'}}>
              <p style={{color:'rgba(255,255,255,.8)',fontSize:'.875rem',letterSpacing:'.1em',textTransform:'uppercase'}}>{lightbox.item.title}</p>
            </div>
            {/* Nav arrows */}
            {items.filter(i=>i.image).length>1 && (
              <>
                <button onClick={e=>{e.stopPropagation();navigate(-1);}} style={{position:'absolute',left:'-3rem',top:'40%',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',color:'#fff',width:'2.5rem',height:'2.5rem',borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.25rem'}}>‹</button>
                <button onClick={e=>{e.stopPropagation();navigate(1);}}  style={{position:'absolute',right:'-3rem',top:'40%',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',color:'#fff',width:'2.5rem',height:'2.5rem',borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.25rem'}}>›</button>
              </>
            )}
            <button className="modal-close" onClick={()=>setLightbox(null)}
              style={{position:'absolute',top:'-.75rem',right:'-.75rem',background:'#2c1810',color:'#d4a96a',width:'2rem',height:'2rem',borderRadius:'9999px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',border:'1px solid rgba(212,169,106,.3)'}}>✕</button>
          </div>
        </div>
      )}
    </>
  );
}

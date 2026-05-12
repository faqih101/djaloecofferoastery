'use client';
import { getPublicUrl } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

type Tab = 'products' | 'values' | 'gallery' | 'settings' | 'reviews';

interface Product { id?: number; productSlug: string; name: string; origin: string; description: string; roastLevel: string; image: string; sortOrder: number; notes: string[] }
interface Testimonial { id?: number; name: string; location: string; rating: number; review: string; date: string; initial: string; sortOrder: number }
interface GalleryItem { id?: number; image: string; title: string; icon: string; sortOrder: number }
interface Settings { [k: string]: string }
interface Review { id: number; rating: number; comment: string; status: string; createdAt: string; user: { name: string; email: string; image: string | null }; product: { name: string } }
interface CompanyValue { id?: number; icon: string; title: string; body: string; sortOrder: number }

function Toast({ msg, onDone }: { msg: { text: string; ok: boolean } | null; onDone: () => void }) {
  useEffect(() => { if (msg) { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); } }, [msg]);
  if (!msg) return null;
  return <div className={`toast ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>;
}

async function doUpload(file: File, type: string): Promise<string | null> {
  const fd = new FormData(); fd.append('file', file); fd.append('type', type);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
  if (!res.ok) return null;
  return (await res.json()).filename;
}

// ── Products ─────────────────────────────────────────────
function ProductsTab({ showToast }: { showToast: (t: string, ok?: boolean) => void }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => { fetch('/api/admin/products').then(r => r.json()).then(setItems); }, []);

  const save = async (p: Product, idx: number) => {
    const url = p.id ? `/api/admin/products/${p.id}` : '/api/admin/products';
    const res = await fetch(url, { method: p.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
    const d = await res.json();
    if (res.ok) { const n = [...items]; n[idx] = d; setItems(n); showToast('✓ Produk disimpan'); }
    else showToast(d.error || 'Gagal', false);
  };

  const del = async (p: Product, idx: number) => {
    if (!confirm(`Hapus "${p.name}"?`)) return;
    if (p.id) await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' });
    setItems(items.filter((_, i) => i !== idx)); showToast('✓ Dihapus');
  };

  const upd = (idx: number, f: keyof Product, v: any) => { const n = [...items]; (n[idx] as any)[f] = v; setItems(n); };

  const handleImg = async (file: File, idx: number) => {
    const fn = await doUpload(file, 'product');
    if (fn) { upd(idx, 'image', fn); showToast('✓ Gambar diupload'); }
    else showToast('Upload gagal', false);
  };

  return (
    <div className="adm-card">
      <div className="adm-card-hdr">
        <div><h2>Coffee Origins</h2><p>Edit, tambah, atau hapus produk kopi.</p></div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button className="adm-add" onClick={() => setItems([...items, { productSlug: 'slug_' + Date.now(), name: 'Produk Baru', origin: '', description: '', roastLevel: 'Medium', image: '', sortOrder: items.length, notes: [] }])}>+ Tambah</button>
        </div>
      </div>
      <div className="adm-card-body">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Gambar</th><th>Slug</th><th>Nama</th><th>Origin</th><th>Deskripsi</th><th>Roast</th><th>Notes</th><th>Aksi</th></tr></thead>
            <tbody>
              {items.map((p, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '90px' }}>
                      {p.image ? <img src={p.image.startsWith('http') ? p.image : getPublicUrl(p.image)} className="img-prev" alt="" /> : <div className="img-ph">☕</div>}
                      <label className="upl-lbl">📷 Upload<input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleImg(e.target.files[0], idx)} /></label>
                    </div>
                  </td>
                  <td><input className="adm-inp" value={p.productSlug} onChange={e => upd(idx, 'productSlug', e.target.value)} style={{ width: '100px' }} /></td>
                  <td><input className="adm-inp" value={p.name} onChange={e => upd(idx, 'name', e.target.value)} style={{ minWidth: '130px' }} /></td>
                  <td><input className="adm-inp" value={p.origin} onChange={e => upd(idx, 'origin', e.target.value)} style={{ minWidth: '130px' }} /></td>
                  <td><textarea className="adm-ta" value={p.description} onChange={e => upd(idx, 'description', e.target.value)} style={{ minWidth: '180px' }} /></td>
                  <td>
                    <select className="adm-sel" value={p.roastLevel} onChange={e => upd(idx, 'roastLevel', e.target.value)} style={{ width: '120px' }}>
                      {['Light', 'Medium', 'Medium-Dark', 'Dark'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center', minWidth: '160px' }}>
                      {(p.notes || []).map((n, ni) => (
                        <span key={ni} className="note-tag">{n}
                          <button className="note-del" onClick={() => { const ns = [...p.notes]; ns.splice(ni, 1); upd(idx, 'notes', ns); }}>×</button>
                        </span>
                      ))}
                      <button className="note-add" onClick={() => { const n = prompt('Note baru:'); if (n?.trim()) upd(idx, 'notes', [...(p.notes || []), n.trim()]); }}>+ note</button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="adm-save" style={{ padding: '.3rem .75rem', fontSize: '.75rem' }} onClick={() => save(p, idx)}>Simpan</button>
                      <button className="adm-del" onClick={() => del(p, idx)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={8}><div className="adm-empty">Belum ada produk.</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Testimonials ─────────────────────────────────────────
function TestimonialsTab({ showToast }: { showToast: (t: string, ok?: boolean) => void }) {
  const [items, setItems] = useState<Testimonial[]>([]);
  useEffect(() => { fetch('/api/admin/testimonials').then(r => r.json()).then(setItems); }, []);
  const save = async (t: Testimonial, idx: number) => {
    const res = await fetch(t.id ? `/api/admin/testimonials/${t.id}` : '/api/admin/testimonials', { method: t.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t) });
    const d = await res.json(); if (res.ok) { const n = [...items]; n[idx] = d; setItems(n); showToast('✓ Disimpan'); } else showToast(d.error || 'Gagal', false);
  };
  const del = async (t: Testimonial, idx: number) => {
    if (!confirm(`Hapus review dari "${t.name}"?`)) return;
    if (t.id) await fetch(`/api/admin/testimonials/${t.id}`, { method: 'DELETE' });
    setItems(items.filter((_, i) => i !== idx)); showToast('✓ Dihapus');
  };
  const upd = (idx: number, f: keyof Testimonial, v: any) => { const n = [...items]; (n[idx] as any)[f] = v; setItems(n); };
  return (
    <div className="adm-card">
      <div className="adm-card-hdr">
        <div><h2>Testimonials</h2><p>Kelola testimoni pelanggan.</p></div>
        <button className="adm-add" onClick={() => setItems([...items, { name: 'Nama', location: '', rating: 5, review: '', date: '', initial: 'N', sortOrder: items.length }])}>+ Tambah</button>
      </div>
      <div className="adm-card-body">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Nama</th><th>Lokasi</th><th>Rating</th><th>Review</th><th>Tanggal</th><th>Initial</th><th>Aksi</th></tr></thead>
            <tbody>
              {items.map((t, idx) => (
                <tr key={idx}>
                  <td><input className="adm-inp" value={t.name} onChange={e => upd(idx, 'name', e.target.value)} style={{ minWidth: '120px' }} /></td>
                  <td><input className="adm-inp" value={t.location} onChange={e => upd(idx, 'location', e.target.value)} style={{ minWidth: '120px' }} /></td>
                  <td><select className="adm-sel" value={t.rating} onChange={e => upd(idx, 'rating', Number(e.target.value))} style={{ width: '70px' }}>{[5,4,3,2,1].map(r=><option key={r}>{r}</option>)}</select></td>
                  <td><textarea className="adm-ta" value={t.review} onChange={e => upd(idx, 'review', e.target.value)} style={{ minWidth: '200px' }} /></td>
                  <td><input className="adm-inp" value={t.date} onChange={e => upd(idx, 'date', e.target.value)} style={{ minWidth: '110px' }} /></td>
                  <td><input className="adm-inp" value={t.initial} onChange={e => upd(idx, 'initial', e.target.value)} style={{ width: '50px' }} maxLength={2} /></td>
                  <td><div style={{ display: 'flex', gap: '4px' }}><button className="adm-save" style={{ padding: '.3rem .75rem', fontSize: '.75rem' }} onClick={() => save(t, idx)}>Simpan</button><button className="adm-del" onClick={() => del(t, idx)}>Hapus</button></div></td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={7}><div className="adm-empty">Belum ada testimonial.</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Gallery ───────────────────────────────────────────────
function GalleryTab({ showToast }: { showToast: (t: string, ok?: boolean) => void }) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  useEffect(() => { fetch('/api/admin/gallery').then(r => r.json()).then(setItems); }, []);
  const save = async (g: GalleryItem, idx: number) => {
    const res = await fetch(g.id ? `/api/admin/gallery/${g.id}` : '/api/admin/gallery', { method: g.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(g) });
    const d = await res.json(); if (res.ok) { const n = [...items]; n[idx] = d; setItems(n); showToast('✓ Disimpan'); } else showToast(d.error || 'Gagal', false);
  };
  const del = async (g: GalleryItem, idx: number) => {
    if (!confirm(`Hapus "${g.title}"?`)) return;
    if (g.id) await fetch(`/api/admin/gallery/${g.id}`, { method: 'DELETE' });
    setItems(items.filter((_, i) => i !== idx)); showToast('✓ Dihapus');
  };
  const handleImg = async (file: File, idx: number) => {
    const fn = await doUpload(file, 'gallery');
    if (fn) { const n = [...items]; n[idx] = { ...n[idx], image: fn }; setItems(n); showToast('✓ Foto diupload'); }
    else showToast('Upload gagal', false);
  };
  const upd = (idx: number, f: keyof GalleryItem, v: any) => { const n = [...items]; (n[idx] as any)[f] = v; setItems(n); };
  return (
    <div className="adm-card">
      <div className="adm-card-hdr">
        <div><h2>Gallery</h2><p>Upload dan kelola foto gallery.</p></div>
        <button className="adm-add" onClick={() => setItems([...items, { image: '', title: 'Foto Baru', icon: '📷', sortOrder: items.length }])}>+ Tambah Foto</button>
      </div>
      <div className="adm-card-body">
        <div className="gal-ed-grid">
          {items.map((g, idx) => (
            <div key={idx} className="gal-ed-card">
              {g.image ? <img src={g.image.startsWith('http') ? g.image : getPublicUrl(g.image)} className="gal-ed-prev" alt="" /> : <div className="gal-ed-ph">{g.icon || '📷'}</div>}
              <div className="gal-ed-body">
                <label className="upl-lbl">📷 Upload Foto<input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleImg(e.target.files[0], idx)} /></label>
                {g.image && <span style={{ fontSize: '.6875rem', color: '#8b7355', wordBreak: 'break-all' }}>{g.image}</span>}
                <input className="adm-inp" placeholder="Judul" value={g.title} onChange={e => upd(idx, 'title', e.target.value)} />
                <input className="adm-inp" placeholder="Icon" value={g.icon} onChange={e => upd(idx, 'icon', e.target.value)} style={{ maxWidth: '80px', textAlign: 'center' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '.6875rem', color: '#8b7355' }}>#{idx + 1}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="adm-save" style={{ padding: '.3rem .75rem', fontSize: '.75rem' }} onClick={() => save(g, idx)}>Simpan</button>
                    <button className="adm-del" onClick={() => del(g, idx)}>Hapus</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!items.length && <div className="adm-empty">Belum ada foto. Klik &quot;+ Tambah Foto&quot;.</div>}
        </div>
      </div>
    </div>
  );
}

// ── Company Values ────────────────────────────────────────
function ValuesTab({ showToast }: { showToast: (t: string, ok?: boolean) => void }) {
  const [items, setItems] = useState<CompanyValue[]>([]);
  useEffect(() => { fetch('/api/admin/values').then(r => r.json()).then(setItems); }, []);

  const save = async (v: CompanyValue, idx: number) => {
    const url = v.id ? `/api/admin/values/${v.id}` : '/api/admin/values';
    const res = await fetch(url, { method: v.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) });
    const d = await res.json();
    if (res.ok) { const n = [...items]; n[idx] = d; setItems(n); showToast('✓ Value disimpan'); }
    else showToast(d.error || 'Gagal menyimpan', false);
  };

  const del = async (v: CompanyValue, idx: number) => {
    if (!confirm(`Hapus "${v.title}"?`)) return;
    if (v.id) await fetch(`/api/admin/values/${v.id}`, { method: 'DELETE' });
    setItems(items.filter((_, i) => i !== idx));
    showToast('✓ Value dihapus');
  };

  const upd = (idx: number, f: keyof CompanyValue, val: any) => {
    const n = [...items]; (n[idx] as any)[f] = val; setItems(n);
  };

  return (
    <div className="adm-card">
      <div className="adm-card-hdr">
        <div>
          <h2>Nilai Perusahaan</h2>
          <p>Edit kartu "Nilai Kami" yang tampil di halaman Story — Sustainability, Quality First, Community, dll.</p>
        </div>
        <button className="adm-add" onClick={() => setItems([...items, { icon: '⭐', title: 'Nilai Baru', body: 'Deskripsi nilai...', sortOrder: items.length }])}>
          + Tambah Nilai
        </button>
      </div>
      <div className="adm-card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1rem' }}>
          {items.map((v, idx) => (
            <div key={idx} style={{ background: '#faf7f2', border: '1px solid #ede5d8', borderRadius: '.75rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {/* Icon + preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2.5rem', minWidth: '3rem', textAlign: 'center' }}>{v.icon}</div>
                <div style={{ flex: 1 }}>
                  <label className="sett-lbl">Icon (emoji)</label>
                  <input className="adm-inp" value={v.icon} onChange={e => upd(idx, 'icon', e.target.value)}
                    style={{ textAlign: 'center', maxWidth: '80px' }} placeholder="⭐" />
                </div>
              </div>

              <div>
                <label className="sett-lbl">Judul</label>
                <input className="adm-inp" value={v.title} onChange={e => upd(idx, 'title', e.target.value)} placeholder="Nama nilai..." />
              </div>

              <div>
                <label className="sett-lbl">Deskripsi</label>
                <textarea className="adm-ta" value={v.body} onChange={e => upd(idx, 'body', e.target.value)}
                  style={{ minHeight: '80px' }} placeholder="Jelaskan nilai ini..." />
              </div>

              <div>
                <label className="sett-lbl">Urutan (angka kecil = tampil lebih dulu)</label>
                <input className="adm-inp" type="number" value={v.sortOrder}
                  onChange={e => upd(idx, 'sortOrder', Number(e.target.value))} style={{ width: '80px' }} />
              </div>

              <div style={{ display: 'flex', gap: '.5rem', paddingTop: '.25rem' }}>
                <button className="adm-save" style={{ flex: 1, padding: '.5rem' }} onClick={() => save(v, idx)}>
                  Simpan
                </button>
                <button className="adm-del" onClick={() => del(v, idx)}>Hapus</button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="adm-empty" style={{ gridColumn: '1/-1' }}>
              Belum ada nilai perusahaan. Klik &quot;+ Tambah Nilai&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ── Settings ──────────────────────────────────────────────
function SettingsTab({ showToast }: { showToast: (t: string, ok?: boolean) => void }) {
  const [settings, setSettings] = useState<Settings>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { fetch('/api/admin/settings').then(r => r.json()).then(setSettings); }, []);

  const LABELS: Record<string, string> = {
    hero_title_line1: 'Hero Title Line 1', hero_title_line2: 'Hero Title Line 2 (italic)', hero_title_line3: 'Hero Title Line 3',
    hero_badge_text: 'Badge — Teks', hero_badge_sub1: 'Badge — Sub 1', hero_badge_sub2: 'Badge — Sub 2',
    about_title_line1: 'About Title 1', about_title_line2: 'About Title 2 (italic)',
    about_paragraph1: 'About Paragraf 1', about_paragraph2: 'About Paragraf 2',
    about_quote: 'About — Pull Quote', contact_desc: 'Contact — Deskripsi',
    contact_whatsapp: 'Contact — WhatsApp', contact_location: 'Contact — Lokasi',
  };

  const handleAboutImg = async (file: File) => {
    const fn = await doUpload(file, 'about');
    if (fn) {
      const n = { ...settings, about_image: fn };
      setSettings(n);
      await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(n) });
      showToast('✓ Foto about diupload dan disimpan');
    } else showToast('Upload gagal', false);
  };

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    setSaving(false);
    if (res.ok) showToast('✓ Settings disimpan'); else showToast('Gagal menyimpan', false);
  };

  return (
    <div className="adm-card">
      <div className="adm-card-hdr">
        <div><h2>Website Settings</h2><p>Edit teks yang tampil di website.</p></div>
        <button className="adm-save" onClick={save} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Settings'}</button>
      </div>
      <div className="adm-card-body">
        {/* About image */}
        <div style={{ background: '#faf7f2', border: '1px solid #ede5d8', padding: '.875rem', borderRadius: '.75rem', marginBottom: '1rem' }}>
          <label className="sett-lbl">Foto Bingkai About Section</label>
          {settings.about_image
            ? <img src={settings.about_image?.startsWith('http') ? settings.about_image : getPublicUrl(settings.about_image || '')} style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd5c8', marginBottom: '8px', display: 'block' }} alt="" />
            : <div style={{ width: '100%', height: '70px', background: '#f5efe6', border: '1px dashed #ddd5c8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#8b7355', marginBottom: '8px' }}>Belum ada gambar</div>}
          <label className="upl-lbl">📷 Upload Foto About
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleAboutImg(e.target.files[0])} />
          </label>
        </div>
        <div className="sett-grid">
          {Object.entries(LABELS).map(([k, label]) => (
            <div key={k} className="sett-item">
              <label className="sett-lbl">{label}</label>
              {k.includes('paragraph') || k.includes('quote') || k.includes('desc')
                ? <textarea className="adm-inp" style={{ minHeight: '70px', resize: 'vertical' }} value={settings[k] || ''} onChange={e => setSettings({ ...settings, [k]: e.target.value })} />
                : <input className="adm-inp" value={settings[k] || ''} onChange={e => setSettings({ ...settings, [k]: e.target.value })} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Reviews ───────────────────────────────────────────────
function ReviewsTab({ showToast }: { showToast: (t: string, ok?: boolean) => void }) {
  const [items, setItems] = useState<Review[]>([]);
  useEffect(() => { fetch('/api/admin/reviews').then(r => r.json()).then(setItems); }, []);

  const setStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const d = await res.json();
    if (res.ok) { setItems(items.map(r => r.id === id ? d : r)); showToast(`✓ Review ${status === 'APPROVED' ? 'disetujui' : 'ditolak'}`); }
    else showToast(d.error || 'Gagal', false);
  };

  const del = async (id: number) => {
    if (!confirm('Hapus review ini?')) return;
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    setItems(items.filter(r => r.id !== id)); showToast('✓ Dihapus');
  };

  return (
    <div className="adm-card">
      <div className="adm-card-hdr"><div><h2>Moderasi Review</h2><p>Setujui atau tolak ulasan sebelum ditampilkan ke publik.</p></div></div>
      <div className="adm-card-body">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>User</th><th>Produk</th><th>Rating</th><th>Komentar</th><th>Status</th><th>Tanggal</th><th>Aksi</th></tr></thead>
            <tbody>
              {items.map(r => (
                <tr key={r.id}>
                  <td style={{ minWidth: '120px' }}>
                    <div style={{ fontWeight: 500, fontSize: '.8125rem' }}>{r.user.name}</div>
                    <div style={{ fontSize: '.75rem', color: '#8b7355' }}>{r.user.email}</div>
                  </td>
                  <td style={{ fontSize: '.8125rem' }}>{r.product.name}</td>
                  <td>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                  <td style={{ maxWidth: '220px', fontSize: '.8125rem', color: '#5c3d2e', fontStyle: 'italic' }}>&ldquo;{r.comment}&rdquo;</td>
                  <td><span className={`badge-pill bp-${r.status.toLowerCase()}`}>{r.status}</span></td>
                  <td style={{ fontSize: '.75rem', color: '#8b7355', whiteSpace: 'nowrap' }}>{new Date(r.createdAt).toLocaleDateString('id-ID')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {r.status !== 'APPROVED' && <button className="adm-approve" onClick={() => setStatus(r.id, 'APPROVED')}>✓ Setuju</button>}
                      {r.status !== 'REJECTED' && <button className="adm-reject" onClick={() => setStatus(r.id, 'REJECTED')}>✗ Tolak</button>}
                      <button className="adm-del" onClick={() => del(r.id)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={7}><div className="adm-empty">Belum ada review masuk.</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────
export default function AdminPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>('products');
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  const showToast = (text: string, ok = true) => setToast({ text, ok });

  const TABS: { key: Tab; label: string }[] = [
    { key: 'products', label: 'Products' }, { key: 'values', label: 'Nilai Perusahaan' },
    { key: 'gallery', label: 'Gallery' }, { key: 'settings', label: 'Settings' }, { key: 'reviews', label: 'Reviews User' },
  ];

  return (
    <div className="adm-layout">
      <div className="adm-hdr">
        <span className="adm-hdr-title">DJALOE <span>CMS</span></span>
        <div className="adm-nav">
          {TABS.map(t => (
            <button key={t.key} className={`adm-tab${tab === t.key ? ' on' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
          <Link href="/" className="adm-site" target="_blank">View Site</Link>
          <button className="adm-logout" onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
        </div>
      </div>
      <div className="adm-wrap">
        {tab === 'products' && <ProductsTab showToast={showToast} />}
        {tab === 'values'   && <ValuesTab showToast={showToast} />}
        {tab === 'gallery'  && <GalleryTab showToast={showToast} />}
        {tab === 'settings' && <SettingsTab showToast={showToast} />}
        {tab === 'reviews'  && <ReviewsTab showToast={showToast} />}
      </div>
      <Toast msg={toast} onDone={() => setToast(null)} />
    </div>
  );
}

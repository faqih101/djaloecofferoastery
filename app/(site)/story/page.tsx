'use client';
import { useEffect, useState } from 'react';
import { initScrollReveal } from '@/components/ui/ScrollReveal';
import { getPublicUrl } from '@/lib/supabase';

interface Settings { [k: string]: string }
interface CompanyValue { id: number; icon: string; title: string; body: string; sortOrder: number }

const timeline = [
  { year: '2019', title: 'Lahirnya Djaloe', body: 'Bermula dari obsesi terhadap secangkir kopi yang sempurna, Djaloe Coffee Roastery resmi berdiri di Bintaro. Dengan roaster kecil dan semangat besar, kami mulai menyangrai biji kopi pilihan dari petani lokal.' },
  { year: '2020', title: 'Mengenal Petani', body: 'Di tengah pandemi, kami justru memperdalam hubungan langsung dengan petani kopi di Sumatera dan Sulawesi. Perjalanan ke kebun kopi mengubah cara kami memandang setiap biji yang kami sangrai.' },
  { year: '2021', title: 'Specialty Journey', body: 'Mendapatkan sertifikasi Q Grader dan mulai fokus pada specialty coffee. Kami menemukan bahwa kopi Indonesia punya profil rasa yang tidak kalah dengan kopi dunia mana pun.' },
  { year: '2022', title: 'Ekspansi Origins', body: 'Koleksi single origin kami berkembang hingga 12 daerah berbeda — dari Aceh hingga Bali. Setiap kopi punya cerita tanah, ketinggian, dan tangan petani yang berbeda.' },
  { year: '2023', title: 'Komunitas Tumbuh', body: 'Djaloe mulai dikenal lebih luas. Kami membuka layanan jasa roasting untuk kedai-kedai specialty di Jabodetabek dan mulai melayani pengiriman ke seluruh Indonesia.' },
  { year: '2024', title: 'Masa Kini', body: 'Dengan lebih dari 11.000 pelanggan puas, Djaloe terus tumbuh sambil mempertahankan komitmen: setiap biji kopi yang kami sangrai harus menceritakan keindahan tanah Indonesia.' },
];

export default function StoryPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [companyValues, setCompanyValues] = useState<CompanyValue[]>([]);

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(d => {
      setSettings(d.settings || {});
      setCompanyValues(d.companyValues || []);
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const obs = initScrollReveal();
      return () => obs?.disconnect();
    }, 100);
    return () => clearTimeout(t);
  }, [settings, companyValues]);

  const imgUrl = settings.about_image ? getPublicUrl(settings.about_image) : '';

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="container" style={{ paddingTop: '2rem' }}>
          <span className="page-hero-label">Our Story</span>
          <h1 className="page-hero-title">
            A Love Letter to<br />
            <span className="italic" style={{ color: 'var(--primary)' }}>Indonesian Soil</span>
          </h1>
          <p className="page-hero-sub">
            {settings.about_paragraph1 || 'Djaloe Coffee Roastery lahir di Bintaro pada tahun 2019 dari kecintaan kami terhadap kekayaan alam Indonesia.'}
          </p>
        </div>
      </section>

      {/* About deep dive */}
      <section style={{ padding: '6rem 0', background: 'var(--card)' }}>
        <div className="container">
          <div className="about-grid">
            <div className="slide-left">
              <div className="vr" style={{ marginBottom: '2.5rem' }}>Filosofi Kami</div>
              <h2 className="section-h2">Lebih dari Sekadar<br /><span className="italic" style={{ color: 'var(--primary)' }}>Kopi</span></h2>
              <div className="about-body">
                <p>{settings.about_paragraph1}</p>
                <p>{settings.about_paragraph2}</p>
                <p>Setiap biji yang kami sangrai telah melewati perjalanan panjang — dari kebun di ketinggian ribuan meter, melewati tangan-tangan petani yang berdedikasi, hingga ke dalam cup kamu. Kami percaya bahwa keindahan ada di setiap tahap perjalanan itu.</p>
              </div>
              <div className="pull-quote">
                <div className="pq-bar" />
                <div className="pq-mark">&ldquo;</div>
                <p className="pq-text">{settings.about_quote || 'Cintai Produk Lokal bukan sekadar slogan, melainkan komitmen kami.'}</p>
              </div>
            </div>
            <div className="about-frame vf slide-right">
              <div className="about-img" style={imgUrl ? { backgroundImage: `url('${imgUrl}')` } : {}}>
                {!imgUrl && (
                  <div style={{ textAlign: 'center', zIndex: 1 }}>
                    <div className="vr" style={{ marginBottom: '1rem', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--primary)' }}>Djaloe Roastery</span>
                    </div>
                    <div className="about-cap">Est. 2019 · Bintaro, Indonesia</div>
                  </div>
                )}
                <div className="sepia-overlay" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values — dari database, editable di CMS */}
      <section style={{ padding: '6rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <div className="vr scroll-in" style={{ marginBottom: '3.5rem' }}>Nilai Kami</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {(companyValues.length > 0 ? companyValues : [
              { id: 1, icon: '🌱', title: 'Sustainability', body: 'Kami bekerja langsung dengan petani lokal, memastikan praktik pertanian yang berkelanjutan dan harga yang adil.', sortOrder: 0 },
              { id: 2, icon: '🔬', title: 'Quality First', body: 'Setiap batch kopi melalui proses cupping yang ketat. Kami hanya menyangrai biji dengan skor 80+ menurut standar SCA.', sortOrder: 1 },
              { id: 3, icon: '🤝', title: 'Community', body: 'Djaloe bukan hanya roastery — ini adalah komunitas pecinta kopi yang saling berbagi pengetahuan dan kecintaan terhadap kopi Indonesia.', sortOrder: 2 },
              { id: 4, icon: '🗺️', title: 'Traceability', body: 'Setiap produk kami memiliki informasi lengkap tentang asal daerah, petani, ketinggian kebun, dan metode proses.', sortOrder: 3 },
            ]).map((v, i) => (
              <div key={v.id} className="scroll-in" data-delay={String(i * 0.1)}
                style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '2rem', transition: 'border-color .2s, transform .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(120,72,30,.4)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
              >
                <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{v.icon}</div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', color: 'var(--fg)', marginBottom: '.75rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--muted-fg)', fontSize: '.875rem', lineHeight: 1.75, fontWeight: 300 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '6rem 0', background: 'var(--card)' }}>
        <div className="container">
          <div className="vr scroll-in" style={{ marginBottom: '1rem' }}>Perjalanan Kami</div>
          <h2 className="section-h2 scroll-in" style={{ marginBottom: '4rem', maxWidth: '30rem' }}>
            Dari Mimpi ke<br /><span className="italic" style={{ color: 'var(--primary)' }}>Kenyataan</span>
          </h2>
          <div className="story-timeline">
            {timeline.map((item, i) => (
              <div key={item.year} className="story-item scroll-in" data-delay={String(i * 0.1)}>
                <div className="story-dot" />
                <div className="story-year">{item.year}</div>
                <h3 className="story-title">{item.title}</h3>
                <p className="story-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '5rem 0', background: 'var(--bg)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="vr scroll-in" style={{ marginBottom: '2.5rem' }}>Layanan Kami</div>
          <div className="tag-row scroll-in" style={{ justifyContent: 'center' }}>
            {['Single Origin', 'House Blend', 'Jasa Roasting', 'Gula Aren', 'Cupping Session', 'Wholesale'].map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

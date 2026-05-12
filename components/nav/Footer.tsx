import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top vr">
        <span className="footer-top-txt">Specialty Coffee Roastery · Bintaro, Indonesia</span>
      </div>
      <div className="container footer-body">
        <div>
          <div className="footer-logo">
            <span className="footer-dash" />
            <span className="footer-name">Djaloe</span>
            <span className="footer-star">✦</span>
            <span className="footer-name">Coffee</span>
            <span className="footer-dash" />
          </div>
          <div className="footer-tag">Cintai Produk Lokal</div>
        </div>
        <div>
          <nav className="footer-nav">
            <Link href="/">Home</Link>
            <Link href="/story">Story</Link>
            <Link href="/origins">Origins</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <p className="footer-copy">© <span id="fyear" /> Djaloe Coffee Roastery. All rights reserved.</p>
          <p className="footer-copy footer-est">Est. 2019 · Bintaro</p>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `document.getElementById('fyear').textContent=new Date().getFullYear()` }} />
    </footer>
  );
}

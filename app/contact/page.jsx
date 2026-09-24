import SiteNav from '@/components/SiteNav';

export const metadata = {
  title: 'Aloqa — CodeGuard Academy',
};

export default function ContactPage() {
  return (
    <div className="page-shell">
      <SiteNav />
      <div className="container" style={{ maxWidth: 640, paddingTop: 40, paddingBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <div className="kicker">Aloqa</div>
          <h2>Biz bilan bog'laning</h2>
          <p>Savollaringiz bo'lsa, quyidagi usullardan istalgani orqali murojaat qiling.</p>
        </div>

        <div className="grid grid-2">
          <a className="card news-card" href="tel:+998913232008">
            <div className="icon">📞</div>
            <h3>Telefon</h3>
            <p>+998 91 323 20 08</p>
          </a>
          <a className="card news-card" href="https://t.me/officer_dark" target="_blank" rel="noopener noreferrer">
            <div className="icon">💬</div>
            <h3>Telegram (shaxsiy)</h3>
            <p>@officer_dark</p>
          </a>
          <a className="card news-card" href="https://t.me/CodeGuard_Academy" target="_blank" rel="noopener noreferrer">
            <div className="icon">📢</div>
            <h3>Telegram kanali</h3>
            <p>@CodeGuard_Academy</p>
          </a>
          <a className="card news-card" href="https://instagram.com/code_guard_" target="_blank" rel="noopener noreferrer">
            <div className="icon">📸</div>
            <h3>Instagram</h3>
            <p>@code_guard_</p>
          </a>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 28, textAlign: 'center' }}>
          Kursga yozilish yoki savollaringiz bo'yicha ro'yxatdan o'tish formasini to'ldirishingiz
          ham mumkin — murabbiylarimiz siz bilan tez orada bog'lanadi.
        </p>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/#royxat" className="btn btn-primary">Ro'yxatdan o'tish</a>
        </div>
      </div>
    </div>
  );
}

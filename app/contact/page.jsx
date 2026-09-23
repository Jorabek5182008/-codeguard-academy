import SiteNav from '@/components/SiteNav';

export const metadata = {
  title: 'Aloqa — CodeGuard Academy',
};

export default function ContactPage() {
  return (
    <div className="page-shell">
      <SiteNav />
      <div className="container" style={{ maxWidth: 600, paddingTop: 40, paddingBottom: 80, textAlign: 'center' }}>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <div className="kicker">Aloqa</div>
          <h2>Biz bilan bog'laning</h2>
          <p>Savollaringiz bo'lsa, quyidagi ijtimoiy tarmoqlarimiz orqali eng tez javob olasiz.</p>
        </div>

        <div className="qr-box">
          <img src="/api/qrcode" alt="Instagram QR" width={180} height={180} />
        </div>

        <div className="hero-actions" style={{ marginTop: 22, marginBottom: 32 }}>
          <a
            className="btn btn-primary"
            href="https://instagram.com/code_guard_"
            target="_blank"
            rel="noopener noreferrer"
          >
            📸 Instagram
          </a>
          <a
            className="btn btn-outline"
            href="https://t.me/CodeGuard_Academy"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Telegram
          </a>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>
          Kursga yozilish yoki savollaringiz bo'yicha ro'yxatdan o'tish formasini to'ldirishingiz
          ham mumkin — murabbiylarimiz siz bilan tez orada bog'lanadi.
        </p>
        <a href="/#royxat" className="btn btn-outline" style={{ marginTop: 16 }}>
          Ro'yxatdan o'tish
        </a>
      </div>
    </div>
  );
}

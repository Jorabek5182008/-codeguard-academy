import { listNews } from '@/lib/db';

export const metadata = {
  title: 'Yangiliklar — CodeGuard Academy',
};

export default function NewsListPage() {
  const news = listNews(50);

  return (
    <div className="page-shell">
      <div className="container" style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <div className="kicker">CodeGuard Academy</div>
          <h2>Barcha yangiliklar</h2>
        </div>

        {news.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>Hozircha yangilik mavjud emas.</p>
        )}

        <div className="grid grid-3">
          {news.map((n) => (
            <a className="card news-card" key={n.id} href={`/news/${n.slug}`}>
              {n.cover_image && <img src={n.cover_image} alt="" className="news-card-cover" />}
              <h3>{n.title}</h3>
              <p>{n.body.slice(0, 100)}{n.body.length > 100 ? '...' : ''}</p>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                {new Date(n.created_at).toLocaleDateString('uz-UZ')}
              </span>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          <a href="/" className="btn btn-outline">← Bosh sahifaga qaytish</a>
        </div>
      </div>
    </div>
  );
}

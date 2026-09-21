import { getNewsBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';
import SiteNav from '@/components/SiteNav';

export async function generateMetadata({ params }) {
  const n = getNewsBySlug(params.slug);
  return { title: n ? `${n.title} — CodeGuard Academy` : 'Yangilik topilmadi' };
}

export default function NewsDetailPage({ params }) {
  const n = getNewsBySlug(params.slug);
  if (!n) notFound();

  return (
    <div className="page-shell">
      <SiteNav />
      <div className="container" style={{ maxWidth: 760, paddingTop: 40, paddingBottom: 80 }}>
        <a href="/news" className="btn btn-outline" style={{ display: 'inline-block', marginBottom: 24 }}>
          ← Barcha yangiliklar
        </a>

        {n.cover_image && (
          <img
            src={n.cover_image}
            alt={n.title}
            style={{ width: '100%', borderRadius: 20, marginBottom: 24, maxHeight: 380, objectFit: 'cover' }}
          />
        )}

        <h1 className="title" style={{ fontSize: 30, marginBottom: 10 }}>{n.title}</h1>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>
          {new Date(n.created_at).toLocaleDateString('uz-UZ')}
        </span>

        <div style={{ marginTop: 24, fontSize: 16, lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
          {n.body}
        </div>
      </div>
    </div>
  );
}

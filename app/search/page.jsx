'use client';

import { useState, useEffect } from 'react';
import SiteNav from '@/components/SiteNav';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Preload from ?q= in the URL (e.g. coming from the navbar search box).
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const initial = params.get('q');
      if (initial) {
        setQ(initial);
        runSearch(initial);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(query) {
    const term = (query ?? q).trim();
    if (!term) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  function submit(e) {
    e.preventDefault();
    runSearch();
  }

  const hasResults = results && (results.courses.length > 0 || results.news.length > 0);
  const noResults = results && !hasResults;

  return (
    <div className="page-shell">
      <SiteNav />
      <div className="container" style={{ maxWidth: 700, paddingTop: 40, paddingBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 28 }}>
          <div className="kicker">CodeGuard Academy</div>
          <h2>Qidiruv</h2>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kurs yoki yangilik qidiring..."
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--bg-alt)', color: 'var(--text)', fontSize: 15,
            }}
          />
          <button className="btn btn-primary" disabled={loading}>
            {loading ? '...' : 'Qidirish'}
          </button>
        </form>

        {noResults && (
          <p style={{ color: 'var(--muted)' }}>Hech narsa topilmadi. Boshqa so'z bilan urinib ko'ring.</p>
        )}

        {results?.courses?.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 14 }}>Kurslar</h3>
            <div className="grid grid-3">
              {results.courses.map((c) => (
                <a className="card news-card" key={c.slug} href={`/courses/${c.slug}`}>
                  <div className="icon">{c.icon}</div>
                  <h3>{c.title}</h3>
                  <p>{c.shortDesc}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {results?.news?.length > 0 && (
          <div>
            <h3 style={{ marginBottom: 14 }}>Yangiliklar</h3>
            <div className="grid grid-3">
              {results.news.map((n) => (
                <a className="card news-card" key={n.id} href={`/news/${n.slug}`}>
                  {n.cover_image && <img src={n.cover_image} alt="" className="news-card-cover" />}
                  <h3>{n.title}</h3>
                  <p>{n.body.slice(0, 90)}{n.body.length > 90 ? '...' : ''}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

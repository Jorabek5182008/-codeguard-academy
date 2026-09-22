import { COURSES } from '@/lib/courses';
import SiteNav from '@/components/SiteNav';

export const metadata = {
  title: 'Kurslar — CodeGuard Academy',
};

export default function CoursesListPage() {
  return (
    <div className="page-shell">
      <SiteNav />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <div className="kicker">CodeGuard Academy</div>
          <h2>Barcha kurslar</h2>
          <p>Har bir kurs haqida batafsil ma'lumot, nima o'rganishingiz va narxlarni shu yerda ko'rasiz.</p>
        </div>

        <div className="grid grid-3">
          {COURSES.map((c) => (
            <a className="card news-card" key={c.slug} href={`/courses/${c.slug}`}>
              {c.badge && <span className="free-tag">{c.badge}</span>}
              <div className="icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.shortDesc}</p>
              <span className="read-more">Batafsil →</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

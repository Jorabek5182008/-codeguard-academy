import { getCourseBySlug, COURSES } from '@/lib/courses';
import { notFound } from 'next/navigation';
import SiteNav from '@/components/SiteNav';

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const c = getCourseBySlug(params.slug);
  return { title: c ? `${c.title} — CodeGuard Academy` : 'Kurs topilmadi' };
}

export default function CourseDetailPage({ params }) {
  const c = getCourseBySlug(params.slug);
  if (!c) notFound();

  return (
    <div className="page-shell">
      <SiteNav />
      <div className="container" style={{ maxWidth: 760, paddingTop: 40, paddingBottom: 80 }}>
        <a href="/courses" className="btn btn-outline" style={{ display: 'inline-block', marginBottom: 24 }}>
          ← Barcha kurslar
        </a>

        <div style={{ fontSize: 48, marginBottom: 10 }}>{c.icon}</div>
        <h1 className="title" style={{ fontSize: 30, marginBottom: 10 }}>{c.title}</h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>{c.longDesc}</p>

        <div className="grid grid-3" style={{ marginBottom: 28 }}>
          <div className="card">
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Daraja</div>
            <strong>{c.level}</strong>
          </div>
          <div className="card">
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Davomiyligi</div>
            <strong>{c.duration}</strong>
          </div>
          <div className="card">
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Narxi</div>
            <strong>{c.price} {c.priceNote && <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 13 }}>/ {c.priceNote}</span>}</strong>
          </div>
        </div>

        <h3 style={{ marginBottom: 12 }}>Nimalarni o'rganasiz</h3>
        <ul style={{ color: 'var(--muted)', lineHeight: 2, paddingLeft: 20, marginBottom: 32 }}>
          {c.whatYouLearn.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <a
          href={`/?course=${c.course}&plan=${c.plan}#royxat`}
          className="btn btn-primary"
        >
          Kursni boshlash
        </a>
      </div>
    </div>
  );
}

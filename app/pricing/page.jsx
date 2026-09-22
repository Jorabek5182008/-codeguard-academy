import SiteNav from '@/components/SiteNav';

export const metadata = {
  title: 'Tariflar — CodeGuard Academy',
};

const PLANS = [
  {
    title: 'Bepul dars',
    price: "0 so'm",
    features: ['1 martalik AI kirish darsi', 'Onlayn formatda', 'Sertifikatsiz'],
    course: 'ai',
    plan: 'free',
    popular: false,
  },
  {
    title: "Boshlang'ich",
    price: "99 999 so'm / oy",
    features: ['Python asoslari — 8 hafta', 'Haftada 3 dars', 'Mentor yordami', 'Sertifikat'],
    course: 'python',
    plan: 'basic',
    popular: true,
  },
  {
    title: 'Pro',
    price: "199 999 so'm / oy",
    features: ['Amaliy loyihalar — 12 hafta', 'Portfolio yaratish', 'Shaxsiy mentor', "Ish bilan ta'minlashda yordam"],
    course: 'python',
    plan: 'pro',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="page-shell">
      <SiteNav />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <div className="kicker">Tariflar</div>
          <h2>O'zingizga mos rejani tanlang</h2>
          <p>To'lov usullari haqida ro'yxatdan o'tgach murabbiylarimiz siz bilan bog'lanadi.</p>
        </div>

        <div className="grid grid-3">
          {PLANS.map((p) => (
            <div className={`card price-card ${p.popular ? 'popular' : ''}`} key={p.title}>
              <h3>{p.title}</h3>
              <div className="price">{p.price}</div>
              <ul>
                {p.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <a
                href={`/?course=${p.course}&plan=${p.plan}#royxat`}
                className={`btn ${p.popular ? 'btn-primary' : 'btn-outline'} btn-full`}
              >
                Tanlash
              </a>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13.5, marginTop: 24 }}>
          To'lov: ro'yxatdan o'tgach, Click/Payme orqali to'lov havolasi yuboriladi.
        </p>
      </div>
    </div>
  );
}

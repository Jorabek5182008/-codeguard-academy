'use client';

import { useState, useEffect } from 'react';

const SERVICE_DETAILS = {
  live: {
    icon: '🧑‍🏫',
    title: 'Jonli darslar',
    text: "Har hafta belgilangan jadval bo'yicha onlayn Zoom/Google Meet orqali guruh darslari o'tkaziladi. Darslar yozib olinadi va guruh a'zolariga Telegram guruhda saqlanadi, shuning uchun darsni o'tkazib yuborsangiz ham qoldirmaysiz.",
  },
  projects: {
    icon: '📁',
    title: 'Amaliy loyihalar',
    text: "Har bir modul yakunida real muammoni yechadigan kichik loyiha topshirig'i beriladi (masalan kalkulyator, ma'lumotlar tahlili skripti, kichik AI-bot). Loyihalar portfolio sifatida GitHub'ga joylanadi.",
  },
  cert: {
    icon: '🎓',
    title: 'Sertifikat',
    text: "Kursni to'liq yakunlagan va yakuniy loyihani topshirgan talabalarga CodeGuard Academy rasmiy sertifikati (raqamli PDF) beriladi. Sertifikat rezyume va LinkedIn profilingizga qo'shish uchun mos.",
  },
  mentor: {
    icon: '💬',
    title: 'Mentor yordami',
    text: "Har bir guruhga shaxsiy mentor biriktiriladi. Savollaringizga Telegram guruh orqali odatda bir necha soat ichida javob olasiz, murakkab holatlarda qo'shimcha video-qo'ng'iroq tashkil qilinadi.",
  },
  progress: {
    icon: '📊',
    title: 'Progress kuzatuvi',
    text: "Shaxsiy kabinetingizda (/account) ariza holatingiz va kursga qabul qilinganingiz ko'rinadi. Kelajakda bu bo'limga modul bo'yicha progress va baholar ham qo'shiladi.",
  },
  jobs: {
    icon: '🤝',
    title: "Ish bilan ta'minlash",
    text: "Pro dasturi bitiruvchilaridan eng yaxshi natija ko'rsatganlarini hamkor kompaniyalarga (startaplar va IT-agentliklarga) tavsiya qilamiz. Bu kafolat emas, lekin bizning ustuvor yordamimiz hisoblanadi.",
  },
};

const THEME_KEY = 'codeguard_theme';

function validateRegistration(f) {
  if (!f.fullName || f.fullName.trim().length < 2) return "Ism-familiyani to'liq kiriting.";
  if (!/^\d{9}$/.test(f.phoneDigits || '')) return "Telefon raqamini to'liq, 9 ta raqam kiriting.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email || '')) return "Email manzilini to'g'ri kiriting.";
  if (!f.age || f.age < 5 || f.age > 100) return "Yoshni to'g'ri kiriting.";
  if (!/^\d{4}$/.test(f.accessCode || '')) return "Kirish kodi 4 ta raqamdan iborat bo'lishi kerak.";
  return null;
}

function PhoneInput({ value, onChange }) {
  return (
    <div className="phone-input">
      <span className="phone-prefix">+998</span>
      <input
        type="tel"
        inputMode="numeric"
        placeholder="90 123 45 67"
        maxLength={9}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 9))}
      />
    </div>
  );
}

export default function HomePage() {
  const [theme, setTheme] = useState('auto');
  const [form, setForm] = useState({ fullName: '', phoneDigits: '', age: '', email: '', accessCode: '', course: 'python', plan: 'free' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch {
      // ignore
    }
    fetch('/api/news')
      .then((r) => r.json())
      .then((d) => setNews(d.news || []))
      .catch(() => {});
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore
    }
  }

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function selectPlan(course, plan) {
    setForm((f) => ({ ...f, course, plan }));
    document.getElementById('royxat')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function submit(e) {
    e.preventDefault();
    const validationError = validateRegistration(form);
    if (validationError) {
      setStatus({ type: 'err', text: validationError });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone: `+998${form.phoneDigits}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi');
      setStatus({ type: 'ok', text: "Ro'yxatdan muvaffaqiyatli o'tdingiz! Tez orada bog'lanamiz." });
      setForm({ fullName: '', phoneDigits: '', age: '', email: '', accessCode: '', course: 'python', plan: 'free' });
    } catch (err) {
      setStatus({ type: 'err', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="brand">🐍 CodeGuard<span className="dot">.</span></div>
          <div className="nav-links">
            <a href="#kurslar">Kurslar</a>
            <a href="/news">Yangiliklar</a>
            <a href="#xizmatlar">Xizmatlar</a>
            <a href="#tolov">Tariflar</a>
            <a href="#instagram">Instagram</a>
            <a href="/account">Akkaunt</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Rejimni almashtirish">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <a href="#royxat" className="nav-cta">Ro'yxatdan o'tish</a>
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <div className="bottom-nav">
        <a href="#top" className="bottom-nav-item active">
          <span className="bottom-nav-icon">🏠</span>
          <span>Bosh sahifa</span>
        </a>
        <a href="#kurslar" className="bottom-nav-item">
          <span className="bottom-nav-icon">📚</span>
          <span>Kurslar</span>
        </a>
        <a href="#royxat" className="bottom-nav-item bottom-nav-cta">
          <span className="bottom-nav-icon">✍️</span>
          <span>Yozilish</span>
        </a>
        <a href="#tolov" className="bottom-nav-item">
          <span className="bottom-nav-icon">💳</span>
          <span>Tariflar</span>
        </a>
        <a href="/account" className="bottom-nav-item">
          <span className="bottom-nav-icon">👤</span>
          <span>Akkaunt</span>
        </a>
      </div>
      <div id="top" />

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="badge-pill">🚀 Yangi guruhlar har oy ochiladi</div>
          <h1>Python va <span>sun'iy intellekt</span>ni noldan amaliy o'rganing</h1>
          <p className="lead">
            CodeGuard akademiyasida siz loyihalar orqali Python dasturlash tilini
            va zamonaviy AI vositalarini o'rganasiz. Birinchi dars — bepul.
          </p>
          <div className="hero-actions">
            <a href="#royxat" className="btn btn-primary">Bepul darsga yozilish</a>
            <a href="#kurslar" className="btn btn-outline">Kurslarni ko'rish</a>
          </div>
        </div>
      </section>

      {/* NEWS */}
      {news.length > 0 && (
        <section className="section" style={{ paddingTop: 0, paddingBottom: 40 }} id="yangiliklar">
          <div className="container">
            <div className="section-head" style={{ marginBottom: 24 }}>
              <div className="kicker">Yangiliklar</div>
              <h2>So'nggi e'lonlar</h2>
            </div>
            <div className="grid grid-3">
              {news.slice(0, 3).map((n) => (
                <a className="card news-card" key={n.id} href={`/news/${n.slug}`}>
                  {n.cover_image && <img src={n.cover_image} alt="" className="news-card-cover" />}
                  <h3>{n.title}</h3>
                  <p>{n.body.slice(0, 90)}{n.body.length > 90 ? '...' : ''}</p>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {new Date(n.created_at).toLocaleDateString('uz-UZ')}
                  </span>
                </a>
              ))}
            </div>
            {news.length > 3 && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <a href="/news" className="btn btn-outline">Barcha yangiliklar</a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* COURSES */}
      <section className="section" id="kurslar">
        <div className="container">
          <div className="section-head">
            <div className="kicker">Kurslar</div>
            <h2>Sizga mos yo'nalishni tanlang</h2>
            <p>Har bir kurs amaliy loyihalar va shaxsiy murabbiy yordami bilan olib boriladi.</p>
          </div>
          <div className="grid grid-3">
            <div className="card highlight">
              <span className="free-tag">BEPUL</span>
              <div className="icon">🤖</div>
              <h3>Sun'iy intellekt — kirish darsi</h3>
              <p>AI qanday ishlaydi, ChatGPT/Claude kabi vositalardan qanday foydalanish — bir martalik bepul dars.</p>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-primary btn-full" onClick={() => selectPlan('ai', 'free')}>
                  Bepul yozilish
                </button>
              </div>
            </div>
            <div className="card">
              <div className="icon">🐍</div>
              <h3>Python — Boshlang'ich</h3>
              <p>Sintaksis, o'zgaruvchilar, tsikllar, funksiyalar — noldan mustahkam bazaviy bilim.</p>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-outline btn-full" onClick={() => selectPlan('python', 'basic')}>
                  Kursga yozilish
                </button>
              </div>
            </div>
            <div className="card">
              <div className="icon">⚙️</div>
              <h3>Python — Amaliy loyihalar</h3>
              <p>Web, ma'lumotlar tahlili va kichik AI loyihalari orqali portfolio yaratish.</p>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-outline btn-full" onClick={() => selectPlan('python', 'pro')}>
                  Kursga yozilish
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="xizmatlar" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="section-head">
            <div className="kicker">Xizmatlar</div>
            <h2>Nima taklif qilamiz</h2>
          </div>
          <div className="grid grid-3">
            {Object.entries(SERVICE_DETAILS).map(([key, s]) => (
              <button key={key} className="card service-card" onClick={() => setActiveService(key)}>
                <div className="icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.text.slice(0, 70)}...</p>
                <span className="read-more">Batafsil →</span>
              </button>
            ))}
          </div>

          {activeService && (
            <div className="modal-overlay" onClick={() => setActiveService(null)}>
              <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setActiveService(null)}>✕</button>
                <div className="icon" style={{ fontSize: 40 }}>{SERVICE_DETAILS[activeService].icon}</div>
                <h3 style={{ fontSize: 20, margin: '10px 0' }}>{SERVICE_DETAILS[activeService].title}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{SERVICE_DETAILS[activeService].text}</p>
                <a href="#royxat" className="btn btn-primary" onClick={() => setActiveService(null)}>
                  Ro'yxatdan o'tish
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PRICING / TO'LOV */}
      <section className="section" id="tolov">
        <div className="container">
          <div className="section-head">
            <div className="kicker">Tariflar</div>
            <h2>O'zingizga mos rejani tanlang</h2>
            <p>To'lov usullari haqida ro'yxatdan o'tgach murabbiylarimiz siz bilan bog'lanadi.</p>
          </div>
          <div className="grid grid-3">
            <div className="card price-card">
              <h3>Bepul dars</h3>
              <div className="price">0 so'm</div>
              <ul>
                <li>1 martalik AI kirish darsi</li>
                <li>Onlayn formatda</li>
                <li>Sertifikatsiz</li>
              </ul>
              <button className="btn btn-outline btn-full" onClick={() => selectPlan('ai', 'free')}>
                Tanlash
              </button>
            </div>
            <div className="card price-card popular">
              <h3>Boshlang'ich</h3>
              <div className="price">99 999 <small>so'm / oy</small></div>
              <ul>
                <li>Python asoslari — 8 hafta</li>
                <li>Haftada 3 dars</li>
                <li>Mentor yordami</li>
                <li>Sertifikat</li>
              </ul>
              <button className="btn btn-primary btn-full" onClick={() => selectPlan('python', 'basic')}>
                Tanlash
              </button>
            </div>
            <div className="card price-card">
              <h3>Pro</h3>
              <div className="price">199 999 <small>so'm / oy</small></div>
              <ul>
                <li>Amaliy loyihalar — 12 hafta</li>
                <li>Portfolio yaratish</li>
                <li>Shaxsiy mentor</li>
                <li>Ish bilan ta'minlashda yordam</li>
              </ul>
              <button className="btn btn-outline btn-full" onClick={() => selectPlan('python', 'pro')}>
                Tanlash
              </button>
            </div>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13.5, marginTop: 24 }}>
            To'lov: ro'yxatdan o'tgach, Click/Payme orqali to'lov havolasi yuboriladi.
          </p>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section className="section" id="royxat" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="section-head">
            <div className="kicker">Ro'yxatdan o'tish</div>
            <h2>Ma'lumotlaringizni qoldiring</h2>
            <p>Ism, telefon raqam, yosh, email va kirish kodini kiriting — murabbiylarimiz siz bilan bog'lanadi.</p>
          </div>
          <form className="form-shell" onSubmit={submit} noValidate>
            <div className="field">
              <label>Ism va familiya</label>
              <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
            </div>
            <div className="field">
              <label>Telefon raqam</label>
              <PhoneInput value={form.phoneDigits} onChange={(v) => update('phoneDigits', v)} />
            </div>
            <div className="field">
              <label>Yosh</label>
              <input type="number" min="5" max="100" value={form.age} onChange={(e) => update('age', e.target.value)} />
            </div>
            <div className="field">
              <label>Email manzil</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className="field">
              <label>Kirish kodi (4 raqam) — kabinetga kirish uchun</label>
              <input
                value={form.accessCode}
                onChange={(e) => update('accessCode', e.target.value.replace(/\D/g, '').slice(0, 4))}
                inputMode="numeric"
                maxLength={4}
              />
            </div>
            <div className="field">
              <label>Kurs</label>
              <select value={form.course} onChange={(e) => update('course', e.target.value)}>
                <option value="ai">Sun'iy intellekt (bepul dars)</option>
                <option value="python">Python</option>
              </select>
            </div>
            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Yuborilmoqda...' : "Ro'yxatdan o'tish"}
            </button>
            {status && (
              <div className={`status-msg ${status.type === 'ok' ? 'ok' : 'err'}`}>
                {status.text}
                {status.type === 'ok' && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <a className="btn btn-outline" style={{ flex: 1, padding: '10px', fontSize: 13 }} href="https://instagram.com/code_guard_" target="_blank" rel="noopener noreferrer">
                      📸 Instagram
                    </a>
                    <a className="btn btn-outline" style={{ flex: 1, padding: '10px', fontSize: 13 }} href="https://t.me/CodeGuard_Academy" target="_blank" rel="noopener noreferrer">
                      💬 Telegram
                    </a>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="section" id="instagram">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-head">
            <div className="kicker">Bizni kuzatib boring</div>
            <h2>Ijtimoiy tarmoqlarimizga qo'shiling</h2>
            <p>Yangiliklar, bepul darslar va talabalar ishlari — Instagram va Telegram'da.</p>
          </div>
          <div className="qr-box">
            <img src="/api/qrcode" alt="Instagram QR" width={200} height={200} />
          </div>
          <div className="hero-actions" style={{ marginTop: 22 }}>
            <a
              className="btn btn-primary"
              href="https://instagram.com/code_guard_"
              target="_blank"
              rel="noopener noreferrer"
            >
              📸 Instagram profiliga o'tish
            </a>
            <a
              className="btn btn-outline"
              href="https://t.me/CodeGuard_Academy"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Telegram kanaliga o'tish
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          © {new Date().getFullYear()} CodeGuard Academy. Barcha huquqlar himoyalangan.
        </div>
      </footer>
    </>
  );
}

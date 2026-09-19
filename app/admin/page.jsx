'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_LABELS = {
  new: 'Yangi',
  contacted: "Bog'lanildi",
  enrolled: "O'qishga qabul qilindi",
  paid: "To'landi",
};

const STATUS_HELP = {
  new: "Ariza hali ko'rib chiqilmagan.",
  contacted: "Talaba bilan bog'lanildi, javob kutilmoqda.",
  enrolled: "Talaba qabul qilindi — kabinetida Telegram guruh havolasi ko'rinadi.",
  paid: "To'lov qilindi — pullik tarifga tegishli qo'shimcha imkoniyatlar ochiladi.",
};

export default function AdminDashboard() {
  const [tab, setTab] = useState('students');
  const [students, setStudents] = useState(null);
  const [stats, setStats] = useState(null);
  const [q, setQ] = useState('');
  const [news, setNews] = useState(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsBody, setNewsBody] = useState('');
  const [newsSaving, setNewsSaving] = useState(false);
  const router = useRouter();

  async function load(query = '') {
    const res = await fetch(`/api/students?q=${encodeURIComponent(query)}`);
    if (res.status === 401) {
      router.push('/admin/login');
      return;
    }
    const data = await res.json();
    setStudents(data.students);
    setStats(data.stats);
  }

  async function loadNews() {
    const res = await fetch('/api/news');
    const data = await res.json();
    setNews(data.news);
  }

  useEffect(() => {
    load();
    loadNews();
  }, []);

  async function changeStatus(id, status) {
    await fetch('/api/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    load(q);
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  function exportCsv() {
    if (!students) return;
    const header = 'Ism,Telefon,Yosh,Email,Kurs,Reja,Status,Sana';
    const rows = students.map((s) =>
      [s.full_name, s.phone, s.age ?? '', s.email, s.course, s.plan, s.status, s.created_at]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codeguard-students.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function submitNews(e) {
    e.preventDefault();
    setNewsSaving(true);
    try {
      await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newsTitle, body: newsBody }),
      });
      setNewsTitle('');
      setNewsBody('');
      loadNews();
    } finally {
      setNewsSaving(false);
    }
  }

  async function removeNews(id) {
    await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
    loadNews();
  }

  if (!students || !stats) {
    return (
      <div className="admin-shell">
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <h1>Admin panel — CodeGuard</h1>
        <button className="btn btn-outline" onClick={logout}>
          Chiqish
        </button>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'students' ? 'active' : ''}`} onClick={() => setTab('students')}>
          👥 Talabalar
        </button>
        <button className={`admin-tab ${tab === 'news' ? 'active' : ''}`} onClick={() => setTab('news')}>
          📰 Yangiliklar
        </button>
      </div>

      {tab === 'students' && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Jami ro'yxatdan o'tganlar</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.last7d}</div>
              <div className="stat-label">Oxirgi 7 kun</div>
            </div>
            {stats.byCourse.map((c) => (
              <div className="stat-card" key={c.course}>
                <div className="stat-value">{c.c}</div>
                <div className="stat-label">{c.course === 'ai' ? "AI (bepul dars)" : 'Python'}</div>
              </div>
            ))}
          </div>

          <p className="admin-help">
            Statusni o'zgartirsangiz, talaba o'z kabinetida darhol yangi holatni ko'radi. "O'qishga qabul
            qilindi" qilib belgilasangiz, talabaga tegishli Telegram guruh havolasi avtomatik chiqadi.
          </p>

          <div className="search-bar">
            <input
              placeholder="Ism, telefon yoki email bo'yicha qidirish..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load(q)}
            />
            <button className="btn btn-outline" onClick={() => load(q)}>
              Qidirish
            </button>
            <button className="btn btn-primary" onClick={exportCsv}>
              CSV yuklab olish
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ism</th>
                  <th>Telefon</th>
                  <th>Yosh</th>
                  <th>Email</th>
                  <th>Kurs</th>
                  <th>Reja</th>
                  <th>Sana</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.full_name}</td>
                    <td>{s.phone}</td>
                    <td>{s.age ?? '-'}</td>
                    <td>{s.email}</td>
                    <td>{s.course === 'ai' ? 'AI' : 'Python'}</td>
                    <td>{s.plan}</td>
                    <td>{new Date(s.created_at).toLocaleDateString('uz-UZ')}</td>
                    <td>
                      <select
                        value={s.status}
                        onChange={(e) => changeStatus(s.id, e.target.value)}
                        title={STATUS_HELP[s.status]}
                      >
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)' }}>
                      Hozircha ro'yxatdan o'tganlar yo'q.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'news' && (
        <>
          <p className="admin-help">
            Bu yerga qo'shgan yangiliklaringiz bosh sahifada "Yangiliklar" bo'limida barcha tashrif
            buyuruvchilarga ko'rinadi.
          </p>

          <form className="panel" onSubmit={submitNews}>
            <div className="field">
              <label>Sarlavha</label>
              <input value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} required />
            </div>
            <div className="field">
              <label>Matn</label>
              <textarea
                value={newsBody}
                onChange={(e) => setNewsBody(e.target.value)}
                required
                rows={4}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10,
                  border: '1px solid var(--border)', background: 'var(--bg-alt)',
                  color: 'var(--text)', fontSize: 14.5, fontFamily: 'inherit', resize: 'vertical',
                }}
              />
            </div>
            <button className="btn btn-primary" disabled={newsSaving}>
              {newsSaving ? 'Saqlanmoqda...' : "Yangilik qo'shish"}
            </button>
          </form>

          <div className="panel">
            <h3>Joylangan yangiliklar</h3>
            {news?.length === 0 && <p style={{ color: 'var(--muted)' }}>Hozircha yangilik yo'q.</p>}
            {news?.map((n) => (
              <div key={n.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div>
                    <strong>{n.title}</strong>
                    <p style={{ color: 'var(--muted)', fontSize: 14, margin: '6px 0 0' }}>{n.body}</p>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {new Date(n.created_at).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                  <button
                    className="btn btn-outline"
                    style={{ width: 'auto', padding: '6px 12px', fontSize: 12.5 }}
                    onClick={() => removeNews(n.id)}
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

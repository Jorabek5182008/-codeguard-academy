'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_LABELS = {
  new: 'Yangi',
  contacted: "Bog'lanildi",
  enrolled: "O'qishga qabul qilindi",
  paid: "To'landi",
};

export default function AdminDashboard() {
  const [students, setStudents] = useState(null);
  const [stats, setStats] = useState(null);
  const [q, setQ] = useState('');
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

  useEffect(() => {
    load();
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
                  <select value={s.status} onChange={(e) => changeStatus(s.id, e.target.value)}>
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
    </div>
  );
}

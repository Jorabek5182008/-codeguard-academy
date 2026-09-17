'use client';

import { useState } from 'react';

const STATUS_LABELS = {
  new: 'Yangi ariza',
  contacted: "Siz bilan bog'lanildi",
  enrolled: "O'qishga qabul qilindingiz",
  paid: "To'lov qabul qilindi",
};

export default function AccountPage() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStudent(null);
    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xatolik');
      setStudent(data.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="account-shell">
      <div className="admin-header">
        <h1>Foydalanuvchi kabineti</h1>
        <a className="btn btn-outline" href="/">
          Bosh sahifa
        </a>
      </div>

      <div className="card" style={{ maxWidth: 460, margin: '0 auto' }}>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 18 }}>
          Ro'yxatdan o'tishda kiritgan telefon raqam va emailingizni kiriting — o'zingizning
          ariza holatingizni ko'rasiz.
        </p>
        <form onSubmit={submit}>
          <div className="field">
            <label>Telefon raqam</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Tekshirilmoqda...' : "Ma'lumotlarimni ko'rish"}
          </button>
          {error && <div className="status-msg err">{error}</div>}
        </form>

        {student && (
          <div style={{ marginTop: 20, textAlign: 'left' }}>
            <div className="status-msg ok">Ariza topildi</div>
            <div style={{ marginTop: 14, fontSize: 14.5 }}>
              <p><strong>Ism:</strong> {student.full_name}</p>
              <p><strong>Kurs:</strong> {student.course === 'ai' ? "Sun'iy intellekt (bepul dars)" : 'Python'}</p>
              <p><strong>Reja:</strong> {student.plan}</p>
              <p><strong>Ro'yxatdan o'tgan sana:</strong> {new Date(student.created_at).toLocaleDateString('uz-UZ')}</p>
              <p><strong>Holat:</strong> {STATUS_LABELS[student.status] || student.status}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

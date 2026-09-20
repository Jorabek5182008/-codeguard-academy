'use client';

import { useState, useEffect } from 'react';

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

const STATUS_LABELS = {
  new: 'Yangi ariza',
  contacted: "Siz bilan bog'lanildi",
  enrolled: "O'qishga qabul qilindingiz",
  paid: "To'lov qabul qilindi",
};

const TELEGRAM_GROUPS = {
  python: 'https://t.me/+JCZWv1fqNWk4ODdi',
  ai: 'https://t.me/+sqRF-7q_zd5iYTMy',
};

const PAID_PLANS = ['basic', 'pro'];
const STORAGE_KEY = 'codeguard_account';

export default function AccountPage() {
  const [phoneDigits, setPhoneDigits] = useState('');
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [remember, setRemember] = useState(true);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);

  async function lookup(phoneVal, emailVal, codeVal) {
    setLoading(true);
    setError(null);
    setStudent(null);
    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneVal, email: emailVal, accessCode: codeVal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xatolik');
      setStudent(data.student);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { phoneDigits: savedPhone, email: savedEmail, accessCode: savedCode } = JSON.parse(saved);
        setPhoneDigits(savedPhone || '');
        setEmail(savedEmail || '');
        setAccessCode(savedCode || '');
        if (savedPhone && savedEmail && savedCode) {
          lookup(`+998${savedPhone}`, savedEmail, savedCode).finally(() => setCheckingSaved(false));
          return;
        }
      }
    } catch {
      // ignore
    }
    setCheckingSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e) {
    e.preventDefault();
    const fullPhone = `+998${phoneDigits}`;
    const ok = await lookup(fullPhone, email, accessCode);
    if (ok && remember) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ phoneDigits, email, accessCode }));
      } catch {
        // ignore
      }
    }
  }

  function logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setStudent(null);
    setPhoneDigits('');
    setEmail('');
    setAccessCode('');
  }

  return (
    <div className="account-shell">
      <div className="admin-header">
        <h1>Mening kabinetim</h1>
        <a className="btn btn-outline" href="/">
          Bosh sahifa
        </a>
      </div>

      <div className="card" style={{ maxWidth: 460, margin: '0 auto' }}>
        {checkingSaved ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Yuklanmoqda...</p>
        ) : student ? (
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="status-msg ok" style={{ margin: 0 }}>Xush kelibsiz</div>
              <button className="btn btn-outline" style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }} onClick={logout}>
                Chiqish
              </button>
            </div>
            <div style={{ fontSize: 14.5 }}>
              <p><strong>Ism:</strong> {student.full_name}</p>
              <p><strong>Kurs:</strong> {student.course === 'ai' ? "Sun'iy intellekt (bepul dars)" : 'Python'}</p>
              <p><strong>Reja:</strong> {student.plan}</p>
              <p><strong>Ro'yxatdan o'tgan sana:</strong> {new Date(student.created_at).toLocaleDateString('uz-UZ')}</p>
              <p><strong>Holat:</strong> {STATUS_LABELS[student.status] || student.status}</p>
            </div>

            {(student.status === 'enrolled' || student.status === 'paid') && (
              <div className="panel" style={{ marginTop: 16, padding: 18 }}>
                <p style={{ margin: '0 0 10px', fontWeight: 700 }}>
                  🎉 Qabul qilindingiz! Ushbu havola orqali Telegram'da darsga qo'shilishingiz mumkin:
                </p>
                <a
                  className="btn btn-primary btn-full"
                  href={TELEGRAM_GROUPS[student.course] || 'https://t.me/CodeGuard_Academy'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 Telegram guruhga qo'shilish
                </a>
              </div>
            )}

            {student.status === 'paid' && PAID_PLANS.includes(student.plan) && (
              <div className="panel" style={{ marginTop: 12, padding: 18 }}>
                <p style={{ margin: '0 0 6px', fontWeight: 700 }}>📚 Black Woods kutubxonasi</p>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13.5 }}>
                  Sizning tarifingiz Black Woods kutubxonasidan bepul foydalanish huquqini beradi. Bu
                  xizmat hozircha tayyorlanmoqda — tez orada shu yerda havola paydo bo'ladi.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 18 }}>
              Ro'yxatdan o'tishda ko'rsatgan telefon raqamingiz, emailingiz va 4 xonali kirish
              kodingizni kiriting.
            </p>
            <form onSubmit={submit} noValidate>
              <div className="field">
                <label>Telefon raqam</label>
                <PhoneInput value={phoneDigits} onChange={setPhoneDigits} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="field">
                <label>Kirish kodi (4 raqam)</label>
                <input
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  inputMode="numeric"
                  maxLength={4}
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13.5, color: 'var(--muted)' }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                Bu qurilmada eslab qolish
              </label>
              <button className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Tekshirilmoqda...' : 'Kirish'}
              </button>
              {error && <div className="status-msg err">{error}</div>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

import { NextResponse } from 'next/server';
import { addStudent, checkRateLimit } from '@/lib/db';
import { getClientIp, isValidEmail, isValidPhone } from '@/lib/utils';

export async function POST(req) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`register:${ip}`, { windowSeconds: 60, max: 6 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });

  const fullName = String(body.fullName || '').trim();
  const phone = String(body.phone || '').trim();
  const email = String(body.email || '').trim();
  const age = body.age ? Number(body.age) : null;
  const course = String(body.course || 'python').trim();
  const plan = String(body.plan || 'free').trim();

  if (!fullName || fullName.length < 2) {
    return NextResponse.json({ error: "Ism-familiyani to'liq kiriting." }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Telefon raqamini to'g'ri kiriting." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email manzilini to'g'ri kiriting." }, { status: 400 });
  }
  if (age !== null && (age < 5 || age > 100)) {
    return NextResponse.json({ error: "Yoshni to'g'ri kiriting." }, { status: 400 });
  }

  const id = addStudent({ fullName, phone, age, email, course, plan });
  return NextResponse.json({ ok: true, id });
}

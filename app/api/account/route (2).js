import { NextResponse } from 'next/server';
import { findStudentByPhoneAndEmail, checkRateLimit } from '@/lib/db';
import { getClientIp } from '@/lib/utils';

// Lightweight self-service lookup: a student proves they know the phone +
// email they registered with. This is not full account authentication
// (no password), so it only ever returns that one student's own
// registration record — never a list, and it's rate limited per IP.
export async function POST(req) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`account:${ip}`, { windowSeconds: 60, max: 10 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Juda ko'p urinish." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const phone = String(body?.phone || '').trim();
  const email = String(body?.email || '').trim();
  if (!phone || !email) {
    return NextResponse.json({ error: 'Telefon va email kiritilishi shart' }, { status: 400 });
  }

  const student = findStudentByPhoneAndEmail(phone, email);
  if (!student) {
    return NextResponse.json({ error: "Bu ma'lumotlar bilan ro'yxat topilmadi." }, { status: 404 });
  }
  return NextResponse.json({ student });
}

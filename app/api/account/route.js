import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findStudentByPhoneAndEmail, checkLoginLock, recordLoginFailure, resetLoginFailures } from '@/lib/db';
import { getClientIp, normalizeUzPhone } from '@/lib/utils';

// Student self-service login: phone + email + the 4-digit access code they
// chose at registration. Same progressive-lockout protection as admin login.
export async function POST(req) {
  const ip = getClientIp(req.headers);
  const body = await req.json().catch(() => null);
  const phone = normalizeUzPhone(body?.phone);
  const email = String(body?.email || '').trim();
  const accessCode = String(body?.accessCode || '').trim();
  const bucketKey = `account-login:${ip}:${phone || body?.phone || ''}`;

  const lock = checkLoginLock(bucketKey);
  if (lock.locked) {
    return NextResponse.json(
      { error: `Juda ko'p noto'g'ri urinish. ${lock.remainingSeconds} soniyadan so'ng qayta urinib ko'ring.` },
      { status: 429 }
    );
  }

  if (!phone || !email || !accessCode) {
    return NextResponse.json({ error: 'Telefon, email va kirish kodi kiritilishi shart' }, { status: 400 });
  }

  const student = findStudentByPhoneAndEmail(phone, email);
  const valid = student?.access_code_hash && bcrypt.compareSync(accessCode, student.access_code_hash);

  if (!valid) {
    const result = recordLoginFailure(bucketKey);
    if (result.locked) {
      return NextResponse.json(
        { error: `Noto'g'ri ma'lumot. Juda ko'p urinish — ${result.remainingSeconds} soniyaga bloklandingiz.` },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: "Telefon, email yoki kirish kodi noto'g'ri." }, { status: 404 });
  }

  resetLoginFailures(bucketKey);
  return NextResponse.json({ student });
}

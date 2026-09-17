import { NextResponse } from 'next/server';
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
} from '@/lib/auth';
import { checkRateLimit } from '@/lib/db';
import { getClientIp } from '@/lib/utils';

export async function POST(req) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`admin-login:${ip}`, { windowSeconds: 60, max: 5 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Juda ko'p urinish." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.username || !body?.password) {
    return NextResponse.json({ error: 'Login va parolni kiriting' }, { status: 400 });
  }

  let ok;
  try {
    ok = await verifyAdminCredentials(body.username, body.password);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  if (!ok) return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });

  const token = createAdminSessionToken(body.username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return res;
}

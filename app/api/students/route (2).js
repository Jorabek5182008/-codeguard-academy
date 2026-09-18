import { NextResponse } from 'next/server';
import { listStudents, updateStudentStatus, getStats } from '@/lib/db';
import { getAdminSessionFromCookies } from '@/lib/auth';

export async function GET(req) {
  const session = getAdminSessionFromCookies(req.headers.get('cookie'));
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const search = req.nextUrl.searchParams.get('q') || '';
  const students = listStudents({ search });
  const stats = getStats();
  return NextResponse.json({ students, stats });
}

export async function PATCH(req) {
  const session = getAdminSessionFromCookies(req.headers.get('cookie'));
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.status) {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }
  const allowed = ['new', 'contacted', 'enrolled', 'paid'];
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: "Noto'g'ri status" }, { status: 400 });
  }
  updateStudentStatus(body.id, body.status);
  return NextResponse.json({ ok: true });
}

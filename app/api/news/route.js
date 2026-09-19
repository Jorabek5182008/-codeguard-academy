import { NextResponse } from 'next/server';
import { listNews, addNews, deleteNews } from '@/lib/db';
import { getAdminSessionFromCookies } from '@/lib/auth';

export async function GET() {
  return NextResponse.json({ news: listNews(20) });
}

export async function POST(req) {
  const session = getAdminSessionFromCookies(req.headers.get('cookie'));
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const title = String(body?.title || '').trim();
  const text = String(body?.body || '').trim();
  if (!title || !text) {
    return NextResponse.json({ error: "Sarlavha va matn to'ldirilishi shart" }, { status: 400 });
  }

  const id = addNews({ title, body: text });
  return NextResponse.json({ ok: true, id });
}

export async function DELETE(req) {
  const session = getAdminSessionFromCookies(req.headers.get('cookie'));
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id kerak' }, { status: 400 });

  deleteNews(Number(id));
  return NextResponse.json({ ok: true });
}

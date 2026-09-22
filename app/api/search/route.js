import { NextResponse } from 'next/server';
import { COURSES } from '@/lib/courses';
import { listNews } from '@/lib/db';

export async function GET(req) {
  const q = (req.nextUrl.searchParams.get('q') || '').trim().toLowerCase();
  if (!q) return NextResponse.json({ courses: [], news: [] });

  const courses = COURSES.filter(
    (c) => c.title.toLowerCase().includes(q) || c.shortDesc.toLowerCase().includes(q)
  );

  const allNews = listNews(200);
  const news = allNews.filter(
    (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
  );

  return NextResponse.json({ courses, news });
}

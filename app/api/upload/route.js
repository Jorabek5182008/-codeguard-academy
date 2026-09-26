import { NextResponse } from 'next/server';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { getAdminSessionFromCookies } from '@/lib/auth';

const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');

// The browser's reported file.type is client-supplied and can be spoofed.
// Check the actual file bytes (magic numbers) so a renamed/relabeled
// malicious file can't slip through just because the client claimed it
// was a JPEG/PNG/WEBP.
function detectRealImageType(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
    buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

export async function POST(req) {
  const session = getAdminSessionFromCookies(req.headers.get('cookie'));
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData().catch(() => null);
  const file = formData?.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 });
  }

  // Layer 1: reject obviously wrong client-reported types early.
  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json(
      { error: "Faqat JPG, PNG yoki WEBP formatidagi rasm yuklash mumkin." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Fayl hajmi 5MB dan oshmasligi kerak." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Layer 2: verify the actual file bytes match a real image — never trust
  // the client-reported MIME type or filename extension alone.
  const realType = detectRealImageType(buffer);
  if (!realType || !ALLOWED_TYPES[realType]) {
    return NextResponse.json(
      { error: "Fayl tarkibi rasmga mos kelmadi. Faqat haqiqiy JPG, PNG yoki WEBP fayl yuklang." },
      { status: 400 }
    );
  }
  const ext = ALLOWED_TYPES[realType];

  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const safeName = `${crypto.randomUUID()}.${ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, safeName), buffer);

  return NextResponse.json({ ok: true, url: `/api/media/${safeName}` });
}

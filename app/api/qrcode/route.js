import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET() {
  const url = process.env.INSTAGRAM_PROFILE_URL || 'https://instagram.com/code_guard_';

  const pngBuffer = await QRCode.toBuffer(url, {
    type: 'png',
    errorCorrectionLevel: 'H',
    margin: 2,
    scale: 10,
    color: { dark: '#070b14', light: '#FFFFFF' },
  });

  return new NextResponse(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="codeguard-instagram-qr.png"',
    },
  });
}

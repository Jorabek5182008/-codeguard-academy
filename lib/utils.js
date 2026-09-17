export function getClientIp(headers) {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return headers.get('x-real-ip') || '0.0.0.0';
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  // Accepts Uzbek numbers loosely: +998901234567 or 901234567 etc.
  return /^[+\d][\d\s-]{6,16}$/.test(phone);
}

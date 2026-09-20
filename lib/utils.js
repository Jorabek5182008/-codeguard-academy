export function getClientIp(headers) {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return headers.get('x-real-ip') || '0.0.0.0';
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  // Expects the normalized Uzbekistan format: +998 followed by 9 digits.
  return /^\+998\d{9}$/.test(phone);
}

// Normalizes any reasonable input into "+998XXXXXXXXX".
// Accepts: "901234567", "+998901234567", "998901234567", "90 123 45 67", etc.
// Returns null if it can't be normalized into a valid 9-digit UZ number.
export function normalizeUzPhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  let nine = digits;
  if (digits.startsWith('998') && digits.length === 12) {
    nine = digits.slice(3);
  }
  if (nine.length !== 9) return null;
  return `+998${nine}`;
}

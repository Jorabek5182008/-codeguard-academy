import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'cg_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET is missing or too short. Set it in .env.local.');
  }
  return secret;
}

export async function verifyAdminCredentials(username, password) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUser || !hash) {
    throw new Error('ADMIN_USERNAME / ADMIN_PASSWORD_HASH are not configured.');
  }
  if (username !== expectedUser) return false;
  return bcrypt.compare(password, hash);
}

export function createAdminSessionToken(username) {
  return jwt.sign({ sub: username, role: 'admin' }, getSecret(), { expiresIn: SESSION_TTL_SECONDS });
}

export function verifyAdminSessionToken(token) {
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_SESSION_TTL_SECONDS = SESSION_TTL_SECONDS;

export function getAdminSessionFromCookies(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  return verifyAdminSessionToken(match.split('=')[1]);
}

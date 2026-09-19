// Server-only.
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'academy.sqlite3');

let _db;

export function getDb() {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');

  _db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      age INTEGER,
      email TEXT NOT NULL,
      course TEXT NOT NULL DEFAULT 'python',
      plan TEXT NOT NULL DEFAULT 'free',
      status TEXT NOT NULL DEFAULT 'new', -- new | contacted | enrolled | paid
      access_code_hash TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rate_limit (
      bucket_key TEXT PRIMARY KEY,
      count INTEGER NOT NULL,
      window_start TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      bucket_key TEXT PRIMARY KEY,
      fail_count INTEGER NOT NULL DEFAULT 0,
      locked_until TEXT
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Migration: older databases created before access_code_hash existed.
  const cols = _db.prepare("PRAGMA table_info(students)").all().map((c) => c.name);
  if (!cols.includes('access_code_hash')) {
    _db.exec('ALTER TABLE students ADD COLUMN access_code_hash TEXT');
  }

  return _db;
}

export function addStudent({ fullName, phone, age, email, course, plan, accessCodeHash }) {
  const db = getDb();
  const info = db
    .prepare(
      `INSERT INTO students (full_name, phone, age, email, course, plan, access_code_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(fullName, phone, age ?? null, email, course || 'python', plan || 'free', accessCodeHash);
  return info.lastInsertRowid;
}

export function listStudents({ search } = {}) {
  const db = getDb();
  if (search) {
    const like = `%${search}%`;
    return db
      .prepare(
        `SELECT * FROM students
         WHERE full_name LIKE ? OR phone LIKE ? OR email LIKE ?
         ORDER BY id DESC`
      )
      .all(like, like, like);
  }
  return db.prepare('SELECT * FROM students ORDER BY id DESC').all();
}

export function updateStudentStatus(id, status) {
  const db = getDb();
  db.prepare('UPDATE students SET status = ? WHERE id = ?').run(status, id);
}

export function findStudentByPhoneAndEmail(phone, email) {
  const db = getDb();
  return db
    .prepare(
      'SELECT * FROM students WHERE phone = ? AND email = ? ORDER BY id DESC LIMIT 1'
    )
    .get(phone, email);
}

export function findStudentByPhone(phone) {
  const db = getDb();
  return db.prepare('SELECT * FROM students WHERE phone = ? ORDER BY id DESC LIMIT 1').get(phone);
}

export function getStats() {
  const db = getDb();
  const total = db.prepare('SELECT COUNT(*) AS c FROM students').get().c;
  const last7d = db
    .prepare(`SELECT COUNT(*) AS c FROM students WHERE created_at >= datetime('now','-7 day')`)
    .get().c;
  const byCourse = db
    .prepare('SELECT course, COUNT(*) AS c FROM students GROUP BY course')
    .all();
  const byStatus = db
    .prepare('SELECT status, COUNT(*) AS c FROM students GROUP BY status')
    .all();
  return { total, last7d, byCourse, byStatus };
}

export function checkRateLimit(bucketKey, { windowSeconds = 60, max = 10 } = {}) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM rate_limit WHERE bucket_key = ?').get(bucketKey);
  const now = Date.now();

  if (!row) {
    db.prepare('INSERT INTO rate_limit (bucket_key, count, window_start) VALUES (?, 1, ?)').run(
      bucketKey,
      String(now)
    );
    return { allowed: true };
  }
  const windowStart = Number(row.window_start);
  if (now - windowStart > windowSeconds * 1000) {
    db.prepare('UPDATE rate_limit SET count = 1, window_start = ? WHERE bucket_key = ?').run(
      String(now),
      bucketKey
    );
    return { allowed: true };
  }
  if (row.count >= max) return { allowed: false };
  db.prepare('UPDATE rate_limit SET count = count + 1 WHERE bucket_key = ?').run(bucketKey);
  return { allowed: true };
}

// --- Progressive login lockout ---
// First 5 wrong attempts: no lockout (just rejected). From the 5th wrong
// attempt onward: locked for 10s, and each further wrong attempt while/after
// locked adds +5s to the lockout duration.
export function checkLoginLock(bucketKey) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM login_attempts WHERE bucket_key = ?').get(bucketKey);
  if (!row || !row.locked_until) return { locked: false };
  const remainingMs = new Date(row.locked_until + 'Z').getTime() - Date.now();
  if (remainingMs <= 0) return { locked: false };
  return { locked: true, remainingSeconds: Math.ceil(remainingMs / 1000) };
}

export function recordLoginFailure(bucketKey) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM login_attempts WHERE bucket_key = ?').get(bucketKey);
  const failCount = (row?.fail_count || 0) + 1;

  let lockedUntil = null;
  if (failCount >= 5) {
    const lockoutSeconds = 10 + 5 * (failCount - 5);
    lockedUntil = new Date(Date.now() + lockoutSeconds * 1000).toISOString().slice(0, 19);
  }

  db.prepare(
    `INSERT INTO login_attempts (bucket_key, fail_count, locked_until) VALUES (?, ?, ?)
     ON CONFLICT(bucket_key) DO UPDATE SET fail_count = excluded.fail_count, locked_until = excluded.locked_until`
  ).run(bucketKey, failCount, lockedUntil);

  return lockedUntil ? { locked: true, remainingSeconds: Math.ceil((new Date(lockedUntil + 'Z').getTime() - Date.now()) / 1000) } : { locked: false };
}

export function resetLoginFailures(bucketKey) {
  const db = getDb();
  db.prepare('DELETE FROM login_attempts WHERE bucket_key = ?').run(bucketKey);
}

// --- News / announcements ---
export function addNews({ title, body }) {
  const db = getDb();
  const info = db.prepare('INSERT INTO news (title, body) VALUES (?, ?)').run(title, body);
  return info.lastInsertRowid;
}

export function listNews(limit = 20) {
  const db = getDb();
  return db.prepare('SELECT * FROM news ORDER BY id DESC LIMIT ?').all(limit);
}

export function deleteNews(id) {
  const db = getDb();
  db.prepare('DELETE FROM news WHERE id = ?').run(id);
}

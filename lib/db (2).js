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
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rate_limit (
      bucket_key TEXT PRIMARY KEY,
      count INTEGER NOT NULL,
      window_start TEXT NOT NULL
    );
  `);

  return _db;
}

export function addStudent({ fullName, phone, age, email, course, plan }) {
  const db = getDb();
  const info = db
    .prepare(
      `INSERT INTO students (full_name, phone, age, email, course, plan)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(fullName, phone, age ?? null, email, course || 'python', plan || 'free');
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

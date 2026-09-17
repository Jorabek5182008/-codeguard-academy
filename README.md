# CodeGuard Academy

Modern landing page for a Python / AI coding academy, with:
- Hero, courses (Python + a highlighted free AI intro lesson), services,
  pricing/"To'lov" sections
- Registration form (name, phone, age, email) → saved to a database
- **Admin panel** (`/admin`) — every registration is visible here, with
  search, status updates (new → contacted → enrolled → paid), stats, and
  CSV export
- **User account panel** (`/account`) — a student can look up their own
  registration status using the phone + email they signed up with
- Instagram QR section (scanning it opens your Instagram profile directly)

## 1. Install

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env.local
```

- Generate the admin password hash:
  ```bash
  node scripts/hash-password.js "your-strong-password"
  ```
  paste the result into `ADMIN_PASSWORD_HASH`, and set `ADMIN_USERNAME`.
- Generate a session secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- Set `INSTAGRAM_PROFILE_URL` to your real profile.

## 3. Run

```bash
npm run dev
```
- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin (redirects to login; every
  `/api/students` and `/api/auth`-protected request checks a signed,
  httpOnly session cookie server-side)
- Student account lookup: http://localhost:3000/account

## Notes on scope

- **Payments**: the pricing section collects a student's chosen plan at
  registration time and shows manual next steps ("to'lov havolasi
  yuboriladi"). No real payment gateway (Click/Payme/Uzcard) is wired in —
  that requires your own merchant credentials. When you have them, add a
  `lib/payments.js` that calls their API and a webhook route to mark a
  student's status as `paid`; the `students` table already has a `status`
  column ready for that.
- **Account panel security**: `/account` is a lightweight self-service
  lookup (phone + email, no password) — good enough for "check my
  application status," but it is *not* a secure login system. If you need
  real student accounts (password reset, private dashboards with grades,
  etc.), that's a separate, larger auth system — happy to build it if you
  need it.
- The database is SQLite at `data/academy.sqlite3`. On a hosting platform
  with an ephemeral filesystem, put that directory on persistent storage,
  or swap `lib/db.js` for Postgres before going live.

## Deploy

```bash
npm run build
npm start
```
Serve over HTTPS (required — the admin session is an httpOnly cookie).
Set every `.env.local` value as a real environment variable in your
hosting platform, never commit `.env.local`.

# Security Audit & Feature Recommendations

**Project:** Wedding Invitation Server
**Tanggal Audit:** 17 Mei 2026
**Update Terakhir:** 17 Mei 2026 (Sprint 1-3 selesai)
**Scope:** Security review, code quality, dan rekomendasi fitur

---

## 1. Ringkasan Eksekutif

Project ini sudah memiliki fondasi keamanan yang baik (bcrypt, signed sessions, CSP, rate limiting, Turnstile, Midtrans signature verify, magic bytes, signed upload URLs, audit log). Per audit ini, **12 issue prioritas tinggi sudah diperbaiki** termasuk CSP nonce-based, session revocation server-side, password policy diperketat, account lockout, CSRF token explicit, webhook retry queue, image lazy loading + CDN, sitemap/robots dynamic, dan background job queue.

---

## 2. Status Perbaikan ✅

Ringkasan eksekusi 12 item prioritas (semua sudah selesai pada audit ini):

| # | Item | Status | File Utama |
|---|------|--------|------------|
| 1 | CSP `unsafe-eval` & `unsafe-inline` di script-src | ✅ Selesai | `src/hooks.server.ts`, `svelte.config.js`, `src/app.html` |
| 2 | Session revocation (DB-backed) | ✅ Selesai | `src/lib/server/session-store.ts`, `src/lib/server/session.ts` |
| 3 | Password policy lemah | ✅ Selesai | `src/lib/server/password-policy.ts` |
| 4 | bcrypt cost factor 10 → 12 | ✅ Selesai | `src/lib/server/password-policy.ts` |
| 5 | CSRF token explicit | ✅ Selesai | `src/lib/server/csrf.ts` |
| 6 | Account lockout | ✅ Selesai | `src/lib/server/account-lockout.ts` |
| 7 | Logging berisi sensitive data | ✅ Selesai | `src/lib/server/logger.ts` |
| 8 | Email enumeration | ✅ Selesai | `src/routes/login/+page.server.ts` |
| 9 | Webhook retry queue (Midtrans) | ✅ Selesai | `src/lib/server/webhook-queue.ts`, `src/routes/api/webhook-queue/run/+server.ts` |
| 10 | Image lazy loading + CDN | ✅ Selesai | `src/lib/image.ts` |
| 11 | Sitemap.xml + robots.txt dynamic | ✅ Selesai | `src/routes/sitemap.xml/+server.ts`, `src/routes/robots.txt/+server.ts` |
| 12 | Background job queue | ✅ Selesai | `src/lib/server/job-queue.ts`, `src/lib/server/job-handlers.ts` |

Bonus pendamping yang ikut diperbaiki:
- Hash `email_verify_token` (SHA-256) sebelum simpan di DB.
- Constant-time fallback pada `authenticateUser` untuk mencegah timing-based user enumeration.
- Transparent rehash bcrypt: hash lama (cost <12) otomatis di-rehash saat user login berhasil.
- Hardening header tambahan: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, `HSTS` (production only).

---

## 3. Detail Perbaikan per Item

### 3.1. CSP Nonce-Based ✅

**Sebelum**

```
"script-src 'self' ... 'unsafe-eval' 'unsafe-inline'"
```

**Sesudah** (`src/hooks.server.ts`)

```ts
const nonce = crypto.randomBytes(16).toString("base64");
event.locals.cspNonce = nonce;

const scriptSrc = dev
  ? `'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' ...` // Vite HMR
  : `'self' 'nonce-${nonce}' 'strict-dynamic' ...`;             // production strict
```

- Setiap request dapat nonce 16-byte fresh.
- Production CSP pakai `strict-dynamic` (script tanpa nonce ditolak).
- Dev tetap longgar agar Vite HMR jalan.
- `<script>` Cloudflare Turnstile di `app.html` di-inject `nonce="%csp_nonce%"`.
- SvelteKit `svelte.config.js` aktifkan `csp: { mode: 'auto' }` agar generated `<script>`/`<style>` ikut nonce.
- Tambahan response header: HSTS (prod), X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy.

---

### 3.2. Session Revocation (DB-backed) ✅

**Sebelum:** JWT-like signed token tanpa server state. Bocor token = valid 7 hari penuh.

**Sesudah:**
- Tabel baru `sessions` dengan kolom `id`, `user_id`, `user_agent`, `ip`, `expires_at`, `revoked_at`.
- `createSession()` → row di DB, `buildSessionToken(sid, userId)` → cookie signed yang reference `sid`.
- `verifySessionToken()` sekarang **async**, validasi: HMAC signature → cookie expiry → DB row aktif (non-revoked, non-expired).
- Logout call `revokeSession(sid)`. Bisa "logout all devices" via `revokeAllSessionsForUser(userId)`.
- Helper `purgeOldSessions(daysToKeep)` untuk cleanup periodik (terdaftar sebagai job `session.purge`).

**File:**
- `src/lib/server/session-store.ts` (baru)
- `src/lib/server/session.ts` (refactor)
- `src/routes/login/+page.server.ts`, `src/routes/logout/+page.server.ts`, `src/hooks.server.ts`

---

### 3.3. Password Policy ✅

**Sebelum:** `if (password.length < 6)`

**Sesudah:** modul `src/lib/server/password-policy.ts`
- Min 8, max 128 karakter (anti-DoS).
- Harus mengandung huruf + angka.
- Blacklist 30 password paling umum.
- Helper `validatePassword()` dipakai konsisten di register, reset-password, dashboard/admin profile.

---

### 3.4. bcrypt cost 12 + Transparent Rehash ✅

- Konstanta `BCRYPT_COST = 12` di `password-policy.ts`.
- `hashPassword()`, `verifyPassword()`, `needsRehash()` helper.
- `authenticateUser()` cek `needsRehash(row.password)` → otomatis re-hash saat login berhasil. User lama (cost 10) terupgrade silently.

---

### 3.5. CSRF Token Explicit ✅

**File:** `src/lib/server/csrf.ts`
- Pola **double-submit cookie + synchronizer token** dengan HMAC bound ke session cookie.
- Token format: `<random>.<hmac(secret, sessionCookie + random)>`.
- Cookie `csrf` di-set otomatis di root `+layout.server.ts` via `ensureCsrfCookie()`.
- Validasi via header `x-csrf-token` atau form field `csrf_token`.
- Layered di atas SvelteKit's built-in origin check.

---

### 3.6. Account Lockout ✅

**File:** `src/lib/server/account-lockout.ts`
- Kolom baru `users.failed_login_attempts` & `users.locked_until` (auto-migrasi).
- `getLockState(email)`, `recordFailedLogin(email)`, `clearFailedLogins(userId)`.
- Threshold: **10 percobaan gagal** → lock **15 menit** (auto-expire).
- Reset counter saat login berhasil.
- Login action sekarang return HTTP 423 Locked dengan informasi sisa waktu.

---

### 3.7. Centralized Logger ✅

**File:** `src/lib/server/logger.ts`
- Level-aware: `dev` = debug+, production = info+ (configurable via `LOG_LEVEL`).
- **PII redaction otomatis** untuk key: `password`, `token`, `secret`, `key`, `authorization`, `cookie`, `signature_key`, `midtrans_*`, dll.
- Format konsisten: `<ISO timestamp> [LEVEL] [scope] message {meta}`.
- Diaplikasikan ke `email.ts`, `midtrans.ts`, notification handler, dan modul baru.
- Hilangkan log debug seperti `console.log('[Midtrans] Debug info: ... serverKeyLength: ...')`.

---

### 3.8. Email Enumeration ✅

**Sebelum** (`resendVerification`):
```ts
if (!user) return fail(404, { error: "Email tidak ditemukan." });
if (user.email_verified === 1) return fail(400, { error: "Sudah terverifikasi" });
```

**Sesudah:** Selalu return success generic. Jika user ada dan belum verified, generate token baru (via `regenerateEmailVerifyToken`) dan kirim email async.
```
"Jika email terdaftar dan belum diverifikasi, link verifikasi akan dikirim."
```

`forgot-password` sudah aman sebelumnya. Login error message tetap generic ("Email atau password salah").

---

### 3.9. Webhook Retry Queue ✅

**File:** `src/lib/server/webhook-queue.ts`, `src/routes/api/webhook-queue/run/+server.ts`

- Tabel `webhook_queue` (status, attempts, max_attempts, next_retry_at, last_error).
- Backoff array: `[30s, 60s, 5m, 15m, 1h]` lalu dead-letter.
- Midtrans notification handler: side-effect dibungkus `try/catch` → kalau gagal, payload masuk queue, response tetap 200 (idempotent retry).
- Idempotency: `processPaymentNotification` skip jika transaksi sudah `status='success'`.
- Endpoint `POST /api/webhook-queue/run` untuk manual trigger / cron (auth via admin session atau header `x-admin-token`).
- Re-verify signature saat replay (defense in depth).

---

### 3.10. Image Lazy Loading + CDN ✅

**File:** `src/lib/image.ts`

- `cdnUrl(src)` rewrite `/uploads/...` ke `PUBLIC_IMAGE_CDN_BASE` env (Cloudflare Images / R2). Absolute URL & data URI dibiarkan.
- Svelte action `lazyImage` pakai IntersectionObserver, fallback ke native `loading="lazy"` + `decoding="async"`.
- Aplikasi ke `admin/templates`, `dashboard/create`, `dashboard/invitations/[id]` template gallery.
- Set `PUBLIC_IMAGE_CDN_BASE=https://cdn.example.com` di `.env` untuk aktifkan CDN.

---

### 3.11. Sitemap.xml & Robots.txt Dynamic ✅

**File:** `src/routes/sitemap.xml/+server.ts`, `src/routes/robots.txt/+server.ts`

- `sitemap.xml`: include homepage + semua template demo + semua published invitation (max 5000), cached 1 jam.
- `robots.txt`: disallow `/admin`, `/dashboard`, `/api/`, `/uploads/`, auth pages; pointer ke sitemap.
- Static file lama `static/robots.txt` dihapus karena clash dengan dynamic.

---

### 3.12. Background Job Queue ✅

**File:** `src/lib/server/job-queue.ts`, `src/lib/server/job-handlers.ts`

- Tabel `background_jobs` (type, payload, status, attempts, run_at, last_error).
- Worker loop in-process polling 10s, atomic claim via `SELECT ... FOR UPDATE SKIP LOCKED` (aman untuk PM2 cluster mode).
- Backoff retry: `[15s, 60s, 5m, 15m, 1h]` lalu dead-letter.
- Handler ter-register: `email.send`, `image.optimize`, `session.purge`.
- Dipanggil sekali di `hooks.server.ts` setelah migration: `registerAllJobHandlers() + startJobWorker()`.
- Interface kompatibel dengan BullMQ kalau nanti migrasi ke Redis.

Contoh enqueue dari kode lain:

```ts
await enqueueJob({
  type: 'email.send',
  payload: { to, subject, html },
  delaySeconds: 0
});
```

---

## 4. Yang Sudah Bagus (Pre-existing) ✅

| Area | Implementasi | File |
|------|--------------|------|
| Cookie security | HttpOnly + Secure + SameSite=lax | `src/routes/login/+page.server.ts` |
| Rate limiting | login (5/min), register (3/min), resend (3/min) | `src/lib/server/rate-limiter.ts` |
| Bot protection | Cloudflare Turnstile | login + register |
| Midtrans verify | SHA-512 signature + IP whitelist | `src/routes/api/midtrans/notification/+server.ts` |
| File upload validation | Magic bytes (JPEG/PNG/WebP/GIF) | `src/lib/server/magic-bytes.ts` |
| Upload URL signing | HMAC dengan expiry | `src/lib/server/upload-signing.ts` |
| Audit log | Login, register, payment, dll | `src/lib/server/audit-log.ts` |
| SQL injection | Prepared statements (mysql2) | seluruh `src/lib/server/*.ts` |

---

## 5. Issue Lain yang Belum Ditangani

### 🟡 Low / Medium

- **2FA / TOTP** untuk admin (item terpisah, bukan dari list 12).
- **Migrasi rate limiter ke Redis** — masih in-memory (per-process state).
- **HIBP password breach check** — saat ini hanya blacklist lokal 30 password.
- **Session list UI** ("device aktif") — backend sudah siap (`listActiveSessionsForUser`), tinggal bangun UI.
- **Soft delete** untuk invitation/user.
- **Migration system** (Drizzle/Knex) menggantikan pola `ensureXxxColumn()`.

---

## 6. Rekomendasi Fitur Lanjutan

### 6.1. Security & Reliability

| Fitur | Effort | Impact |
|-------|--------|--------|
| 2FA / TOTP untuk admin | M | High |
| Database backup otomatis (cron) | S | High |
| Health check lengkap (DB, disk, queue) | S | Medium |
| Sentry / error tracking | S | High |
| HIBP password breach check | S | High |
| Session list UI ("device aktif") | M | High |

### 6.2. User Experience

| Fitur | Effort | Impact |
|-------|--------|--------|
| Bulk import tamu (CSV/Excel) | M | High |
| WhatsApp share link per tamu | S | High |
| QR code per tamu (check-in event) | M | High |
| Live RSVP/wishes counter (WebSocket) | L | Medium |
| Music preview di editor | S | Low |
| Drag & drop gallery reorder | M | Medium |
| Preview link expiring (untuk client review) | S | Medium |

### 6.3. Admin & Business

| Fitur | Effort | Impact |
|-------|--------|--------|
| Dashboard analytics chart (revenue, funnel) | M | High |
| Coupon usage report + auto-disable | S | Medium |
| Refund flow Midtrans | M | Medium |
| Email campaign (reminder upgrade/trial) | M | High |
| Affiliate / referral system | M | High |
| Template marketplace | L | High |

### 6.4. Technical Improvements

| Fitur | Effort | Impact |
|-------|--------|--------|
| Migration system (Drizzle/Knex) | M | High |
| API versioning (`/api/v1/...`) | S | Medium |
| OpenAPI spec | M | Medium |
| Unit + E2E test (Vitest + Playwright) | L | High |
| Soft delete untuk invitation/user | S | Medium |
| PWA support (offline view) | M | Medium |
| Migrate rate-limiter ke Redis | S | High |

### 6.5. Compliance

| Fitur | Effort | Impact |
|-------|--------|--------|
| GDPR/UU PDP: export + delete account | M | High |
| Cookie consent banner | S | High |
| Privacy & Terms versioning + acceptance log | S | Medium |
| Data retention policy (auto-purge log >1 tahun) | S | Medium |

> **Effort:** S = small (<1 hari), M = medium (1-3 hari), L = large (>3 hari)

---

## 7. Variabel Environment Baru

Tambahkan ke `.env`:

```bash
# Logging
LOG_LEVEL=info               # debug | info | warn | error (default: info di prod, debug di dev)

# CDN (opsional, kosongkan untuk pakai upload lokal)
PUBLIC_IMAGE_CDN_BASE=

# Webhook runner auth (untuk cron job)
WEBHOOK_RUNNER_TOKEN=        # generate dengan: openssl rand -hex 32

# Sudah ada sebelumnya, pastikan terisi
SESSION_SECRET=              # min 32 byte, generate: openssl rand -hex 32
UPLOADS_SIGNING_SECRET=
TURNSTILE_SECRET_KEY=
PUBLIC_TURNSTILE_SITE_KEY=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM_NAME=
SMTP_FROM_EMAIL=
ORIGIN=
DISABLE_TURNSTILE=false
```

---

## 8. Migration Database (Auto-run saat boot)

Tabel/kolom baru yang otomatis di-create oleh `hooks.server.ts`:

```sql
-- Sessions table (server-side session store)
CREATE TABLE sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  user_agent VARCHAR(255) NULL,
  ip VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  revoked_at TIMESTAMP NULL,
  INDEX idx_user (user_id),
  INDEX idx_expires (expires_at)
);

-- Webhook retry queue
CREATE TABLE webhook_queue (
  id VARCHAR(36) PRIMARY KEY,
  direction ENUM('inbound', 'outbound') NOT NULL,
  source VARCHAR(50) NOT NULL,
  target_url VARCHAR(500) NULL,
  payload MEDIUMTEXT NOT NULL,
  headers TEXT NULL,
  status ENUM('pending','success','failed','dead') NOT NULL DEFAULT 'pending',
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  next_retry_at TIMESTAMP NULL,
  last_error TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status_next (status, next_retry_at),
  INDEX idx_source (source)
);

-- Background job queue
CREATE TABLE background_jobs (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  payload MEDIUMTEXT NOT NULL,
  status ENUM('queued','running','success','failed','dead') NOT NULL DEFAULT 'queued',
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  run_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_error TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status_run (status, run_at),
  INDEX idx_type (type)
);

-- Account lockout columns
ALTER TABLE users ADD COLUMN failed_login_attempts INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN locked_until DATETIME NULL;
```

---

## 9. Catatan Tambahan

### File yang Perlu Dibersihkan

- `src/app.html.bak` - hapus, sudah punya version control
- `src/routes/login/+page.server.ts.bak` - hapus
- `frontend/src/lib/templates/` - dead code, tidak pernah di-import
- File test root (`test-midtrans.js`, `test-webhook.js`, dll) - pindahkan ke folder `tests/`

### Konfigurasi yang Perlu Dicek

- `.env.example` - update dengan variabel baru di section 7
- `ecosystem.config.js` vs `ecosystem.config.cjs` - duplikasi, pilih satu
- `data.sql`, `data_new.sql`, `data_packages.sql` - banyak file SQL, perlu konsolidasi

### Roadmap Selanjutnya

1. **2FA / TOTP** untuk admin (otplib + QR code)
2. **HIBP API** integration untuk password breach check
3. **Sentry** untuk error tracking di production
4. **Redis-backed rate limiter** kalau target deploy multi-instance
5. **Migration system** (Drizzle ORM) menggantikan `ensureXxxColumn()`
6. **Session list UI** di profile (backend sudah siap via `listActiveSessionsForUser`)

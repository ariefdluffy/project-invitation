# Analisis Lengkap Project Wedding Invitation Server

---

## 1. Ringkasan Proyek

| Item | Detail |
|------|--------|
| **Nama** | Wedding Invitation Server |
| **Tipe** | SaaS Undangan Digital |
| **Stack** | SvelteKit 2 + Svelte 5 (runes) + TypeScript + MySQL |
| **Payment** | Midtrans Snap (sandbox/production) |
| **Deploy** | PM2 cluster mode, Ubuntu server |
| **Domain** | nikahin.lockbit.my.id |
| **Security** | Cloudflare Turnstile, CSP headers, Signed Upload URLs |

---

## 2. Struktur Code

```
wedding-invitaion-server/
├── src/
│   ├── lib/
│   │   ├── server/
│   │   │   ├── db.ts                  # Koneksi MySQL (pool)
│   │   │   ├── users.ts              # CRUD user + auth
│   │   │   ├── invitations.ts        # CRUD undangan, tamu, ucapan, template
│   │   │   ├── midtrans.ts           # Integrasi Midtrans Snap API
│   │   │   ├── midtrans-order-id.ts  # Format order_id (P/A_uuid_ts)
│   │   │   ├── payment-transactions.ts # Tracking transaksi pembayaran
│   │   │   ├── settings.ts           # CRUD pengaturan aplikasi
│   │   │   ├── upload-signing.ts     # Signed URL untuk proteksi file
│   │   │   └── utils.ts              # Generate random password
│   │   ├── components/
│   │   │   ├── invitation/           # 13 komponen tampilan undangan
│   │   │   └── invitations/          # 9 layout template berbeda
│   │   ├── toast.svelte.ts           # Toast notification (runes)
│   │   ├── template-categories.ts    # Kategori template
│   │   └── index.ts
│   ├── routes/
│   │   ├── +page.svelte              # Landing page
│   │   ├── +layout.svelte            # Layout utama + flash/toast
│   │   ├── login/                    # Login + Turnstile
│   │   ├── register/                 # Register + Turnstile
│   │   ├── logout/                   # Logout
│   │   ├── dashboard/                # User dashboard
│   │   │   ├── create/               # Buat undangan baru
│   │   │   ├── invitations/[id]/     # Edit undangan + kelola tamu
│   │   │   ├── billing/              # Harga & status pembayaran
│   │   │   ├── billing/checkout/     # Checkout Midtrans Snap
│   │   │   ├── media/                # Upload foto
│   │   │   └── profile/              # Ganti password
│   │   ├── admin/                    # Admin panel
│   │   │   ├── users/                # Kelola user (CRUD, reset password)
│   │   │   ├── invitations/          # Lihat semua undangan
│   │   │   ├── settings/             # Pengaturan global + Midtrans keys
│   │   │   ├── templates/            # Lihat semua template
│   │   │   └── profile/              # Admin ganti password
│   │   ├── invitation/[slug]/        # Halaman publik undangan + RSVP
│   │   ├── demo/[id]/                # Preview template publik
│   │   ├── api/midtrans/
│   │   │   ├── create-transaction/   # API buat transaksi (legacy?)
│   │   │   └── notification/         # Webhook Midtrans
│   │   └── uploads/[...path]/        # Serve file terproteksi
│   ├── hooks.server.ts               # Handle: seed, session, auth guard, CSP
│   ├── app.html
│   └── app.css
├── frontend/
│   └── src/lib/templates/
│       ├── emerald/                  # Template Emerald (parametrik)
│       └── 3d-motion/                # Template 3D Motion
├── static/
│   ├── templates/                    # Template JSON definitions
│   │   ├── pernikahan/               # 6 template pernikahan
│   │   ├── khitan/
│   │   ├── aqiqah/
│   │   ├── birthday/
│   │   ├── gathering/
│   │   └── formal/
│   └── uploads/                      # File upload storage
├── scripts/
│   ├── backup-database.js
│   └── restore-database.js
├── migrate_mysql.sql                 # Skema database
├── ecosystem.config.js               # PM2 production config
└── DEPLOYMENT_STAGES.md              # Panduan deploy lengkap
```

---

## 3. Alur Aplikasi

### 3.1. Alur User (End User / Calon Pengantin)

```
Register → Login → Dashboard
                       ├── Create Invitation (pilih template, isi data)
                       ├── Edit Invitation (isi detail, foto, musik, bank)
                       ├── Manage Guests (tambah/import tamu)
                       ├── Media (upload foto ke storage pribadi)
                       ├── Billing (lihat harga, bayar premium)
                       └── Profile (ganti password)

Payment Flow:
  Billing → Pilih Paket → Midtrans Snap (redirect/popup) → Bayar
    → Midtrans kirim webhook → Server update status user
    → User mendapat akses (has_access=1, invitation_limit=3)
```

### 3.2. Alur Tamu Undangan

```
Tamu terima link → /invitation/[slug]?to=NamaTamu
  → Lihat undangan (cover, pasangan, acara, cerita, galeri, map, bank)
  → Kirim ucapan & konfirmasi hadir (RSVP)
```

### 3.3. Alur Admin

```
Login sebagai admin → Admin Dashboard
  ├── Users: CRUD user, atur akses, reset password
  ├── Invitations: lihat semua undangan
  ├── Settings: harga, Midtrans keys, app name, dll
  ├── Templates: lihat semua template
  └── Profile: ganti password
```

### 3.4. Alur Pembayaran

```
Checkout Page:
  1. buildMidtransOrderId('premium', userId) → "P_abc123def456_1a2b3c"
  2. createMidtransTransaction() → POST ke Midtrans Snap API
  3. createPaymentTransaction() → simpan ke DB (pending)
  4. Render Snap popup dengan client key + token

Midtrans Webhook (/api/midtrans/notification):
  1. Verifikasi signature (sha512 order_id+status+gross_amount+server_key)
  2. Cari payment_transactions berdasarkan order_id
  3. Update user: has_access=1, payment_status='paid', invitation_limit=3
  4. Update transaction status = 'success'
```

---

## 4. Analisis Keamanan (Security Audit)

### 🔴 CRITICAL

#### 1. Session Cookie Tidak Secure

**File:** `src/routes/login/+page.server.ts` (line ~63) dan semua set cookie

```typescript
cookies.set('session', JSON.stringify({ userId: user.id }), {
    secure: false, // ❌ HARUS true di production
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
});
```

**Dampak:** Cookie dikirim via HTTP plaintext. Bisa dicuri via MITM attack.

**Fix:** `secure: process.env.NODE_ENV === 'production'` atau `secure: true` jika sudah pakai HTTPS.

#### 2. Session Tidak Ditandatangani (Unsigned Session)

**File:** `src/routes/login/+page.server.ts`

```typescript
cookies.set('session', JSON.stringify({ userId: user.id }), ...);
```

Session hanya berisi `{ userId: "..." }` dalam plain JSON tanpa signature. Siapa pun yang bisa memodifikasi cookie bisa impersonate user lain.

**Dampak:** Session forgery. Jika attacker bisa inject cookie, bisa login sebagai user mana pun.

**Fix:** Gunakan signed/encrypted session token (JWT atau iron-session), atau simpan session di server.

#### 3. Admin Reset Password Mengembalikan Password Plaintext

**File:** `src/routes/admin/users/+page.server.ts`

```typescript
return { success: true, message: `Password berhasil direset. Password baru: ${newRandomPassword}` };
```

**Dampak:** Password baru dikirim ke response JSON. Bisa terbaca di network tab browser, server logs, atau logging middleware.

**Fix:** Jangan pernah mengembalikan password dalam response. Kirim via email atau tampilkan sekali di halaman dengan peringatan untuk segera diganti.

#### 4. Tidak Ada Rate Limiting

**Endpoint tanpa proteksi:**
- `/login` — brute force attack
- `/register` — spam akun
- `/api/midtrans/create-transaction` — abuse transaksi

**Dampak:** Attacker bisa melakukan brute force login tanpa batas.

**Fix:** Integrasikan rate limiter (express-rate-limit, atau Cloudflare rate limiting rules).

---

### 🟡 HIGH

#### 5. File Upload Validasi Lemah

**File:** `src/routes/dashboard/media/+page.server.ts`

```typescript
const allowedTypes = ['image/jpeg', 'image/png'];
if (!allowedTypes.includes(file.type)) { ... }
```

Validasi hanya berdasarkan MIME type dari header HTTP (client-controlled). Mudah dipalsukan.

**Dampak:** Attacker bisa upload file berbahaya dengan MIME type palsu.

**Fix:** Validasi magic bytes (file signature) menggunakan library seperti `file-type`.

#### 6. Tidak Ada Proteksi CSRF di Form Actions

Hampir semua form action (create invitation, update, delete, billing) tidak memiliki CSRF token. Hanya mengandalkan `sameSite: 'lax'` yang tidak cukup.

**Dampak:** Potensi Cross-Site Request Forgery dari subdomain atau site lain.

**Fix:** Implementasikan CSRF token (double-submit cookie pattern atau hidden field token).

#### 7. Midtrans Webhook Tidak Whitelist IP

**File:** `src/routes/api/midtrans/notification/+server.ts`

```typescript
// Ada verifikasi signature, tapi tidak ada IP whitelist Midtrans
```

**Dampak:** Signature verification sudah cukup baik, tapi best practice Midtrans menyarankan IP whitelist juga untuk defense in depth.

**Fix:** Verifikasi IP来源 dari range IP Midtrans.

---

### 🟡 MEDIUM

#### 8. Invitation Update File Upload Ke Root Directory

**File:** `src/routes/dashboard/invitations/[id]/+page.server.ts`

```typescript
const filePath = join(uploadDir, fileName); // uploadDir = static/uploads/
// vs media page yang simpan ke: static/uploads/{userId}/fileName
```

**Inkonsistensi:** File dari halaman edit undangan disimpan di root `static/uploads/`, sedangkan dari halaman media disimpan di `static/uploads/{userId}/`. Berpotensi overwrite file.

#### 9. Tidak Ada Email Verification

User bisa langsung login setelah register tanpa verifikasi email. Tidak ada sistem forgot password.

#### 10. Tidak Ada Audit Log

Tidak ada pencatatan aktivitas penting (login, payment, delete).

#### 11. Turnstile Secret Key Concatenation

```typescript
body: `secret=${SECRET_KEY}&response=${turnstileResponse}`
```

Jika `turnstileResponse` mengandung karakter khusus, bisa menyebabkan masalah. Sebaiknya gunakan `URLSearchParams`.

---

## 5. Analisis Proses Bisnis

### ✅ SUDAH BAIK

| Fitur | Keterangan |
|-------|------------|
| **Multi-template** | 6 kategori, 9+ layout component, JSON-based |
| **Payment Midtrans** | Sandbox/production, webhook signature, fallback |
| **Guest Management** | Tambah tamu, RSVP, limit per user |
| **Wishes System** | Tamu bisa kirim ucapan + konfirmasi hadir |
| **Signed Upload URLs** | File terproteksi dengan HMAC expiry |
| **Admin Panel** | Full CRUD user, settings, templates |
| **Flash Messages** | system notifikasi UX |
| **Category Templates** | Wedding, Khitan, Aqiqah, Birthday, dll |
| **Demo Preview** | Setiap template bisa di-preview publik |

### ❌ YANG KURANG / BISA DITINGKATKAN

#### A. Fitur Wajib untuk Production

| Fitur | Prioritas | Alasan |
|-------|-----------|--------|
| **Email Service** | 🔴 CRITICAL | Verifikasi email, notifikasi payment, forgot password, kirim undangan ke tamu |
| **Rate Limiting** | 🔴 CRITICAL | Cegah brute force & abuse |
| **CSRF Protection** | 🔴 CRITICAL | Proteksi form actions |
| **Session Signature** | 🟡 HIGH | Cegah session forgery |
| **Secure Cookie** | 🟡 HIGH | Cegah session hijacking |
| **File Validation by Magic Bytes** | 🟡 HIGH | Cegah upload file berbahaya |
| **Forgot Password** | 🟡 HIGH | User experience penting |
| **Audit Log** | 🟡 MEDIUM | Tracking aktivitas untuk troubleshooting |

#### B. Fitur Monetisasi

| Fitur | Keterangan |
|-------|------------|
| **Paket Berjenjang** | Saat ini hanya premium (149k) + add-on. Bisa ditambah: Basic, Premium, Unlimited |
| **White-label / Reseller** | Belum ada sistem reseller atau sub-domain |
| **Trial Period** | Bisa dikasih trial 3 hari akses premium |
| **Promo Code** | Belum ada sistem diskon/kupon |
| **Payment Methods** | Hanya Midtrans (bagus sih, karena Midtrans support banyak metode) |

#### C. Fitur Pengalaman User

| Fitur | Keterangan |
|-------|------------|
| **Guest Link Generator** | Setiap tamu punya link unik untuk RSVP |
| **Bulk Import Guest** | Import dari CSV/Excel |
| **Invitation Analytics** | View count, unique visitors, RSVP stats |
| **Countdown Timer** | Hiasan di undangan |
| **Photo Gallery Album** | Galeri foto yang lebih interaktif |
| **Live Streaming Embed** | Embed YouTube Live / Zoom |
| **Multi-language** | Dukungan bahasa Inggris |
| **Print-ready Card** | Download versi cetak |
| **Schedule Post** | Jadwalkan publikasi undangan |
| **Comment Moderation** | Setujui/tolak ucapan sebelum tampil |
| **Notification to Owner** | Notifikasi kalau ada tamu RSVP |
| **Save The Date** | Fitur reminder ke tamu |
| **Image Optimization** | Kompres & resize otomatis pas upload |

#### D. Fitur Teknis

| Fitur | Keterangan |
|-------|------------|
| **Database Migration Tool** | Masih manual SQL + auto-migrate |
| **Redis Caching** | Cache template, settings, session |
| **Background Jobs** | Proses webhook, kirim email async |
| **HTTPS Only** | Pastikan secure di semua environment |
| **Docker Support** | Memudahkan deploy |
| **CI/CD Pipeline** | Auto deploy dari GitHub |
| **Monitoring** | APM, error tracking (Sentry) |
| **CDN for Assets** | Image optimization & CDN delivery |
| **SEO Meta Tags** | Open Graph, Twitter Card untuk undangan |
| **API Documentation** | Belum ada docs untuk integrasi |

#### E. Security Hardening Tambahan

| Item | Keterangan |
|------|------------|
| **Helmet.js** | Security headers tambahan (X-Frame-Options, dll) - sudah ada CSP manual sih |
| **Input Sanitasi** | Sanitasi guest_name, wish message dari XSS |
| **SQL Injection Review** | Dynamic query di updateInvitation perlu dicek allowedFields |
| **Dependency Audit** | `npm audit` rutin |
| **2FA Admin** | Two-factor authentication untuk admin panel |

---

## 6. Rekomendasi Prioritas

### 🔴 Minggu 1 (Critical - Harus Sebelum Live)

1. **Session signing** — Pake JWT atau simpan session di DB dengan token acak
2. **Secure cookie** — `secure: true` (pastikan HTTPS sudah aktif)
3. **Rate limiting** — Minimal di `/login`, `/register`, `/api/midtrans/create-transaction`
4. **CSRF protection** — Tambahkan hidden token di tiap form action
5. **Fix admin reset password** — Jangan balikin password di response
6. **File upload validation by magic bytes** — Cegah file berbahaya

### 🟡 Minggu 2 (High)

7. **Email service** — Kirim verifikasi email, forgot password, notifikasi
8. **Forgot password flow** — Link reset via email
9. **Audit log** — Log aktivitas penting ke tabel terpisah
10. **Invitation analytics** — Hit view count, unique visitor
11. **Fix upload path inconsistency** — Standardisasi penyimpanan file
12. **Guest link generator** — Setiap tamu punya link RSVP unik

### 🟢 Minggu 3+ (Nice to Have)

13. **Bulk import guest** — CSV upload
14. **Image optimization** — Resize/compress pas upload
15. **Redis caching** — Buat ngebut
16. **Docker + CI/CD** — Standardisasi deployment
17. **Multi-language** — Buka pasar lebih luas
18. **Live streaming embed** — Fitur undangan online
19. **Sentry monitoring** — Error tracking

---

## 7. Catatan Positif

Meskipun banyak catatan perbaikan, project ini sudah punya fondasi yang **sangat bagus**:

- ✅ Kode terstruktur rapi dengan SvelteKit patterns
- ✅ TypeScript strict
- ✅ Session-based auth dengan httpOnly cookie
- ✅ Cloudflare Turnstile proteksi form publik
- ✅ CSP headers sudah diimplementasi
- ✅ Payment flow dengan webhook signature verification
- ✅ Signed URLs untuk proteksi upload
- ✅ PM2 cluster mode untuk production
- ✅ Backup/restore scripts tersedia
- ✅ Deployment stages terdokumentasi rapi
- ✅ Midtrans integration dengan order_id format dan legacy fallback
- ✅ Template system yang extensible (JSON + Svelte components)
- ✅ Parameterized queries (SQL injection prevention dasar)
- ✅ Error handling di sebagian besar endpoints

---

## 8. Arsitektur Database

```
users
├── id VARCHAR(36) PK
├── username VARCHAR(50) UNIQUE
├── email VARCHAR(100) UNIQUE
├── password VARCHAR(255) [bcrypt]
├── role ENUM('admin','user')
├── has_access TINYINT
├── payment_status VARCHAR(20)
├── invitation_limit INT
├── guest_limit INT
├── template_quota INT
├── template_quota_used INT
└── created_at TIMESTAMP

templates
├── id VARCHAR(50) PK
├── name VARCHAR(100)
├── slug VARCHAR(100) UNIQUE
├── description TEXT
├── thumbnail VARCHAR(255)
├── primary_color VARCHAR(10)
├── secondary_color VARCHAR(10)
├── accent_color VARCHAR(10)
├── font_family VARCHAR(50)
├── layout_style VARCHAR(30)
├── category VARCHAR(30)
└── created_at TIMESTAMP

invitations
├── id VARCHAR(36) PK
├── user_id VARCHAR(50) FK → users
├── template_id VARCHAR(50) FK → templates
├── slug VARCHAR(100) UNIQUE
├── [bride/groom]_name, _full_name, _parents, _instagram, _photo
├── quote, quote_source
├── akad_date, akad_time
├── resepsi_date, resepsi_time
├── venue_name, venue_address, venue_map_url
├── love_story LONGTEXT
├── bank_accounts TEXT [JSON]
├── dress_code_colors TEXT [JSON]
├── music_url TEXT
├── background_image TEXT
├── gallery_images TEXT
├── is_published TINYINT
├── custom_content TEXT [JSON]
├── respect_person TEXT
└── created_at, updated_at TIMESTAMP

guests
├── id VARCHAR(36) PK
├── invitation_id VARCHAR(50) FK → invitations
├── name VARCHAR(100)
├── slug VARCHAR(100)
├── is_attending TINYINT
├── num_guests INT
├── has_responded TINYINT
└── created_at TIMESTAMP

wishes
├── id VARCHAR(36) PK
├── invitation_id VARCHAR(50) FK → invitations
├── guest_name VARCHAR(100)
├── message TEXT
├── is_attending VARCHAR(20)
└── created_at TIMESTAMP

payment_transactions
├── id VARCHAR(36) PK
├── user_id VARCHAR(36) FK → users
├── order_id VARCHAR(50) UNIQUE
├── type ENUM('premium','addon')
├── amount INT
├── status ENUM('pending','success','failed','cancelled')
└── created_at, updated_at TIMESTAMP

settings
├── key VARCHAR(100) PK
├── value TEXT
└── updated_at TIMESTAMP
```

---

## 9. Diagram Alur Pembayaran

```
User click "Bayar"
    │
    ▼
Checkout Page
    │
    ├─ buildMidtransOrderId(type, userId) → "P_uuidshort_tshex"
    │
    ├─ createMidtransTransaction({
    │     orderId, amount,
    │     customer: { name, email },
    │     item: { id, name, price }
    │   })
    │     │
    │     ▼
    │   POST https://app.midtrans.com/snap/v1/transactions
    │     │
    │     ▼
    │   Response: { token: "snap-token" }
    │
    ├─ createPaymentTransaction(userId, orderId, type, amount) → DB (pending)
    │
    └─ Render Snap popup dengan clientKey + token
            │
            ▼
       User bayar di Midtrans Snap
            │
            ▼
    Midtrans kirim POST ke /api/midtrans/notification
            │
            ├─ Verify signature (sha512)
            ├─ findPaymentTransactionByOrderId(orderId)
            ├─ updateUserAccess(userId, 1, 'paid', 3)
            └─ updatePaymentTransactionStatus(orderId, 'success')
```

---

*Dokumen ini dibuat berdasarkan analisis kode sumber tanggal 2026-04-26.*

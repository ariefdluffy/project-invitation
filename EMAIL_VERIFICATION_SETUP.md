# Konfigurasi Email & Verifikasi

## 1. Mailtrap SMTP Integration

### Konfigurasi .env

```bash
# ============================================
# EMAIL SMTP (Production)
# ============================================
SMTP_HOST=live.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=api
SMTP_PASS=<YOUR_API_TOKEN>
SMTP_FROM_NAME=Invitation
SMTP_FROM_EMAIL=no-reply@temuin.web.id

ORIGIN=https://temuin.web.id
```

### Catatan Penting

- **Host:** `live.smtp.mailtrap.io` (bukan `sandbox.smtp.mailtrap.io`)
- **User:** gunakan string literal `api` untuk Mailtrap Live
- **Pass:** API Token dari Mailtrap Dashboard → Account → API Tokens
- **Port:** 587 (TLS), bukan 465

### Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `ENOTFOUND =live...` | `SMTP_HOST==` (double `=`) | Ubah ke `SMTP_HOST=live...` |
| `Invalid login` | Credentials salah | Cek API Token di mailtrap.io |
| `Authentication failed` | User bukan `api` | Gunakan `api` sebagai username |

---

## 2. Cloudflare Turnstile URL Fix

### Masalah
Badge Turnstile tidak muncul, error 404 saat load script.

### Solusi
Fix URL script di `src/app.html`:

```html
<!-- SALAH -->
<script src="https://challenges.cloudflare.com/turnstile/api.js?compat=explicit" async defer></script>

<!-- BENAR -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
```

---

## 3. getClientAddress Fix

### Masalah
`TypeError: request.getClientAddress is not a function`

### Solusi
Hapus fallback `getClientAddress()` di `src/lib/server/utils.ts`:

```typescript
// Sebelum
return request.getClientAddress();

// Sesudah
return '127.0.0.1';
```

---

## 4. Email Verification Feature

### Flow
1. User register → akun dibuat (`email_verified = 0`)
2. Email verifikasi dikirim otomatis
3. User klik link `/verify-email/{token}`
4. Email terverifikasi → user bisa login

### File yang Dibuat/Modifikasi

| File | Perubahan |
|------|-----------|
| `src/lib/server/users.ts` | Tambah kolom `email_verified`, `email_verify_token`, `email_verify_expires` |
| `src/lib/server/email.ts` | Fungsi `sendVerificationEmail()` |
| `src/hooks.server.ts` | Panggil `ensureEmailVerifyColumns()` |
| `src/routes/register/+page.server.ts` | Kirim email verifikasi, redirect ke login |
| `src/routes/login/+page.server.ts` | Cek `email_verified` sebelum login |
| `src/routes/verify-email/[token]/+page.server.ts` | Verifikasi token |
| `src/routes/verify-email/[token]/+page.svelte` | Tampilan sukses/gagal |
| `src/routes/login/+page.svelte` | Tampilkan pesan "cek inbox email" |

### Database Migration

Kolom otomatis dibuat saat server start. Atau jalankan manual:

```sql
ALTER TABLE users ADD COLUMN email_verified TINYINT(1) DEFAULT 0;
ALTER TABLE users ADD COLUMN email_verify_token VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN email_verify_expires DATETIME NULL;
```

### Endpoint Test

```bash
# Test email
curl http://localhost:3003/api/test-email?to=test@example.com
```

---

## 5. Env Variables Summary

```bash
# ============================================
# APP
# ============================================
ORIGIN=https://temuin.web.id

# ============================================
# EMAIL SMTP
# ============================================
SMTP_HOST=live.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=api
SMTP_PASS=<API_TOKEN>
SMTP_FROM_NAME=Invitation
SMTP_FROM_EMAIL=no-reply@temuin.web.id

# ============================================
# TURNSTILE (Cloudflare)
# ============================================
PUBLIC_TURNSTILE_SITE_KEY=<SITE_KEY>
TURNSTILE_SECRET_KEY=<SECRET_KEY>
DISABLE_TURNSTILE=false
```

---

## Restart Server

```bash
# Local
npm run dev

# Production
pm2 restart project-invitation
pm2 logs project-invitation --lines 50
```
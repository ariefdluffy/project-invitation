# Analisis Menu & Responsive Mobile

## 1. Struktur Menu Lengkap

### 🏠 Public Routes

| Route | Nama Halaman | Responsive? | Catatan |
|-------|-------------|:-----------:|---------|
| `/` | Landing Page | ⚠️ Sebagian | `clamp()`, auto-fit grids. `<480px` template card bisa overflow |
| `/login` | Login | ✅ Cukup | Pakai app.css global |
| `/register` | Register | ✅ Cukup | Sama seperti login |
| `/forgot-password` | Lupa Password | ❌ | Inline style putih, beda tema dgn login/register |
| `/reset-password/[token]` | Reset Password | ❌ | Inline style putih, tanpa Turnstile |
| `/invitation/[slug]` | Lihat Undangan | ✅ Baik | Breakpoint 480/600/768px |
| `/demo/[id]` | Demo Template | ✅ Baik | Sama dgn invitation |

### 📊 Dashboard Routes (Sidebar Menu)

| Menu | Route | Responsive? | Catatan |
|------|-------|:-----------:|---------|
| Dashboard | `/dashboard` | ✅ | `@media (max-width:600px)` analytics 1kol |
| Buat Undangan | `/dashboard/create` | ✅ | 4-step form, `@media 700px` |
| Undangan Saya | `/dashboard/invitations` | ⚠️ | Auto-fill grid OK, tanpa breakpoint eksplisit |
| Media & Foto | `/dashboard/media` | ⚠️ | Auto-fill grid OK |
| Billing & Akses | `/dashboard/billing` | ✅ | 768px→2kol, 1024px→3kol |
| My Profile | `/dashboard/profile` | ✅ | 768px→2kol |

**Orphan Routes (tidak ada menu sidebar):**
- `/dashboard/billing/checkout` — ⚠️ Sebagian responsive
- `/dashboard/invitations/[id]` — ✅ 5 tab editor, 700px breakpoint
- `/dashboard/import-guests` — ❌ Legacy page, hardcoded warna

### 🔧 Admin Routes (Sidebar Menu)

| Group | Menu | Route | Responsive? | Catatan |
|-------|------|-------|:-----------:|---------|
| 📋 Kelola | Overview | `/admin` | ⚠️ | Grid 900px→1kol. Stat row rawan wrap |
| 📋 Kelola | Users | `/admin/users` | ❌ | **10 kolom tabel overflow** |
| 📋 Kelola | Undangan | `/admin/invitations` | ❌ | 5 kolom tabel overflow |
| 📋 Kelola | Template | `/admin/templates` | ✅ | 4→3→2→1 kolom breakpoint |
| 💰 Bisnis | Revenue | `/admin/revenue` | ⚠️ | Chart label overlap |
| 💰 Bisnis | Promo | `/admin/promo` | ❌ | Form-row 2kol tanpa breakpoint |
| ⚙️ Admin | Settings | `/admin/settings` | ✅ | minmax grid |
| ⚙️ Admin | Broadcast | `/admin/announcement` | ✅ | Single form |
| ⚙️ Admin | Export | `/admin/export` | ✅ | auto-fit minmax |
| ⚙️ Admin | Audit Log | `/admin/audit` | ✅ **Sempurna** | Banyak `@media 768px` |
| 👤 Akun | Profile | `/admin/profile` | ✅ | 768px→2kol |

**Sub-pages:**
- `/admin/users/[id]` — ⚠️ Tabel3x overflow
- `/admin/templates/preview/[id]` — ❌ Badge/back overlap

### 📄 Invitation Components

| Komponen | Tipe | Responsive? | Catatan |
|----------|------|:-----------:|---------|
| AqiqahLayout | Proxy | N/A | Delegasi |
| BirthdayLayout | Proxy | N/A | Delegasi |
| SimpleEventLayout | Layout | ⚠️ | `clamp()` ok, tanpa `@media` |
| Tema31InspiredWedding | Layout | ✅ | Breakpoint 720/768px |
| ThreeDMotionWedding | Layout | ⚠️ | `clamp()` ok, tanpa `@media` |
| InvitationCover | Block | ❌ | Font 2.8rem tanpa clamp |
| InvitationEvent | Block | ✅ | 768px 2kol, 600px 1kol |
| InvitationHero | Block | ✅ | 480px countdown |
| InvitationGallery | Block | ✅ | 600px 2→3 kolom |
| InvitationCouple | Block | ⚠️ | Avatar 180px fixed |
| InvitationRsvp | Block | ❌ | Tanpa breakpoint |

## 2. Global CSS Responsive

| Aspek | Status |
|-------|--------|
| Breakpoints | 480, 600, 700, 720, 768, 900, 1024, 1200px — tersebar |
| CSS Variables Responsive | ❌ Nol |
| Utility Classes | ❌ Nol |
| Satu global `@media` | `768px` di app.css |

## 3. Masalah Kritis

| # | Masalah | Halaman |
|---|---------|---------|
| 🔴 | Sidebar admin tak sembunyi di mobile | Semua admin |
| 🔴 | Tabel overflow tanpa scroll wrapper | users, invitations, revenue, promo |
| 🟡 | form-row 2kol tanpa breakpoint | promo |
| 🟡 | Landing `template card` overflow di `<480px` | `/` |
| 🟡 | import-guests legacy page | dashboard |
| 🟡 | Auth pages tema inkonsisten | forgot/reset password |
| 🟡 | `prefers-reduced-motion` tidak ditangani | Semua animasi |

## 4. Rekomendasi

1. Fix sidebar off-canvas (`transform + transition`)
2. Tambah `overflow-x: auto` di semua `.dash-table`
3. Standardisasi breakpoints ke CSS variables
4. Tambah `@media (max-width:480px)` form-row 1kol
5. Konversi InvitationCover font ke `clamp()`
6. Tambah `prefers-reduced-motion`
7. Refactor import-guests pakai dashboard CSS

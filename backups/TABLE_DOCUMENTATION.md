# 📊 Database Schema Dokumentasi Lengkap

## Daftar Isi
1. [Tabel Users](#users-table)
2. [Tabel Templates](#templates-table)
3. [Tabel Invitations](#invitations-table)
4. [Tabel Guests](#guests-table)
5. [Tabel Wishes](#wishes-table)
6. [Tabel Settings](#settings-table)
7. [Tabel Orders](#orders-table)

---

## Users Table

**Deskripsi:** Menyimpan data pengguna aplikasi (admin dan regular users)

| Column | Type | Constraint | Default | Deskripsi |
|--------|------|-----------|---------|-----------|
| id | VARCHAR(50) | PRIMARY KEY | - | UUID identifier |
| username | VARCHAR(50) | UNIQUE, NOT NULL | - | Username untuk login |
| email | VARCHAR(100) | UNIQUE, NOT NULL | - | Email unik pengguna |
| password | VARCHAR(255) | NOT NULL | - | Password terenkripsi (bcrypt) |
| role | ENUM('admin', 'user') | - | user | Role pengguna |
| has_access | TINYINT | - | 0 | 0 = no access, 1 = has access |
| payment_status | VARCHAR(20) | - | unpaid | unpaid, pending, paid, inactive |
| payment_method | VARCHAR(50) | - | NULL | Metode pembayaran terakhir |
| invitation_limit | INT | - | 1 | Jumlah undangan yang bisa dibuat |
| guest_limit | INT | - | 100 | Total kuota tamu untuk semua undangan |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | Waktu pembuatan akun |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP ON UPDATE | Waktu update terakhir |

**Indexes:**
- `idx_username` - Untuk login
- `idx_email` - Untuk email lookup
- `idx_created_at` - Untuk listing

**Contoh Data:**
```sql
INSERT INTO users VALUES (
  'user-001',
  'john_doe',
  'john@example.com',
  '$2a$10$...',  -- bcrypt hash
  'user',
  1,
  'paid',
  'qris',
  3,
  200,
  NOW(),
  NOW()
);
```

---

## Templates Table

**Deskripsi:** Menyimpan template desain undangan yang tersedia

| Column | Type | Constraint | Default | Deskripsi |
|--------|------|-----------|---------|-----------|
| id | VARCHAR(50) | PRIMARY KEY | - | UUID identifier |
| name | VARCHAR(100) | NOT NULL | - | Nama template (cth: "Classic Wedding") |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | - | URL-friendly identifier |
| description | TEXT | - | NULL | Deskripsi template |
| thumbnail | VARCHAR(255) | - | NULL | URL gambar preview template |
| primary_color | VARCHAR(10) | - | #D4A574 | Warna primer (hex format) |
| secondary_color | VARCHAR(10) | - | #8B6F4E | Warna sekunder (hex) |
| accent_color | VARCHAR(10) | - | #F5E6D3 | Warna aksen (hex) |
| font_family | VARCHAR(50) | - | Playfair Display | Font utama template |
| layout_style | VARCHAR(30) | - | classic | classic, modern, elegant, minimalis |
| category | VARCHAR(30) | NOT NULL | wedding | Kategori: wedding, akad, reception, etc |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP ON UPDATE | Waktu update terakhir |

**Indexes:**
- `idx_category` - Untuk filtering template
- `idx_slug` - Untuk URL lookup

**Contoh Data:**
```sql
INSERT INTO templates VALUES (
  'tpl-001',
  'Classic Wedding',
  'classic-wedding',
  'Traditional wedding invitation with elegant design',
  'https://example.com/thumb-classic.jpg',
  '#D4A574',
  '#8B6F4E',
  '#F5E6D3',
  'Playfair Display',
  'classic',
  'wedding',
  NOW(),
  NOW()
);
```

---

## Invitations Table

**Deskripsi:** Menyimpan undangan yang dibuat oleh user

| Column | Type | Constraint | Default | Deskripsi |
|--------|------|-----------|---------|-----------|
| id | VARCHAR(50) | PRIMARY KEY | - | UUID identifier |
| user_id | VARCHAR(50) | FOREIGN KEY | - | Owner/pembuat undangan (ref: users) |
| template_id | VARCHAR(50) | FOREIGN KEY | - | Template yang digunakan (ref: templates) |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | - | URL path untuk share undangan |
| groom_name | VARCHAR(100) | NOT NULL | - | Nama panggilan pengantin pria |
| groom_full_name | VARCHAR(255) | - | NULL | Nama lengkap pengantin pria |
| groom_parents | TEXT | - | NULL | Info orang tua (JSON format) |
| groom_instagram | VARCHAR(100) | - | NULL | Instagram handle pengantin pria |
| groom_photo | VARCHAR(255) | - | NULL | URL foto pengantin pria |
| bride_name | VARCHAR(100) | NOT NULL | - | Nama panggilan pengantin wanita |
| bride_full_name | VARCHAR(255) | - | NULL | Nama lengkap pengantin wanita |
| bride_parents | TEXT | - | NULL | Info orang tua (JSON format) |
| bride_instagram | VARCHAR(100) | - | NULL | Instagram handle pengantin wanita |
| bride_photo | VARCHAR(255) | - | NULL | URL foto pengantin wanita |
| quote | TEXT | - | NULL | Kutipan/quote untuk undangan |
| quote_source | VARCHAR(255) | - | NULL | Sumber quote |
| akad_date | DATE | - | NULL | Tanggal akad nikah |
| akad_time | VARCHAR(50) | - | NULL | Waktu akad nikah (format: HH:mm) |
| resepsi_date | DATE | - | NULL | Tanggal resepsi |
| resepsi_time | VARCHAR(50) | - | NULL | Waktu resepsi |
| venue_name | VARCHAR(255) | - | NULL | Nama venue |
| venue_address | TEXT | - | NULL | Alamat lengkap venue |
| venue_map_url | TEXT | - | NULL | Link Google Maps atau embed URL |
| love_story | LONGTEXT | - | NULL | Cerita cinta mereka |
| bank_accounts | TEXT | - | NULL | Data rekening untuk hadiah (JSON array) |
| dress_code_colors | TEXT | - | NULL | Warna dress code yang direkomendasikan |
| music_url | TEXT | - | NULL | URL lagu background |
| background_image | TEXT | - | NULL | URL background image |
| gallery_images | TEXT | - | NULL | List URL foto (JSON array) |
| is_published | TINYINT | - | 0 | 0 = draft, 1 = published |
| view_count | INT | - | 0 | Jumlah kali undangan dibuka |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP ON UPDATE | Waktu update terakhir |

**Indexes:**
- `idx_user_id` - Untuk user's invitations
- `idx_template_id` - Untuk template usage
- `idx_slug` - Untuk public URL
- `idx_is_published` - Untuk filtering
- `idx_created_at` - Untuk chronological listing

**Contoh Data:**
```sql
INSERT INTO invitations VALUES (
  'inv-001',
  'user-001',
  'tpl-001',
  'john-and-jane-2026',
  'John',
  'John Sutarto',
  '[{"name":"Papa Sutarto","profession":"Retired"}]',
  'john_sutarto',
  'https://example.com/john.jpg',
  'Jane',
  'Jane Utomo',
  '[{"name":"Mama Utomo","profession":"Teacher"}]',
  'jane_utomo',
  'https://example.com/jane.jpg',
  'With every love comes a story to tell',
  'Unknown',
  '2026-06-15',
  '10:00',
  '2026-06-15',
  '12:00',
  'Jakarta Convention Center',
  'Jl. Gatot Subroto No.1, Jakarta',
  'https://maps.google.com/...',
  'Cerita mereka dimulai...',
  '[{"bank":"BCA","account":"123456789","holder":"John Sutarto"}]',
  'Batik Biru',
  'https://example.com/musik.mp3',
  'https://example.com/bg.jpg',
  '["https://example.com/1.jpg","https://example.com/2.jpg"]',
  1,
  250,
  NOW(),
  NOW()
);
```

---

## Guests Table

**Deskripsi:** Menyimpan daftar tamu yang diundang per undangan

| Column | Type | Constraint | Default | Deskripsi |
|--------|------|-----------|---------|-----------|
| id | VARCHAR(50) | PRIMARY KEY | - | UUID identifier |
| invitation_id | VARCHAR(50) | FOREIGN KEY | - | Referensi ke invitation (ON DELETE CASCADE) |
| name | VARCHAR(100) | NOT NULL | - | Nama tamu |
| slug | VARCHAR(100) | NOT NULL | - | URL-friendly identifier untuk link khusus tamu |
| is_attending | TINYINT | - | 0 | 0 = tidak hadir, 1 = hadir |
| num_guests | INT | - | 1 | Jumlah tamu yang akan hadir (termasuk diri sendiri) |
| has_responded | TINYINT | - | 0 | 0 = belum RSVP, 1 = sudah RSVP |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | Waktu ditambahkan |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP ON UPDATE | Waktu update terakhir |

**Indexes:**
- `idx_invitation_id` - Untuk guest listing per invitation
- `idx_has_responded` - Untuk RSVP tracking
- `idx_created_at` - Untuk chronological listing

**Contoh Data:**
```sql
INSERT INTO guests VALUES (
  'guest-001',
  'inv-001',
  'Budi Santoso',
  'budi-santoso',
  1,
  2,
  1,
  NOW(),
  NOW()
);
```

---

## Wishes Table

**Deskripsi:** Menyimpan komentar/ucapan dari tamu

| Column | Type | Constraint | Default | Deskripsi |
|--------|------|-----------|---------|-----------|
| id | VARCHAR(50) | PRIMARY KEY | - | UUID identifier |
| invitation_id | VARCHAR(50) | FOREIGN KEY | - | Referensi ke invitation (ON DELETE CASCADE) |
| guest_name | VARCHAR(100) | NOT NULL | - | Nama tamu yang memberikan ucapan |
| message | TEXT | NOT NULL | - | Isi ucapan/komentar |
| is_attending | VARCHAR(20) | - | hadir | Status kehadiran tamu (hadir, tidak hadir, belum tahu) |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | Waktu ucapan dibuat |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP ON UPDATE | Waktu update terakhir |

**Indexes:**
- `idx_invitation_id` - Untuk wishes per invitation
- `idx_created_at` - Untuk chronological order

**Contoh Data:**
```sql
INSERT INTO wishes VALUES (
  'wish-001',
  'inv-001',
  'Budi Santoso',
  'Selamat ya untuk John dan Jane! Semoga langgeng selamanya.',
  'hadir',
  NOW(),
  NOW()
);
```

---

## Settings Table

**Deskripsi:** Menyimpan konfigurasi aplikasi (key-value store)

| Column | Type | Constraint | Default | Deskripsi |
|--------|------|-----------|---------|-----------|
| key | VARCHAR(100) | PRIMARY KEY | - | Setting identifier |
| value | LONGTEXT | NOT NULL | - | Nilai setting (bisa JSON) |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP ON UPDATE | Waktu update terakhir |

**Default Keys:**

| Key | Example Value | Deskripsi |
|-----|---------------|-----------|
| premium_price | 149000 | Harga paket premium (Rp) |
| addon_guest_price | 19000 | Harga add-on per tamu (Rp) |
| addon_guest_quantity | 50 | Jumlah tamu per add-on |
| app_name | Wedding.id | Nama aplikasi |
| payment_instructions | Transfer ke Rekening BCA... | Instruksi pembayaran manual |
| default_music_url | https://... | URL musik default untuk undangan baru |
| midtrans_server_key | SB-Mid-server-... | Midtrans payment gateway server key |
| midtrans_client_key | SB-Mid-client-... | Midtrans payment gateway client key |
| midtrans_is_production | 0 | 0 = sandbox, 1 = production |

**Contoh Data:**
```sql
INSERT INTO settings VALUES 
('premium_price', '149000', NOW()),
('app_name', 'Wedding.id', NOW());
```

---

## Orders Table

**Deskripsi:** Menyimpan riwayat pesanan dan pembayaran

| Column | Type | Constraint | Default | Deskripsi |
|--------|------|-----------|---------|-----------|
| id | VARCHAR(50) | PRIMARY KEY | - | UUID identifier |
| user_id | VARCHAR(50) | FOREIGN KEY | - | User yang melakukan pembayaran (ref: users) |
| type | VARCHAR(50) | - | NULL | Tipe pesanan: premium, addon |
| amount | INT | NOT NULL | - | Jumlah pembayaran dalam Rp |
| status | VARCHAR(20) | - | pending | pending, paid, failed, cancelled |
| payment_method | VARCHAR(50) | - | NULL | Metode pembayaran: qris, dana, gopay, bank_transfer |
| order_id | VARCHAR(100) | - | NULL | Order ID internal |
| midtrans_transaction_id | VARCHAR(100) | - | NULL | Transaction ID dari Midtrans |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | Waktu order dibuat |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP ON UPDATE | Waktu update terakhir |

**Indexes:**
- `idx_user_id` - Untuk user's orders
- `idx_status` - Untuk filtering
- `idx_created_at` - Untuk chronological listing

**Contoh Data:**
```sql
INSERT INTO orders VALUES (
  'order-001',
  'user-001',
  'premium',
  149000,
  'paid',
  'qris',
  'ORD-20260425-001',
  '1234567890-abcdef',
  NOW(),
  NOW()
);
```

---

## Relationships Diagram

```
USERS (1) ──→ (Many) INVITATIONS
      ├──→ (Many) ORDERS
      │
TEMPLATES (1) ──→ (Many) INVITATIONS
                  │
                  ├──→ (Many) GUESTS
                  │
                  └──→ (Many) WISHES

SETTINGS: Global key-value configuration
```

---

## Data Volume Guide

### Typical Row Counts

```
users           ~100-1,000 rows
templates       ~10-50 rows
invitations     ~100-10,000 rows
guests          ~1,000-100,000 rows
wishes          ~1,000-100,000 rows
settings        ~20-30 rows
orders          ~100-1,000 rows
```

### Estimated Database Size

- **Empty Schema**: ~2 MB
- **Small (< 100 users)**: ~5-10 MB
- **Medium (100-1K users)**: ~50-100 MB
- **Large (1K+ users)**: ~100+ MB

---

## Best Practices

### Data Entry

1. Always use UUIDs for primary keys
2. Keep email addresses lowercase
3. Store passwords as bcrypt hashes
4. Use JSON format for flexible data (parents, bank accounts)
5. Store URLs in consistent format

### Queries

1. Always filter by `user_id` for security
2. Use `slug` for public URL lookups
3. Paginate large result sets
4. Use appropriate indexes for frequent queries

### Maintenance

1. Archive old wishes annually
2. Clean up draft invitations after 1 year
3. Monitor backup sizes
4. Regular index maintenance
5. Update statistics monthly

---

## Migration Checklist

Ketika melakukan deployment:

- [ ] Run migration script: `schema_backup_2026-04-25.sql`
- [ ] Verify all tables created successfully
- [ ] Check default settings inserted
- [ ] Test database connection
- [ ] Create initial backup
- [ ] Document access credentials
- [ ] Setup backup schedule

---

**Last Updated:** 2026-04-25
**MySQL Version:** 8.0+
**Database Name:** wedding_db

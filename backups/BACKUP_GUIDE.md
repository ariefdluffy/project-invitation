# Database Backup & Restore Guide

## Struktur Tabel Database

### 📊 Daftar Tabel

1. **users** - Data pengguna aplikasi
2. **templates** - Template undangan
3. **invitations** - Undangan yang dibuat user
4. **guests** - Daftar tamu per undangan
5. **wishes** - Komentar/ucapan tamu
6. **settings** - Konfigurasi aplikasi
7. **orders** - Riwayat pesanan/pembayaran

---

## 🔄 Backup Database

### Otomatis Backup (Rekomendasi)

Script Node.js akan backup schema + data:

```bash
# Backup ke folder default (./backups/)
node scripts/backup-database.js

# Backup ke folder custom
node scripts/backup-database.js ./my-backups/
```

**Output:** File SQL dengan timestamp: `database_backup_2026-04-25T12-30-45-123Z.sql`

### Manual Backup dengan MySQL Command

```bash
# Export schema + data
mysqldump -h localhost -u root -p wedding_db > backup.sql

# Export hanya schema (tanpa data)
mysqldump -h localhost -u root -p --no-data wedding_db > schema_only.sql

# Export dengan kompresi
mysqldump -h localhost -u root -p wedding_db | gzip > backup.sql.gz
```

---

## 💾 Restore Database

### Dari Script Node.js

```bash
node scripts/restore-database.js ./backups/database_backup_2026-04-25T12-30-45-123Z.sql
```

Script akan:
- Meminta konfirmasi sebelum overwrite
- Menampilkan progress
- Menangani duplikasi key dengan aman

### Manual dengan MySQL

```bash
# Restore dari file SQL
mysql -h localhost -u root -p < backup.sql

# Restore dari file terkompresi
gunzip < backup.sql.gz | mysql -h localhost -u root -p

# Restore ke database spesifik
mysql -h localhost -u root -p wedding_db < backup.sql
```

---

## 🗂️ File Backup

### Schema Backup Statis

File `backups/schema_backup_2026-04-25.sql` berisi:
- Struktur semua tabel dengan lengkap
- Indexes dan constraints
- Default settings
- Dokumentasi tabel

Gunakan untuk:
- Referensi struktur database
- Setup database baru
- Development environment

---

## 🔑 Environment Variables

Pastikan `.env` atau environment variable sudah set:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=wedding_db
```

Jika tidak ada `.env`, script akan menggunakan nilai default.

---

## 📋 Rekomendasi Best Practice

### Backup Regular
```bash
# Backup harian (gunakan cron job di Linux/Mac)
0 2 * * * cd /path/to/project && node scripts/backup-database.js >> backups/backup.log 2>&1
```

### Untuk Windows (Task Scheduler)
```
Program: node
Arguments: C:\path\to\scripts\backup-database.js
Run as: Regular user
Frequency: Daily at 2:00 AM
```

### Struktur Folder Backup
```
backups/
├── schema_backup_2026-04-25.sql
├── database_backup_2026-04-25T02-00-15-123Z.sql
├── database_backup_2026-04-24T02-00-22-456Z.sql
└── database_backup_2026-04-23T02-00-18-789Z.sql
```

---

## 🚨 Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- Cek password di `.env`
- Pastikan MySQL service berjalan
- Verify username MySQL

### Error: "Unknown database 'wedding_db'"
- Database akan dibuat otomatis saat restore
- Atau jalankan schema_backup.sql terlebih dahulu

### File backup kosong atau sangat kecil
- Cek koneksi database
- Pastikan database memiliki data
- Lihat log error di console

---

## 📊 Database Schema Details

### Users Table
```sql
- id (VARCHAR 50, PK)
- username (VARCHAR 50, UNIQUE)
- email (VARCHAR 100, UNIQUE)
- password (VARCHAR 255)
- role (ENUM: admin, user)
- has_access (TINYINT: 0/1)
- payment_status (VARCHAR: unpaid, pending, paid, inactive)
- guest_limit (INT)
- created_at, updated_at
```

### Invitations Table
```sql
- id (VARCHAR 50, PK)
- user_id (FK to users)
- template_id (FK to templates)
- slug (VARCHAR 100, UNIQUE)
- groom_*, bride_* (Detail pengantin)
- akad_date, akad_time, resepsi_date, resepsi_time
- venue_* (Detail venue)
- gallery_images (TEXT - JSON array)
- is_published (TINYINT)
- view_count (INT)
- created_at, updated_at
```

### Templates Table
```sql
- id (VARCHAR 50, PK)
- name, slug (UNIQUE), description
- thumbnail (VARCHAR 255)
- primary_color, secondary_color, accent_color (VARCHAR 10)
- font_family, layout_style
- category (VARCHAR 30)
- created_at, updated_at
```

### Guests Table
```sql
- id (VARCHAR 50, PK)
- invitation_id (FK)
- name (VARCHAR 100)
- slug (VARCHAR 100)
- is_attending (TINYINT)
- num_guests (INT)
- has_responded (TINYINT)
```

### Wishes Table
```sql
- id (VARCHAR 50, PK)
- invitation_id (FK)
- guest_name (VARCHAR 100)
- message (TEXT)
- is_attending (VARCHAR 20)
```

### Settings Table
```sql
- key (VARCHAR 100, PK)
- value (LONGTEXT)
- Default keys:
  * premium_price
  * addon_guest_price
  * addon_guest_quantity
  * app_name
  * payment_instructions
  * default_music_url
  * midtrans_* (untuk payment gateway)
```

---

## ✅ Checklist Backup

- [ ] Backup otomatis sudah di-schedule
- [ ] Test restore dari backup terakhir
- [ ] Simpan backup di multiple location
- [ ] Encrypt sensitive backups
- [ ] Monitor backup logs
- [ ] Dokumentasi perubahan schema

---

## 📞 Support

Untuk pertanyaan lebih lanjut, silakan cek:
- File: `migrate_mysql.sql` (schema original)
- Database config: `src/lib/server/db.ts`

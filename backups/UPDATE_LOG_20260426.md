# Wedding Invitation Platform - Update Log: 26 April 2026

## Ringkasan Perubahan
Sesi pengerjaan hari ini difokuskan pada perbaikan bug template, modernisasi UI pada template **Royal Midnight**, dan penambahan fitur kustomisasi teks dinamis.

---

## 1. Perbaikan Bug & Sinkronisasi
*   **Fix Template Duplikasi:**
    *   Membersihkan konflik ID pada direktori template.
    *   Mengubah ID template `baby-blue.json` dari `tmpl-aqiqah-soft` menjadi `tmpl-aqiqah-blue` (kategori: aqiqah).
    *   Mengubah ID template `arisan-keluarga.json` dari `tmpl-gathering-bistro` menjadi `tmpl-arisan-keluarga` (kategori: gathering).
*   **Sinkronisasi Data:**
    *   Menjalankan skrip sinkronisasi database untuk memastikan semua file `.json` di `static/templates/` konsisten dengan tabel `wedding_db.templates`.

## 2. Modernisasi UI (Template: Royal Midnight)
*   **Pembaruan Desain (Modern Royal Look):**
    *   **Hero Box:** Implementasi *Glassmorphism* dengan gradien gelap, *blur* latar belakang, dan *shadow* premium.
    *   **Couple Card:** Desain *floating card* dengan efek hover dan *rounded corners* yang lebih halus.
    *   **Avatar:** Penambahan *glow border* emas.
    *   **Event Cards:** Desain *Grid* modern untuk kotak Akad & Resepsi.
    *   **Tipografi:** Pembaruan gaya "THE WEDDING OF" dengan *letter-spacing* luas, *uppercase*, dan *opacity* untuk kesan elegan.
*   **Sinkronisasi Pratinjau:** Menyelaraskan CSS pada halaman Pratinjau Dashboard agar identik dengan laman undangan utama.

## 3. Fitur Kustomisasi Teks Dinamis
*   **Database:** Menambahkan kolom `custom_content` (JSON) pada tabel `invitations`.
*   **Dashboard:** Menambahkan tab **"✍️ Teks"** di halaman Edit Undangan untuk mengubah teks berikut secara spesifik per undangan:
    *   *Judul Utama* (e.g., "The Wedding of").
    *   *Heading Mempelai* (e.g., "Bride & Groom").
    *   *Teks Undangan* (Teks ajakan utama).
*   **Rendering:** Update logika *parsing* data di sisi klien agar menangani data `custom_content` dengan aman dan otomatis menerapkan *font-family* sesuai template yang dipilih melalui variabel `--f-fam`.

## 4. Backup & Maintenance
*   **Full Backup:** Melakukan backup seluruh proyek (`wedding-invitation/`) beserta SQL dump database ke dalam `wedding-invitation/backups/full_project_backup.zip`.
*   **Google Drive:** Mengunggah backup ke Google Drive via `gdrive_upload.py`.
*   **Nama Tab:** Pembaruan judul tab pada dashboard agar dinamis mengambil nama aplikasi (`Lembar Moment`) dari tabel `settings`.

---
*Catatan: Semua perubahan telah diuji dan divalidasi. Jika ditemukan masalah pada rendering template, silakan lakukan Hard Refresh (Ctrl+F5).*
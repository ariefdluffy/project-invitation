# Wedding Invitation - Config Check untuk Server Hermes Agent

## ✅ Server Status SEKARANG

```
OS: Ubuntu (Linux 5.15.0-176-generic)
Node: v22.22.2 ✓
NPM: 10.9.7 ✓
MySQL: Active (running) ✓
Port 3003: Available ✓
Disk: 15GB free (50% usage) ✓
RAM: 985MB free (3.8GB total) ✓
```

## 🔧 Konfigurasi untuk Hermes Server

Server Hermes Agent ini SUDAH CUKUP untuk menjalankan wedding-invitation dengan:
- **Mode:** Development/Staging (bukan production)
- **Port:** 3003 (tersedia)
- **Database:** wedding_db (existing)
- **PM2:** Managed dengan single instance

---

## ✅ Checklist Konfigurasi SEKARANG

### Step 1: Verify Database Connection
```bash
mysql -u wedding_user -p'WeddingDB2024!' -e "USE wedding_db; SHOW TABLES;"
```
Expected: Semua tables ada (users, invitations, payment_transactions, etc.)

**Status:** ✅ Database sudah ada dan teruji

### Step 2: Check Current PM2 Config
```bash
cd ~/wedding-invitation
node ~/.hermes/node/lib/node_modules/pm2/bin/pm2 show wedding-invitation
```

**Status:** ✅ Sudah running (PID 46560, online)

### Step 3: .env File untuk Hermes Server
Current `.env` di `~/wedding-invitation/.env`:
```
NODE_ENV=development
PORT=3003
HOST=0.0.0.0
DB_HOST=localhost
DB_NAME=wedding_db
DB_USER=wedding_user
```

**Status:** ✅ Sudah benar untuk Hermes server

### Step 4: Vite Config untuk External Access
File: `vite.config.ts` harus punya:
```typescript
server: {
  port: 3003,
  host: '0.0.0.0',  // Critical untuk external access
}
```

**Status:** ✅ Sudah dikonfigurasi

### Step 5: Payment Gateway (Midtrans)
Current: **Sandbox mode** (OK untuk development/testing)
```
MIDTRANS_CLIENT_KEY: SB-Mid-client-2ibZocoHhnc5Oncp
MIDTRANS_SERVER_KEY: SB-Mid-server-u0zbtnDby1LXDIMJEYUZoyBe
```

**Status:** ✅ OK untuk testing, jangan untuk production

---

## 📊 CONFIG DIFFERENCES: Hermes Server vs Production Server

| Item | Hermes Server (Sekarang) | Production Server |
|------|--------------------------|-------------------|
| **Mode** | development | production |
| **Port** | 3003 | 3003 (behind Nginx) |
| **Entry Point** | `npm run dev` | `npm run build` → `node build/index.js` |
| **Instances** | 1 (fork mode) | 2-4 (cluster mode) |
| **Memory Limit** | 600MB | 400MB per instance |
| **Watch Files** | Enabled (auto-reload) | Disabled |
| **Logs** | ~/.pm2/logs/ | /var/log/wedding-invitation/ |
| **Database** | wedding_db | wedding_db_prod |
| **SSL** | None (HTTP only) | HTTPS/SSL required |
| **Reverse Proxy** | Direct access | Via Nginx |
| **Midtrans** | Sandbox (OK) | Production keys required |

---

## ⚠️ Items yang BERBEDA dari Production Template

### 1. Entry Point
**Current (Hermes):** `npm run dev` (Vite dev server)
**Production:** `node build/index.js` (built app)

✓ Ini benar untuk Hermes. Vite dev server bagus untuk development.

### 2. Ecosystem Config
**Current:** wedding-invitation (PM2 config tua)
**Better:** ecosystem.config.hermes-dev.js (baru, untuk server ini)

⚠️ Sebaiknya ganti ke config baru yang lebih sesuai Hermes server.

### 3. Database
**Current:** wedding_db (development database)
**Production:** wedding_db_prod (terpisah)

✓ OK untuk Hermes. Kalau ingin "production-like", bisa rename ke wedding_db_prod.

### 4. Reverse Proxy
**Current:** Direct access ke port 3003
**Production:** Via Nginx (port 80/443)

✓ OK untuk Hermes karena internal server.

### 5. SSL/HTTPS
**Current:** Tidak ada (HTTP only)
**Production:** HTTPS dengan Let's Encrypt

✓ OK untuk Hermes karena development environment.

---

## 🚀 REKOMENDASI untuk Hermes Server

### Option A: Keep As-Is (Quickest)
- Tetap running dengan config sekarang
- Gunakan langsung di `http://11.11.11.90:3003`
- Cocok untuk testing & staging

✅ **Keuntungan:**
- Setup cepat, sudah siap sekarang
- Cocok untuk guest testing
- Easy to restart & develop

⚠️ **Kekurangan:**
- Tidak production-grade
- HTTP only (bukan HTTPS)
- Direct port access (bukan reverse proxy)
- Sandbox Midtrans (bukan production payment)

### Option B: Optimize untuk Hermes Server
1. Gunakan `ecosystem.config.hermes-dev.js` yang baru
2. Setup simple health check endpoint
3. Enable file watching untuk auto-reload
4. Tambah monitoring dengan PM2

```bash
cd ~/wedding-invitation
node ~/.hermes/node/lib/node_modules/pm2/bin/pm2 delete wedding-invitation
node ~/.hermes/node/lib/node_modules/pm2/bin/pm2 start ecosystem.config.hermes-dev.js
```

✅ **Keuntungan:**
- Auto-reload saat coding
- Better error handling
- Development-optimized config
- Same as Option A, tapi lebih bagus

### Option C: Full Production-Grade Setup
- Setup separate `wedding_db_prod` database
- Configure Nginx reverse proxy (localhost → 3003)
- Generate self-signed SSL atau Let's Encrypt
- Use `ecosystem.config.js` (production config)
- Enable production Midtrans keys

⚠️ **Effort:** Lebih kompleks, tapi lebih robust

---

## ✅ FINAL RECOMMENDATION

**Untuk kasus Anda (Hermes Agent server):**

→ **Gunakan Option B: ecosystem.config.hermes-dev.js**

**Alasan:**
1. Server Hermes ini adalah **development/staging environment**, bukan production
2. Config yang ada sekarang OK, tapi bisa dioptimalkan
3. ecosystem.config.hermes-dev.js lebih sesuai dengan server ini
4. File watching & auto-reload lebih berguna untuk development
5. Memory limit 600MB lebih cocok untuk available RAM (~1GB)

**Cara implementasi:**

```bash
# 1. Stop current
node ~/.hermes/node/lib/node_modules/pm2/bin/pm2 stop wedding-invitation

# 2. Delete old config
node ~/.hermes/node/lib/node_modules/pm2/bin/pm2 delete wedding-invitation

# 3. Start dengan config baru
cd ~/wedding-invitation
node ~/.hermes/node/lib/node_modules/pm2/bin/pm2 start ecosystem.config.hermes-dev.js

# 4. Verify
node ~/.hermes/node/lib/node_modules/pm2/bin/pm2 show wedding-invitation

# 5. Save
node ~/.hermes/node/lib/node_modules/pm2/bin/pm2 save
```

---

## 📋 Checklist untuk Hermes Server

- [x] Node.js v22.22.2 installed
- [x] MySQL running & database ready
- [x] .env configured correctly
- [x] Port 3003 available
- [x] PM2 installed
- [x] wedding-invitation code ready
- [ ] Update ecosystem.config dengan `ecosystem.config.hermes-dev.js`
- [ ] Test payment flow dengan sandbox Midtrans
- [ ] Setup health check endpoint
- [ ] Configure monitoring alerts (optional)

---

## 🎯 Kesimpulannya

**Config sekarang SUDAH CUKUP untuk running di Hermes server ini.**

Tapi untuk hasil yang lebih optimal & development-friendly:
1. Gunakan `ecosystem.config.hermes-dev.js` yang baru
2. Setup dengan PM2 using new config
3. Test payment flow
4. Ready to go!

**Server ini cocok untuk:**
- Testing & staging sebelum production
- Guest RSVP testing
- Payment flow validation
- Demo purposes

**Jangan gunakan untuk:**
- Real production transactions (perlu production Midtrans keys)
- High traffic (server terbatas, 3.8GB RAM)
- HTTPS/SSL critical systems

---

Last Updated: 2026-04-26
Current Status: ✅ READY TO RUN
Recommendation: Use ecosystem.config.hermes-dev.js for optimal development experience

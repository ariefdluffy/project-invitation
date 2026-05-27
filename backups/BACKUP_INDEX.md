# 📦 Backup Index - Wedding Invitation Platform

**Backup Date:** April 25, 2025  
**Project:** Wedding Invitation Platform (Lembar Moment)  
**Version:** 1.0.0

---

## 📋 File List

| File | Size | Description |
|------|------|-------------|
| `README.md` | 19 KB | **Dokumentasi lengkap** - Structure, database schema, API, deployment guide |
| `QUICK_REFERENCE.md` | 5 KB | **Quick commands** - Common tasks, debugging, SQL queries |
| `database-schema.sql` | 7 KB | **Database structure** - All tables without data |
| `database-data.sql` | 9 KB | **Default data** - Settings & templates |

**Total:** 40 KB

---

## 🗄️ Database Summary

### Tables (6)
1. **users** - User accounts & subscription status
2. **invitations** - Wedding invitation data
3. **templates** - Design templates
4. **guests** - Guest lists
5. **wishes** - Guest messages/RSVP
6. **settings** - Application configuration

### Current Data (as of backup)
- **Users:** 3 (admin, arieftheluffy, miftahul)
- **Templates:** 17 (wedding, anniversary, aqiqah, birthday, corporate, gathering, khitan)
- **Invitations:** 2 (fatimah-yusuf, fatimah-yusuf-copy-1205)
- **Guests:** 1
- **Wishes:** 1
- **Settings:** 9 keys

---

## 🔑 Important Credentials

### Database
```
Host: localhost:3306
Database: wedding_db
User: wedding_user
Password: WeddingDB2024!

Root: root / admin123
```

### Admin Login
```
Email: admin@wedding.com
Password: admin123
```

### Midtrans Sandbox
```
Client: SB-Mid-client-2ibZocoHhnc5Oncp
Server: SB-Mid-server-u0zbtnDby1LXDIMJEYUZoyBe
```

---

## 🚀 Quick Start from Backup

### 1. Restore Database
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE wedding_db CHARACTER SET utf8mb4;"

# Import schema
mysql -u root -p wedding_db < database-schema.sql

# Import default data
mysql -u root -p wedding_db < database-data.sql
```

### 2. Setup Application
```bash
# Install dependencies
npm install

# Copy environment
cp .env.example .env
nano .env  # Edit credentials

# Start server
pm2 start npm --name "wedding-invitation" -- run dev
```

### 3. Configure Cloudflare Tunnel
```bash
# Point to port 3003
cloudflared tunnel --url http://localhost:3003

# Or use existing tunnel
# Add to tunnel config: nikahin.lockbit.my.id → localhost:3003
```

---

## 📊 Project Statistics

### Code Structure
- **Routes:** 20+ pages
- **API Endpoints:** 5 endpoints
- **Database Tables:** 6 tables
- **Templates:** 17 designs
- **Languages:** TypeScript, Svelte, SQL

### Features
✅ User authentication (JWT)  
✅ Multi-template system  
✅ Drag & drop file upload  
✅ Guest management  
✅ RSVP system  
✅ Wishes/ucapan  
✅ Payment automation (Midtrans)  
✅ Admin panel  
✅ Public invitation pages  
✅ Mobile responsive  
✅ SEO friendly  

---

## 🔗 External Services

| Service | Purpose | Status |
|---------|---------|--------|
| **Midtrans** | Payment gateway | ✅ Configured |
| **Cloudflare Tunnel** | HTTPS & security | ✅ Active |
| **PM2** | Process manager | ✅ Running |
| **MySQL** | Database | ✅ Localhost:3306 |

---

## 📞 Support

**Developer:** Miftahul Arif Hidayah  
**Contact:** 0852-5088-7277 (WhatsApp)  
**Email:** support@lockbit.my.id

---

## 📝 Notes

1. **Backup Frequency:** Manual (create before major changes)
2. **Storage:** Local + Google Drive (via script)
3. **Recovery Time:** ~5 minutes for full restore
4. **Last Test:** April 25, 2025 - ✅ Successful

---

**Generated:** April 25, 2025 11:26 AM  
**Backup Location:** `~/wedding-invitation/backup/`

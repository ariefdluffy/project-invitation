# 📦 Wedding Invitation - Quick Reference

## 🚀 Quick Commands

### Start/Stop Server
```bash
# Start
pm2 start wedding-invitation

# Stop
pm2 stop wedding-invitation

# Restart
pm2 restart wedding-invitation --update-env

# Monitor
pm2 monit
pm2 logs wedding-invitation --lines 50
```

### Database
```bash
# Login to MySQL
mysql -u wedding_user -p'WeddingDB2024!' wedding_db

# Backup database
mysqldump -u root -p'admin123' wedding_db > backup-$(date +%Y%m%d).sql

# Restore database
mysql -u root -p'admin123' wedding_db < backup-20250425.sql

# Check tables
mysql -u root -p'admin123' -e "USE wedding_db; SHOW TABLES;"
```

### File Management
```bash
# View uploads
ls -lh static/uploads/

# Clear cache
rm -rf .svelte-kit

# Check disk usage
df -h /
du -sh static/uploads/
```

---

## 🔧 Common Tasks

### Add New Template
```sql
INSERT INTO templates (id, name, slug, description, thumbnail, category) 
VALUES ('uuid-here', 'Modern Love', 'modern-love', 'Deskripsi...', '/templates/modern.jpg', 'wedding');
```

### Reset User Password
```sql
-- Generate bcrypt hash first, then:
UPDATE users SET password='$2b$10$...' WHERE email='user@example.com';
```

### Activate User Manually
```sql
UPDATE users 
SET has_access=1, payment_status='paid', invitation_limit=3 
WHERE id='user-uuid';
```

### Add Guest Limit
```sql
UPDATE users 
SET guest_limit = guest_limit + 50 
WHERE id='user-uuid';
```

---

## 📊 Database Queries

### User Statistics
```sql
SELECT 
  COUNT(*) as total_users,
  SUM(CASE WHEN has_access=1 THEN 1 ELSE 0 END) as premium_users,
  SUM(CASE WHEN payment_status='paid' THEN 1 ELSE 0 END) as active_paid
FROM users;
```

### Invitation Statistics
```sql
SELECT 
  COUNT(*) as total_invitations,
  SUM(CASE WHEN is_published=1 THEN 1 ELSE 0 END) as published,
  COUNT(DISTINCT user_id) as active_users
FROM invitations;
```

### Guest Statistics
```sql
SELECT 
  i.slug as invitation,
  COUNT(g.id) as total_guests,
  SUM(CASE WHEN g.is_attending=1 THEN 1 ELSE 0 END) as attending
FROM invitations i
LEFT JOIN guests g ON i.id = g.invitation_id
GROUP BY i.id;
```

### Revenue (Premium + Addon)
```sql
SELECT 
  payment_status,
  COUNT(*) as count,
  SUM(CASE 
    WHEN payment_status='paid' THEN 39000 
    ELSE 0 
  END) as estimated_revenue
FROM users
GROUP BY payment_status;
```

---

## 🔍 Debugging

### Check Midtrans Settings
```sql
SELECT * FROM settings WHERE `key` LIKE 'midtrans%';
```

### View Recent Users
```sql
SELECT id, username, email, payment_status, has_access, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check User Invitations
```sql
SELECT i.id, i.slug, i.groom_name, i.bride_name, i.is_published, i.created_at
FROM invitations i
WHERE i.user_id = 'user-uuid'
ORDER BY i.created_at DESC;
```

### Find Invitation by Slug
```sql
SELECT i.*, u.username, u.email
FROM invitations i
JOIN users u ON i.user_id = u.id
WHERE i.slug = 'fatimah-yusuf';
```

---

## 🌐 URLs

| Page | URL |
|------|-----|
| **Login** | https://nikahin.lockbit.my.id/login |
| **Dashboard** | https://nikahin.lockbit.my.id/dashboard |
| **Create Invitation** | https://nikahin.lockbit.my.id/dashboard/create |
| **Billing** | https://nikahin.lockbit.my.id/dashboard/billing |
| **Admin Settings** | https://nikahin.lockbit.my.id/admin/settings |
| **Template Demo** | https://nikahin.lockbit.my.id/demo/[template-id] |
| **Public Invitation** | https://nikahin.lockbit.my.id/invitation/[slug] |

---

## 🔑 Default Credentials

### Admin Account
```
Email: admin@wedding.com
Password: admin123
```

### Database
```
Host: localhost
Port: 3306
Database: wedding_db
User: wedding_user
Password: WeddingDB2024!

Root User: root
Root Password: admin123
```

### Midtrans Sandbox
```
Client Key: SB-Mid-client-2ibZocoHhnc5Oncp
Server Key: SB-Mid-server-u0zbtnDby1LXDIMJEYUZoyBe
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables |
| `vite.config.ts` | Vite configuration |
| `src/hooks.server.ts` | Global auth hooks |
| `src/lib/server/db.ts` | Database connection |
| `src/lib/server/users.ts` | User management |
| `src/lib/server/invitations.ts` | Invitation CRUD |
| `src/routes/api/midtrans/notification/+server.ts` | Webhook handler |

---

## ⚠️ Common Issues

### 1. 500 Error After Deploy
```bash
rm -rf .svelte-kit
pm2 restart wedding-invitation --update-env
```

### 2. Login Not Working
- Check `.env` SESSION_SECRET
- Verify database connection
- Check cookie settings (secure: false for HTTP)

### 3. Webhook Not Receiving
```bash
# Test endpoint
curl -X POST https://nikahin.lockbit.my.id/api/midtrans/notification \
  -H "Content-Type: application/json" \
  -d '{"test":"webhook"}'

# Check logs
pm2 logs wedding-invitation | grep Midtrans
```

### 4. Date Off By One Day
- Fixed in `formatForInput()` function
- Uses local date components instead of toISOString()

---

## 📞 Emergency Contacts

**Developer:** Miftahul Arif Hidayah  
**WhatsApp:** 0852-5088-7277  
**Email:** support@lockbit.my.id

---

**Last Updated:** April 25, 2025

# Wedding Invitation - Production Deployment Checklist

Complete step-by-step guide untuk deploy wedding-invitation ke production dengan database management, payment gateway, monitoring, dan backup automation.

## ⚠️ IMPORTANT SECURITY NOTES

- **JANGAN commit `.env.production` ke Git** - selalu ada di `.gitignore`
- **Backup `.env.production`** di secure location
- **Ganti semua password** dari template sebelum deploy
- **Use HTTPS/SSL** untuk semua connections
- **Test thoroughly** sebelum launch ke guests

---

## Phase 0: Pre-Deployment Requirements

### 0.1 Production Server Setup
Pastikan server sudah memiliki:
- ✅ Ubuntu 20.04+ atau equivalent Linux
- ✅ Node.js 18+ (`node --version`)
- ✅ MySQL 5.7+ (`mysql --version`)
- ✅ Nginx atau Apache webserver
- ✅ PM2 installed globally (`npm install -g pm2`)
- ✅ SSL certificate (Let's Encrypt recommended)

### 0.2 Environment Configuration

**Create `.env.production`:**
```bash
# App Configuration
NODE_ENV=production
PORT=3003
HOST=0.0.0.0

# Database (Production Database - JANGAN sama dengan dev!)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wedding_db_prod
DB_USER=wedding_user
DB_PASSWORD=<GENERATE_STRONG_PASSWORD_HERE>

# Midtrans (PRODUCTION KEYS - bukan sandbox)
MIDTRANS_CLIENT_KEY=<YOUR_PRODUCTION_CLIENT_KEY>
MIDTRANS_SERVER_KEY=<YOUR_PRODUCTION_SERVER_KEY>
MIDTRANS_MODE=production

# Security
JWT_SECRET=<RANDOM_64_CHAR_SECRET>
API_KEY=<RANDOM_32_CHAR_API_KEY>

# Logging
LOG_LEVEL=error
LOG_DIR=/var/log/wedding-invitation
```

**Verification checklist:**
- [ ] Midtrans keys adalah production (bukan sandbox)
- [ ] Semua password strong dan unique
- [ ] `.env.production` ada di `.gitignore`
- [ ] Copy `.env.production` ke secure location

---

## Phase 1: Database Preparation

### 1.1 Backup Development Database
```bash
# Backup current dev database
mysqldump -u wedding_user -p'WeddingDB2024!' wedding_db > \
  ~/backups/wedding_db_dev_$(date +%Y%m%d_%H%M%S).sql

# Test backup bisa di-restore
file ~/backups/wedding_db_dev_*.sql
```

### 1.2 Create Production Database

**Login as root dan jalankan:**
```sql
-- Gunakan mysql client atau Adminer
-- Login: mysql -u root -p

-- Create database
CREATE DATABASE wedding_db_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (dengan strong password)
CREATE USER 'wedding_user'@'localhost' IDENTIFIED BY '<STRONG_PASSWORD_HERE>';

-- Grant privileges
GRANT ALL PRIVILEGES ON wedding_db_prod.* TO 'wedding_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW GRANTS FOR 'wedding_user'@'localhost';
```

### 1.3 Restore Schema Saja (tanpa data)

```bash
# Extract schema dari dev backup
mysqldump --no-data -u wedding_user -p'WeddingDB2024!' wedding_db | \
  mysql -u wedding_user -p'<NEW_PASSWORD>' wedding_db_prod

# Verify tables
mysql -u wedding_user -p'<NEW_PASSWORD>' -e "USE wedding_db_prod; SHOW TABLES;"
```

**Expected tables:**
- users
- invitations
- payment_transactions
- templates
- galleries

---

## Phase 2: Application Build

### 2.1 Clean & Fresh Build
```bash
cd ~/wedding-invitation

# Clean old builds
rm -rf node_modules package-lock.json .svelte-kit dist build

# Fresh install
npm install

# Type check
npm run check

# Production build
npm run build

# Verify build output
echo "Build size:" && du -sh .svelte-kit/output build/
```

### 2.2 Build Verification
```bash
# Check required files exist
[ -d build ] && echo "✅ build/ exists" || echo "❌ build/ missing"
[ -f build/index.js ] && echo "✅ build/index.js exists" || echo "❌ missing"
[ -d .svelte-kit ] && echo "✅ .svelte-kit/ exists" || echo "❌ missing"
```

---

## Phase 3: PM2 Configuration

### 3.1 Create `ecosystem.config.js`

```javascript
module.exports = {
  apps: [
    {
      name: 'wedding-invitation-prod',
      script: 'node',
      args: 'build/index.js',
      cwd: '/opt/wedding-invitation',
      
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
      
      // Clustering
      instances: '2',  // Use 2 CPU cores
      exec_mode: 'cluster',
      
      // Logging
      error_file: '/var/log/wedding-invitation/error.log',
      out_file: '/var/log/wedding-invitation/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart policy
      max_restarts: 10,
      min_uptime: '30s',
      autorestart: true,
      
      // Memory limits
      max_memory_restart: '400M',
      
      // Timeouts
      listen_timeout: 10000,
      kill_timeout: 5000,
    }
  ]
};
```

### 3.2 Start with PM2

```bash
cd /opt/wedding-invitation

# Dry-run test
pm2 start ecosystem.config.js --dry-run

# Actually start
pm2 start ecosystem.config.js

# Check status
pm2 list
pm2 show wedding-invitation-prod

# Save process list (untuk auto-start on reboot)
pm2 save
```

### 3.3 Enable Auto-Start on Server Reboot

```bash
# Setup startup script (requires sudo)
pm2 startup

# Copy output dari command di atas dan jalankan sebagai sudo
# Misal: sudo env PATH=$PATH:/home/user/.nvm/versions/node/vXX/bin pm2 startup...

# Verify
pm2 save
```

---

## Phase 4: Nginx Reverse Proxy

### 4.1 Nginx Configuration

Create `/etc/nginx/sites-available/wedding-invitation`:
```nginx
upstream wedding_app {
    server 127.0.0.1:3003;
    server 127.0.0.1:3004;
}

server {
    listen 80;
    server_name wedding.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name wedding.example.com;
    
    ssl_certificate /etc/letsencrypt/live/wedding.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wedding.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    access_log /var/log/nginx/wedding.access.log;
    error_log /var/log/nginx/wedding.error.log;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=payment:10m rate=2r/s;
    
    # Main application
    location / {
        proxy_pass http://wedding_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        limit_req zone=general burst=20 nodelay;
    }
    
    # Payment endpoints (stricter rate limit)
    location /api/midtrans/ {
        proxy_pass http://wedding_app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        limit_req zone=payment burst=5 nodelay;
    }
    
    # Static files (cache aggressively)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        proxy_pass http://wedding_app;
        expires 30d;
        add_header Cache-Control "public, immutable, max-age=2592000";
    }
}
```

### 4.2 Enable & Test Nginx

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/wedding-invitation \
  /etc/nginx/sites-enabled/

# Test syntax
sudo nginx -t

# Reload
sudo systemctl reload nginx

# Verify running
ps aux | grep nginx
```

### 4.3 Setup SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d wedding.example.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify certificate
sudo certbot renew --dry-run
```

---

## Phase 5: Database Backup Automation

### 5.1 Create Backup Script

Create `~/backup-prod-database.sh`:
```bash
#!/bin/bash

BACKUP_DIR="/home/$(whoami)/backups/wedding-invitation-prod"
DB_NAME="wedding_db_prod"
DB_USER="wedding_user"
DB_PASS="<PASSWORD_HERE>"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
echo "[$(date)] Starting backup..."
mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/wedding_$DATE.sql"

if [ $? -eq 0 ]; then
    echo "[$(date)] Backup succeeded: $BACKUP_DIR/wedding_$DATE.sql"
    
    # Compress
    gzip "$BACKUP_DIR/wedding_$DATE.sql"
    
    # Keep only last 30 days
    find "$BACKUP_DIR" -name "wedding_*.sql.gz" -mtime +30 -delete
    
    # Optional: Upload to Google Drive
    # python3 ~/gdrive_upload.py "$BACKUP_DIR/wedding_$DATE.sql.gz"
else
    echo "[$(date)] Backup FAILED!" >&2
fi
```

### 5.2 Make Executable & Test

```bash
chmod +x ~/backup-prod-database.sh

# Test
~/backup-prod-database.sh

# Check backup
ls -lh ~/backups/wedding-invitation-prod/
```

### 5.3 Add to Crontab

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM):
0 2 * * * ~/backup-prod-database.sh >> ~/logs/backup.log 2>&1

# Verify crontab
crontab -l
```

---

## Phase 6: Post-Deployment Verification

### 6.1 Health Check

```bash
# Test endpoint
curl -s https://wedding.example.com/api/health | jq

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2026-04-26T12:00:00.000Z",
#   "uptime": 1234.56,
#   "memory": {...},
#   "database": "connected"
# }
```

### 6.2 Payment Flow Test

1. Go to https://wedding.example.com
2. Create test invitation
3. Try to pay (gunakan test card)
4. Verify payment received
5. Check database updated:
   ```bash
   mysql -u wedding_user -p'<PASSWORD>' -e "\
   USE wedding_db_prod;
   SELECT * FROM payment_transactions ORDER BY created_at DESC LIMIT 5;"
   ```

### 6.3 Monitor Logs

```bash
# Real-time logs
pm2 logs wedding-invitation-prod

# Error logs only
pm2 logs wedding-invitation-prod --err

# Show last 100 lines
pm2 logs wedding-invitation-prod --lines 100
```

### 6.4 Database Integrity Check

```bash
mysql -u wedding_user -p'<PASSWORD>' << EOF
USE wedding_db_prod;

-- Check transaction count
SELECT COUNT(*) as total_transactions FROM payment_transactions;

-- Check user count
SELECT COUNT(*) as total_users FROM users;

-- Check invitation count
SELECT COUNT(*) as total_invitations FROM invitations;

-- Check for failed transactions
SELECT COUNT(*) as failed FROM payment_transactions WHERE status = 'failed';
EOF
```

---

## Monitoring & Maintenance

### Daily Tasks

```bash
# Check service health
pm2 status

# Review error logs
pm2 logs wedding-invitation-prod --err --lines 50

# Monitor resources
pm2 monit

# Verify database backups created
ls -lh ~/backups/wedding-invitation-prod/ | tail -3
```

### Weekly Tasks

- Review payment transactions
- Check disk space
- Verify SSL certificate expiration
- Test database restore procedure

### Monthly Tasks

- Review security logs
- Update dependencies (`npm audit fix`)
- Prune old backups manually
- Performance review

---

## Troubleshooting

### Service won't start
```bash
# Check logs
pm2 logs wedding-invitation-prod --err

# Check if port 3003 is in use
lsof -i :3003

# Try manual start
cd /opt/wedding-invitation
npm run build
pm2 restart wedding-invitation-prod
```

### Payment processing fails
- [ ] Verify Midtrans production keys (bukan sandbox)
- [ ] Check Midtrans webhook endpoint is accessible
- [ ] Test webhook manually from Midtrans dashboard

### High memory usage
```bash
pm2 show wedding-invitation-prod

# If > 400MB:
pm2 restart wedding-invitation-prod
```

### Database connection issues
```bash
# Test connection
mysql -u wedding_user -p'<PASSWORD>' -e "SELECT 1;" wedding_db_prod

# Check MySQL status
systemctl status mysql
```

---

## Rollback Plan

### If Something Goes Wrong

**Option 1: Quick restart**
```bash
pm2 restart wedding-invitation-prod
```

**Option 2: Rollback code**
```bash
cd /opt/wedding-invitation
git revert HEAD
npm run build
pm2 restart wedding-invitation-prod
```

**Option 3: Restore database from backup**
```bash
# List backups
ls -lh ~/backups/wedding-invitation-prod/

# Restore specific backup
mysql -u wedding_user -p'<PASSWORD>' wedding_db_prod < \
  ~/backups/wedding-invitation-prod/wedding_20260426_020000.sql.gz
```

---

## Deployment Checklist

Pre-Launch:
- [ ] `.env.production` configured dengan correct Midtrans keys
- [ ] Production database created
- [ ] Application builds successfully
- [ ] SSL certificate installed
- [ ] Nginx configured dan tested
- [ ] Health check endpoint tested

Launch Day:
- [ ] Code deployed ke production server
- [ ] PM2 processes started
- [ ] Database backup automation configured
- [ ] Logs monitoring setup
- [ ] Auto-restart on reboot configured

Post-Launch:
- [ ] All payment endpoints tested
- [ ] Database integrity verified
- [ ] Nginx reverse proxy working
- [ ] SSL certificate valid
- [ ] Backups running successfully
- [ ] Team notified of production URL
- [ ] Emergency contact person designated

---

## Important Contacts & Documentation

- **Midtrans Support:** https://support.midtrans.com
- **Let's Encrypt:** https://letsencrypt.org
- **PM2 Docs:** https://pm2.keymetrics.io/docs/
- **SvelteKit Deploy:** https://kit.svelte.dev/docs/adapter-auto

---

## Security Reminders

⚠️ **DO NOT:**
- Commit `.env.production` to Git
- Share passwords via email or chat
- Use same database for dev and prod
- Deploy without SSL/HTTPS
- Ignore error logs

✅ **DO:**
- Use strong, unique passwords
- Enable SSL/TLS
- Monitor logs regularly
- Backup database daily
- Test rollback procedure
- Keep software updated

---

Last Updated: 2026-04-26
Author: Hermes Agent Production Setup

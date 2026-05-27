# 📋 Wedding Invitation Platform - Dokumentasi Lengkap

**Platform pembuatan undangan pernikahan digital dengan sistem pembayaran otomatis**

---

## 📑 Daftar Isi

1. [Informasi Project](#informasi-project)
2. [Struktur Folder](#struktur-folder)
3. [Database Schema](#database-schema)
4. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
5. [Konfigurasi Environment](#konfigurasi-environment)
6. [API Endpoints](#api-endpoints)
7. [Midtrans Integration](#midtrans-integration)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## ℹ️ Informasi Project

| Detail | Informasi |
|--------|-----------|
| **Nama Project** | Wedding Invitation Platform |
| **Brand** | Lembar Moment |
| **Framework** | SvelteKit + Vite |
| **Language** | TypeScript |
| **Database** | MySQL 8.0 |
| **Payment Gateway** | Midtrans |
| **Server** | Node.js + PM2 |
| **Port** | 3003 |
| **URL Production** | https://nikahin.lockbit.my.id |

---

## 📁 Struktur Folder

```
wedding-invitation/
├── src/
│   ├── lib/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ToastContainer.svelte
│   │   │   └── ...
│   │   ├── server/              # Server-side logic
│   │   │   ├── db.ts            # MySQL connection
│   │   │   ├── users.ts         # User management
│   │   │   ├── invitations.ts   # Invitation CRUD
│   │   │   ├── midtrans.ts      # Payment processing
│   │   │   └── settings.ts      # App settings
│   │   ├── toast.svelte         # Toast notification store
│   │   └── utils.ts             # Helper functions
│   │
│   ├── routes/
│   │   ├── (public)/            # Public routes
│   │   │   ├── login/           # Login page
│   │   │   ├── register/        # Registration page
│   │   │   ├── invitation/[slug]/  # Public invitation view
│   │   │   └── demo/[id]/       # Template demo
│   │   │
│   │   ├── dashboard/           # User dashboard (protected)
│   │   │   ├── +layout.server.ts  # Auth check
│   │   │   ├── create/          # Create new invitation
│   │   │   ├── invitations/     # Manage invitations
│   │   │   │   ├── +page.svelte   # List invitations
│   │   │   │   └── [id]/
│   │   │   │       ├── +page.svelte   # Edit invitation
│   │   │   │       └── +page.server.ts
│   │   │   ├── billing/         # Payment & subscription
│   │   │   ├── media/           # File upload manager
│   │   │   └── guests/          # Guest management
│   │   │
│   │   ├── admin/               # Admin panel
│   │   │   ├── settings/        # App configuration
│   │   │   ├── users/           # User management
│   │   │   ├── templates/       # Template manager
│   │   │   └── invitations/     # All invitations
│   │   │
│   │   └── api/                 # API endpoints
│   │       └── midtrans/
│   │           └── notification/ # Webhook handler
│   │
│   ├── app.html                 # HTML template
│   ├── hooks.server.ts          # Global auth hooks
│   └── routes/+layout.svelte    # Root layout
│
├── static/
│   ├── uploads/                 # User uploaded files
│   ├── templates/               # Template thumbnails
│   └── favicon.png
│
├── backup/                      # Backup & documentation
│   ├── README.md                # This file
│   └── database-schema.sql      # DB schema backup
│
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── package.json                 # Dependencies
├── vite.config.ts               # Vite configuration
├── svelte.config.js             # SvelteKit config
└── tsconfig.json                # TypeScript config
```

---

## 🗄️ Database Schema

### **Database:** `wedding_db`

### **1. Table: `users`**
Menyimpan data pengguna sistem.

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(50) | Primary Key (UUID) |
| `username` | VARCHAR(50) | Unique username |
| `email` | VARCHAR(100) | Unique email |
| `password` | VARCHAR(255) | Hashed password (bcrypt) |
| `role` | ENUM('admin','user') | User role |
| `has_access` | TINYINT(1) | Premium access flag |
| `payment_status` | VARCHAR(20) | 'unpaid', 'pending', 'paid', 'inactive' |
| `invitation_limit` | INT | Max invitations (default: 1) |
| `guest_limit` | INT | Max guests (default: 50) |
| `created_at` | TIMESTAMP | Account creation date |

**Indexes:** PRIMARY KEY (id), UNIQUE (username), UNIQUE (email)

---

### **2. Table: `invitations`**
Data undangan yang dibuat pengguna.

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(50) | Primary Key (UUID) |
| `user_id` | VARCHAR(50) | Foreign Key → users.id |
| `template_id` | VARCHAR(50) | Foreign Key → templates.id |
| `slug` | VARCHAR(100) | Unique URL slug |
| `groom_name` | VARCHAR(100) | Groom short name |
| `groom_full_name` | VARCHAR(255) | Groom full name |
| `groom_parents` | TEXT | Groom parents info |
| `groom_instagram` | VARCHAR(100) | Groom IG username |
| `groom_photo` | VARCHAR(255) | Groom photo URL |
| `bride_name` | VARCHAR(100) | Bride short name |
| `bride_full_name` | VARCHAR(255) | Bride full name |
| `bride_parents` | TEXT | Bride parents info |
| `bride_instagram` | VARCHAR(100) | Bride IG username |
| `bride_photo` | VARCHAR(255) | Bride photo URL |
| `quote` | TEXT | Main quote |
| `quote_source` | VARCHAR(255) | Quote source |
| `akad_date` | DATE | Akad ceremony date |
| `akad_time` | VARCHAR(50) | Akad ceremony time |
| `resepsi_date` | DATE | Reception date |
| `resepsi_time` | VARCHAR(50) | Reception time |
| `venue_name` | VARCHAR(255) | Venue name |
| `venue_address` | TEXT | Venue address |
| `venue_map_url` | TEXT | Google Maps URL |
| `love_story` | LONGTEXT | Love story content |
| `respect_person` | VARCHAR(255) | Respect to person |
| `bank_accounts` | TEXT | JSON array of bank accounts |
| `dress_code_colors` | TEXT | JSON array of colors |
| `music_url` | TEXT | Background music URL |
| `background_image` | TEXT | Background images (newline separated) |
| `gallery_images` | TEXT | Gallery images (newline separated) |
| `is_published` | TINYINT(1) | Publication status |
| `created_at` | TIMESTAMP | Creation date |
| `updated_at` | TIMESTAMP | Last update date |

**Indexes:** PRIMARY KEY (id), UNIQUE (slug), KEY (user_id), KEY (template_id)

**Foreign Keys:**
- `user_id` → `users(id)`
- `template_id` → `templates(id)`

---

### **3. Table: `templates`**
Template desain undangan.

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(50) | Primary Key (UUID) |
| `name` | VARCHAR(100) | Template name |
| `slug` | VARCHAR(100) | Unique slug |
| `description` | TEXT | Template description |
| `thumbnail` | VARCHAR(255) | Thumbnail image URL |
| `primary_color` | VARCHAR(10) | Primary color hex |
| `secondary_color` | VARCHAR(10) | Secondary color hex |
| `accent_color` | VARCHAR(10) | Accent color hex |
| `font_family` | VARCHAR(50) | Font family name |
| `layout_style` | VARCHAR(30) | Layout type |
| `category` | VARCHAR(30) | 'wedding', 'aqiqah', 'birthday', etc. |
| `created_at` | TIMESTAMP | Creation date |

**Indexes:** PRIMARY KEY (id), UNIQUE (slug)

---

### **4. Table: `guests`**
Data tamu undangan.

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(50) | Primary Key (UUID) |
| `invitation_id` | VARCHAR(50) | Foreign Key → invitations.id |
| `name` | VARCHAR(100) | Guest name |
| `slug` | VARCHAR(100) | Unique guest slug |
| `is_attending` | TINYINT(1) | Attendance confirmation |
| `num_guests` | INT | Number of guests (default: 1) |
| `has_responded` | TINYINT(1) | RSVP responded flag |
| `created_at` | TIMESTAMP | Creation date |

**Indexes:** PRIMARY KEY (id), KEY (invitation_id)

**Foreign Keys:**
- `invitation_id` → `invitations(id)` ON DELETE CASCADE

---

### **5. Table: `wishes`**
Ucapan dari tamu.

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(50) | Primary Key (UUID) |
| `invitation_id` | VARCHAR(50) | Foreign Key → invitations.id |
| `guest_name` | VARCHAR(100) | Guest name |
| `message` | TEXT | Wish message |
| `is_attending` | VARCHAR(20) | 'hadir', 'tidak_hadir', 'ragu' |
| `created_at` | TIMESTAMP | Creation date |

**Indexes:** PRIMARY KEY (id), KEY (invitation_id)

**Foreign Keys:**
- `invitation_id` → `invitations(id)` ON DELETE CASCADE

---

### **6. Table: `settings`**
Konfigurasi aplikasi.

| Column | Type | Description |
|--------|------|-------------|
| `key` | VARCHAR(100) | Primary Key (setting key) |
| `value` | TEXT | Setting value |
| `updated_at` | TIMESTAMP | Last update date |

**Indexes:** PRIMARY KEY (key)

**Default Settings:**
```sql
INSERT INTO settings (`key`, `value`) VALUES
('app_name', 'Lembar Moment'),
('premium_price', '39000'),
('addon_guest_price', '19000'),
('addon_guest_quantity', '50'),
('default_music_url', 'https://server14.mp3quran.net/khalf/004.mp3'),
('midtrans_client_key', 'SB-Mid-client-xxx'),
('midtrans_server_key', 'SB-Mid-server-xxx'),
('midtrans_is_production', '0'),
('payment_instructions', 'Transfer DANA / GOPAY / OVO 0852-5088-7277 an. Miftahul Arif Hidayah');
```

---

## 🛠️ Teknologi yang Digunakan

### **Frontend**
- **SvelteKit** - Full-stack framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **CSS Variables** - Theming system

### **Backend**
- **Node.js** - Runtime
- **MySQL** - Database
- **Better-SQLite3** (legacy) - Local DB
- **JWT** - Authentication

### **Payment**
- **Midtrans** - Payment gateway
  - QRIS
  - E-wallet (DANA, GOPAY, OVO)
  - Bank transfer

### **Infrastructure**
- **PM2** - Process manager
- **Cloudflare Tunnel** - HTTPS & security
- **Linux (Ubuntu)** - OS

---

## ⚙️ Konfigurasi Environment

### **File: `.env`**

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=wedding_user
DB_PASSWORD=WeddingDB2024!
DB_NAME=wedding_db

# JWT & Session
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
SESSION_SECRET=your-session-secret-key-min-32-chars

# Upload
MAX_UPLOAD_SIZE=5242880
UPLOAD_DIR=./static/uploads

# CORS
CORS_ORIGIN=https://nikahin.lockbit.my.id

# App
APP_NAME=Lembar Moment
APP_URL=https://nikahin.lockbit.my.id

# Midtrans (diisi via admin/settings)
MIDTRANS_CLIENT_KEY=
MIDTRANS_SERVER_KEY=
MIDTRANS_IS_PRODUCTION=0
```

### **File: `vite.config.ts`**

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 3003,
    host: '0.0.0.0',
    allowedHosts: ['nikahin.lockbit.my.id', 'lockbit.my.id'],
    watch: {
      ignored: ['**/data/**']
    }
  }
});
```

---

## 🔌 API Endpoints

### **Public Routes**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Homepage (redirect to login) |
| GET/POST | `/login` | User login |
| GET/POST | `/register` | User registration |
| GET | `/invitation/[slug]` | Public invitation view |
| GET | `/invitation/[slug]?to=[guest]` | Invitation with guest name |
| GET | `/demo/[id]` | Template demo preview |

### **Dashboard Routes (Protected)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Dashboard home |
| GET/POST | `/dashboard/create` | Create invitation |
| GET | `/dashboard/invitations` | List invitations |
| GET/POST | `/dashboard/invitations/[id]` | Edit invitation |
| GET/POST | `/dashboard/billing` | Payment & subscription |
| GET/POST | `/dashboard/media` | File upload manager |
| POST | `/dashboard/billing/checkout` | Initiate payment |

### **Admin Routes**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/admin/settings` | App configuration |
| GET/POST | `/admin/users` | User management |
| GET/POST | `/admin/templates` | Template manager |
| GET/POST | `/admin/invitations` | All invitations |

### **API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/midtrans/notification` | Midtrans webhook |
| POST | `/api/midtrans/create-transaction` | Create payment |
| GET | `/uploads/[path]` | Serve uploaded files |

---

## 💳 Midtrans Integration

### **Webhook Configuration**

**Webhook URL:**
```
https://nikahin.lockbit.my.id/api/midtrans/notification
```

**Setup di Midtrans Dashboard:**
1. Login → Settings → Configuration
2. Payment Notification URL: isi dengan webhook URL
3. Finish Redirect URL: `https://nikahin.lockbit.my.id/dashboard/billing`

### **Order ID Format**

**New Format:**
```
PREM-{userId}-{timestamp}   // Premium package
ADDN-{userId}-{timestamp}   // Add-on guest
```

**Legacy Format:**
```
PREMIUM__{userId}__{timestamp}
ADDON__{userId}__{timestamp}
```

### **Webhook Handler Logic**

```typescript
// src/routes/api/midtrans/notification/+server.ts

POST /api/midtrans/notification
1. Verify SHA512 signature
2. Check transaction status:
   - 'capture', 'settlement', 'success' → Activate
   - 'pending' → Wait
   - 'expire', 'cancel', 'deny' → Cancel
3. Parse order ID to get user ID & type
4. Activate:
   - Premium: updateUserAccess(userId, 1, 'paid', 3)
   - Addon: addGuestLimitToUser(userId, 50)
```

### **Testing Webhook**

```bash
# Monitor webhook logs
pm2 logs wedding-invitation | grep Midtrans

# Expected output:
[Midtrans] Notification received: PREM-xxx-xxx - Status: settlement
[Midtrans] Activating Premium for User: xxx-xxx-xxx
```

---

## 🚀 Deployment

### **1. Prerequisites**

```bash
# Install Node.js 22+
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MySQL
sudo apt install -y mysql-server
```

### **2. Database Setup**

```bash
# Create database
mysql -u root -p
CREATE DATABASE wedding_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'wedding_user'@'localhost' IDENTIFIED BY 'WeddingDB2024!';
GRANT ALL PRIVILEGES ON wedding_db.* TO 'wedding_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u wedding_user -p wedding_db < backup/database-schema.sql
```

### **3. Application Setup**

```bash
# Clone/install
cd ~/wedding-invitation
npm install

# Create .env
cp .env.example .env
nano .env  # Edit dengan kredensial yang benar

# Build
npm run build
```

### **4. PM2 Configuration**

```bash
# Start application
pm2 start npm --name "wedding-invitation" -- run dev

# Auto-start on boot
pm2 startup
pm2 save

# Monitor
pm2 monit
pm2 logs wedding-invitation
```

### **5. Cloudflare Tunnel**

```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Run tunnel
cloudflared tunnel --url http://localhost:3003
```

---

## 🐛 Troubleshooting

### **1. Login Redirect Loop**

**Problem:** Login berhasil tapi redirect terus-menerus

**Solution:**
```typescript
// Cek cookie settings di hooks.server.ts
cookies.set('session', token, {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure: false  // false untuk HTTP, true untuk HTTPS
});
```

### **2. Date Off by One Day**

**Problem:** Tanggal yang disimpan mundur 1 hari

**Solution:**
```typescript
// Gunakan format lokal, bukan toISOString()
function formatForInput(dateStr: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
```

### **3. Midtrans Webhook Not Working**

**Checklist:**
- [ ] Webhook URL accessible (test dengan curl)
- [ ] Server Key benar di settings
- [ ] Signature verification pass
- [ ] Order ID format valid

**Test:**
```bash
curl -X POST https://nikahin.lockbit.my.id/api/midtrans/notification \
  -H "Content-Type: application/json" \
  -d '{"order_id":"test","status_code":"200","gross_amount":"1000"}'
```

### **4. File Upload Fails**

**Check:**
```bash
# Check upload directory permissions
ls -la static/uploads/
chmod 755 static/uploads/

# Check MAX_UPLOAD_SIZE in .env
MAX_UPLOAD_SIZE=5242880  # 5MB
```

### **5. PM2 Process Keeps Restarting**

**Debug:**
```bash
pm2 logs wedding-invitation --lines 100
pm2 describe wedding-invitation

# Check memory
pm2 monit

# Restart with clean cache
rm -rf .svelte-kit
pm2 restart wedding-invitation --update-env
```

---

## 📊 Server Monitoring

### **PM2 Commands**

```bash
# Status
pm2 status
pm2 show wedding-invitation

# Logs
pm2 logs wedding-invitation
pm2 logs wedding-invitation --lines 50

# Metrics
pm2 monit

# Restart
pm2 restart wedding-invitation --update-env

# Stop/Start
pm2 stop wedding-invitation
pm2 start wedding-invitation

# Delete
pm2 delete wedding-invitation
```

### **MySQL Monitoring**

```bash
# Status
mysqladmin -u root -p status

# Check connections
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"

# Slow queries
mysql -u root -p -e "SHOW VARIABLES LIKE 'slow_query_log%';"
```

### **Resource Usage**

```bash
# CPU & Memory
top -p $(pgrep -d',' -f 'node.*vite')

# Disk usage
df -h /

# Network
ss -tlnp | grep 3003
```

---

## 🔐 Security Notes

1. **HTTPS Only** - Gunakan Cloudflare Tunnel untuk HTTPS
2. **Cookie Security** - Set `secure: true` untuk production
3. **SQL Injection** - Gunakan parameterized queries
4. **XSS Prevention** - Svelte auto-escapes by default
5. **CSRF Protection** - SvelteKit forms have built-in CSRF
6. **Rate Limiting** - Implement untuk API endpoints
7. **File Upload** - Validate type & size

---

## 📝 Changelog

### **v1.0.0** (April 2025)
- ✅ Initial release
- ✅ SvelteKit + MySQL
- ✅ Midtrans integration
- ✅ Multi-template system
- ✅ Guest management
- ✅ RSVP & wishes
- ✅ File upload
- ✅ Admin panel
- ✅ Payment automation

---

## 👥 Contact & Support

**Developer:** Miftahul Arif Hidayah  
**Email:** support@lockbit.my.id  
**WhatsApp:** 0852-5088-7277

---

**Last Updated:** April 25, 2025  
**Version:** 1.0.0

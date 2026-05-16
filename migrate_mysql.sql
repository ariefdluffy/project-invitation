-- =====================================================
-- Database Migration for Wedding Invitation App
-- MySQL Schema - Complete Version
-- =====================================================

CREATE DATABASE IF NOT EXISTS wedding_db;
USE wedding_db;

-- =====================================================
-- 1. Users Table
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    has_access TINYINT DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    invitation_limit INT DEFAULT 1,
    guest_limit INT DEFAULT 50,
    template_quota INT DEFAULT 0,
    template_quota_used INT DEFAULT 0,
    expires_at DATETIME NULL,
    trial_ends_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_payment_status (payment_status)
);

-- =====================================================
-- 2. Sessions Table
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- =====================================================
-- 3. Templates Table
-- =====================================================
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    thumbnail VARCHAR(255),
    primary_color VARCHAR(10) DEFAULT '#D4A574',
    secondary_color VARCHAR(10) DEFAULT '#8B6F4E',
    accent_color VARCHAR(10) DEFAULT '#F5E6D3',
    font_family VARCHAR(50) DEFAULT 'Playfair Display',
    layout_style VARCHAR(30) DEFAULT 'classic',
    category VARCHAR(30) NOT NULL DEFAULT 'wedding',
    is_active TINYINT DEFAULT 1,
    is_premium TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
);

-- =====================================================
-- 4. Invitations Table
-- =====================================================
CREATE TABLE IF NOT EXISTS invitations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    template_id VARCHAR(36) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    groom_name VARCHAR(100) NOT NULL,
    groom_full_name VARCHAR(255),
    groom_parents TEXT,
    groom_instagram VARCHAR(100),
    groom_photo VARCHAR(500),
    bride_name VARCHAR(100) NOT NULL,
    bride_full_name VARCHAR(255),
    bride_parents TEXT,
    bride_instagram VARCHAR(100),
    bride_photo VARCHAR(500),
    quote TEXT,
    quote_source VARCHAR(255),
    akad_date DATE,
    akad_time VARCHAR(50),
    resepsi_date DATE,
    resepsi_time VARCHAR(50),
    venue_name VARCHAR(255),
    venue_address TEXT,
    venue_map_url TEXT,
    love_story LONGTEXT,
    bank_accounts TEXT,
    dress_code_colors TEXT,
    music_url VARCHAR(500),
    background_image VARCHAR(500),
    gallery_images LONGTEXT,
    is_published TINYINT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES templates(id),
    INDEX idx_user_id (user_id),
    INDEX idx_slug (slug),
    INDEX idx_is_published (is_published)
);

-- =====================================================
-- 5. Guests Table
-- =====================================================
CREATE TABLE IF NOT EXISTS guests (
    id VARCHAR(36) PRIMARY KEY,
    invitation_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    is_attending TINYINT DEFAULT 0,
    num_guests INT DEFAULT 1,
    has_responded TINYINT DEFAULT 0,
    rsvp_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE,
    INDEX idx_invitation_id (invitation_id),
    INDEX idx_slug (slug)
);

-- =====================================================
-- 6. Wishes Table
-- =====================================================
CREATE TABLE IF NOT EXISTS wishes (
    id VARCHAR(36) PRIMARY KEY,
    invitation_id VARCHAR(36) NOT NULL,
    guest_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_attending VARCHAR(20) DEFAULT 'hadir',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE,
    INDEX idx_invitation_id (invitation_id)
);

-- =====================================================
-- 7. Settings Table
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
    `key` VARCHAR(100) PRIMARY KEY,
    `value` TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 8. Audit Logs Table
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    user_id VARCHAR(36) NULL,
    email VARCHAR(100) NULL,
    details TEXT NULL,
    ip VARCHAR(45) NULL,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_action (action),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 9. Page Views / Analytics Table
-- =====================================================
CREATE TABLE IF NOT EXISTS page_views (
    id VARCHAR(36) PRIMARY KEY,
    invitation_id VARCHAR(36) NOT NULL,
    guest_ip VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    referrer VARCHAR(500) NULL,
    guest_name VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_invitation_id (invitation_id),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 10. Packages Table
-- =====================================================
CREATE TABLE IF NOT EXISTS packages (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    price INT NOT NULL DEFAULT 0,
    invitation_limit INT NOT NULL DEFAULT 1,
    guest_limit INT NOT NULL DEFAULT 50,
    template_quota INT NOT NULL DEFAULT 3,
    duration_days INT NULL,
    is_active TINYINT DEFAULT 1,
    sort_order INT DEFAULT 0,
    features TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active),
    INDEX idx_sort_order (sort_order)
);

-- =====================================================
-- 11. Payment Transactions Table
-- =====================================================
CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('premium', 'addon') NOT NULL,
    amount INT NOT NULL,
    status ENUM('pending', 'success', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
    midtrans_order_id VARCHAR(100) NULL,
    payment_type VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_order_id (order_id),
    INDEX idx_status (status)
);

-- =====================================================
-- 12. Promo Codes Table
-- =====================================================
CREATE TABLE IF NOT EXISTS promo_codes (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INT DEFAULT 0,
    discount_fixed INT DEFAULT 0,
    max_uses INT DEFAULT 0,
    used_count INT DEFAULT 0,
    package_id VARCHAR(36) NULL,
    expires_at DATETIME NULL,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_is_active (is_active),
    INDEX idx_expires_at (expires_at)
);

-- =====================================================
-- SEED DATA: Settings
-- =====================================================
INSERT INTO settings (`key`, `value`) VALUES ('app_name', 'Wedding.id') ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);
INSERT INTO settings (`key`, `value`) VALUES ('app_description', 'Buat undangan pernikahan digital profesional') ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);
INSERT INTO settings (`key`, `value`) VALUES ('premium_price', '149000') ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);
INSERT INTO settings (`key`, `value`) VALUES ('addon_guest_price', '25000') ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);
INSERT INTO settings (`key`, `value`) VALUES ('addon_guest_quantity', '50') ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);
INSERT INTO settings (`key`, `value`) VALUES ('template_expansion_price', '79000') ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);
INSERT INTO settings (`key`, `value`) VALUES ('template_expansion_quantity', '3') ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);
INSERT INTO settings (`key`, `value`) VALUES ('trial_days', '3') ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);
INSERT INTO settings (`key`, `value`) VALUES ('payment_instructions', 'Silakan transfer ke rekening yang tertera di halaman checkout. Pembayaran akan diverifikasi dalam 1x24 jam.') ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);

-- =====================================================
-- SEED DATA: Packages
-- =====================================================
INSERT INTO packages (id, name, slug, description, price, invitation_limit, guest_limit, template_quota, duration_days, is_active, sort_order, features) VALUES
('free', 'Gratis', 'free', 'Coba buat undangan gratis', 0, 1, 50, 3, NULL, 1, 1, '["1 undangan aktif","50 tamu per undangan","3 template tersedia","RSVP online","Ucapan tamu"]')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO packages (id, name, slug, description, price, invitation_limit, guest_limit, template_quota, duration_days, is_active, sort_order, features) VALUES
('premium', 'Premium', 'premium', 'Undangan premium tanpa batas', 149000, 3, 500, 10, NULL, 1, 2, '["3 undangan aktif","500 tamu per undangan","Semua template","RSVP online","Upload foto & galeri","Midtrans payment","Prioritas support"]')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO packages (id, name, slug, description, price, invitation_limit, guest_limit, template_quota, duration_days, is_active, sort_order, features) VALUES
('pro', 'Pro', 'pro', 'Untuk wedding organizer & bisnis', 349000, 10, 2000, 30, NULL, 1, 3, '["10 undangan aktif","2000 tamu per undangan","Semua template","RSVP online","Upload foto & galeri","Midtrans payment","Analytics tamu","Import tamu CSV","White-label"]')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- =====================================================
-- SEED DATA: Templates
-- =====================================================
INSERT INTO templates (id, name, slug, description, thumbnail, primary_color, secondary_color, accent_color, font_family, layout_style, category, is_active, is_premium) VALUES
('template-1', 'Classic Elegance', 'classic-elegance', 'Template klasik dengan sentuhan elegan untuk pernikahan tradisional', '/templates/classic-elegance.jpg', '#D4A574', '#8B6F4E', '#F5E6D3', 'Playfair Display', 'classic', 'wedding', 1, 0)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO templates (id, name, slug, description, thumbnail, primary_color, secondary_color, accent_color, font_family, layout_style, category, is_active, is_premium) VALUES
('template-2', 'Modern Minimalist', 'modern-minimalist', 'Template modern minimalis dengan desain bersih', '/templates/modern-minimalist.jpg', '#1A1A2E', '#16213E', '#E94560', 'Poppins', 'modern', 'wedding', 1, 0)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO templates (id, name, slug, description, thumbnail, primary_color, secondary_color, accent_color, font_family, layout_style, category, is_active, is_premium) VALUES
('template-3', 'Floral Paradise', 'floral-paradise', 'Template dengan motif bunga untuk pernikahan garden party', '/templates/floral-paradise.jpg', '#2D4059', '#EA5455', '#F9D56E', 'Dancing Script', 'floral', 'wedding', 1, 0)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO templates (id, name, slug, description, thumbnail, primary_color, secondary_color, accent_color, font_family, layout_style, category, is_active, is_premium) VALUES
('template-4', 'Royal Wedding', 'royal-wedding', 'Template mewah untuk pernikahan bergaya kerajaan', '/templates/royal-wedding.jpg', '#6C3483', '#BB8FCE', '#F8E7FF', 'Great Vibes', 'royal', 'wedding', 1, 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO templates (id, name, slug, description, thumbnail, primary_color, secondary_color, accent_color, font_family, layout_style, category, is_active, is_premium) VALUES
('template-5', 'Beach Romance', 'beach-romance', 'Template tropis untuk pernikahan di pantai', '/templates/beach-romance.jpg', '#00ADB5', '#393E46', '#EEEEEE', 'Satisfy', 'beach', 'wedding', 1, 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

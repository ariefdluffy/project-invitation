-- Database Migration for Wedding Invitation App
-- Convert SQLite schema to MySQL

CREATE DATABASE IF NOT EXISTS wedding_db;
USE wedding_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    has_access TINYINT DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    invitation_limit INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Templates Table
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(50) PRIMARY KEY,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Invitations Table
CREATE TABLE IF NOT EXISTS invitations (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    template_id VARCHAR(50) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    groom_name VARCHAR(100) NOT NULL,
    groom_full_name VARCHAR(255),
    groom_parents TEXT,
    groom_instagram VARCHAR(100),
    groom_photo VARCHAR(255),
    bride_name VARCHAR(100) NOT NULL,
    bride_full_name VARCHAR(255),
    bride_parents TEXT,
    bride_instagram VARCHAR(100),
    bride_photo VARCHAR(255),
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
    music_url TEXT,
    background_image TEXT,
    gallery_images TEXT,
    is_published TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (template_id) REFERENCES templates(id)
);

-- 4. Guests Table
CREATE TABLE IF NOT EXISTS guests (
    id VARCHAR(50) PRIMARY KEY,
    invitation_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    is_attending TINYINT DEFAULT 0,
    num_guests INT DEFAULT 1,
    has_responded TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
);

-- 5. Wishes Table
CREATE TABLE IF NOT EXISTS wishes (
    id VARCHAR(50) PRIMARY KEY,
    invitation_id VARCHAR(50) NOT NULL,
    guest_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_attending VARCHAR(20) DEFAULT 'hadir',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
);

-- 6. Settings Table
CREATE TABLE IF NOT EXISTS settings (
    `key` VARCHAR(100) PRIMARY KEY,
    `value` TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed Default Settings
INSERT INTO settings (`key`, `value`) VALUES ('premium_price', '149000') ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);
INSERT INTO settings (`key`, `value`) VALUES ('app_name', 'Wedding.id') ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);

-- 7. Audit Logs Table
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

-- 8. Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(100) NOT NULL,
    type ENUM('premium', 'addon') NOT NULL,
    amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_order_id (order_id)
);

-- 9. Promo Codes Table
CREATE TABLE IF NOT EXISTS promo_codes (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_amount DECIMAL(10,2) DEFAULT 0,
    max_uses INT DEFAULT 1,
    used_count INT DEFAULT 0,
    expires_at DATE NULL,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

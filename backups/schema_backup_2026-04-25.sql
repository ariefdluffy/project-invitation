-- ============================================================
-- Wedding Invitation App - Database Schema Backup
-- Generated: 2026-04-25
-- ============================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS wedding_db;
USE wedding_db;

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    has_access TINYINT DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    payment_method VARCHAR(50),
    invitation_limit INT DEFAULT 1,
    guest_limit INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- ============================================================
-- 2. TEMPLATES TABLE
-- ============================================================
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_slug (slug)
);

-- ============================================================
-- 3. INVITATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS invitations (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    template_id VARCHAR(50) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    
    -- Groom Info
    groom_name VARCHAR(100) NOT NULL,
    groom_full_name VARCHAR(255),
    groom_parents TEXT,
    groom_instagram VARCHAR(100),
    groom_photo VARCHAR(255),
    
    -- Bride Info
    bride_name VARCHAR(100) NOT NULL,
    bride_full_name VARCHAR(255),
    bride_parents TEXT,
    bride_instagram VARCHAR(100),
    bride_photo VARCHAR(255),
    
    -- Event Details
    quote TEXT,
    quote_source VARCHAR(255),
    akad_date DATE,
    akad_time VARCHAR(50),
    resepsi_date DATE,
    resepsi_time VARCHAR(50),
    
    -- Venue
    venue_name VARCHAR(255),
    venue_address TEXT,
    venue_map_url TEXT,
    
    -- Content
    love_story LONGTEXT,
    bank_accounts TEXT,
    dress_code_colors TEXT,
    
    -- Media
    music_url TEXT,
    background_image TEXT,
    gallery_images TEXT,
    
    -- Status
    is_published TINYINT DEFAULT 0,
    view_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_template_id (template_id),
    INDEX idx_slug (slug),
    INDEX idx_is_published (is_published),
    INDEX idx_created_at (created_at)
);

-- ============================================================
-- 4. GUESTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS guests (
    id VARCHAR(50) PRIMARY KEY,
    invitation_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    is_attending TINYINT DEFAULT 0,
    num_guests INT DEFAULT 1,
    has_responded TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE,
    INDEX idx_invitation_id (invitation_id),
    INDEX idx_has_responded (has_responded),
    INDEX idx_created_at (created_at)
);

-- ============================================================
-- 5. WISHES TABLE (Comments/Ucapan)
-- ============================================================
CREATE TABLE IF NOT EXISTS wishes (
    id VARCHAR(50) PRIMARY KEY,
    invitation_id VARCHAR(50) NOT NULL,
    guest_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_attending VARCHAR(20) DEFAULT 'hadir',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE,
    INDEX idx_invitation_id (invitation_id),
    INDEX idx_created_at (created_at)
);

-- ============================================================
-- 6. SETTINGS TABLE (App Configuration)
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
    `key` VARCHAR(100) PRIMARY KEY,
    `value` LONGTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (`key`)
);

-- ============================================================
-- 7. ORDERS TABLE (Payment Orders)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type VARCHAR(50),
    amount INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    order_id VARCHAR(100),
    midtrans_transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- ============================================================
-- DEFAULT SETTINGS
-- ============================================================
INSERT IGNORE INTO settings (`key`, `value`) VALUES 
('premium_price', '149000'),
('addon_guest_price', '19000'),
('addon_guest_quantity', '50'),
('app_name', 'Wedding.id'),
('default_music_url', ''),
('payment_instructions', ''),
('midtrans_server_key', ''),
('midtrans_client_key', ''),
('midtrans_is_production', '0');

-- ============================================================
-- END OF SCHEMA BACKUP
-- ============================================================

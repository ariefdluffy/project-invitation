-- Converted from JavaScript date format to MySQL datetime format
-- Original file: data-wedding.sql
-- Added SET FOREIGN_KEY_CHECKS=0 for proper import

SET FOREIGN_KEY_CHECKS=0;

-- ============================================================
-- Wedding Invitation Database Backup
-- Generated: 2026-04-25T01:29:03.559Z
-- Database: wedding_db
-- ============================================================

-- Drop and recreate database
DROP DATABASE IF EXISTS `wedding_db`;
CREATE DATABASE `wedding_db`;
USE `wedding_db`;

-- ============================================================
-- Table: guests
-- ============================================================
DROP TABLE IF EXISTS `guests`;
CREATE TABLE `guests` (
  `id` varchar(50) NOT NULL,
  `invitation_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `is_attending` tinyint(1) DEFAULT '0',
  `num_guests` int DEFAULT '1',
  `has_responded` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `invitation_id` (`invitation_id`),
  CONSTRAINT `guests_ibfk_1` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table `guests`
LOCK TABLES `guests` WRITE;
/*!40000 ALTER TABLE `guests` DISABLE KEYS */;
INSERT INTO `guests` (`id`, `invitation_id`, `name`, `slug`, `is_attending`, `num_guests`, `has_responded`, `created_at`) VALUES ('ade19747-6295-417d-880d-96c000efe949', '46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab', 'Yunus dan Istri', 'yunus-dan-istri', 1, 1, 1, '2026-04-24 23:56:57');
/*!40000 ALTER TABLE `guests` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- Table: invitations
-- ============================================================
DROP TABLE IF EXISTS `invitations`;
CREATE TABLE `invitations` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `template_id` varchar(50) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `groom_name` varchar(100) NOT NULL,
  `groom_full_name` varchar(255) DEFAULT NULL,
  `groom_parents` text,
  `groom_instagram` varchar(100) DEFAULT NULL,
  `groom_photo` varchar(255) DEFAULT NULL,
  `bride_name` varchar(100) NOT NULL,
  `bride_full_name` varchar(255) DEFAULT NULL,
  `bride_parents` text,
  `bride_instagram` varchar(100) DEFAULT NULL,
  `bride_photo` varchar(255) DEFAULT NULL,
  `quote` text,
  `quote_source` varchar(255) DEFAULT NULL,
  `akad_date` date DEFAULT NULL,
  `akad_time` varchar(50) DEFAULT NULL,
  `resepsi_date` date DEFAULT NULL,
  `resepsi_time` varchar(50) DEFAULT NULL,
  `venue_name` varchar(255) DEFAULT NULL,
  `venue_address` text,
  `venue_map_url` text,
  `love_story` longtext,
  `respect_person` varchar(255) DEFAULT NULL,
  `bank_accounts` text,
  `dress_code_colors` text,
  `music_url` text,
  `background_image` text,
  `gallery_images` text,
  `is_published` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `user_id` (`user_id`),
  KEY `template_id` (`template_id`),
  CONSTRAINT `invitations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `invitations_ibfk_2` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table `invitations`
LOCK TABLES `invitations` WRITE;
/*!40000 ALTER TABLE `invitations` DISABLE KEYS */;
INSERT INTO `invitations` (`id`, `user_id`, `template_id`, `slug`, `groom_name`, `groom_full_name`, `groom_parents`, `groom_instagram`, `groom_photo`, `bride_name`, `bride_full_name`, `bride_parents`, `bride_instagram`, `bride_photo`, `quote`, `quote_source`, `akad_date`, `akad_time`, `resepsi_date`, `resepsi_time`, `venue_name`, `venue_address`, `venue_map_url`, `love_story`, `respect_person`, `bank_accounts`, `dress_code_colors`, `music_url`, `background_image`, `gallery_images`, `is_published`, `created_at`, `updated_at`) VALUES ('46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab', '28d6f5a2-8033-474f-a185-4c64fe0c5f39', 'tmpl-earth', 'fatimah-yusuf', 'Yusuf', 'Muhammad Yusuf', 'Putra dari Bapak Ibrohim dan Ibu', '@yusuf', '/uploads/46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab-groom_photo-1777047022778.jpg', 'Fatimah', 'Siti Fatimah', 'Putri dari Bapak Muhammad dan Ibu ', '@fatimah', '/uploads/46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab-bride_photo-1777047022777.jpg', '¨Maha Suci Allah yang telah menciptakan pasangan-pasangan semuanya, baik dari apa yang ditumbuhkan oleh bumi dan dari diri mereka maupun dari apa yang tidak mereka ketahui.¨', 'Qs. Yaa Siin (36) : 36)', '2026-05-30 00:00:00', '09.00 Wita - Selesai', '2026-05-30 00:00:00', '10.00 - 15.00 Wita', 'Grand Ballroom Hotel', 'Jl. Asia 2', 'https://maps.app.goo.gl/CjYwPithi3NvE1uM8', 'Love Story', 'Keluarga Besar Bpk. Aius dan Istri
Keluarga Besar Bpk. Iskar dan Istri', '[{"bank":"Nama Bank","number":"Nomor Rekening","name":"Fatimah"}]', '["#8B6914","#FDF6E3","#ffffff"]', 'https://server14.mp3quran.net/khalf/004.mp3', '/uploads/46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab-background_image-1777046991096.jpg
http://localhost:5173/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/678633183-3861485243982574-7258817377620287722-n-1777046600962.jpg', '/uploads/46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab-gallery_images-1777046991099.jpg
http://localhost:5173/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/678633183-3861485243982574-7258817377620287722-n-1777046600962.jpg', 1, '2026-04-24 23:56:42', '2026-04-25 01:51:10');
INSERT INTO `invitations` (`id`, `user_id`, `template_id`, `slug`, `groom_name`, `groom_full_name`, `groom_parents`, `groom_instagram`, `groom_photo`, `bride_name`, `bride_full_name`, `bride_parents`, `bride_instagram`, `bride_photo`, `quote`, `quote_source`, `akad_date`, `akad_time`, `resepsi_date`, `resepsi_time`, `venue_name`, `venue_address`, `venue_map_url`, `love_story`, `respect_person`, `bank_accounts`, `dress_code_colors`, `music_url`, `background_image`, `gallery_images`, `is_published`, `created_at`, `updated_at`) VALUES ('a1c7b9ce-c15c-468d-92fd-46b7fb666b18', '28d6f5a2-8033-474f-a185-4c64fe0c5f39', 'tmpl-javanese', 'fatimah-yusuf-copy-1205', 'Yusuf', 'Muhammad Yusuf', 'Putra dari Bapak Ibrohim dan Ibu', '@yusuf', '/uploads/46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab-groom_photo-1777047022778.jpg', 'Fatimah', 'Siti Fatimah', 'Putri dari Bapak Muhammad dan Ibu ', '@fatimah', '/uploads/46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab-bride_photo-1777047022777.jpg', '¨Maha Suci Allah yang telah menciptakan pasangan-pasangan semuanya, baik dari apa yang ditumbuhkan oleh bumi dan dari diri mereka maupun dari apa yang tidak mereka ketahui.¨', 'Qs. Yaa Siin (36) : 36)', '2026-05-25 00:00:00', '09.00 Wita - Selesai', '2026-05-25 00:00:00', '10.00 - 15.00 Wita', 'Grand Ballroom Hotel', 'Jl. Asia 2', 'https://maps.app.goo.gl/CjYwPithi3NvE1uM8', 'Love Story', 'Keluarga Besar Bpk. Aius dan Istri
Keluarga Besar Bpk. Iskar dan Istri', '[{"bank":"Nama Bank","number":"Nomor Rekening","name":"Fatimah"}]', '["#8B6914","#FDF6E3","#ffffff"]', 'https://server14.mp3quran.net/khalf/004.mp3', '/uploads/46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab-background_image-1777046991096.jpg
http://localhost:5173/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/678633183-3861485243982574-7258817377620287722-n-1777046600962.jpg', '/uploads/46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab-gallery_images-1777046991099.jpg
http://localhost:5173/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/678633183-3861485243982574-7258817377620287722-n-1777046600962.jpg', 1, '2026-04-25 01:31:11', '2026-04-25 01:49:44');
/*!40000 ALTER TABLE `invitations` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- Table: settings
-- ============================================================
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `key` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table `settings`
LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` (`key`, `value`, `updated_at`) VALUES ('addon_guest_price', '19000', '2026-04-25 08:09:52');
INSERT INTO `settings` (`key`, `value`, `updated_at`) VALUES ('addon_guest_quantity', '50', '2026-04-25 08:09:52');
INSERT INTO `settings` (`key`, `value`, `updated_at`) VALUES ('app_name', 'Lembar Moment', '2026-04-25 08:09:52');
INSERT INTO `settings` (`key`, `value`, `updated_at`) VALUES ('default_music_url', 'https://server14.mp3quran.net/khalf/004.mp3', '2026-04-25 01:15:14');
INSERT INTO `settings` (`key`, `value`, `updated_at`) VALUES ('midtrans_client_key', 'SB-Mid-client-2ibZocoHhnc5Oncp', '2026-04-25 08:09:52');
INSERT INTO `settings` (`key`, `value`, `updated_at`) VALUES ('midtrans_is_production', '0', '2026-04-25 08:09:52');
INSERT INTO `settings` (`key`, `value`, `updated_at`) VALUES ('midtrans_server_key', 'SB-Mid-server-u0zbtnDby1LXDIMJEYUZoyBe', '2026-04-25 08:09:52');
INSERT INTO `settings` (`key`, `value`, `updated_at`) VALUES ('payment_instructions', 'Transfer DANA / GOPAY / OVO 0852-5088-7277 an. Miftahul Arif Hidayah', '2026-04-25 08:09:52');
INSERT INTO `settings` (`key`, `value`, `updated_at`) VALUES ('premium_price', '39000', '2026-04-25 08:09:52');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- Table: templates
-- ============================================================
DROP TABLE IF EXISTS `templates`;
CREATE TABLE `templates` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text,
  `thumbnail` varchar(255) DEFAULT NULL,
  `primary_color` varchar(10) DEFAULT '#D4A574',
  `secondary_color` varchar(10) DEFAULT '#8B6F4E',
  `accent_color` varchar(10) DEFAULT '#F5E6D3',
  `font_family` varchar(50) DEFAULT 'Playfair Display',
  `layout_style` varchar(30) DEFAULT 'classic',
  `category` varchar(30) NOT NULL DEFAULT 'wedding',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table `templates`
LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-anniversary-velvet', 'Anniversary Velvet', 'anniversary-velvet', 'Merah burgundy dan emas lembut — elegan untuk resepsi ulang tahun pernikahan atau milestone bersama pasangan.', 'https://images.unsplash.com/photo-1529636799528-941f294af16f?auto=format&fit=crop&w=600&q=80', '#7f1d1d', '#d4a574', '#fef2f2', 'Playfair Display', 'classic', 'anniversary', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-aqiqah-soft', 'Aqiqah Blush', 'aqiqah-blush', 'Lembut dengan krem dan blush pink, nuansa menggemaskan untuk aqiqah dan selamatan kelahiran.', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80', '#9d174d', '#fbcfe8', '#fff1f2', 'Cormorant Garamond', 'romantic', 'aqiqah', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-birthday-pop', 'Birthday Confetti', 'birthday-confetti', 'Warna-warni ceria dan kontras tegas — cocok untuk pesta ulang tahun anak maupun dewasa.', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80', '#7c3aed', '#f472b6', '#faf5ff', 'Outfit', 'modern', 'birthday', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-celestial', 'Celestial Night', 'celestial-night', 'Terinspirasi dari keindahan langit malam berbintang. Perpaduan warna navy tua dan silver yang magis.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', '#0f172a', '#94a3b8', '#f8fafc', 'Cinzel Decorative', 'celestial', 'wedding', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-classic', 'Classic Elegance', 'classic-elegance', 'Desain abadi dengan perpaduan warna putih murni dan emas metalik. Memberikan kesan bersih, mewah, dan sangat profesional.', 'https://images.unsplash.com/photo-1519225495810-751bd131c90d?auto=format&fit=crop&w=600&q=80', '#ffffff', '#d4af37', '#2c2c2c', 'Playfair Display', 'classic', 'wedding', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-corporate-summit', 'Summit Corporate', 'summit-corporate', 'Bersih dan profesional dengan slate dan biru — untuk seminar, launching, atau undangan formal perusahaan.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80', '#1e293b', '#38bdf8', '#f8fafc', 'Montserrat', 'modern', 'corporate', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-earth', 'Minimalist Earth', 'minimalist-earth', 'Tema warna bumi (terracotta & sage) yang menenangkan, memberikan kesan hangat, organik, dan estetik.', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80', '#7c6a53', '#a3b18a', '#fefae0', 'Lora', 'minimalist', 'general', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-garden', 'Garden Romance', 'garden-romance', 'Template romantis dengan tema taman bunga, warna pastel lembut, dan ilustrasi floral watercolor.', 'https://images.unsplash.com/photo-1522673607200-164883eeca48?auto=format&fit=crop&w=600&q=80', '#8B4D6E', '#D4849B', '#FFF0F5', 'Great Vibes', 'romantic', 'wedding', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-gathering-bistro', 'Gathering Bistro', 'gathering-bistro', 'Hangat seperti kafe: terracotta dan krem. Cocok untuk arisan, reunion keluarga, atau bukber.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', '#9a3412', '#fdba74', '#fff7ed', 'Lora', 'vintage', 'gathering', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-javanese', 'Javanese Elegance', 'javanese-elegance', 'Template elegan dengan nuansa budaya Jawa yang indah, ornamen batik, dan warna emas klasik.', 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=600&q=80', '#8B6914', '#D4A574', '#FDF6E3', 'Playfair Display', 'classic', 'wedding', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-khitan-joy', 'Joyful Sunatan', 'joyful-sunatan', 'Ceria dan hangat dengan hijau segar dan aksen emas — pas untuk undangan khitan, tasyakuran, atau syukuran anak.', 'https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=600&q=80', '#166534', '#facc15', '#f0fdf4', 'Montserrat', 'modern', 'khitan', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-luxury', 'Luxury Emerald', 'luxury-emerald', 'Kombinasi berkelas antara hijau zamrud tua dan emas murni. Memberikan aura kemewahan yang mendalam.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80', '#064e3b', '#fbbf24', '#ffffff', 'Cormorant Garamond', 'luxury', 'wedding', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-modern', 'Modern Minimalist', 'modern-minimalist', 'Template modern dan minimalis dengan desain bersih, tipografi bold, dan animasi smooth.', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80', '#2C3E50', '#E67E22', '#ECF0F1', 'Montserrat', 'modern', 'general', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-romantic', 'Soft Lavender', 'soft-lavender', 'Lembut dan puitis dengan gradasi warna lavender dan putih. Memberikan kesan damai dan penuh cinta.', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80', '#7e22ce', '#e9d5ff', '#faf5ff', 'Alex Brush', 'romantic', 'wedding', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-royal', 'Royal Midnight', 'royal-midnight', 'Perpaduan mewah warna biru tengah malam dan emas champagne, menciptakan kesan agung dan eksklusif.', 'https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=600&q=80', '#1a1a2e', '#c0a080', '#ffffff', 'Cinzel', 'royal', 'wedding', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-tropical', 'Tropical Breeze', 'tropical-breeze', 'Segar dan ceria dengan palet warna hijau botani dan teal. Sempurna untuk pernikahan tema pantai atau musim panas.', 'https://images.unsplash.com/photo-1512100356132-d39918387e94?auto=format&fit=crop&w=600&q=80', '#065f46', '#2dd4bf', '#f0fdfa', 'Outfit', 'tropical', 'wedding', '2026-04-25 09:03:15');
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES ('tmpl-vintage', 'Vintage Rustic', 'vintage-rustic', 'Nuansa hangat kayu dan kertas kraft dengan sentuhan retro. Cocok untuk pernikahan tema outdoor atau barn wedding.', 'https://images.unsplash.com/photo-1458007683879-47560d7e33c3?auto=format&fit=crop&w=600&q=80', '#5d4037', '#d7ccc8', '#8d6e63', 'Special Elite', 'vintage', 'wedding', '2026-04-25 09:03:15');
/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- Table: users
-- ============================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `has_access` tinyint(1) DEFAULT '0',
  `payment_status` varchar(20) DEFAULT 'unpaid',
  `invitation_limit` int DEFAULT '1',
  `guest_limit` int DEFAULT '50',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table `users`
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `has_access`, `payment_status`, `invitation_limit`, `guest_limit`, `created_at`) VALUES ('28d6f5a2-8033-474f-a185-4c64fe0c5f39', 'arieftheluffy', 'arieftheluffy@gmail.com', '$2b$10$/MkqZVKJoFWupaxKcapLJOOod9H/KI4wfIWPhL6cvvSnnE3r57DKu', 'user', 1, 'paid', 2, 50, '2026-04-24 23:36:26');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `has_access`, `payment_status`, `invitation_limit`, `guest_limit`, `created_at`) VALUES ('f12516fe-e017-4464-9fef-9fc98082e732', 'miftahul', 'miftahularifhidayah@gmail.com', '$2b$10$2SZpRAuf.nLnzXvaqYEMReZQZxE81C.6liMQvrzGI3fBGTjP2ei36', 'user', 0, 'inactive', 1, 50, '2026-04-25 09:07:26');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `has_access`, `payment_status`, `invitation_limit`, `guest_limit`, `created_at`) VALUES ('f424c366-3ec8-4ef6-aac8-4b28bb6f2e3e', 'admin', 'admin@wedding.com', '$2b$10$pP7FaTvuJ2XcLKdb.dAuEe2vXD35xvElUOSqrzyyNvbzUdfnqrAF2', 'admin', 1, 'paid', 1, 50, '2026-04-24 23:30:34');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- Table: wishes
-- ============================================================
DROP TABLE IF EXISTS `wishes`;
CREATE TABLE `wishes` (
  `id` varchar(50) NOT NULL,
  `invitation_id` varchar(50) NOT NULL,
  `guest_name` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `is_attending` varchar(20) DEFAULT 'hadir',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `invitation_id` (`invitation_id`),
  CONSTRAINT `wishes_ibfk_1` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table `wishes`
LOCK TABLES `wishes` WRITE;
/*!40000 ALTER TABLE `wishes` DISABLE KEYS */;
INSERT INTO `wishes` (`id`, `invitation_id`, `guest_name`, `message`, `is_attending`, `created_at`) VALUES ('7eebd322-dea6-44bc-9300-520ec9b6c49b', '46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab', 'Yunus dan Istri', 'selamat ya', 'hadir', '2026-04-25 00:44:19');
/*!40000 ALTER TABLE `wishes` ENABLE KEYS */;
UNLOCK TABLES;


SET FOREIGN_KEY_CHECKS=1;

-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for wedding_db
DROP DATABASE IF EXISTS `wedding_db`;
CREATE DATABASE IF NOT EXISTS `wedding_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `wedding_db`;

-- Dumping structure for table wedding_db.audit_logs
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` varchar(36) NOT NULL,
  `action` varchar(50) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `details` text,
  `ip` varchar(45) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_action` (`action`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table wedding_db.audit_logs: ~7 rows (approximately)
DELETE FROM `audit_logs`;
INSERT INTO `audit_logs` (`id`, `action`, `user_id`, `email`, `details`, `ip`, `metadata`, `created_at`) VALUES
	('45a9266e-4e0e-4094-9f76-7b4221945a90', 'admin.settings_update', 'f424c366-3ec8-4ef6-aac8-4b28bb6f2e3e', NULL, 'Created promo code: PROMOTHREADS', NULL, NULL, '2026-05-16 15:06:08'),
	('6b4fc87b-f09e-4853-9575-0b7c94ce4046', 'user.login', '28d6f5a2-8033-474f-a185-4c64fe0c5f39', 'arieftheluffy@gmail.com', NULL, '127.0.0.1', NULL, '2026-05-16 16:19:55'),
	('75a4f244-a821-4020-8c36-1078bc44df39', 'user.login', 'f424c366-3ec8-4ef6-aac8-4b28bb6f2e3e', 'admin@wedding.com', NULL, '127.0.0.1', NULL, '2026-05-16 17:28:26'),
	('92ccac25-b818-42e1-afda-118d9e726a21', 'user.logout', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', NULL, NULL, NULL, NULL, '2026-05-16 16:19:45'),
	('9b88e06e-4117-41ee-a3f9-59ffc59d7e3f', 'user.logout', 'f424c366-3ec8-4ef6-aac8-4b28bb6f2e3e', NULL, NULL, NULL, NULL, '2026-05-16 16:53:04'),
	('ca3cbb73-5b6d-44f8-9f24-ddfe13bee890', 'user.login', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'pkt.miftahul@gmail.com', NULL, '127.0.0.1', NULL, '2026-05-16 15:34:55'),
	('cbaa2274-164d-471e-b8a6-894a82d4c609', 'user.login', 'f424c366-3ec8-4ef6-aac8-4b28bb6f2e3e', 'admin@wedding.com', NULL, '127.0.0.1', NULL, '2026-05-16 15:05:36');

-- Dumping structure for table wedding_db.guests
DROP TABLE IF EXISTS `guests`;
CREATE TABLE IF NOT EXISTS `guests` (
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

-- Dumping data for table wedding_db.guests: ~3 rows (approximately)
DELETE FROM `guests`;
INSERT INTO `guests` (`id`, `invitation_id`, `name`, `slug`, `is_attending`, `num_guests`, `has_responded`, `created_at`) VALUES
	('1babfa90-a694-4bfb-8548-b1b6c21fe056', '33e01e0f-a672-4dc4-bc90-c53363b52723', 'Taufik Rahman dan Istri', 'taufik-rahman-dan-istri', 1, 1, 1, '2026-04-25 02:36:40'),
	('3139ac0f-377d-43b9-80e0-3e1e139079b5', '33e01e0f-a672-4dc4-bc90-c53363b52723', 'Udin dan Istri', 'udin-dan-istri', 0, 1, 0, '2026-04-25 07:02:24'),
	('67e9f43f-b9de-4ec5-a01a-f1c07caf3136', '33e01e0f-a672-4dc4-bc90-c53363b52723', 'Yusuf dan Istri', 'yusuf-dan-istri', 1, 1, 1, '2026-04-25 05:09:41');

-- Dumping structure for table wedding_db.invitations
DROP TABLE IF EXISTS `invitations`;
CREATE TABLE IF NOT EXISTS `invitations` (
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
  `custom_content` json DEFAULT NULL,
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

-- Dumping data for table wedding_db.invitations: ~2 rows (approximately)
DELETE FROM `invitations`;
INSERT INTO `invitations` (`id`, `user_id`, `template_id`, `slug`, `groom_name`, `groom_full_name`, `groom_parents`, `groom_instagram`, `groom_photo`, `bride_name`, `bride_full_name`, `bride_parents`, `bride_instagram`, `bride_photo`, `quote`, `quote_source`, `akad_date`, `akad_time`, `resepsi_date`, `resepsi_time`, `venue_name`, `venue_address`, `venue_map_url`, `love_story`, `respect_person`, `bank_accounts`, `dress_code_colors`, `music_url`, `background_image`, `gallery_images`, `custom_content`, `is_published`, `created_at`, `updated_at`) VALUES
	('33e01e0f-a672-4dc4-bc90-c53363b52723', '28d6f5a2-8033-474f-a185-4c64fe0c5f39', 'tmpl-javanese', 'icha-yusni', 'Yusni', 'Ns. Ahmad Yusni. S.Kep', 'Putra Ketiga dari Bapak Arsil. S.Pd & (Almh) Ibu Siti Jureidah / Ibu Maridah', '@yusuf', '/uploads/33e01e0f-a672-4dc4-bc90-c53363b52723-groom_photo-1777085679985.jpeg', 'Icha', 'Siti Khairunnisa', 'Putri Keempat Dari Bapak (Alm) M.Yunus Satta & Ibu Hj. Ermawati', '@fatimah', '/uploads/33e01e0f-a672-4dc4-bc90-c53363b52723-bride_photo-1777085679984.jpeg', '“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”', 'Ar-Rum: 21', '2026-05-31', NULL, '2026-05-31', NULL, 'Rumah Sopian', 'Jln. Gunung Belah Gg. Arsapati 5', 'https://maps.app.goo.gl/gWxeFTmTHvtN8xQR8', '"Dua jiwa, dua cerita, kini menyatu dalam satu doa. Allah mempertemukan kami bukan tanpa alasan, melainkan untuk saling melengkapi dan menyempurnakan ibadah. Dengan bismillah, kami melangkah menuju babak baru untuk membangun istana cinta yang sakinah, mawaddah, dan warahmah."', 'Bapak (Alm) M.Yunus Satta & Ibu Hj. Ermawati\r\nBapak Arsil. S.Pd & (Almh) Ibu Siti Jureidah / Ibu Maridah', '[{"bank":"Nama Bank","number":"Nomo Rekening","name":"Siti Khairunnisa"}]', '["#8b6914","#d4a574","#fdf6e3"]', 'https://server14.mp3quran.net/khalf/004.mp3', 'http://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08-1777084840272.jpeg\r\nhttp://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--2--1777084830439.jpeg', 'http://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--1--1777084811542.jpeg\r\nhttp://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-09-1777084818384.jpeg\r\nhttp://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--2--1777084830439.jpeg\r\nhttp://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-07-1777084801661.jpeg\r\nhttp://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08-1777084840272.jpeg', '{"title": "", "heading": "", "invitation_text": ""}', 1, '2026-04-25 02:36:17', '2026-05-04 00:47:20'),
	('3e9d10ad-6b5f-451c-a791-deae75955d2d', '28d6f5a2-8033-474f-a185-4c64fe0c5f39', 'tmpl-tema-31-inspired', 'icha-yusni-copy-7370', 'Yusni', 'Ns. Ahmad Yusni. S.Kep', 'Putra Ketiga dari Bapak Arsil. S.Pd & (Almh) Ibu Siti Jureidah / Ibu Maridah', '@yusuf', '/uploads/33e01e0f-a672-4dc4-bc90-c53363b52723-groom_photo-1777085679985.jpeg', 'Icha', 'Siti Khairunnisa', 'Putri Keempat Dari Bapak (Alm) M.Yunus Satta & Ibu Hj. Ermawati', '@fatimah', '/uploads/33e01e0f-a672-4dc4-bc90-c53363b52723-bride_photo-1777085679984.jpeg', '“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”', 'Ar-Rum: 21', '2026-05-31', '07:01', '2026-05-31', '11:01', 'Rumah Sopian', 'Jln. Gunung Belah Gg. Arsapati 5\r\n', 'https://maps.app.goo.gl/gWxeFTmTHvtN8xQR8', '"Dua jiwa, dua cerita, kini menyatu dalam satu doa. Allah mempertemukan kami bukan tanpa alasan, melainkan untuk saling melengkapi dan menyempurnakan ibadah. Dengan bismillah, kami melangkah menuju babak baru untuk membangun istana cinta yang sakinah, mawaddah, dan warahmah."', 'Bapak (Alm) M.Yunus Satta & Ibu Hj. Ermawati\r\nBapak Arsil. S.Pd & (Almh) Ibu Siti Jureidah / Ibu Maridah', '[{"bank":"Nama Bank","number":"Nomo Rekening","name":"Siti Khairunnisa"}]', '["#8b6914","#d4a574","#fdf6e3"]', 'https://server14.mp3quran.net/khalf/004.mp3', 'http://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-09-1777084818384.jpeg\r\nhttp://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-07-1777084801661.jpeg\r\nhttp://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--2--1777084830439.jpeg', 'http://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08-1777084840272.jpeg\r\nhttp://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--2--1777084830439.jpeg\r\nhttp://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-07-1777084801661.jpeg\r\nhttp://localhost:3003/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-09-1777084818384.jpeg', NULL, 1, '2026-05-03 02:02:07', '2026-05-03 05:38:26');

-- Dumping structure for table wedding_db.packages
DROP TABLE IF EXISTS `packages`;
CREATE TABLE IF NOT EXISTS `packages` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `description` text,
  `price` int NOT NULL DEFAULT '0',
  `invitation_limit` int NOT NULL DEFAULT '1',
  `guest_limit` int NOT NULL DEFAULT '50',
  `template_quota` int NOT NULL DEFAULT '3',
  `duration_days` int DEFAULT NULL,
  `is_active` tinyint DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `features` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table wedding_db.packages: ~3 rows (approximately)
DELETE FROM `packages`;
INSERT INTO `packages` (`id`, `name`, `slug`, `description`, `price`, `invitation_limit`, `guest_limit`, `template_quota`, `duration_days`, `is_active`, `sort_order`, `features`, `created_at`) VALUES
	('free', 'Gratis', 'free', 'Coba buat undangan gratis', 0, 1, 50, 3, NULL, 1, 1, '["1 undangan aktif","50 tamu per undangan","3 template tersedia","RSVP online","Ucapan tamu"]', '2026-05-16 14:50:42'),
	('premium', 'Premium', 'premium', 'Undangan premium tanpa batas', 39000, 3, 500, 10, NULL, 1, 2, '["3 undangan aktif","500 tamu per undangan","Semua template","RSVP online","Upload foto & galeri","Midtrans payment","Prioritas support"]', '2026-05-16 14:50:42'),
	('pro', 'Pro', 'pro', 'Untuk wedding organizer & bisnis', 349000, 10, 2000, 30, NULL, 1, 3, '["10 undangan aktif","2000 tamu per undangan","Semua template","RSVP online","Upload foto & galeri","Midtrans payment","Analytics tamu","Import tamu CSV","White-label"]', '2026-05-16 14:50:42');

-- Dumping structure for table wedding_db.page_views
DROP TABLE IF EXISTS `page_views`;
CREATE TABLE IF NOT EXISTS `page_views` (
  `id` varchar(36) NOT NULL,
  `invitation_id` varchar(36) NOT NULL,
  `guest_ip` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `referrer` varchar(500) DEFAULT NULL,
  `guest_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_invitation_id` (`invitation_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `page_views_ibfk_1` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table wedding_db.page_views: ~0 rows (approximately)
DELETE FROM `page_views`;

-- Dumping structure for table wedding_db.payment_transactions
DROP TABLE IF EXISTS `payment_transactions`;
CREATE TABLE IF NOT EXISTS `payment_transactions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `type` enum('premium','addon') NOT NULL,
  `amount` int NOT NULL,
  `status` enum('pending','success','failed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `payment_transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table wedding_db.payment_transactions: ~22 rows (approximately)
DELETE FROM `payment_transactions`;
INSERT INTO `payment_transactions` (`id`, `user_id`, `order_id`, `type`, `amount`, `status`, `created_at`, `updated_at`) VALUES
	('06486dbf-148d-4de7-8f07-0a0cc14c6c8d', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_862c75', 'premium', 39000, 'pending', '2026-04-25 22:42:10', '2026-04-25 22:42:10'),
	('15d98a57-fa79-4ac4-a3f5-a3c037fcc268', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_7ffac8', 'premium', 39000, 'pending', '2026-05-16 07:55:31', '2026-05-16 07:55:31'),
	('1a15a9a3-ed6c-490e-bdd5-ceb7f1c23c66', '28d6f5a2-8033-474f-a185-4c64fe0c5f39', 'A_28d6f5a28033_970265', 'addon', 19000, 'pending', '2026-05-16 08:20:41', '2026-05-16 08:20:41'),
	('1e6e64ff-f716-41e0-9037-396e7169a001', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_7a6e63', 'premium', 149000, 'pending', '2026-05-16 07:49:28', '2026-05-16 07:49:28'),
	('224edc9f-ba2c-48fd-a5be-d9011e9ed1f6', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_83ea1d', 'premium', 39000, 'pending', '2026-05-16 07:59:49', '2026-05-16 07:59:49'),
	('25dcea2e-9834-4463-97eb-9273ee709f61', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_8ab67a', 'premium', 0, 'pending', '2026-05-16 08:07:14', '2026-05-16 08:07:14'),
	('2c13915c-cf56-4fb7-838a-89890e2e2bac', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_868232', 'premium', 39000, 'success', '2026-04-25 22:42:32', '2026-04-25 22:43:00'),
	('2f782133-9d39-485d-9e00-f357974a1df4', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_856971', 'premium', 39000, 'pending', '2026-05-16 08:01:28', '2026-05-16 08:01:28'),
	('39005afa-ef73-435a-805c-a0955d2fc7fb', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_7cff7d', 'premium', 39000, 'pending', '2026-05-16 07:52:16', '2026-05-16 07:52:16'),
	('438bb77b-e3cb-4923-b1bf-5017dec45974', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_7878c1', 'premium', 149000, 'pending', '2026-05-16 07:47:19', '2026-05-16 07:47:19'),
	('451bd385-22a0-45b1-a31b-4b005a6672a2', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_8aa9d4', 'premium', 39000, 'pending', '2026-05-16 08:07:12', '2026-05-16 08:07:12'),
	('4ec76e6d-d030-494e-b620-d91000ba168f', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_7f114a', 'premium', 39000, 'pending', '2026-05-16 07:54:32', '2026-05-16 07:54:32'),
	('577a0071-0e9e-4d5e-818e-62b993eb5b51', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_82eb54', 'premium', 39000, 'pending', '2026-05-16 07:58:44', '2026-05-16 07:58:44'),
	('6acccc8c-5e24-4f9f-a2c3-f9fd527bbb3b', 'f12516fe-e017-4464-9fef-9fc98082e732', 'P_f12516fee017_eb634d', 'premium', 39000, 'pending', '2026-04-25 19:53:06', '2026-04-25 19:53:06'),
	('73092534-a75c-4d80-bc23-9643c52f82ff', 'f424c366-3ec8-4ef6-aac8-4b28bb6f2e3e', 'P_afb588f79780_eaf344', 'premium', 99000, 'pending', '2026-04-25 19:52:37', '2026-04-25 19:52:37'),
	('7cab7909-c4c8-4cde-85fb-08fa10a41f07', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_796aae', 'premium', 149000, 'pending', '2026-05-16 07:48:21', '2026-05-16 07:48:21'),
	('84ca1f09-b3db-4f3a-a463-3c85d337df04', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_7a0419', 'premium', 149000, 'pending', '2026-05-16 07:49:01', '2026-05-16 07:49:01'),
	('a3fdf034-0ea4-44fd-9245-c3ecd2e634b2', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'A_fd14f3e947a5_80bcf8', 'addon', 19000, 'pending', '2026-05-16 07:56:21', '2026-05-16 07:56:21'),
	('c458c306-4358-4bfb-a764-f2ec0a8633f0', 'f12516fe-e017-4464-9fef-9fc98082e732', 'A_f12516fee017_ec868e', 'addon', 19000, 'pending', '2026-04-25 19:54:20', '2026-04-25 19:54:20'),
	('e9b1a66f-c2be-413f-b33a-4a8339b30c2f', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_8a7fdd', 'premium', 39000, 'pending', '2026-05-16 08:07:01', '2026-05-16 08:07:01'),
	('ed1a95af-1e2b-4696-8016-28f4ddf84d47', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_960d90', 'premium', 39000, 'pending', '2026-05-16 08:19:38', '2026-05-16 08:19:38'),
	('f46c4273-abbf-4f4b-9855-a969cafa92c5', 'fd14f3e9-47a5-4a99-b147-0435afe7104c', 'P_fd14f3e947a5_829a08', 'premium', 39000, 'pending', '2026-05-16 07:58:23', '2026-05-16 07:58:23');

-- Dumping structure for table wedding_db.promo_codes
DROP TABLE IF EXISTS `promo_codes`;
CREATE TABLE IF NOT EXISTS `promo_codes` (
  `id` varchar(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_percent` int DEFAULT '0',
  `discount_fixed` int DEFAULT '0',
  `max_uses` int DEFAULT '0',
  `used_count` int DEFAULT '0',
  `package_id` varchar(36) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table wedding_db.promo_codes: ~1 rows (approximately)
DELETE FROM `promo_codes`;
INSERT INTO `promo_codes` (`id`, `code`, `discount_percent`, `discount_fixed`, `max_uses`, `used_count`, `package_id`, `expires_at`, `is_active`, `created_at`) VALUES
	('aa8b646d-47dc-4014-85ac-06ac5a4d09b8', 'PROMOTHREADS', 100, 0, 50, 0, NULL, '2026-06-22 00:00:00', 1, '2026-05-16 15:06:08');

-- Dumping structure for table wedding_db.settings
DROP TABLE IF EXISTS `settings`;
CREATE TABLE IF NOT EXISTS `settings` (
  `key` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table wedding_db.settings: ~11 rows (approximately)
DELETE FROM `settings`;
INSERT INTO `settings` (`key`, `value`, `updated_at`) VALUES
	('addon_guest_price', '19000', '2026-05-16 15:48:43'),
	('addon_guest_quantity', '50', '2026-05-16 15:48:43'),
	('app_name', 'Lembar Moment', '2026-05-16 15:48:43'),
	('default_music_url', 'https://server14.mp3quran.net/khalf/004.mp3', '2026-05-16 15:48:43'),
	('midtrans_client_key', 'SB-Mid-client-2ibZocoHhnc5Oncp', '2026-05-16 15:48:43'),
	('midtrans_is_production', '0', '2026-05-16 15:48:43'),
	('midtrans_server_key', 'SB-Mid-server-u0zbtnDby1LXDIMJEYUZoyBe', '2026-05-16 15:48:43'),
	('payment_instructions', 'Transfer DANA / GOPAY / OVO 0852-5088-7277 an. Miftahul Arif Hidayah', '2026-05-16 15:48:43'),
	('premium_price', '39000', '2026-05-16 15:48:43'),
	('template_expansion_price', '29000', '2026-05-16 15:48:43'),
	('template_expansion_quantity', '5', '2026-05-16 15:48:43'),
	('turnstile_site_key', '1x00000000000000000000AA', '2026-05-16 22:57:52');

-- Dumping structure for table wedding_db.templates
DROP TABLE IF EXISTS `templates`;
CREATE TABLE IF NOT EXISTS `templates` (
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

-- Dumping data for table wedding_db.templates: ~13 rows (approximately)
DELETE FROM `templates`;
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `thumbnail`, `primary_color`, `secondary_color`, `accent_color`, `font_family`, `layout_style`, `category`, `created_at`) VALUES
	('modern-minimalist', 'Modern Minimalist', 'modern-minimalist', 'Desain modern dan minimalis dengan layout kartu yang unik, avatar bulat, dan animasi fade-in yang halus.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', '#6366F1', '#EC4899', '#F8FAFC', 'Playfair Display', 'modern', 'pernikahan', '2026-05-16 22:57:52'),
	('tmpl-3d-motion-wedding', '3D Motion Wedding', 'tmpl-3d-motion-wedding', 'Futuristic 3D motion look with neon depth, glass cards, and kinetic highlights for a modern wedding vibe.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80', '#0ea5e9', '#22c55e', '#020617', 'Space Grotesk', 'modern', 'pernikahan', '2026-05-16 22:57:52'),
	('tmpl-anniversary-velvet', 'Anniversary Velvet', 'tmpl-anniversary-velvet', 'Merah burgundy dan emas lembut — elegan untuk resepsi ulang tahun pernikahan atau milestone bersama pasangan.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', '#7f1d1d', '#d4a574', '#fef2f2', 'Playfair Display', 'classic', 'pernikahan', '2026-05-16 22:57:52'),
	('tmpl-aqiqah-blue', 'Baby Blue Aqiqah', 'tmpl-aqiqah-blue', 'Desain yang lembut dan ceria untuk perayaan aqiqah putra atau putri Anda.', 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=600&q=80', '#1e40af', '#bfdbfe', '#eff6ff', 'Playfair Display', 'classic', 'aqiqah', '2026-05-16 22:57:52'),
	('tmpl-aqiqah-soft', 'Aqiqah Blush', 'tmpl-aqiqah-soft', 'Lembut dengan krem dan blush pink, nuansa menggemaskan untuk aqiqah dan selamatan kelahiran.', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80', '#9d174d', '#fbcfe8', '#fff1f2', 'Playfair Display', 'classic', 'aqiqah', '2026-05-16 22:57:52'),
	('tmpl-arisan-keluarga', 'Arisan Keluarga', 'tmpl-arisan-keluarga', 'Template santai dan hangat untuk acara kumpul keluarga atau arisan.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', '#78350f', '#fde68a', '#fefce8', 'Playfair Display', 'classic', 'gathering', '2026-05-16 22:57:52'),
	('tmpl-birthday-pop', 'Birthday Confetti', 'tmpl-birthday-pop', 'Warna-warni ceria dan kontras tegas — cocok untuk pesta ulang tahun anak maupun dewasa.', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80', '#7c3aed', '#f472b6', '#faf5ff', 'Playfair Display', 'classic', 'birthday', '2026-05-16 22:57:52'),
	('tmpl-corporate-summit', 'Summit Corporate', 'tmpl-corporate-summit', 'Bersih dan profesional dengan slate dan biru — untuk seminar, launching, atau undangan formal perusahaan.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80', '#1e293b', '#38bdf8', '#f8fafc', 'Playfair Display', 'classic', 'formal', '2026-05-16 22:57:52'),
	('tmpl-gathering-bistro', 'Gathering Bistro', 'tmpl-gathering-bistro', 'Hangat seperti kafe: terracotta dan krem. Cocok untuk arisan, reunion keluarga, atau bukber.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', '#9a3412', '#fdba74', '#fff7ed', 'Playfair Display', 'classic', 'gathering', '2026-05-16 22:57:52'),
	('tmpl-javanese', 'Javanese Elegance', 'tmpl-javanese', 'Template elegan dengan nuansa budaya Jawa yang indah, ornamen batik, dan warna emas klasik.', 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=600&q=80', '#D4A574', '#8B6F4E', '#F5E6D3', 'Playfair Display', 'classic', 'pernikahan', '2026-05-16 22:57:52'),
	('tmpl-khitan-joy', 'Joyful Sunatan', 'tmpl-khitan-joy', 'Ceria dan hangat dengan hijau segar dan aksen emas — pas untuk undangan khitan, tasyakuran, atau syukuran anak.', 'https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=600&q=80', '#166534', '#facc15', '#f0fdf4', 'Playfair Display', 'classic', 'khitan', '2026-05-16 22:57:52'),
	('tmpl-royal', 'Royal Midnight', 'tmpl-royal', 'Perpaduan mewah warna biru tengah malam dan emas champagne, menciptakan kesan agung dan eksklusif.', 'https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=600&q=80', '#0f172a', '#c0a080', '#ffffff', 'Cinzel', 'classic', 'pernikahan', '2026-05-16 22:57:52'),
	('tmpl-tema-31-inspired', 'Tema 31 Inspired', 'tmpl-tema-31-inspired', 'Romantic photo-centric layout with soft glass cards, floating ornaments, and cinematic typography for a modern classic wedding.', 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=600&q=80', '#d4a574', '#1f2937', '#fdf7ef', 'Cormorant Garamond', 'romantic', 'pernikahan', '2026-05-16 22:57:52');

-- Dumping structure for table wedding_db.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
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
  `template_quota` int DEFAULT '3',
  `template_quota_used` int DEFAULT '0',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `trial_ends_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table wedding_db.users: ~5 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `has_access`, `payment_status`, `invitation_limit`, `guest_limit`, `created_at`, `template_quota`, `template_quota_used`, `reset_token`, `reset_token_expires`, `trial_ends_at`) VALUES
	('28d6f5a2-8033-474f-a185-4c64fe0c5f39', 'arieftheluffy', 'arieftheluffy@gmail.com', '$2b$10$/MkqZVKJoFWupaxKcapLJOOod9H/KI4wfIWPhL6cvvSnnE3r57DKu', 'user', 1, 'paid', 3, 50, '2026-04-24 15:36:26', 3, 0, NULL, NULL, NULL),
	('b58494c1-8d77-45d2-8f91-c7fbee08ba25', 'sitirusmini', 'sitirusmini0392@gmail.com', '$2b$10$PhIi6FStQgIu61GMBvn6kOTCaayJs44gaj9EgtyoeNWokR/2Lz6PS', 'user', 1, 'paid', 3, 50, '2026-04-25 01:46:46', 3, 0, NULL, NULL, NULL),
	('f12516fe-e017-4464-9fef-9fc98082e732', 'miftahul', 'miftahularifhidayah@gmail.com', '$2b$10$2SZpRAuf.nLnzXvaqYEMReZQZxE81C.6liMQvrzGI3fBGTjP2ei36', 'user', 1, 'paid', 3, 150, '2026-04-25 01:07:26', 3, 0, NULL, NULL, NULL),
	('f424c366-3ec8-4ef6-aac8-4b28bb6f2e3e', 'admin', 'admin@wedding.com', '$2b$10$pP7FaTvuJ2XcLKdb.dAuEe2vXD35xvElUOSqrzyyNvbzUdfnqrAF2', 'admin', 1, 'paid', 1, 50, '2026-04-24 15:30:34', 3, 0, NULL, NULL, NULL),
	('fd14f3e9-47a5-4a99-b147-0435afe7104c', 'hidayah', 'pkt.miftahul@gmail.com', '$2b$10$tQ1jz3nvlZYJWr5uVzZjT.gdtzKqEtsSX9Pn4uFTXgwVYtxRonu5C', 'user', 1, 'unpaid', 1, 50, '2026-04-26 01:54:27', 3, 0, NULL, NULL, NULL);

-- Dumping structure for table wedding_db.wishes
DROP TABLE IF EXISTS `wishes`;
CREATE TABLE IF NOT EXISTS `wishes` (
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

-- Dumping data for table wedding_db.wishes: ~3 rows (approximately)
DELETE FROM `wishes`;
INSERT INTO `wishes` (`id`, `invitation_id`, `guest_name`, `message`, `is_attending`, `created_at`) VALUES
	('5d454b73-f4dd-4cb5-aeee-77010f09ad75', '33e01e0f-a672-4dc4-bc90-c53363b52723', 'Taufik Rahman dan Istri', 'selamat menikah', 'hadir', '2026-04-25 02:38:41'),
	('7a00e0ef-67d4-4a29-a2b1-b2e72717d674', '33e01e0f-a672-4dc4-bc90-c53363b52723', 'Taufik Rahman dan Istri', 'Test ucapan dari sistem - semoga bahagia selamanya', 'hadir', '2026-04-25 06:51:07'),
	('83db9676-39cd-4712-8e50-a44cec977543', '33e01e0f-a672-4dc4-bc90-c53363b52723', 'Yusuf dan Istri', 'Selamat cha', 'hadir', '2026-04-25 07:01:59');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

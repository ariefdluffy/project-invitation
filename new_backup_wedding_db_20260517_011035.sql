-- =====================================================
-- RESTORE SCRIPT - Wedding Invitation Database
-- Generated: 2026-05-17
-- =====================================================

-- Drop existing database and create new one
DROP DATABASE IF EXISTS wedding_db;
CREATE DATABASE wedding_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wedding_db;

-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: wedding_db
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_action` (`action`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guests`
--

DROP TABLE IF EXISTS `guests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guests`
--

LOCK TABLES `guests` WRITE;
/*!40000 ALTER TABLE `guests` DISABLE KEYS */;
INSERT INTO `guests` VALUES ('1babfa90-a694-4bfb-8548-b1b6c21fe056','33e01e0f-a672-4dc4-bc90-c53363b52723','Taufik Rahman dan Istri','taufik-rahman-dan-istri',1,1,1,'2026-04-25 02:36:40'),('3139ac0f-377d-43b9-80e0-3e1e139079b5','33e01e0f-a672-4dc4-bc90-c53363b52723','Udin dan Istri','udin-dan-istri',1,1,1,'2026-04-25 07:02:24'),('67e9f43f-b9de-4ec5-a01a-f1c07caf3136','33e01e0f-a672-4dc4-bc90-c53363b52723','Yusuf dan Istri','yusuf-dan-istri',1,1,1,'2026-04-25 05:09:41');
/*!40000 ALTER TABLE `guests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitations`
--

DROP TABLE IF EXISTS `invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitations`
--

LOCK TABLES `invitations` WRITE;
/*!40000 ALTER TABLE `invitations` DISABLE KEYS */;
INSERT INTO `invitations` VALUES ('33e01e0f-a672-4dc4-bc90-c53363b52723','28d6f5a2-8033-474f-a185-4c64fe0c5f39','tmpl-javanese','icha-yusni','Yusni','Ns. Ahmad Yusni. S.Kep','Putra Ketiga dari Bapak Arsil. S.Pd & (Almh) Ibu Siti Jureidah / Ibu Maridah','@yusuf','/uploads/33e01e0f-a672-4dc4-bc90-c53363b52723-groom_photo-1777085679985.jpeg','Icha','Siti Khairunnisa','Putri Keempat Dari Bapak (Alm) M.Yunus Satta & Ibu Hj. Ermawati','@fatimah','/uploads/33e01e0f-a672-4dc4-bc90-c53363b52723-bride_photo-1777852281555.jpeg','“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”','Ar-Rum: 21','2026-05-31',NULL,'2026-05-31',NULL,'Rumah Sopian','Jln. Gunung Belah Gg. Arsapati 5','https://maps.app.goo.gl/gWxeFTmTHvtN8xQR8','\"Dua jiwa, dua cerita, kini menyatu dalam satu doa. Allah mempertemukan kami bukan tanpa alasan, melainkan untuk saling melengkapi dan menyempurnakan ibadah. Dengan bismillah, kami melangkah menuju babak baru untuk membangun istana cinta yang sakinah, mawaddah, dan warahmah.\"','Bapak (Alm) M.Yunus Satta & Ibu Hj. Ermawati\r\nBapak Arsil. S.Pd & (Almh) Ibu Siti Jureidah / Ibu Maridah','[{\"bank\":\"Nama Bank\",\"number\":\"Nomo Rekening\",\"name\":\"Siti Khairunnisa\"}]','[\"#8b6914\",\"#d4a574\",\"#fdf6e3\"]','https://server14.mp3quran.net/khalf/004.mp3','https://temuin.web.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08-1777084840272.jpeg\r\nhttps://temuin.web.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--2--1777084830439.jpeg','https://temuin.web.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--1--1777084811542.jpeg\r\nhttps://temuin.web.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-09-1777084818384.jpeg\r\nhttps://temuin.web.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--2--1777084830439.jpeg\r\nhttps://temuin.web.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-07-1777084801661.jpeg\r\nhttps://temuin.web.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08-1777084840272.jpeg','{\"title\": \"\", \"heading\": \"\", \"invitation_text\": \"\"}',1,'2026-04-25 02:36:17','2026-05-04 01:11:56');
/*!40000 ALTER TABLE `invitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_transactions`
--

DROP TABLE IF EXISTS `payment_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_transactions` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_transactions`
--

LOCK TABLES `payment_transactions` WRITE;
/*!40000 ALTER TABLE `payment_transactions` DISABLE KEYS */;
INSERT INTO `payment_transactions` VALUES ('06486dbf-148d-4de7-8f07-0a0cc14c6c8d','fd14f3e9-47a5-4a99-b147-0435afe7104c','P_fd14f3e947a5_862c75','premium',39000,'pending','2026-04-25 22:42:10','2026-04-25 22:42:10'),('2c13915c-cf56-4fb7-838a-89890e2e2bac','fd14f3e9-47a5-4a99-b147-0435afe7104c','P_fd14f3e947a5_868232','premium',39000,'success','2026-04-25 22:42:32','2026-04-25 22:43:00'),('6acccc8c-5e24-4f9f-a2c3-f9fd527bbb3b','f12516fe-e017-4464-9fef-9fc98082e732','P_f12516fee017_eb634d','premium',39000,'pending','2026-04-25 19:53:06','2026-04-25 19:53:06'),('73092534-a75c-4d80-bc23-9643c52f82ff','f424c366-3ec8-4ef6-aac8-4b28bb6f2e3e','P_afb588f79780_eaf344','premium',99000,'pending','2026-04-25 19:52:37','2026-04-25 19:52:37'),('940b710a-39db-420f-b1d9-acb6d4d0799f','91d9062b-15f7-469f-85e2-d00d6d3f1241','P_91d9062b15f7_e8164a','premium',39000,'pending','2026-05-02 08:57:20','2026-05-02 08:57:20'),('a3b0e9ba-ca19-4c73-87fb-46db95b485b1','692bd0c4-5340-4a40-99f6-a41389236470','P_692bd0c45340_a4b445','premium',39000,'pending','2026-05-01 17:44:53','2026-05-01 17:44:53'),('c458c306-4358-4bfb-a764-f2ec0a8633f0','f12516fe-e017-4464-9fef-9fc98082e732','A_f12516fee017_ec868e','addon',19000,'pending','2026-04-25 19:54:20','2026-04-25 19:54:20'),('f8d72f8b-30bc-4fc0-99dc-4d8bcf3caefd','692bd0c4-5340-4a40-99f6-a41389236470','P_692bd0c45340_a51fb2','premium',39000,'pending','2026-05-01 17:45:20','2026-05-01 17:45:20');
/*!40000 ALTER TABLE `payment_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promo_codes`
--

DROP TABLE IF EXISTS `promo_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promo_codes` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_type` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_amount` decimal(10,2) DEFAULT '0.00',
  `max_uses` int DEFAULT '1',
  `used_count` int DEFAULT '0',
  `expires_at` date DEFAULT NULL,
  `is_active` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promo_codes`
--

LOCK TABLES `promo_codes` WRITE;
/*!40000 ALTER TABLE `promo_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `promo_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `key` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES ('addon_guest_price','19000','2026-05-03 00:39:59'),('addon_guest_quantity','50','2026-05-03 00:39:59'),('app_name','Wedding.id','2026-05-16 17:00:01'),('default_music_url','https://server14.mp3quran.net/khalf/004.mp3','2026-05-03 00:39:59'),('midtrans_client_key','Mid-client-eNK6QbjOVx35SuC_','2026-05-03 00:39:59'),('midtrans_is_production','1','2026-05-03 00:39:59'),('midtrans_server_key','Mid-server-Si-5GfhV0kDZ7BfMUP34YoSp','2026-05-03 00:39:59'),('payment_instructions','Transfer DANA / GOPAY / OVO 0852-5088-7277 an. Miftahul Arif Hidayah','2026-05-03 00:39:59'),('premium_price','149000','2026-05-16 17:00:01'),('template_expansion_price','29000','2026-05-03 00:39:59'),('template_expansion_quantity','5','2026-05-03 00:39:59');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `templates`
--

DROP TABLE IF EXISTS `templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
INSERT INTO `templates` VALUES ('modern-minimalist','Modern Minimalist','modern-minimalist','Desain modern dan minimalis dengan layout kartu yang unik, avatar bulat, dan animasi fade-in yang halus.','https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80','#6366F1','#EC4899','#F8FAFC','Playfair Display','modern','pernikahan','2026-05-16 16:55:42'),('tmpl-3d-motion-wedding','3D Motion Wedding','tmpl-3d-motion-wedding','Futuristic 3D motion look with neon depth, glass cards, and kinetic highlights for a modern wedding vibe.','https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80','#0ea5e9','#22c55e','#020617','Space Grotesk','modern','pernikahan','2026-05-16 16:55:42'),('tmpl-anniversary-velvet','Anniversary Velvet','tmpl-anniversary-velvet','Merah burgundy dan emas lembut — elegan untuk resepsi ulang tahun pernikahan atau milestone bersama pasangan.','https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80','#7f1d1d','#d4a574','#fef2f2','Playfair Display','classic','pernikahan','2026-05-16 16:55:42'),('tmpl-aqiqah-blue','Baby Blue Aqiqah','tmpl-aqiqah-blue','Desain yang lembut dan ceria untuk perayaan aqiqah putra atau putri Anda.','https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=600&q=80','#1e40af','#bfdbfe','#eff6ff','Playfair Display','classic','aqiqah','2026-05-16 16:55:42'),('tmpl-aqiqah-soft','Aqiqah Blush','tmpl-aqiqah-soft','Lembut dengan krem dan blush pink, nuansa menggemaskan untuk aqiqah dan selamatan kelahiran.','https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80','#9d174d','#fbcfe8','#fff1f2','Playfair Display','classic','aqiqah','2026-05-16 16:55:42'),('tmpl-arisan-keluarga','Arisan Keluarga','tmpl-arisan-keluarga','Template santai dan hangat untuk acara kumpul keluarga atau arisan.','https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80','#78350f','#fde68a','#fefce8','Playfair Display','classic','gathering','2026-05-16 16:55:42'),('tmpl-birthday-pop','Birthday Confetti','tmpl-birthday-pop','Warna-warni ceria dan kontras tegas — cocok untuk pesta ulang tahun anak maupun dewasa.','https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80','#7c3aed','#f472b6','#faf5ff','Playfair Display','classic','birthday','2026-05-16 16:55:42'),('tmpl-corporate-summit','Summit Corporate','tmpl-corporate-summit','Bersih dan profesional dengan slate dan biru — untuk seminar, launching, atau undangan formal perusahaan.','https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80','#1e293b','#38bdf8','#f8fafc','Playfair Display','classic','formal','2026-05-16 16:55:42'),('tmpl-gathering-bistro','Gathering Bistro','tmpl-gathering-bistro','Hangat seperti kafe: terracotta dan krem. Cocok untuk arisan, reunion keluarga, atau bukber.','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80','#9a3412','#fdba74','#fff7ed','Playfair Display','classic','gathering','2026-05-16 16:55:42'),('tmpl-javanese','Javanese Elegance','tmpl-javanese','Template elegan dengan nuansa budaya Jawa yang indah, ornamen batik, dan warna emas klasik.','https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=600&q=80','#D4A574','#8B6F4E','#F5E6D3','Playfair Display','classic','pernikahan','2026-05-16 16:55:42'),('tmpl-khitan-joy','Joyful Sunatan','tmpl-khitan-joy','Ceria dan hangat dengan hijau segar dan aksen emas — pas untuk undangan khitan, tasyakuran, atau syukuran anak.','https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=600&q=80','#166534','#facc15','#f0fdf4','Playfair Display','classic','khitan','2026-05-16 16:55:42'),('tmpl-royal','Royal Midnight','tmpl-royal','Perpaduan mewah warna biru tengah malam dan emas champagne, menciptakan kesan agung dan eksklusif.','https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=600&q=80','#0f172a','#c0a080','#ffffff','Cinzel','classic','pernikahan','2026-05-16 16:55:42'),('tmpl-tema-31-inspired','Tema 31 Inspired','tmpl-tema-31-inspired','Romantic photo-centric layout with soft glass cards, floating ornaments, and cinematic typography for a modern classic wedding.','https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=600&q=80','#d4a574','#1f2937','#fdf7ef','Cormorant Garamond','romantic','pernikahan','2026-05-16 16:55:42');
/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  `template_quota` int DEFAULT '3',
  `template_quota_used` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('28d6f5a2-8033-474f-a185-4c64fe0c5f39','arieftheluffy','arieftheluffy@gmail.com','$2b$10$/MkqZVKJoFWupaxKcapLJOOod9H/KI4wfIWPhL6cvvSnnE3r57DKu','user',1,'paid',2,50,'2026-04-24 15:36:26',3,0),('692bd0c4-5340-4a40-99f6-a41389236470','gel@glx.web.id','gel@glx.web.id','$2b$10$Od6lo34wm3dZhZdMYr2HputlMa5o1Dr3b2iNBcvXDblrd1lD6LaSy','user',0,'inactive',1,50,'2026-05-01 17:44:32',3,0),('91d9062b-15f7-469f-85e2-d00d6d3f1241','Cek','cek@gmail.com','$2b$10$1VRo51JsZZPtu5QB6dY5YeDqxgTwVKY4B7SVqRN0ZfTcuvZTvxJIu','user',0,'pending',1,50,'2026-05-02 08:56:48',3,0),('b58494c1-8d77-45d2-8f91-c7fbee08ba25','sitirusmini','sitirusmini0392@gmail.com','$2b$10$PhIi6FStQgIu61GMBvn6kOTCaayJs44gaj9EgtyoeNWokR/2Lz6PS','user',1,'paid',3,50,'2026-04-25 01:46:46',3,0),('f12516fe-e017-4464-9fef-9fc98082e732','miftahul','miftahularifhidayah@gmail.com','$2b$10$2SZpRAuf.nLnzXvaqYEMReZQZxE81C.6liMQvrzGI3fBGTjP2ei36','user',1,'paid',3,150,'2026-04-25 01:07:26',3,0),('f424c366-3ec8-4ef6-aac8-4b28bb6f2e3e','admin','admin@wedding.com','$2b$10$pP7FaTvuJ2XcLKdb.dAuEe2vXD35xvElUOSqrzyyNvbzUdfnqrAF2','admin',1,'paid',1,50,'2026-04-24 15:30:34',3,0),('fd14f3e9-47a5-4a99-b147-0435afe7104c','hidayah','pkt.miftahul@gmail.com','$2b$10$tQ1jz3nvlZYJWr5uVzZjT.gdtzKqEtsSX9Pn4uFTXgwVYtxRonu5C','user',1,'paid',3,50,'2026-04-26 01:54:27',3,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishes`
--

DROP TABLE IF EXISTS `wishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishes`
--

LOCK TABLES `wishes` WRITE;
/*!40000 ALTER TABLE `wishes` DISABLE KEYS */;
INSERT INTO `wishes` VALUES ('4c46d5a1-7625-414f-afcb-9702985b0cdf','33e01e0f-a672-4dc4-bc90-c53363b52723','Udin dan Istri','Semoga','hadir','2026-04-28 12:56:25'),('5d454b73-f4dd-4cb5-aeee-77010f09ad75','33e01e0f-a672-4dc4-bc90-c53363b52723','Taufik Rahman dan Istri','selamat menikah','hadir','2026-04-25 02:38:41'),('7a00e0ef-67d4-4a29-a2b1-b2e72717d674','33e01e0f-a672-4dc4-bc90-c53363b52723','Taufik Rahman dan Istri','Test ucapan dari sistem - semoga bahagia selamanya','hadir','2026-04-25 06:51:07'),('83db9676-39cd-4712-8e50-a44cec977543','33e01e0f-a672-4dc4-bc90-c53363b52723','Yusuf dan Istri','Selamat cha','hadir','2026-04-25 07:01:59');
/*!40000 ALTER TABLE `wishes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-17  1:10:36

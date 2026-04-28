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
INSERT INTO `guests` VALUES ('1babfa90-a694-4bfb-8548-b1b6c21fe056','33e01e0f-a672-4dc4-bc90-c53363b52723','Taufik Rahman dan Istri','taufik-rahman-dan-istri',1,1,1,'2026-04-25 02:36:40'),('3139ac0f-377d-43b9-80e0-3e1e139079b5','33e01e0f-a672-4dc4-bc90-c53363b52723','Udin dan Istri','udin-dan-istri',0,1,0,'2026-04-25 07:02:24'),('67e9f43f-b9de-4ec5-a01a-f1c07caf3136','33e01e0f-a672-4dc4-bc90-c53363b52723','Yusuf dan Istri','yusuf-dan-istri',1,1,1,'2026-04-25 05:09:41');
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
INSERT INTO `invitations` VALUES ('33e01e0f-a672-4dc4-bc90-c53363b52723','28d6f5a2-8033-474f-a185-4c64fe0c5f39','tmpl-javanese','icha-yusni','Yusni','Ns. Ahmad Yusni. S.Kep','Putra Ketiga dari Bapak Arsil. S.Pd & (Almh) Ibu Siti Jureidah / Ibu Maridah','@yusuf','/uploads/33e01e0f-a672-4dc4-bc90-c53363b52723-groom_photo-1777085679985.jpeg','Icha','Siti Khairunnisa','Putri Keempat Dari Bapak (Alm) M.Yunus Satta & Ibu Hj. Ermawati','@fatimah','/uploads/33e01e0f-a672-4dc4-bc90-c53363b52723-bride_photo-1777085679984.jpeg','“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”','Ar-Rum: 21','2026-05-31','07.00 Wita - Selesai','2026-05-31','11.00 - Selesai','Rumah Sopian','Jln. Gunung Belah Gg. Arsapati 5','https://maps.app.goo.gl/gWxeFTmTHvtN8xQR8','\"Dua jiwa, dua cerita, kini menyatu dalam satu doa. Allah mempertemukan kami bukan tanpa alasan, melainkan untuk saling melengkapi dan menyempurnakan ibadah. Dengan bismillah, kami melangkah menuju babak baru untuk membangun istana cinta yang sakinah, mawaddah, dan warahmah.\"','Bapak (Alm) M.Yunus Satta & Ibu Hj. Ermawati\r\nBapak Arsil. S.Pd & (Almh) Ibu Siti Jureidah / Ibu Maridah','[{\"bank\":\"Nama Bank\",\"number\":\"Nomo Rekening\",\"name\":\"Siti Khairunnisa\"}]','[\"#8b6914\",\"#d4a574\",\"#fdf6e3\"]','https://server14.mp3quran.net/khalf/004.mp3','https://nikahin.lockbit.my.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08-1777084840272.jpeg\r\nhttps://nikahin.lockbit.my.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--2--1777084830439.jpeg','https://nikahin.lockbit.my.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--1--1777084811542.jpeg\r\nhttps://nikahin.lockbit.my.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-09-1777084818384.jpeg\r\nhttps://nikahin.lockbit.my.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--2--1777084830439.jpeg\r\nhttps://nikahin.lockbit.my.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-07-1777084801661.jpeg\r\nhttps://nikahin.lockbit.my.id/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08-1777084840272.jpeg','{\"title\": \"\", \"heading\": \"\", \"invitation_text\": \"\"}',1,'2026-04-25 02:36:17','2026-04-26 11:47:19');
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
INSERT INTO `payment_transactions` VALUES ('06486dbf-148d-4de7-8f07-0a0cc14c6c8d','fd14f3e9-47a5-4a99-b147-0435afe7104c','P_fd14f3e947a5_862c75','premium',39000,'pending','2026-04-25 22:42:10','2026-04-25 22:42:10'),('2c13915c-cf56-4fb7-838a-89890e2e2bac','fd14f3e9-47a5-4a99-b147-0435afe7104c','P_fd14f3e947a5_868232','premium',39000,'success','2026-04-25 22:42:32','2026-04-25 22:43:00'),('6acccc8c-5e24-4f9f-a2c3-f9fd527bbb3b','f12516fe-e017-4464-9fef-9fc98082e732','P_f12516fee017_eb634d','premium',39000,'pending','2026-04-25 19:53:06','2026-04-25 19:53:06'),('73092534-a75c-4d80-bc23-9643c52f82ff','f424c366-3ec8-4ef6-aac8-4b28bb6f2e3e','P_afb588f79780_eaf344','premium',99000,'pending','2026-04-25 19:52:37','2026-04-25 19:52:37'),('c458c306-4358-4bfb-a764-f2ec0a8633f0','f12516fe-e017-4464-9fef-9fc98082e732','A_f12516fee017_ec868e','addon',19000,'pending','2026-04-25 19:54:20','2026-04-25 19:54:20');
/*!40000 ALTER TABLE `payment_transactions` ENABLE KEYS */;
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
INSERT INTO `settings` VALUES ('addon_guest_price','19000','2026-04-26 02:45:35'),('addon_guest_quantity','50','2026-04-26 02:45:35'),('app_name','Lembar Moment','2026-04-26 02:45:35'),('default_music_url','https://server14.mp3quran.net/khalf/004.mp3','2026-04-26 02:45:35'),('midtrans_client_key','SB-Mid-client-2ibZocoHhnc5Oncp','2026-04-26 02:45:35'),('midtrans_is_production','0','2026-04-26 02:45:35'),('midtrans_server_key','SB-Mid-server-u0zbtnDby1LXDIMJEYUZoyBe','2026-04-26 02:45:35'),('payment_instructions','Transfer DANA / GOPAY / OVO 0852-5088-7277 an. Miftahul Arif Hidayah','2026-04-26 02:45:35'),('premium_price','39000','2026-04-26 02:45:35'),('template_expansion_price','29000','2026-04-26 06:02:12'),('template_expansion_quantity','5','2026-04-26 06:02:12');
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
INSERT INTO `templates` VALUES ('tmpl-3d-motion','3D Motion','3d-motion','A dynamic 3D animated background with floating elements and particle effects.',NULL,'#0066FF','#00FFCC','#F5E6D3','Arial, sans-serif','modern','wedding','2026-04-26 11:48:34'),('tmpl-anniversary-velvet','Anniversary Velvet','anniversary-velvet','Merah burgundy dan emas lembut — elegan untuk resepsi ulang tahun pernikahan atau milestone bersama pasangan.','https://images.unsplash.com/photo-1529636799528-941f294af16f?auto=format&fit=crop&w=600&q=80','#7f1d1d','#d4a574','#fef2f2','Playfair Display','classic','anniversary','2026-04-26 11:48:34'),('tmpl-aqiqah-soft','Aqiqah Blush','aqiqah-blush','Lembut dengan krem dan blush pink, nuansa menggemaskan untuk aqiqah dan selamatan kelahiran.','https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80','#9d174d','#fbcfe8','#fff1f2','Cormorant Garamond','romantic','aqiqah','2026-04-26 11:48:34'),('tmpl-birthday-pop','Birthday Confetti','birthday-confetti','Warna-warni ceria dan kontras tegas — cocok untuk pesta ulang tahun anak maupun dewasa.','https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80','#7c3aed','#f472b6','#faf5ff','Outfit','modern','birthday','2026-04-26 11:48:34'),('tmpl-celestial','Celestial Night','celestial-night','Terinspirasi dari keindahan langit malam berbintang. Perpaduan warna navy tua dan silver yang magis.','https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80','#0f172a','#94a3b8','#f8fafc','Cinzel Decorative','celestial','wedding','2026-04-26 11:48:34'),('tmpl-classic','Classic Elegance','classic-elegance','Desain abadi dengan perpaduan warna putih murni dan emas metalik. Memberikan kesan bersih, mewah, dan sangat profesional.','https://images.unsplash.com/photo-1519225495810-751bd131c90d?auto=format&fit=crop&w=600&q=80','#ffffff','#d4af37','#2c2c2c','Playfair Display','classic','wedding','2026-04-26 11:48:34'),('tmpl-corporate-summit','Summit Corporate','summit-corporate','Bersih dan profesional dengan slate dan biru — untuk seminar, launching, atau undangan formal perusahaan.','https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80','#1e293b','#38bdf8','#f8fafc','Montserrat','modern','corporate','2026-04-26 11:48:34'),('tmpl-earth','Minimalist Earth','minimalist-earth','Tema warna bumi (terracotta & sage) yang menenangkan, memberikan kesan hangat, organik, dan estetik.','https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80','#7c6a53','#a3b18a','#fefae0','Lora','minimalist','general','2026-04-26 11:48:34'),('tmpl-garden','Garden Romance','garden-romance','Template romantis dengan tema taman bunga, warna pastel lembut, dan ilustrasi floral watercolor.','https://images.unsplash.com/photo-1522673607200-164883eeca48?auto=format&fit=crop&w=600&q=80','#8B4D6E','#D4849B','#FFF0F5','Great Vibes','romantic','wedding','2026-04-26 11:48:34'),('tmpl-gathering-bistro','Gathering Bistro','gathering-bistro','Hangat seperti kafe: terracotta dan krem. Cocok untuk arisan, reunion keluarga, atau bukber.','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80','#9a3412','#fdba74','#fff7ed','Lora','vintage','gathering','2026-04-26 11:48:34'),('tmpl-javanese','Javanese Elegance','javanese-elegance','Template elegan dengan nuansa budaya Jawa yang indah, ornamen batik, dan warna emas klasik.','https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=600&q=80','#8B6914','#D4A574','#FDF6E3','Playfair Display','classic','wedding','2026-04-26 11:48:34'),('tmpl-khitan-joy','Joyful Sunatan','joyful-sunatan','Ceria dan hangat dengan hijau segar dan aksen emas — pas untuk undangan khitan, tasyakuran, atau syukuran anak.','https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=600&q=80','#166534','#facc15','#f0fdf4','Montserrat','modern','khitan','2026-04-26 11:48:34'),('tmpl-luxury','Luxury Emerald','luxury-emerald','Kombinasi berkelas antara hijau zamrud tua dan emas murni. Memberikan aura kemewahan yang mendalam.','https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80','#047857','#f59e0b','#fffbeb','Cormorant Garamond','luxury','wedding','2026-04-26 11:48:34'),('tmpl-modern','Modern Minimalist','modern-minimalist','Template modern dan minimalis dengan desain bersih, tipografi bold, dan animasi smooth.','https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80','#2C3E50','#E67E22','#ECF0F1','Montserrat','modern','general','2026-04-26 11:48:34'),('tmpl-romantic','Soft Lavender','soft-lavender','Lembut dan puitis dengan gradasi warna lavender dan putih. Memberikan kesan damai dan penuh cinta.','https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80','#7e22ce','#e9d5ff','#faf5ff','Alex Brush','romantic','wedding','2026-04-26 11:48:34'),('tmpl-royal','Royal Midnight','royal-midnight','Perpaduan mewah warna biru tengah malam dan emas champagne, menciptakan kesan agung dan eksklusif.','https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=600&q=80','#1a1a2e','#c0a080','#ffffff','Cinzel','royal','wedding','2026-04-26 11:48:34'),('tmpl-tropical','Tropical Breeze','tropical-breeze','Segar dan ceria dengan palet warna hijau botani dan teal. Sempurna untuk pernikahan tema pantai atau musim panas.','https://images.unsplash.com/photo-1512100356132-d39918387e94?auto=format&fit=crop&w=600&q=80','#065f46','#2dd4bf','#f0fdfa','Outfit','tropical','wedding','2026-04-26 11:48:34'),('tmpl-vintage','Vintage Rustic','vintage-rustic','Nuansa hangat kayu dan kertas kraft dengan sentuhan retro. Cocok untuk pernikahan tema outdoor atau barn wedding.','https://images.unsplash.com/photo-1458007683879-47560d7e33c3?auto=format&fit=crop&w=600&q=80','#5d4037','#d7ccc8','#8d6e63','Special Elite','vintage','wedding','2026-04-26 11:48:34');
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
INSERT INTO `users` VALUES ('28d6f5a2-8033-474f-a185-4c64fe0c5f39','arieftheluffy','arieftheluffy@gmail.com','$2b$10$/MkqZVKJoFWupaxKcapLJOOod9H/KI4wfIWPhL6cvvSnnE3r57DKu','user',1,'paid',2,50,'2026-04-24 15:36:26',3,0),('b58494c1-8d77-45d2-8f91-c7fbee08ba25','sitirusmini','sitirusmini0392@gmail.com','$2b$10$PhIi6FStQgIu61GMBvn6kOTCaayJs44gaj9EgtyoeNWokR/2Lz6PS','user',1,'paid',3,50,'2026-04-25 01:46:46',3,0),('e77622f9-fa32-47b4-b82c-24d309de293d','testuser','test@test.com','$2b$10$kmhUl3mcvPo.C90fnNTJ3exx/61qzijkx7YTxYfinmasWJQ3mAwyy','user',0,'pending',1,50,'2026-04-26 02:59:25',3,0),('f12516fe-e017-4464-9fef-9fc98082e732','miftahul','miftahularifhidayah@gmail.com','$2b$10$2SZpRAuf.nLnzXvaqYEMReZQZxE81C.6liMQvrzGI3fBGTjP2ei36','user',1,'paid',3,150,'2026-04-25 01:07:26',3,0),('f424c366-3ec8-4ef6-aac8-4b28bb6f2e3e','admin','admin@wedding.com','$2b$10$pP7FaTvuJ2XcLKdb.dAuEe2vXD35xvElUOSqrzyyNvbzUdfnqrAF2','admin',1,'paid',1,50,'2026-04-24 15:30:34',3,0),('fd14f3e9-47a5-4a99-b147-0435afe7104c','hidayah','pkt.miftahul@gmail.com','$2b$10$tQ1jz3nvlZYJWr5uVzZjT.gdtzKqEtsSX9Pn4uFTXgwVYtxRonu5C','user',1,'paid',3,50,'2026-04-26 01:54:27',3,0);
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
INSERT INTO `wishes` VALUES ('5d454b73-f4dd-4cb5-aeee-77010f09ad75','33e01e0f-a672-4dc4-bc90-c53363b52723','Taufik Rahman dan Istri','selamat menikah','hadir','2026-04-25 02:38:41'),('7a00e0ef-67d4-4a29-a2b1-b2e72717d674','33e01e0f-a672-4dc4-bc90-c53363b52723','Taufik Rahman dan Istri','Test ucapan dari sistem - semoga bahagia selamanya','hadir','2026-04-25 06:51:07'),('83db9676-39cd-4712-8e50-a44cec977543','33e01e0f-a672-4dc4-bc90-c53363b52723','Yusuf dan Istri','Selamat cha','hadir','2026-04-25 07:01:59');
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

-- Dump completed on 2026-04-26 19:51:28

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
INSERT INTO `settings` VALUES ('addon_guest_price','19000','2026-04-25 03:21:19'),('addon_guest_quantity','50','2026-04-25 03:21:19'),('app_name','Lembar Moment','2026-04-25 03:21:19'),('default_music_url','https://server14.mp3quran.net/khalf/004.mp3','2026-04-25 03:21:19'),('midtrans_client_key','Mid-client-eNK6QbjOVx35SuC_','2026-04-25 03:21:19'),('midtrans_is_production','1','2026-04-25 03:21:19'),('midtrans_server_key','Mid-server-Si-5GfhV0kDZ7BfMUP34YoSp','2026-04-25 03:21:19'),('payment_instructions','Transfer DANA / GOPAY / OVO 0852-5088-7277 an. Miftahul Arif Hidayah','2026-04-25 03:21:19'),('premium_price','39000','2026-04-25 03:21:19');
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
INSERT INTO `templates` VALUES ('tmpl-anniversary-velvet','Anniversary Velvet','anniversary-velvet','Merah burgundy dan emas lembut — elegan untuk resepsi ulang tahun pernikahan atau milestone bersama pasangan.','https://images.unsplash.com/photo-1529636799528-941f294af16f?auto=format&fit=crop&w=600&q=80','#7f1d1d','#d4a574','#fef2f2','Playfair Display','classic','anniversary','2026-04-25 03:09:18'),('tmpl-aqiqah-soft','Aqiqah Blush','aqiqah-blush','Lembut dengan krem dan blush pink, nuansa menggemaskan untuk aqiqah dan selamatan kelahiran.','https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80','#9d174d','#fbcfe8','#fff1f2','Cormorant Garamond','romantic','aqiqah','2026-04-25 03:09:18'),('tmpl-birthday-pop','Birthday Confetti','birthday-confetti','Warna-warni ceria dan kontras tegas — cocok untuk pesta ulang tahun anak maupun dewasa.','https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80','#7c3aed','#f472b6','#faf5ff','Outfit','modern','birthday','2026-04-25 03:09:18'),('tmpl-celestial','Celestial Night','celestial-night','Terinspirasi dari keindahan langit malam berbintang. Perpaduan warna navy tua dan silver yang magis.','https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80','#0f172a','#94a3b8','#f8fafc','Cinzel Decorative','celestial','wedding','2026-04-25 03:09:18'),('tmpl-classic','Classic Elegance','classic-elegance','Desain abadi dengan perpaduan warna putih murni dan emas metalik. Memberikan kesan bersih, mewah, dan sangat profesional.','https://images.unsplash.com/photo-1519225495810-751bd131c90d?auto=format&fit=crop&w=600&q=80','#ffffff','#d4af37','#2c2c2c','Playfair Display','classic','wedding','2026-04-25 03:09:18'),('tmpl-corporate-summit','Summit Corporate','summit-corporate','Bersih dan profesional dengan slate dan biru — untuk seminar, launching, atau undangan formal perusahaan.','https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80','#1e293b','#38bdf8','#f8fafc','Montserrat','modern','corporate','2026-04-25 03:09:18'),('tmpl-earth','Minimalist Earth','minimalist-earth','Tema warna bumi (terracotta & sage) yang menenangkan, memberikan kesan hangat, organik, dan estetik.','https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80','#7c6a53','#a3b18a','#fefae0','Lora','minimalist','general','2026-04-25 03:09:18'),('tmpl-garden','Garden Romance','garden-romance','Template romantis dengan tema taman bunga, warna pastel lembut, dan ilustrasi floral watercolor.','https://images.unsplash.com/photo-1522673607200-164883eeca48?auto=format&fit=crop&w=600&q=80','#8B4D6E','#D4849B','#FFF0F5','Great Vibes','romantic','wedding','2026-04-25 03:09:18'),('tmpl-gathering-bistro','Gathering Bistro','gathering-bistro','Hangat seperti kafe: terracotta dan krem. Cocok untuk arisan, reunion keluarga, atau bukber.','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80','#9a3412','#fdba74','#fff7ed','Lora','vintage','gathering','2026-04-25 03:09:18'),('tmpl-javanese','Javanese Elegance','javanese-elegance','Template elegan dengan nuansa budaya Jawa yang indah, ornamen batik, dan warna emas klasik.','https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=600&q=80','#8B6914','#D4A574','#FDF6E3','Playfair Display','classic','wedding','2026-04-25 03:09:18'),('tmpl-khitan-joy','Joyful Sunatan','joyful-sunatan','Ceria dan hangat dengan hijau segar dan aksen emas — pas untuk undangan khitan, tasyakuran, atau syukuran anak.','https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=600&q=80','#166534','#facc15','#f0fdf4','Montserrat','modern','khitan','2026-04-25 03:09:18'),('tmpl-luxury','Luxury Emerald','luxury-emerald','Kombinasi berkelas antara hijau zamrud tua dan emas murni. Memberikan aura kemewahan yang mendalam.','https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80','#064e3b','#fbbf24','#ffffff','Cormorant Garamond','luxury','wedding','2026-04-25 03:09:18'),('tmpl-modern','Modern Minimalist','modern-minimalist','Template modern dan minimalis dengan desain bersih, tipografi bold, dan animasi smooth.','https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80','#2C3E50','#E67E22','#ECF0F1','Montserrat','modern','general','2026-04-25 03:09:18'),('tmpl-romantic','Soft Lavender','soft-lavender','Lembut dan puitis dengan gradasi warna lavender dan putih. Memberikan kesan damai dan penuh cinta.','https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80','#7e22ce','#e9d5ff','#faf5ff','Alex Brush','romantic','wedding','2026-04-25 03:09:18'),('tmpl-royal','Royal Midnight','royal-midnight','Perpaduan mewah warna biru tengah malam dan emas champagne, menciptakan kesan agung dan eksklusif.','https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=600&q=80','#1a1a2e','#c0a080','#ffffff','Cinzel','royal','wedding','2026-04-25 03:09:18'),('tmpl-tropical','Tropical Breeze','tropical-breeze','Segar dan ceria dengan palet warna hijau botani dan teal. Sempurna untuk pernikahan tema pantai atau musim panas.','https://images.unsplash.com/photo-1512100356132-d39918387e94?auto=format&fit=crop&w=600&q=80','#065f46','#2dd4bf','#f0fdfa','Outfit','tropical','wedding','2026-04-25 03:09:18'),('tmpl-vintage','Vintage Rustic','vintage-rustic','Nuansa hangat kayu dan kertas kraft dengan sentuhan retro. Cocok untuk pernikahan tema outdoor atau barn wedding.','https://images.unsplash.com/photo-1458007683879-47560d7e33c3?auto=format&fit=crop&w=600&q=80','#5d4037','#d7ccc8','#8d6e63','Special Elite','vintage','wedding','2026-04-25 03:09:18');
/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-25 11:25:58

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
CREATE DATABASE IF NOT EXISTS `wedding_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `wedding_db`;

-- Dumping structure for table wedding_db.packages
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
	('premium', 'Premium', 'premium', 'Undangan premium tanpa batas', 149000, 3, 500, 10, NULL, 1, 2, '["3 undangan aktif","500 tamu per undangan","Semua template","RSVP online","Upload foto & galeri","Midtrans payment","Prioritas support"]', '2026-05-16 14:50:42'),
	('pro', 'Pro', 'pro', 'Untuk wedding organizer & bisnis', 349000, 10, 2000, 30, NULL, 1, 3, '["10 undangan aktif","2000 tamu per undangan","Semua template","RSVP online","Upload foto & galeri","Midtrans payment","Analytics tamu","Import tamu CSV","White-label"]', '2026-05-16 14:50:42');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

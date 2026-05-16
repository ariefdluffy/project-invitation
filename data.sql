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

-- Dumping structure for table wedding_db.promo_codes
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

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

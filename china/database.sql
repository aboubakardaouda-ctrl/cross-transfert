-- ACTILC RSVP Platform - MySQL Schema
-- Import this file via phpMyAdmin or MySQL CLI

CREATE TABLE IF NOT EXISTS `participants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `translator_id` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `participates` TINYINT(1) DEFAULT 1,
  `comment` TEXT DEFAULT NULL,
  `total_paid` INT DEFAULT 0,
  `status` ENUM('pending','validated','invited') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_email` (`email`),
  UNIQUE KEY `uq_translator_id` (`translator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `participant_id` INT NOT NULL,
  `amount` INT NOT NULL,
  `note` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `event_settings` (
  `id` VARCHAR(10) PRIMARY KEY,
  `title` VARCHAR(255) DEFAULT NULL,
  `title_en` VARCHAR(255) DEFAULT NULL,
  `title_zh` VARCHAR(255) DEFAULT NULL,
  `event_date` VARCHAR(100) DEFAULT NULL,
  `event_time` VARCHAR(100) DEFAULT NULL,
  `event_location` VARCHAR(255) DEFAULT NULL,
  `total_required` INT DEFAULT 25000,
  `year` INT DEFAULT 2026
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default event settings
INSERT INTO `event_settings` (`id`,`title`,`title_en`,`title_zh`,`event_date`,`event_time`,`event_location`,`total_required`,`year`)
VALUES ('default',
  '2ème Assemblée Générale de l\'ACTILC',
  '2nd General Assembly of ACTILC',
  'ACTILC第二届全体大会',
  'Dimanche 27 décembre 2026',
  '9h00 précise',
  'Franco Hôtel, Yaoundé',
  25000, 2026)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Default admin (password: Admin2024! — CHANGE THIS via admin/settings page)
-- Run this PHP snippet once to get a proper hash:
-- echo password_hash('YourPassword', PASSWORD_DEFAULT);
INSERT INTO `admins` (`username`,`password`)
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE `id`=`id`;
-- Default password is: password (change it in api/config.php!)

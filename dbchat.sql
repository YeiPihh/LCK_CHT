CREATE DATABASE dbchat;
USE DATABASE dbchat;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT DEFAULT NULL,
  `contact_id` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`contact_id`) REFERENCES `users` (`id`)
);

DROP TABLE IF EXISTS `friend_requests`;
CREATE TABLE `friend_requests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sender_id` INT DEFAULT NULL,
  `receiver_id` INT DEFAULT NULL,
  `status` ENUM('pendiente','aceptado','rechazado') DEFAULT 'pendiente',
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
);

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sender_id` INT DEFAULT NULL,
  `receiver_id` INT DEFAULT NULL,
  `content` TEXT,
  `timestamp` DATETIME DEFAULT NULL,
  `showSender` BOOLEAN DEFAULT 1,
  `showReceiver` BOOLEAN DEFAULT 1,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
);

DROP TABLE IF EXISTS `deleted_messages`;
CREATE TABLE `deleted_messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sender_id` INT DEFAULT NULL,
  `receiver_id` INT DEFAULT NULL,
  `content` TEXT,
  `timestamp` DATETIME DEFAULT NULL,
  `showSender` BOOLEAN DEFAULT 1,
  `showReceiver` BOOLEAN DEFAULT 1,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
);

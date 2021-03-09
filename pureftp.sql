CREATE DATABASE IF NOT EXISTS `pureftp`;
USE `pureftp`;

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  User VARCHAR(255) BINARY NOT NULL,
  Password VARCHAR(255) BINARY NOT NULL,
  Uid INT NOT NULL default '-1',
  Gid INT NOT NULL default '-1',
  Active BOOLEAN NOT NULL default TRUE,
  Dir VARCHAR(255) BINARY NOT NULL,
  PRIMARY KEY (User)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `gui_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(150) DEFAULT NULL,
  `password` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
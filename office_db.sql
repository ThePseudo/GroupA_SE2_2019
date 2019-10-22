-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Ott 22, 2019 alle 09:39
-- Versione del server: 10.4.8-MariaDB
-- Versione PHP: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `office_db`
--
CREATE DATABASE IF NOT EXISTS `office_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `office_db`;

-- --------------------------------------------------------

--
-- Struttura della tabella `employee`
--

DROP TABLE IF EXISTS `employee`;
CREATE TABLE IF NOT EXISTS `employee` (
  `ID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  `ID_counter` int(11) DEFAULT NULL,
  `status` varchar(10) NOT NULL,
  `ID_ticket_service` varchar(1) DEFAULT NULL,
  `ID_ticket_number` int(11) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `employee`
--

INSERT INTO `employee` (`ID`, `name`, `surname`, `admin`, `ID_counter`, `status`, `ID_ticket_service`, `ID_ticket_number`, `password`) VALUES
(1, 'Marco', 'Pecoraro', 0, 1, 'free', NULL, 0, 'pecoraro'),
(2, 'Giulio', 'Giuliani', 0, 2, 'free', NULL, 0, '2'),
(3, 'Simone', 'Simoni', 0, 3, 'free', NULL, NULL, '3');

-- --------------------------------------------------------

--
-- Struttura della tabella `employee_service`
--

DROP TABLE IF EXISTS `employee_service`;
CREATE TABLE IF NOT EXISTS `employee_service` (
  `ID_employee` int(11) NOT NULL,
  `ID_service` varchar(1) NOT NULL,
  PRIMARY KEY (`ID_employee`,`ID_service`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `employee_service`
--

INSERT INTO `employee_service` (`ID_employee`, `ID_service`) VALUES
(1, 'A'),
(1, 'P'),
(2, 'A'),
(3, 'P');

-- --------------------------------------------------------

--
-- Struttura della tabella `service`
--

DROP TABLE IF EXISTS `service`;
CREATE TABLE IF NOT EXISTS `service` (
  `ID` varchar(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `service_time_estimate` time NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `service`
--

INSERT INTO `service` (`ID`, `name`, `service_time_estimate`) VALUES
('A', 'Accounting', '00:03:00'),
('P', 'Packaging', '00:03:00');

-- --------------------------------------------------------

--
-- Struttura della tabella `ticket`
--

DROP TABLE IF EXISTS `ticket`;
CREATE TABLE IF NOT EXISTS `ticket` (
  `ID_service` varchar(1) NOT NULL,
  `number` int(11) NOT NULL,
  `date` date NOT NULL,
  `time_start_waiting` time NOT NULL,
  `time_end_waiting` time DEFAULT NULL,
  `time_end_service` time DEFAULT NULL,
  PRIMARY KEY (`ID_service`,`number`,`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `ticket`
--

INSERT INTO `ticket` (`ID_service`, `number`, `date`, `time_start_waiting`, `time_end_waiting`, `time_end_service`) VALUES
('A', 1, '2019-10-16', '14:24:33', NULL, NULL),
('A', 1, '2019-10-20', '11:05:43', NULL, NULL),
('A', 1, '2019-10-21', '16:17:08', NULL, NULL),
('A', 1, '2019-10-22', '08:41:16', '09:19:45', NULL),
('A', 2, '2019-10-16', '14:24:40', NULL, NULL),
('A', 2, '2019-10-20', '21:52:49', NULL, NULL),
('A', 2, '2019-10-21', '16:17:12', NULL, NULL),
('A', 2, '2019-10-22', '08:41:50', '09:19:47', NULL),
('A', 3, '2019-10-16', '14:24:48', NULL, NULL),
('A', 3, '2019-10-20', '21:52:52', NULL, NULL),
('A', 3, '2019-10-21', '16:17:16', NULL, NULL),
('A', 3, '2019-10-22', '08:51:26', '09:19:48', NULL),
('A', 4, '2019-10-16', '14:24:55', NULL, NULL),
('A', 4, '2019-10-20', '21:52:56', NULL, NULL),
('A', 4, '2019-10-21', '16:24:51', NULL, NULL),
('A', 4, '2019-10-22', '08:56:54', '09:19:49', NULL),
('A', 5, '2019-10-16', '14:25:02', NULL, NULL),
('A', 5, '2019-10-21', '16:25:24', NULL, NULL),
('A', 5, '2019-10-22', '09:01:10', '09:19:49', NULL),
('A', 6, '2019-10-16', '14:25:09', NULL, NULL),
('A', 6, '2019-10-21', '16:25:49', NULL, NULL),
('A', 6, '2019-10-22', '09:02:20', '09:19:49', NULL),
('A', 7, '2019-10-16', '14:25:15', NULL, NULL),
('A', 7, '2019-10-21', '16:26:29', NULL, NULL),
('A', 7, '2019-10-22', '09:02:42', '09:19:49', NULL),
('A', 8, '2019-10-16', '14:35:26', NULL, NULL),
('A', 8, '2019-10-21', '16:26:49', NULL, NULL),
('A', 8, '2019-10-22', '09:19:55', '09:24:31', '09:24:41'),
('A', 9, '2019-10-16', '14:36:06', NULL, NULL),
('A', 9, '2019-10-21', '17:05:19', NULL, NULL),
('A', 9, '2019-10-22', '09:24:18', '09:24:41', '09:24:42'),
('A', 10, '2019-10-16', '14:36:54', NULL, NULL),
('A', 10, '2019-10-22', '09:24:21', '09:24:42', '09:24:42'),
('A', 11, '2019-10-16', '14:37:48', NULL, NULL),
('A', 11, '2019-10-22', '09:29:19', '09:29:35', '09:30:37'),
('A', 12, '2019-10-16', '14:38:43', NULL, NULL),
('A', 12, '2019-10-22', '09:30:51', '09:30:52', '09:31:30'),
('A', 13, '2019-10-16', '14:39:34', NULL, NULL),
('A', 13, '2019-10-22', '09:35:04', '09:35:32', '09:36:38'),
('A', 14, '2019-10-16', '14:39:50', NULL, NULL),
('A', 14, '2019-10-22', '09:35:22', '09:35:49', NULL),
('A', 15, '2019-10-16', '14:41:11', NULL, NULL),
('A', 16, '2019-10-16', '14:42:33', NULL, NULL),
('A', 17, '2019-10-16', '14:43:32', NULL, NULL),
('A', 18, '2019-10-16', '14:44:00', NULL, NULL),
('A', 19, '2019-10-16', '14:44:12', NULL, NULL),
('A', 20, '2019-10-16', '14:44:37', NULL, NULL),
('A', 21, '2019-10-16', '14:46:39', NULL, NULL),
('A', 22, '2019-10-16', '14:47:16', NULL, NULL),
('A', 23, '2019-10-16', '14:47:21', NULL, NULL),
('A', 24, '2019-10-16', '14:55:06', NULL, NULL),
('P', 1, '2019-10-16', '14:25:22', NULL, NULL),
('P', 1, '2019-10-20', '21:52:53', NULL, NULL),
('P', 1, '2019-10-21', '16:25:31', NULL, NULL),
('P', 1, '2019-10-22', '09:35:19', '09:36:38', '09:36:43'),
('P', 2, '2019-10-16', '14:47:26', NULL, NULL),
('P', 2, '2019-10-20', '21:52:54', NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

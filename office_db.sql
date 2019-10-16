-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Ott 16, 2019 alle 16:55
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
CREATE TABLE `employee` (
  `ID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  `ID_counter` int(11) DEFAULT NULL,
  `status` varchar(10) NOT NULL,
  `ID_ticket_service` varchar(1) DEFAULT NULL,
  `ID_ticket_number` int(11) DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `employee_service`
--

DROP TABLE IF EXISTS `employee_service`;
CREATE TABLE `employee_service` (
  `ID_employee` int(11) NOT NULL,
  `ID_service` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `service`
--

DROP TABLE IF EXISTS `service`;
CREATE TABLE `service` (
  `ID` varchar(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `service_time_estimate` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `ticket`
--

DROP TABLE IF EXISTS `ticket`;
CREATE TABLE `ticket` (
  `ID_service` varchar(1) NOT NULL,
  `number` int(11) NOT NULL,
  `date` date NOT NULL,
  `time_start_waiting` time NOT NULL,
  `time_end_waiting` time DEFAULT NULL,
  `time_end_service` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `ticket`
--

INSERT INTO `ticket` (`ID_service`, `number`, `date`, `time_start_waiting`, `time_end_waiting`, `time_end_service`) VALUES
('A', 1, '2019-10-16', '14:24:33', NULL, NULL),
('A', 2, '2019-10-16', '14:24:40', NULL, NULL),
('A', 3, '2019-10-16', '14:24:48', NULL, NULL),
('A', 4, '2019-10-16', '14:24:55', NULL, NULL),
('A', 5, '2019-10-16', '14:25:02', NULL, NULL),
('A', 6, '2019-10-16', '14:25:09', NULL, NULL),
('A', 7, '2019-10-16', '14:25:15', NULL, NULL),
('A', 8, '2019-10-16', '14:35:26', NULL, NULL),
('A', 9, '2019-10-16', '14:36:06', NULL, NULL),
('A', 10, '2019-10-16', '14:36:54', NULL, NULL),
('A', 11, '2019-10-16', '14:37:48', NULL, NULL),
('A', 12, '2019-10-16', '14:38:43', NULL, NULL),
('A', 13, '2019-10-16', '14:39:34', NULL, NULL),
('A', 14, '2019-10-16', '14:39:50', NULL, NULL),
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
('P', 2, '2019-10-16', '14:47:26', NULL, NULL);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`ID`);

--
-- Indici per le tabelle `employee_service`
--
ALTER TABLE `employee_service`
  ADD PRIMARY KEY (`ID_employee`,`ID_service`);

--
-- Indici per le tabelle `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`ID`);

--
-- Indici per le tabelle `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`ID_service`,`number`,`date`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

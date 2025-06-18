-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Giu 18, 2025 alle 19:17
-- Versione del server: 8.0.36
-- Versione PHP: 8.0.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `my_lokalinomlud`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `Adoptation`
--

CREATE TABLE `Adoptation` (
  `A_Id` bigint UNSIGNED NOT NULL,
  `ISBN` char(13) NOT NULL,
  `School_Id` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `Book`
--

CREATE TABLE `Book` (
  `ISBN` char(13) NOT NULL,
  `Title` varchar(200) NOT NULL,
  `Author` varchar(100) NOT NULL,
  `Editor` varchar(100) NOT NULL,
  `Price_new` decimal(10,2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `Period`
--

CREATE TABLE `Period` (
  `P_Id` bigint UNSIGNED NOT NULL,
  `Description` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `Provider`
--

CREATE TABLE `Provider` (
  `Provider_Id` bigint UNSIGNED NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Surname` varchar(100) NOT NULL,
  `Phone_no` varchar(15) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `School` int NOT NULL,
  `Mail_list` tinyint(1) NOT NULL,
  `Delivery_period` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `Provider_Book`
--

CREATE TABLE `Provider_Book` (
  `PB_Id` bigint UNSIGNED NOT NULL,
  `ISBN` char(13) NOT NULL,
  `Provider_Id` int NOT NULL,
  `Dec_conditions` varchar(100) NOT NULL,
  `Comment` varchar(200) DEFAULT NULL,
  `Consign_date` timestamp NULL DEFAULT NULL,
  `Sold_date` timestamp NULL DEFAULT NULL,
  `Liquidation_date` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `School`
--

CREATE TABLE `School` (
  `School_Id` bigint UNSIGNED NOT NULL,
  `Name` varchar(200) NOT NULL,
  `Is_HighSchool` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `Adoptation`
--
ALTER TABLE `Adoptation`
  ADD PRIMARY KEY (`A_Id`),
  ADD UNIQUE KEY `A_Id` (`A_Id`),
  ADD KEY `ISBN` (`ISBN`),
  ADD KEY `School_Id` (`School_Id`);

--
-- Indici per le tabelle `Book`
--
ALTER TABLE `Book`
  ADD PRIMARY KEY (`ISBN`);

--
-- Indici per le tabelle `Period`
--
ALTER TABLE `Period`
  ADD PRIMARY KEY (`P_Id`),
  ADD UNIQUE KEY `P_Id` (`P_Id`);

--
-- Indici per le tabelle `Provider`
--
ALTER TABLE `Provider`
  ADD PRIMARY KEY (`Provider_Id`),
  ADD UNIQUE KEY `Provider_Id` (`Provider_Id`),
  ADD KEY `School` (`School`),
  ADD KEY `Delivery_period` (`Delivery_period`);

--
-- Indici per le tabelle `Provider_Book`
--
ALTER TABLE `Provider_Book`
  ADD PRIMARY KEY (`PB_Id`),
  ADD UNIQUE KEY `PB_Id` (`PB_Id`),
  ADD KEY `ISBN` (`ISBN`),
  ADD KEY `Provider_Id` (`Provider_Id`);

--
-- Indici per le tabelle `School`
--
ALTER TABLE `School`
  ADD PRIMARY KEY (`School_Id`),
  ADD UNIQUE KEY `School_Id` (`School_Id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `Adoptation`
--
ALTER TABLE `Adoptation`
  MODIFY `A_Id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `Period`
--
ALTER TABLE `Period`
  MODIFY `P_Id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `Provider`
--
ALTER TABLE `Provider`
  MODIFY `Provider_Id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `Provider_Book`
--
ALTER TABLE `Provider_Book`
  MODIFY `PB_Id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `School`
--
ALTER TABLE `School`
  MODIFY `School_Id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
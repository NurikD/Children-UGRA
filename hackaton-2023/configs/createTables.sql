-- create database
DROP DATABASE IF EXISTS hackathon;
CREATE DATABASE hackathon;
USE hackathon;

-- create table admins
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` varchar(50) NOT NULL,
  `token` varchar(100) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `patronomic` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL
);

-- create table childrens
DROP TABLE IF EXISTS `childrens`;
CREATE TABLE `childrens` (
  `id` varchar(50) NOT NULL,
  `token` varchar(100) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `patronomic` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `avatar` varchar(100) NOT NULL,
  `birth_date` bigint(20) NOT NULL,
  `city_id` int(11) NOT NULL,
  `talent_id` int(11) NOT NULL,
  `place_study` varchar(100) NOT NULL,
  `phone` varchar(50) NOT NULL
);

-- create table organizers
DROP TABLE IF EXISTS `organizers`;
CREATE TABLE `organizers` (
  `id` varchar(50) NOT NULL,
  `token` varchar(100) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `patronomic` varchar(50) NOT NULL,
  `birth_date` bigint(20) NOT NULL,
  `city_id` int(11) NOT NULL,
  `organization` varchar(100) NOT NULL,
  `specialty` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `passport` varchar(50),
  `confirmed` boolean NOT NULL
);

-- create table roles
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` varchar(50) NOT NULL,
  `token` varchar(100) NOT NULL,
  `role` text NOT NULL
);

-- create table events
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `city` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `date` bigint(20) NOT NULL,
  `duration` bigint(20) NOT NULL,
  `talent_id` int(11) NOT NULL,
  `organizer` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `photo` varchar(100) NOT NULL
);
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

-- create table talents
DROP TABLE IF EXISTS `talents`;
CREATE TABLE `talents` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL
);
ALTER TABLE `talents`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `talents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

-- create table cities
DROP TABLE IF EXISTS `cities`;
CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `city` varchar(50) NOT NULL
);
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
-- MySQL dump 10.13  Distrib 8.4.4, for Win64 (x86_64)
--
-- Host: localhost    Database: eatsy_food
-- ------------------------------------------------------
-- Server version	11.2.6-MariaDB

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
-- Current Database: `eatsy_food`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `eatsy_food` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `eatsy_food`;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `address_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `street` varchar(500) NOT NULL,
  `ward` varchar(255) NOT NULL,
  `district` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `label` enum('Home','Work','Other') DEFAULT 'Home',
  `is_default` tinyint(1) DEFAULT 0,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`address_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_user_default` (`user_id`,`is_default`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES ('ec77584b-bb01-4cea-b48f-2a3d6b47c36b','c52cd072-3da1-11f1-b276-40c2ba3a3365','765B Đường Ba Đình','Chánh Hưng',NULL,'TP.HCM','Home',0,NULL,NULL,'2026-04-21 18:59:48','2026-04-21 18:59:51');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cartitems`
--

DROP TABLE IF EXISTS `cartitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartitems` (
  `cart_item_id` char(36) NOT NULL,
  `dish_id` char(36) DEFAULT NULL,
  `cart_id` char(36) DEFAULT NULL,
  `price_snapshot` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL CHECK (`quantity` >= 0),
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`cart_item_id`),
  UNIQUE KEY `cart_id` (`cart_id`,`dish_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`dish_id`) ON DELETE CASCADE,
  CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitems`
--

LOCK TABLES `cartitems` WRITE;
/*!40000 ALTER TABLE `cartitems` DISABLE KEYS */;
INSERT INTO `cartitems` VALUES ('6f8e8b59-6781-4532-b21f-41ab32f0ebe3','a05e55bc-3da1-11f1-b276-40c2ba3a3365','364dfa81-ee15-4b84-9781-6ab59c9309d5',49000.00,2,'2026-04-21 16:55:16','2026-04-21 16:55:16');
/*!40000 ALTER TABLE `cartitems` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_cart_items_id_trigger
BEFORE INSERT ON CartItems
FOR EACH ROW
BEGIN
    IF NEW.cart_item_id IS NULL THEN
        SET NEW.cart_item_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `cart_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES ('364dfa81-ee15-4b84-9781-6ab59c9309d5','c52cd072-3da1-11f1-b276-40c2ba3a3365');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_carts_id_trigger
BEFORE INSERT ON Carts
FOR EACH ROW
BEGIN
    IF NEW.cart_id IS NULL THEN
        SET NEW.cart_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('a05c09c6-3da1-11f1-b276-40c2ba3a3365','Burgers','A variety of burgers including beef, chicken, abd veggie options','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05c19db-3da1-11f1-b276-40c2ba3a3365','Pizza','Different types of pizza, including classic and specialty options','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05c1a9d-3da1-11f1-b276-40c2ba3a3365','Mì','Different types of noodles like spaghetti, and stir-fried noodles','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05c1adf-3da1-11f1-b276-40c2ba3a3365','Cơm','Various rice dishes such as fried rice, steamed rice, and rice bowls','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05c1b0d-3da1-11f1-b276-40c2ba3a3365','Nước uống','Soft drinks, milkshakes, and a variety of beverages','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05c1b36-3da1-11f1-b276-40c2ba3a3365','Combos','Combo meals including a main dish, side, and drink','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05c1b65-3da1-11f1-b276-40c2ba3a3365','Ưu đãi đặc biệt','Limited-time offers and meal deals for customers','2026-04-21 23:46:04','2026-04-21 23:46:04');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_categories_id_trigger
BEFORE INSERT ON Categories
FOR EACH ROW
BEGIN
    IF NEW.category_id IS NULL OR NEW.category_id = ''
    THEN
        SET NEW.category_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `loyal_points` int(10) unsigned DEFAULT 0,
  PRIMARY KEY (`customer_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_customers_id_trigger
BEFORE INSERT ON Customers
FOR EACH ROW
BEGIN
    IF NEW.customer_id IS NULL THEN
        SET NEW.customer_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `dishaddons`
--

DROP TABLE IF EXISTS `dishaddons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dishaddons` (
  `addon_id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`addon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dishaddons`
--

LOCK TABLES `dishaddons` WRITE;
/*!40000 ALTER TABLE `dishaddons` DISABLE KEYS */;
/*!40000 ALTER TABLE `dishaddons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dishes`
--

DROP TABLE IF EXISTS `dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dishes` (
  `dish_id` char(36) NOT NULL,
  `category_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `thumbnail_path` varchar(1000) NOT NULL,
  `price` decimal(10,2) NOT NULL CHECK (`price` >= 0),
  `discount_amount` decimal(5,2) unsigned NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 100 CHECK (`stock` >= 0),
  `sold_count` int(11) NOT NULL DEFAULT 0 CHECK (`sold_count` >= 0),
  `rating_avg` decimal(2,1) DEFAULT 0.0,
  `rating_count` int(11) DEFAULT 0,
  `available` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `status` enum('draft','active','inactive') DEFAULT 'active',
  `preparation_time` int(11) DEFAULT NULL COMMENT 'minutes',
  `calories` int(11) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`dish_id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `dishes_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dishes`
--

LOCK TABLES `dishes` WRITE;
/*!40000 ALTER TABLE `dishes` DISABLE KEYS */;
INSERT INTO `dishes` VALUES ('a05e3aec-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','American Trio Charcoal Burger ( Size M )','american-trio-charcoal-burger-size-m',NULL,'Burger với 3 loại xốt mới và vỏ bánh than tre thủ công','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802062/ex_cheese_whp_jr_1_av3n9m.jpg',79000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e5480-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','American Trio Charcoal Burger ( Size L )','american-trio-charcoal-burger-size-l',NULL,'Burger với 3 loại xốt mới và vỏ bánh than tre thủ công','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802061/dbl-bbq-bc-chz_mkhjpv.jpg',129000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e5563-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','CHEESE RING BURGER','cheese-ring-burger',NULL,'Burger bò nướng Whopper ( cỡ vừa )','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802059/16-burger-b_-n_ng-whopper_1_uhyh8v.jpg',55000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e55bc-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','FISH BURGER','fish-burger',NULL,'Burger Cá giòn','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802059/12-burger-b_-n_ng-h_nh-chi_n_4_nkn25c.jpg',49000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e560b-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','GRILLED ONION BURGER','grilled-onion-burger',NULL,'Grilled Onion Burger','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802060/burger-american-jr_uvzewn.jpg',49000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e564e-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','EXTREME CHEESE BURGER JR','extreme-cheese-burger-jr-m',NULL,'Burger bò tắm phô mai ( cỡ vừa )','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802058/6-burger-ca_x5c3qq.jpg',65000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e5692-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','EXTREME CHEESE BURGER JR','extreme-cheese-burger-jr-l',NULL,'Burger bò tắm phô mai ( cỡ lớn )','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802058/6-burger-ca_x5c3qq.jpg',125000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e56ce-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','BBQ CHIC\'N CRISP CHEESE BURGER','bbq-chicn-crisp-cheese-burger-1',NULL,'Burger gà giòn phô mai sốt BBQ','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802060/burger-american-jr_uvzewn.jpg',49000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e570d-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','BBQ CHIC\'N CRISP CHEESE BURGER','bbq-chicn-crisp-cheese-burger-2',NULL,'Burger gà giòn phô mai sốt BBQ','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802057/2-mieng-b_-burger-b_-n_ng-whopper_3_eqkc20.jpg',49000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e574f-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','DOUBLE WHOPPER','double-whopper',NULL,'DOUBLE WHOPPER','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802057/2-mieng-b_-burger-b_-n_ng-whopper_3_eqkc20.jpg',175000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e578b-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','WHOPPER','whopper-l',NULL,'Burger bò nướng Whopper ( cỡ lớn )','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802057/2-mieng-b_-burger-b_-n_ng-whopper_3_eqkc20.jpg',125000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e57cd-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','WHOPPER','whopper-m',NULL,'Burger bò nướng Whopper ( cỡ vừa )','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802057/2-mieng-b_-burger-b_-n_ng-whopper_3_eqkc20.jpg',125000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e5822-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','DOUBLE CHEESEBURGER','double-cheeseburger',NULL,'Burger 2 miếng bò nướng phô mai','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802057/2-mieng-b_-burger-b_-n_ng-whopper_3_eqkc20.jpg',79000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e586d-3da1-11f1-b276-40c2ba3a3365','a05c09c6-3da1-11f1-b276-40c2ba3a3365','DOUBLE BBQ BACON CHEESE','double-bbq-bacon-cheese',NULL,'Burger 2 miếng bò nướng phô mai thịt xông khói','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802057/2-mieng-b_-burger-b_-n_ng-whopper_3_eqkc20.jpg',105000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e58aa-3da1-11f1-b276-40c2ba3a3365','a05c19db-3da1-11f1-b276-40c2ba3a3365','Pizza Siêu Topping Siêu Topping Hải Sản 4 Mùa','pizza-sieu-topping-hai-san-4-mua',NULL,'12 inches','https://res.cloudinary.com/dxitytnx9/image/upload/v1763292400/viber_image_2024-12-20_11-11-37-302_ezuu5p.jpg',355000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e58e3-3da1-11f1-b276-40c2ba3a3365','a05c19db-3da1-11f1-b276-40c2ba3a3365','Pizza Siêu Topping Hải Sản Xốt Pesto \"Chanh Sả\"','pizza-hai-san-pesto-chanh-sa',NULL,'9 inches','https://res.cloudinary.com/dxitytnx9/image/upload/v1763292400/viber_image_2024-12-20_11-11-35-787_caryzj.jpg',235000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e591e-3da1-11f1-b276-40c2ba3a3365','a05c19db-3da1-11f1-b276-40c2ba3a3365','Pizza Siêu Topping Bò Và Tôm Nướng Kiểu Mỹ','pizza-bo-tom-nuong-kieu-my',NULL,'9 inches','https://res.cloudinary.com/dxitytnx9/image/upload/v1763292398/Veggie-mania-Pizza-Rau-Cu-Thap-Cam_txn7kk.jpg',235000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e5957-3da1-11f1-b276-40c2ba3a3365','a05c19db-3da1-11f1-b276-40c2ba3a3365','Pizza Dăm Bông Dứa Kiểu Hawaii','pizza-hawaiian',NULL,'9 inches','https://res.cloudinary.com/dxitytnx9/image/upload/v1763292396/Pizza-Dam-Bong-Dua-Kieu-Hawaii-Hawaiian_hxanox.jpg',175000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e5996-3da1-11f1-b276-40c2ba3a3365','a05c1a9d-3da1-11f1-b276-40c2ba3a3365','Mì Carbonara','mi-carbonara',NULL,'Mì spaghetti, thịt xông khói, phô mai Parmesan','https://res.cloudinary.com/dxitytnx9/image/upload/v1763292392/mi-carbonara-300x300_rf01bi.jpg',155000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e59d0-3da1-11f1-b276-40c2ba3a3365','a05c1a9d-3da1-11f1-b276-40c2ba3a3365','Mì Bolognese','mi-bolognese',NULL,'Sự kết hợp hoàn hảo giữa mì spaghetti','https://res.cloudinary.com/dxitytnx9/image/upload/v1763292392/mi-bolognese-300x300_jz6iba.jpg',155000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e5a0a-3da1-11f1-b276-40c2ba3a3365','a05c1adf-3da1-11f1-b276-40c2ba3a3365','Cơm gà tắm nước mắm','com-ga-nuoc-mam',NULL,'','https://res.cloudinary.com/dxitytnx9/image/upload/v1763292386/38.RM4CmGTNM_t1h8o6.png',49000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e5a4b-3da1-11f1-b276-40c2ba3a3365','a05c1b0d-3da1-11f1-b276-40c2ba3a3365','Milo','milo',NULL,'','https://res.cloudinary.com/dxitytnx9/image/upload/v1763292391/Milohop_y8q3k6.webp',25000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e5a88-3da1-11f1-b276-40c2ba3a3365','a05c1b0d-3da1-11f1-b276-40c2ba3a3365','Coca Cola','coca-cola',NULL,'','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802123/Cocazero_fvx0tc.webp',15000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e5b8a-3da1-11f1-b276-40c2ba3a3365','a05c1b36-3da1-11f1-b276-40c2ba3a3365','COMBO DOUBLE WHOPPER JR.','combo-double-whopper-jr',NULL,'Combo burger + khoai + nước','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802112/m_n_ngon_ph_i_th_-_7_y1anbs.png',95000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05e5bcd-3da1-11f1-b276-40c2ba3a3365','a05c1b36-3da1-11f1-b276-40c2ba3a3365','Combo Cặp đôi ăn ý','combo-cap-doi',NULL,'2 mì + 2 nước + khoai','https://res.cloudinary.com/dgw84jhvl/image/upload/q_auto/f_auto/v1775802107/combo-doublewhopper_2_uqqe8q.jpg',145000.00,0.00,100,0,0.0,0,1,0,'active',NULL,NULL,NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04');
/*!40000 ALTER TABLE `dishes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_dishes_id_trigger
BEFORE INSERT ON Dishes
FOR EACH ROW
BEGIN
    IF NEW.dish_id IS NULL OR NEW.dish_id = '' THEN
        SET NEW.dish_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `dishimages`
--

DROP TABLE IF EXISTS `dishimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dishimages` (
  `image_id` char(36) NOT NULL,
  `dish_id` char(36) DEFAULT NULL,
  `image_url` varchar(1000) DEFAULT NULL,
  `is_thumbnail` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`image_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `dishimages_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`dish_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dishimages`
--

LOCK TABLES `dishimages` WRITE;
/*!40000 ALTER TABLE `dishimages` DISABLE KEYS */;
/*!40000 ALTER TABLE `dishimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dishvariants`
--

DROP TABLE IF EXISTS `dishvariants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dishvariants` (
  `variant_id` char(36) NOT NULL,
  `dish_id` char(36) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`variant_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `dishvariants_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`dish_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dishvariants`
--

LOCK TABLES `dishvariants` WRITE;
/*!40000 ALTER TABLE `dishvariants` DISABLE KEYS */;
/*!40000 ALTER TABLE `dishvariants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoiceitems`
--

DROP TABLE IF EXISTS `invoiceitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoiceitems` (
  `invoice_item_id` char(36) NOT NULL,
  `invoice_id` char(36) NOT NULL,
  `dish_id` char(36) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1 CHECK (`quantity` > 0),
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`invoice_item_id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `invoiceitems_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE CASCADE,
  CONSTRAINT `invoiceitems_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`dish_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoiceitems`
--

LOCK TABLES `invoiceitems` WRITE;
/*!40000 ALTER TABLE `invoiceitems` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoiceitems` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_invoice_items_id_trigger
BEFORE INSERT ON InvoiceItems
FOR EACH ROW
BEGIN
    IF NEW.invoice_item_id IS NULL THEN
        SET NEW.invoice_item_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `invoice_id` char(36) NOT NULL,
  `customer_id` char(36) NOT NULL,
  `employee_id` char(36) NOT NULL,
  `payment_method_id` int(11) NOT NULL,
  `shipping_fee` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('Paid','Pending','Cancelled') DEFAULT 'Pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`invoice_id`),
  KEY `customer_id` (`customer_id`),
  KEY `employee_id` (`employee_id`),
  KEY `payment_method_id` (`payment_method_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE,
  CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `invoices_ibfk_3` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethods` (`payment_method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_invoices_id_trigger
BEFORE INSERT ON Invoices
FOR EACH ROW
BEGIN
    IF NEW.invoice_id IS NULL THEN
        SET NEW.invoice_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitems` (
  `order_item_id` char(36) NOT NULL,
  `order_id` char(36) DEFAULT NULL,
  `dish_id` char(36) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`dish_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitems`
--

LOCK TABLES `orderitems` WRITE;
/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_order_items_id_trigger
BEFORE INSERT ON OrderItems
FOR EACH ROW
BEGIN
    IF NEW.order_item_id IS NULL THEN
        SET NEW.order_item_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `order_note` text DEFAULT NULL,
  `order_status` enum('Pending','In Progress','Completed','Cancelled') NOT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_orders_id_trigger
BEFORE INSERT ON Orders
FOR EACH ROW
BEGIN
    IF NEW.order_id IS NULL THEN
        SET NEW.order_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `otp`
--

DROP TABLE IF EXISTS `otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp` (
  `otp_id` char(36) NOT NULL,
  `info` varchar(255) NOT NULL,
  `country_code` char(10) DEFAULT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`otp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp`
--

LOCK TABLES `otp` WRITE;
/*!40000 ALTER TABLE `otp` DISABLE KEYS */;
INSERT INTO `otp` VALUES ('00e2f956-b80d-4339-a4eb-19a651896ef9','0909943237','+84','817412','2026-04-21 19:07:49','2026-04-21 18:57:49');
/*!40000 ALTER TABLE `otp` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_otp_id_trigger
BEFORE INSERT ON OTP
FOR EACH ROW
BEGIN
    IF NEW.otp_id IS NULL THEN
        SET NEW.otp_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `paymentmethods`
--

DROP TABLE IF EXISTS `paymentmethods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentmethods` (
  `payment_method_id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`payment_method_id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentmethods`
--

LOCK TABLES `paymentmethods` WRITE;
/*!40000 ALTER TABLE `paymentmethods` DISABLE KEYS */;
INSERT INTO `paymentmethods` VALUES (1,'cash','Cash',1,'2026-04-21 23:46:04'),(2,'credit_card','Credit Card',1,'2026-04-21 23:46:04'),(3,'momo','Momo',1,'2026-04-21 23:46:04'),(4,'zalopay','Zalo Pay',1,'2026-04-21 23:46:04'),(5,'bank_transfer','Bank Transfer',1,'2026-04-21 23:46:04');
/*!40000 ALTER TABLE `paymentmethods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `dish_id` char(36) DEFAULT NULL,
  `points` decimal(2,1) NOT NULL CHECK (`points` >= 0 and `points` <= 5),
  `content` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`review_id`),
  KEY `user_id` (`user_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`dish_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES ('a06115ae-3da1-11f1-b276-40c2ba3a3365','a05f3285-3da1-11f1-b276-40c2ba3a3365','a05e578b-3da1-11f1-b276-40c2ba3a3365',5.0,'Burger rất ngon, thịt bò nướng vừa ý, rau củ tươi. Sẽ quay lại lần sau!','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a06117de-3da1-11f1-b276-40c2ba3a3365','a05f3285-3da1-11f1-b276-40c2ba3a3365',NULL,4.5,'Pizza hải sản phong phú, topping nhiều. Đế bánh giòn tan. Recommend!','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a06118cf-3da1-11f1-b276-40c2ba3a3365','a05f352a-3da1-11f1-b276-40c2ba3a3365','a05e574f-3da1-11f1-b276-40c2ba3a3365',4.8,'Double Whopper rất đáng tiền! 2 miếng bò dày, ngon lắm. Chỉ hơi nhiều cho 1 người ăn thôi.','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a061192c-3da1-11f1-b276-40c2ba3a3365','a05f352a-3da1-11f1-b276-40c2ba3a3365','a05e5996-3da1-11f1-b276-40c2ba3a3365',4.0,'Mì Carbonara béo ngậy, phô mai thơm. Tuy nhiên hơi mặn một chút.','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a061197f-3da1-11f1-b276-40c2ba3a3365','a05f3615-3da1-11f1-b276-40c2ba3a3365',NULL,5.0,'Pizza phô mai 4 loại, tan chảy trong miệng. Tuyệt vời! Sẽ đặt thường xuyên.','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a06119c7-3da1-11f1-b276-40c2ba3a3365','a05f3615-3da1-11f1-b276-40c2ba3a3365','a05e5a0a-3da1-11f1-b276-40c2ba3a3365',3.5,'Cơm gà tạm ổn, gà hơi khô. Nước mắm ngon nhưng ít quá.','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a0611a0f-3da1-11f1-b276-40c2ba3a3365','a05f3668-3da1-11f1-b276-40c2ba3a3365','a05e578b-3da1-11f1-b276-40c2ba3a3365',4.7,'Whopper xứng đáng là burger kinh điển. Xốt đặc biệt rất ngon!','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a0611a56-3da1-11f1-b276-40c2ba3a3365','a05f3668-3da1-11f1-b276-40c2ba3a3365',NULL,5.0,'Pizza siêu topping thật sự siêu! Hải sản tươi ngon, topping đầy đủ. Worth it!','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a0611a94-3da1-11f1-b276-40c2ba3a3365','a05f36b1-3da1-11f1-b276-40c2ba3a3365','a05e5996-3da1-11f1-b276-40c2ba3a3365',4.2,'Mì Ý ngon, phần ăn vừa đủ. Thịt xông khói thơm, trứng lòng đào chuẩn.','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a0611ad6-3da1-11f1-b276-40c2ba3a3365','a05f36b1-3da1-11f1-b276-40c2ba3a3365','a05e574f-3da1-11f1-b276-40c2ba3a3365',4.9,'Hamburger ngon nhất từng ăn! Thịt bò tươi, nướng vừa chín. 10/10!','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a0611b17-3da1-11f1-b276-40c2ba3a3365','a05f3285-3da1-11f1-b276-40c2ba3a3365','a05e5a0a-3da1-11f1-b276-40c2ba3a3365',3.8,'Cơm gà ổn, giá hợp lý. Thích hợp cho bữa trưa nhanh gọn.','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a0611b56-3da1-11f1-b276-40c2ba3a3365','a05f352a-3da1-11f1-b276-40c2ba3a3365',NULL,4.6,'Phô mai kéo sợi dài, bánh mềm. Ăn một lần nhớ mãi.','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a0611b93-3da1-11f1-b276-40c2ba3a3365','a05f3615-3da1-11f1-b276-40c2ba3a3365','a05e574f-3da1-11f1-b276-40c2ba3a3365',4.5,'Burger size lớn, đầy đặn. Phù hợp cho người ăn nhiều như mình.','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a0611bd4-3da1-11f1-b276-40c2ba3a3365','a05f3668-3da1-11f1-b276-40c2ba3a3365','a05e5996-3da1-11f1-b276-40c2ba3a3365',4.3,'Mì Carbonara chuẩn vị Ý. Giá có hơi cao nhưng chất lượng xứng đáng.','2026-04-21 23:46:04','2026-04-21 23:46:04'),('a0611c13-3da1-11f1-b276-40c2ba3a3365','a05f36b1-3da1-11f1-b276-40c2ba3a3365',NULL,4.7,'Pizza hải sản tươi ngon, không tanh. Đế bánh giòn rụm. Thích quá!','2026-04-21 23:46:04','2026-04-21 23:46:04');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_reviews_id_trigger
BEFORE INSERT ON Reviews
FOR EACH ROW
BEGIN
    IF NEW.review_id IS NULL OR NEW.review_id = '' THEN
        SET NEW.review_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` char(36) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `type_login` enum('Standard','Google','Facebook','Apple') NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `country_code` varchar(10) NOT NULL,
  `role` enum('Admin','Customer','Owner','Employee') DEFAULT 'Customer',
  `avatar_path` varchar(1000) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` datetime DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT 1,
  `payment_method_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `phone_number` (`phone_number`),
  UNIQUE KEY `email` (`email`),
  KEY `payment_method_id` (`payment_method_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethods` (`payment_method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('a05f3285-3da1-11f1-b276-40c2ba3a3365','Nguyễn Văn An',NULL,NULL,'$2a$10$dummyhash1','nguyenvanan','Standard','nguyenvanan@gmail.com','0901234567','+84','Customer',NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04',NULL,1,NULL),('a05f352a-3da1-11f1-b276-40c2ba3a3365','Trần Thị Bình',NULL,NULL,'$2a$10$dummyhash2','tranthibinh','Standard','tranthibinh@gmail.com','0902345678','+84','Customer',NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04',NULL,1,NULL),('a05f3615-3da1-11f1-b276-40c2ba3a3365','Lê Hoàng Cường',NULL,NULL,'$2a$10$dummyhash3','lehoangcuong','Standard','lehoangcuong@gmail.com','0903456789','+84','Customer',NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04',NULL,1,NULL),('a05f3668-3da1-11f1-b276-40c2ba3a3365','Phạm Thị Dung',NULL,NULL,'$2a$10$dummyhash4','phamthidung','Standard','phamthidung@gmail.com','0904567890','+84','Customer',NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04',NULL,1,NULL),('a05f36b1-3da1-11f1-b276-40c2ba3a3365','Hoàng Minh Đức',NULL,NULL,'$2a$10$dummyhash5','hoangminhduc','Standard','hoangminhduc@gmail.com','0905678901','+84','Customer',NULL,'2026-04-21 23:46:04','2026-04-21 23:46:04',NULL,1,NULL),('c52cd072-3da1-11f1-b276-40c2ba3a3365','Nguyễn Phan Minh Mẫn','Male','2026-04-02','$2b$10$JsIsf3dbo6bNkNkbwq0wN.lkl1q7tlu3E7zKWTxv0tFgT5u5SkESW','man','Standard','nguyenphanminhman04@gmail.com','0909943237','+84','Customer',NULL,'2026-04-21 16:47:05','2026-04-21 16:56:17',NULL,1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_users_id_trigger
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    IF NEW.user_id IS NULL OR NEW.user_id = '' THEN
        SET NEW.user_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `uservoucher`
--

DROP TABLE IF EXISTS `uservoucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uservoucher` (
  `user_id` char(255) NOT NULL,
  `voucher_id` char(255) NOT NULL,
  `used_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`,`voucher_id`),
  KEY `voucher_id` (`voucher_id`),
  CONSTRAINT `uservoucher_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `uservoucher_ibfk_2` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`voucher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uservoucher`
--

LOCK TABLES `uservoucher` WRITE;
/*!40000 ALTER TABLE `uservoucher` DISABLE KEYS */;
/*!40000 ALTER TABLE `uservoucher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vouchers` (
  `voucher_id` char(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('Percentage','Amount') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `valid_from` datetime NOT NULL,
  `valid_to` datetime NOT NULL,
  `min_purchase` decimal(10,2) DEFAULT 0.00,
  `number_of_uses` int(11) DEFAULT 1 CHECK (`number_of_uses` >= 0),
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`voucher_id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
INSERT INTO `vouchers` VALUES ('a05ec0af-3da1-11f1-b276-40c2ba3a3365','EATSYWELCOME','Giảm 10% cho hóa đơn','Percentage',0.10,'2025-01-01 00:00:00','2025-12-31 23:59:59',0.00,999,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05ec2aa-3da1-11f1-b276-40c2ba3a3365','EATSY50','Giảm 50.000đ cho đơn hàng từ 500.000đ','Amount',50000.00,'2025-01-01 00:00:00','2025-06-30 23:59:59',500000.00,100,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05ec359-3da1-11f1-b276-40c2ba3a3365','WELCOME20','Chào mừng khách hàng mới, giảm 20%','Percentage',0.20,'2025-01-01 00:00:00','2025-03-31 23:59:59',0.00,100,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05ec397-3da1-11f1-b276-40c2ba3a3365','BIGSALE100','Giảm 100.000đ cho đơn hàng từ 1.000.000đ','Amount',100000.00,'2025-01-01 00:00:00','2025-08-31 23:59:59',1000000.00,100,'2026-04-21 23:46:04','2026-04-21 23:46:04'),('a05ec3ce-3da1-11f1-b276-40c2ba3a3365','FREESHIP','Miễn phí vận chuyển cho đơn hàng từ 300.000đ','Amount',30000.00,'2025-01-01 00:00:00','2025-12-31 23:59:59',300000.00,100,'2026-04-21 23:46:04','2026-04-21 23:46:04');
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`eatsy_user`@`localhost`*/ /*!50003 TRIGGER insert_vouchers_id_trigger
BEFORE INSERT ON Vouchers
FOR EACH ROW
BEGIN
    IF NEW.voucher_id IS NULL OR NEW.voucher_id = '' THEN
        SET NEW.voucher_id = UUID();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-22  2:12:56

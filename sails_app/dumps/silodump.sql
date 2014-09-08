-- MySQL dump 10.15  Distrib 10.0.11-MariaDB, for debian-linux-gnu (i686)
--
-- Host: localhost    Database: siloapp
-- ------------------------------------------------------
-- Server version	10.0.11-MariaDB-1~precise-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity` (
  `rest_call` varchar(255) NOT NULL,
  `role` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role` (`role`),
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`role`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alertdata`
--

DROP TABLE IF EXISTS `alertdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alertdata` (
  `rfidTagNum` int(11) DEFAULT NULL,
  `alerthandler_name` varchar(255) DEFAULT NULL,
  `threshold` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `timestamp` int(11) DEFAULT NULL,
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alertdata`
--

LOCK TABLES `alertdata` WRITE;
/*!40000 ALTER TABLE `alertdata` DISABLE KEYS */;
INSERT INTO `alertdata` VALUES (314,'MinThreshold',30,'warning',1409259314,1,'2014-08-28 16:55:13','2014-08-28 16:55:13'),(276,'MinThreshold',30,'warning',1409259314,2,'2014-08-28 16:55:13','2014-08-28 16:55:13'),(235,'MinThreshold',NULL,'ok',1409259314,3,'2014-08-28 16:55:13','2014-08-28 16:55:13'),(314,'MinThreshold',30,'warning',1409323552,4,'2014-08-29 10:45:52','2014-08-29 10:45:52'),(276,'MinThreshold',30,'warning',1409323552,5,'2014-08-29 10:45:52','2014-08-29 10:45:52'),(235,'MinThreshold',30,'warning',1409323552,6,'2014-08-29 10:45:52','2014-08-29 10:45:52'),(314,'MinThreshold',30,'warning',1409324154,7,'2014-08-29 10:55:54','2014-08-29 10:55:54'),(276,'MinThreshold',30,'warning',1409324154,8,'2014-08-29 10:55:54','2014-08-29 10:55:54'),(235,'MinThreshold',30,'warning',1409324154,9,'2014-08-29 10:55:54','2014-08-29 10:55:54'),(314,'MinThreshold',30,'warning',1409324767,10,'2014-08-29 11:06:06','2014-08-29 11:06:06'),(276,'MinThreshold',30,'warning',1409324767,11,'2014-08-29 11:06:06','2014-08-29 11:06:06'),(235,'MinThreshold',30,'warning',1409324767,12,'2014-08-29 11:06:06','2014-08-29 11:06:06'),(314,'MinThreshold',30,'warning',1409325310,13,'2014-08-29 11:15:09','2014-08-29 11:15:09'),(276,'MinThreshold',30,'warning',1409325310,14,'2014-08-29 11:15:09','2014-08-29 11:15:09'),(235,'MinThreshold',30,'warning',1409325310,15,'2014-08-29 11:15:09','2014-08-29 11:15:09'),(314,'MinThreshold',30,'warning',1409325914,16,'2014-08-29 11:25:13','2014-08-29 11:25:13'),(276,'MinThreshold',30,'warning',1409325914,17,'2014-08-29 11:25:13','2014-08-29 11:25:13'),(235,'MinThreshold',30,'warning',1409325914,18,'2014-08-29 11:25:13','2014-08-29 11:25:13'),(314,'MinThreshold',30,'warning',1409326525,19,'2014-08-29 11:35:25','2014-08-29 11:35:25'),(276,'MinThreshold',30,'warning',1409326525,20,'2014-08-29 11:35:25','2014-08-29 11:35:25'),(235,'MinThreshold',30,'warning',1409326525,21,'2014-08-29 11:35:25','2014-08-29 11:35:25'),(314,'MinThreshold',30,'warning',1409327128,22,'2014-08-29 11:45:28','2014-08-29 11:45:28'),(276,'MinThreshold',30,'warning',1409327128,23,'2014-08-29 11:45:28','2014-08-29 11:45:28'),(235,'MinThreshold',30,'warning',1409327128,24,'2014-08-29 11:45:28','2014-08-29 11:45:28'),(314,'MinThreshold',30,'warning',1409327731,25,'2014-08-29 11:55:31','2014-08-29 11:55:31'),(276,'MinThreshold',30,'warning',1409327731,26,'2014-08-29 11:55:31','2014-08-29 11:55:31'),(235,'MinThreshold',30,'warning',1409327731,27,'2014-08-29 11:55:31','2014-08-29 11:55:31'),(314,'MinThreshold',30,'warning',1409328334,28,'2014-08-29 12:05:33','2014-08-29 12:05:33'),(276,'MinThreshold',30,'warning',1409328334,29,'2014-08-29 12:05:33','2014-08-29 12:05:33'),(235,'MinThreshold',30,'warning',1409328334,30,'2014-08-29 12:05:33','2014-08-29 12:05:33'),(314,'MinThreshold',30,'warning',1409328939,31,'2014-08-29 12:15:38','2014-08-29 12:15:38'),(276,'MinThreshold',30,'warning',1409328939,32,'2014-08-29 12:15:38','2014-08-29 12:15:38'),(235,'MinThreshold',30,'warning',1409328939,33,'2014-08-29 12:15:39','2014-08-29 12:15:39'),(314,'MinThreshold',30,'warning',1409329551,34,'2014-08-29 12:25:50','2014-08-29 12:25:50'),(276,'MinThreshold',30,'warning',1409329551,35,'2014-08-29 12:25:50','2014-08-29 12:25:50'),(235,'MinThreshold',30,'warning',1409329551,36,'2014-08-29 12:25:50','2014-08-29 12:25:50'),(314,'MinThreshold',30,'warning',1409330153,37,'2014-08-29 12:35:53','2014-08-29 12:35:53'),(276,'MinThreshold',30,'warning',1409330153,38,'2014-08-29 12:35:53','2014-08-29 12:35:53'),(235,'MinThreshold',30,'warning',1409330153,39,'2014-08-29 12:35:53','2014-08-29 12:35:53'),(314,'MinThreshold',30,'warning',1409331363,40,'2014-08-29 12:56:02','2014-08-29 12:56:02'),(276,'MinThreshold',30,'warning',1409331363,41,'2014-08-29 12:56:02','2014-08-29 12:56:02'),(235,'MinThreshold',30,'warning',1409331363,42,'2014-08-29 12:56:02','2014-08-29 12:56:02'),(314,'MinThreshold',30,'warning',1409331965,43,'2014-08-29 13:06:05','2014-08-29 13:06:05'),(276,'MinThreshold',30,'warning',1409331965,44,'2014-08-29 13:06:05','2014-08-29 13:06:05'),(235,'MinThreshold',30,'warning',1409331965,45,'2014-08-29 13:06:05','2014-08-29 13:06:05'),(314,'MinThreshold',30,'warning',1409332511,46,'2014-08-29 13:15:10','2014-08-29 13:15:10'),(276,'MinThreshold',30,'warning',1409332511,47,'2014-08-29 13:15:10','2014-08-29 13:15:10'),(235,'MinThreshold',30,'warning',1409332511,48,'2014-08-29 13:15:10','2014-08-29 13:15:10'),(314,'MinThreshold',30,'warning',1409333113,49,'2014-08-29 13:25:13','2014-08-29 13:25:13'),(276,'MinThreshold',30,'warning',1409333113,50,'2014-08-29 13:25:13','2014-08-29 13:25:13'),(235,'MinThreshold',30,'warning',1409333113,51,'2014-08-29 13:25:13','2014-08-29 13:25:13'),(314,'MinThreshold',30,'warning',1409333716,52,'2014-08-29 13:35:15','2014-08-29 13:35:15'),(276,'MinThreshold',30,'warning',1409333716,53,'2014-08-29 13:35:15','2014-08-29 13:35:15'),(235,'MinThreshold',30,'warning',1409333716,54,'2014-08-29 13:35:15','2014-08-29 13:35:15'),(314,'MinThreshold',30,'warning',1409334318,55,'2014-08-29 13:45:18','2014-08-29 13:45:18'),(276,'MinThreshold',30,'warning',1409334318,56,'2014-08-29 13:45:18','2014-08-29 13:45:18'),(235,'MinThreshold',30,'warning',1409334318,57,'2014-08-29 13:45:18','2014-08-29 13:45:18');
/*!40000 ALTER TABLE `alertdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard`
--

DROP TABLE IF EXISTS `dashboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dashboard` (
  `organization` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard`
--

LOCK TABLES `dashboard` WRITE;
/*!40000 ALTER TABLE `dashboard` DISABLE KEYS */;
/*!40000 ALTER TABLE `dashboard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard_widget`
--

DROP TABLE IF EXISTS `dashboard_widget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dashboard_widget` (
  `dashboard` int(11) DEFAULT NULL,
  `widget` int(11) DEFAULT NULL,
  `data_filter` varchar(3000) DEFAULT NULL,
  `options` varchar(5000) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `display_name_2` varchar(255) DEFAULT NULL,
  `widget_order` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard_widget`
--

LOCK TABLES `dashboard_widget` WRITE;
/*!40000 ALTER TABLE `dashboard_widget` DISABLE KEYS */;
/*!40000 ALTER TABLE `dashboard_widget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email`
--

DROP TABLE IF EXISTS `email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email` (
  `username` varchar(255) NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `silo` int(11) NOT NULL,
  `threshold` int(11) NOT NULL,
  `alarm_status` varchar(255) NOT NULL,
  `email_status` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2451 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email`
--

LOCK TABLES `email` WRITE;
/*!40000 ALTER TABLE `email` DISABLE KEYS */;
INSERT INTO `email` VALUES ('jlam','jonathan.g.lam@gmail.com',3,65,'warning','success',2449,'2014-08-28 13:54:31','2014-08-28 13:54:31'),('jlam','jonathan.g.lam@gmail.com',2,30,'warning','success',2450,'2014-08-29 10:46:52','2014-08-29 10:46:52');
/*!40000 ALTER TABLE `email` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `farm`
--

DROP TABLE IF EXISTS `farm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `farm` (
  `name` varchar(255) NOT NULL,
  `region` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `organization` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `region` (`region`),
  CONSTRAINT `farm_ibfk_1` FOREIGN KEY (`region`) REFERENCES `region` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `farm`
--

LOCK TABLES `farm` WRITE;
/*!40000 ALTER TABLE `farm` DISABLE KEYS */;
INSERT INTO `farm` VALUES ('Grand Valley Farms (1)',1,'43.442798, -80.482660','123 Fake St, Kitchener, ON|M1A1A1',1,1,'2014-08-21 09:51:07','2014-08-21 09:51:07'),('Grand Valley Farms (2)',1,'43.445000, -80.482660','123 Abc Rd, Kitchener, ON|M1A1A1',1,2,'2014-08-29 11:37:44','2014-08-29 11:37:44'),('Grand Valley Farms (3)',1,'43.446000, -80.482660','123 Abc Rd, Kitchener, ON|M1A1A1',1,3,'2014-08-29 11:37:44','2014-08-29 11:37:44'),('Grand Valley Farms (4)',1,'43.447000, -80.482660','123 Abc Rd, Kitchener, ON|M1A1A1',1,4,'2014-08-29 11:37:44','2014-08-29 11:37:44'),('Grand Valley Farms (5)',1,'43.448000, -80.482660','123 Abc Rd, Kitchener, ON|M1A1A1',1,5,'2014-08-29 11:37:44','2014-08-29 11:37:44'),('Grand Valley Farms (6)',1,'43.449000, -80.482660','123 Abc Rd, Kitchener, ON|M1A1A1',1,6,'2014-08-29 11:37:44','2014-08-29 11:37:44');
/*!40000 ALTER TABLE `farm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organization`
--

DROP TABLE IF EXISTS `organization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organization` (
  `name` varchar(255) DEFAULT NULL,
  `auth_token` varchar(255) DEFAULT NULL,
  `parent` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization`
--

LOCK TABLES `organization` WRITE;
/*!40000 ALTER TABLE `organization` DISABLE KEYS */;
INSERT INTO `organization` VALUES ('Grand Valley','ccbcad4b-8df6-45d5-8868-2a83b3edf79d',NULL,1,'2014-08-27 12:30:30','2014-08-27 12:30:30'),('Another Organization','6b29b635-8c64-4283-8e52-a038e7d5f694',NULL,2,'2014-08-27 12:38:29','2014-08-27 12:38:29');
/*!40000 ALTER TABLE `organization` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `name` varchar(255) NOT NULL,
  `SKU_ID` varchar(255) NOT NULL,
  `organization` int(11) DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('Product 1','1111111',1,'This is product 1',1,'2014-08-21 09:38:50','2014-08-27 10:20:32'),('Product 2','2222222',1,'This is product 2',2,'2014-08-21 09:38:50','2014-08-21 09:38:50'),('Product 3','3333333',1,'This is product 3',3,'2014-08-21 09:38:50','2014-08-21 09:38:50'),('Poo','poo123poo',2,'This is poo',4,'2014-08-27 12:39:02','2014-08-27 12:39:02'),('Poo2','123123po2',1,'The23123',5,'2014-08-27 13:11:04','2014-08-27 13:11:13');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `region`
--

DROP TABLE IF EXISTS `region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `region` (
  `name` varchar(255) NOT NULL,
  `geofence` varchar(1000) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `region`
--

LOCK TABLES `region` WRITE;
/*!40000 ALTER TABLE `region` DISABLE KEYS */;
INSERT INTO `region` VALUES ('Region A','[[1,1],[2,2]]',1,'2014-08-21 09:40:58','2014-08-21 09:40:58');
/*!40000 ALTER TABLE `region` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfidalerthandler`
--

DROP TABLE IF EXISTS `rfidalerthandler`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rfidalerthandler` (
  `rfid` int(11) DEFAULT NULL,
  `alerthandler_name` varchar(255) DEFAULT NULL,
  `config` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfidalerthandler`
--

LOCK TABLES `rfidalerthandler` WRITE;
/*!40000 ALTER TABLE `rfidalerthandler` DISABLE KEYS */;
INSERT INTO `rfidalerthandler` VALUES (256,'MinThreshold','{\"threshold\": [30]}',1,'2014-08-27 17:06:51','2014-08-27 17:06:51'),(235,'MinThreshold','{\"threshold\": [30]}',2,'2014-08-28 16:50:40','2014-08-28 16:50:40'),(276,'MinThreshold','{\"threshold\": [30]}',3,'2014-08-28 16:50:40','2014-08-28 16:50:40'),(215,'MinThreshold','{\"threshold\": [30]}',4,'2014-08-28 16:50:40','2014-08-28 16:50:40'),(314,'MinThreshold','{\"threshold\": [30]}',5,'2014-08-28 16:50:40','2014-08-28 16:50:40');
/*!40000 ALTER TABLE `rfidalerthandler` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `name` varchar(255) NOT NULL,
  `user` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  CONSTRAINT `role_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES ('admin',1,1,'2014-08-21 10:28:14','2014-08-21 10:28:14');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `silo`
--

DROP TABLE IF EXISTS `silo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `silo` (
  `name` varchar(255) NOT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `farm` int(11) NOT NULL,
  `product` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `capacity` int(11) DEFAULT NULL,
  `rfid` int(11) DEFAULT NULL,
  `level_1` int(11) DEFAULT NULL,
  `level_2` int(11) DEFAULT NULL,
  `level_3` int(11) DEFAULT NULL,
  `level_4` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `farm` (`farm`),
  KEY `product` (`product`),
  CONSTRAINT `silo_ibfk_1` FOREIGN KEY (`farm`) REFERENCES `farm` (`id`),
  CONSTRAINT `silo_ibfk_2` FOREIGN KEY (`product`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `silo`
--

LOCK TABLES `silo` WRITE;
/*!40000 ALTER TABLE `silo` DISABLE KEYS */;
INSERT INTO `silo` VALUES ('Silo 1','This is Silo 1 Desc',1,1,'43.442798, -80.542660',100,256,60,60,30,30,1,'2014-08-21 09:52:44','2014-08-28 10:57:19'),('Silo 2','This is Silo 2 Desc',1,2,'43.442798, -80.402660',100,235,60,60,30,30,2,'2014-08-21 09:52:44','2014-08-26 15:39:19'),('Silo 3','This is Silo 3 Desc',1,3,'43.442798, -80.472800',100,276,60,60,30,30,3,'2014-08-28 12:21:20','2014-08-28 15:31:33'),('Silo 4','This is Silo 4 Desc',1,2,'43.442798, -80.472400',100,215,60,60,30,30,4,'2014-08-28 16:47:35','2014-08-28 16:47:35'),('Silo 5','This is Silo 5 Desc',1,1,'43.442870, -80.472600',100,314,60,60,30,30,5,'2014-08-28 16:47:35','2014-08-28 16:47:35');
/*!40000 ALTER TABLE `silo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `silochangelog`
--

DROP TABLE IF EXISTS `silochangelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `silochangelog` (
  `silo` int(11) NOT NULL,
  `old_product` int(11) DEFAULT NULL,
  `new_product` int(11) DEFAULT NULL,
  `timestamp` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `silo` (`silo`),
  KEY `old_product` (`old_product`),
  KEY `new_product` (`new_product`),
  CONSTRAINT `silochangelog_ibfk_1` FOREIGN KEY (`silo`) REFERENCES `silo` (`id`),
  CONSTRAINT `silochangelog_ibfk_2` FOREIGN KEY (`old_product`) REFERENCES `product` (`id`),
  CONSTRAINT `silochangelog_ibfk_3` FOREIGN KEY (`new_product`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `silochangelog`
--

LOCK TABLES `silochangelog` WRITE;
/*!40000 ALTER TABLE `silochangelog` DISABLE KEYS */;
INSERT INTO `silochangelog` VALUES (1,2,1,1408637000,1,'2014-08-26 09:30:04','2014-08-26 09:30:04'),(2,1,2,1409081959,2,'2014-08-26 15:39:19','2014-08-26 15:39:19'),(1,1,1,1409237839,3,'2014-08-28 10:57:19','2014-08-28 10:57:19'),(3,1,3,1409254293,4,'2014-08-28 15:31:33','2014-08-28 15:31:33');
/*!40000 ALTER TABLE `silochangelog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `silodata`
--

DROP TABLE IF EXISTS `silodata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `silodata` (
  `accountID` varchar(255) DEFAULT NULL,
  `deviceID` varchar(255) DEFAULT NULL,
  `statusCode` int(11) DEFAULT NULL,
  `rfidTagNum` varchar(255) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `binaryLevel` varchar(32) DEFAULT NULL,
  `rawData` varchar(255) DEFAULT NULL,
  `timestamp` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `silodata`
--

LOCK TABLES `silodata` WRITE;
/*!40000 ALTER TABLE `silodata` DISABLE KEYS */;
INSERT INTO `silodata` VALUES ('grandvalley','grand01',62720,'356',0,'0000',NULL,1408994465,1,'2014-08-28 16:41:08','2014-08-28 16:41:08'),('grandvalley','grand01',62720,'356',0,'0000',NULL,1408995065,2,'2014-08-28 16:41:08','2014-08-28 16:41:08'),('grandvalley','grand01',62720,'356',0,'0000',NULL,1408995665,3,'2014-08-28 16:41:08','2014-08-28 16:41:08'),('grandvalley','grand01',62720,'356',0,'0000',NULL,1408996265,4,'2014-08-28 16:41:08','2014-08-28 16:41:08'),('grandvalley','grand01',62720,'356',0,'0000',NULL,1408996865,5,'2014-08-28 16:41:08','2014-08-28 16:41:08'),('grandvalley','grand01',62721,'356',0,'0000',NULL,1408997465,6,'2014-08-28 16:41:08','2014-08-28 16:41:08'),('grandvalley','grand01',62720,'356',0,'0000',NULL,1409165176,7,'2014-08-28 16:42:57','2014-08-28 16:42:57'),('grandvalley','grand01',62720,'356',0,'0000',NULL,1409165776,8,'2014-08-28 16:42:57','2014-08-28 16:42:57'),('grandvalley','grand01',62720,'356',0,'0000',NULL,1409166376,9,'2014-08-28 16:42:57','2014-08-28 16:42:57'),('grandvalley','grand01',62720,'356',0,'0000',NULL,1409166976,10,'2014-08-28 16:42:57','2014-08-28 16:42:57'),('grandvalley','grand01',62720,'356',0,'0000',NULL,1409167576,11,'2014-08-28 16:42:57','2014-08-28 16:42:57'),('grandvalley','grand01',62721,'356',0,'0000',NULL,1409168177,12,'2014-08-28 16:42:57','2014-08-28 16:42:57'),('grandvalley','grand01',62720,'276',0,'0000',NULL,1409257933,13,'2014-08-28 16:43:08','2014-08-28 16:43:08'),('grandvalley','grand01',62720,'276',0,'0000',NULL,1409258533,14,'2014-08-28 16:45:11','2014-08-28 16:45:11'),('grandvalley','grand01',62720,'314',30,'0001',NULL,1409259133,15,'2014-08-28 16:55:13','2014-08-28 16:55:13'),('grandvalley','grand01',62720,'276',0,'0000',NULL,1409259133,16,'2014-08-28 16:55:13','2014-08-28 16:55:13'),('grandvalley','grand01',62720,'235',100,'1100',NULL,1409259133,17,'2014-08-28 16:55:13','2014-08-28 16:55:13'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400914900000000000000000205000001030000013AB31B00015B',1409323337,18,'2014-08-29 10:45:52','2014-08-29 10:45:52'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F50054009149000000000000000002050000010300000114AB1B00005C',1409323337,19,'2014-08-29 10:45:52','2014-08-29 10:45:52'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F500540091490000000000000000020500000103000000EBBD1B00005D',1409323337,20,'2014-08-29 10:45:52','2014-08-29 10:45:52'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F500540093A100000000000000000205000001030000013AB21B00015E',1409323937,21,'2014-08-29 10:55:54','2014-08-29 10:55:54'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F500540093A1000000000000000002050000010300000114AA1B00005F',1409323937,22,'2014-08-29 10:55:54','2014-08-29 10:55:54'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F500540093A10000000000000000020500000103000000EBBC1B000060',1409323937,23,'2014-08-29 10:55:54','2014-08-29 10:55:54'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F500540095FA00000000000000000205000001030000013AB21B000161',1409324538,24,'2014-08-29 11:06:06','2014-08-29 11:06:06'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F500540095FA000000000000000002050000010300000114AB1B000062',1409324538,25,'2014-08-29 11:06:06','2014-08-29 11:06:06'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F500540095FA0000000000000000020500000103000000EBBD1B000063',1409324538,26,'2014-08-29 11:06:06','2014-08-29 11:06:06'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400985200000000000000000205000001030000013AB31B000164',1409325138,27,'2014-08-29 11:15:09','2014-08-29 11:15:09'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F50054009852000000000000000002050000010300000114AB1B000065',1409325138,28,'2014-08-29 11:15:09','2014-08-29 11:15:09'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F500540098520000000000000000020500000103000000EBBD1B000066',1409325138,29,'2014-08-29 11:15:09','2014-08-29 11:15:09'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F50054009AAA00000000000000000205000001030000013AB21B000167',1409325738,30,'2014-08-29 11:25:13','2014-08-29 11:25:13'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F50054009AAA000000000000000002050000010300000114AB1B000068',1409325738,31,'2014-08-29 11:25:13','2014-08-29 11:25:13'),('grandvalley','grand01',62721,'235',0,'0000','$E051:F50154009AAA0000000000000000020500000103000000EBBD1B000069',1409325738,32,'2014-08-29 11:25:13','2014-08-29 11:25:13'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F50054009D0200000000000000000205000001030000013AB21B00016A',1409326338,33,'2014-08-29 11:35:25','2014-08-29 11:35:25'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F50054009D02000000000000000002050000010300000114AB1B00006B',1409326338,34,'2014-08-29 11:35:25','2014-08-29 11:35:25'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F50054009D020000000000000000020500000103000000EBBC1B00006C',1409326338,35,'2014-08-29 11:35:25','2014-08-29 11:35:25'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F50054009F5A00000000000000000205000001030000013AB21B00016D',1409326938,36,'2014-08-29 11:45:28','2014-08-29 11:45:28'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F50054009F5A000000000000000002050000010300000114AB1B00006E',1409326938,37,'2014-08-29 11:45:28','2014-08-29 11:45:28'),('grandvalley','grand01',62721,'235',0,'0000','$E051:F50154009F5A0000000000000000020500000103000000EBBC1B00006F',1409326938,38,'2014-08-29 11:45:28','2014-08-29 11:45:28'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F5005400A1B20000000000000000020500000103000000EBBD1B000072',1409327538,39,'2014-08-29 11:55:31','2014-08-29 11:55:31'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400A1B200000000000000000205000001030000013AB21B000170',1409327538,40,'2014-08-29 11:55:31','2014-08-29 11:55:31'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F5005400A1B2000000000000000002050000010300000114AB1B000071',1409327538,41,'2014-08-29 11:55:31','2014-08-29 11:55:31'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400A40A00000000000000000205000001030000013AB21B000173',1409328138,42,'2014-08-29 12:05:33','2014-08-29 12:05:33'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F5005400A40A000000000000000002050000010300000114AB1B000074',1409328138,43,'2014-08-29 12:05:33','2014-08-29 12:05:33'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F5005400A40A0000000000000000020500000103000000EBBC1B000075',1409328138,44,'2014-08-29 12:05:33','2014-08-29 12:05:33'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400A66200000000000000000205000001030000013AB31B000176',1409328738,45,'2014-08-29 12:15:38','2014-08-29 12:15:38'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F5005400A662000000000000000002050000010300000114AB1B000077',1409328738,46,'2014-08-29 12:15:38','2014-08-29 12:15:38'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F5005400A6620000000000000000020500000103000000EBBD1B000078',1409328738,47,'2014-08-29 12:15:39','2014-08-29 12:15:39'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400A8BA00000000000000000205000001030000013AB31B000179',1409329338,48,'2014-08-29 12:25:50','2014-08-29 12:25:50'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F5005400A8BA000000000000000002050000010300000114AB1B00007A',1409329338,49,'2014-08-29 12:25:50','2014-08-29 12:25:50'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F5005400A8BA0000000000000000020500000103000000EBBD1B00007B',1409329338,50,'2014-08-29 12:25:50','2014-08-29 12:25:50'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400AB1200000000000000000205000001030000013AB21B00017C',1409329938,51,'2014-08-29 12:35:53','2014-08-29 12:35:53'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F5005400AB12000000000000000002050000010300000114AB1B00007D',1409329938,52,'2014-08-29 12:35:53','2014-08-29 12:35:53'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F5005400AB120000000000000000020500000103000000EBBC1B00007E',1409329938,53,'2014-08-29 12:35:53','2014-08-29 12:35:53'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400AFC200000000000000000205000001030000013AB31B000182',1409331138,54,'2014-08-29 12:56:02','2014-08-29 12:56:02'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F5005400AFC2000000000000000002050000010300000114AB1B000083',1409331138,55,'2014-08-29 12:56:02','2014-08-29 12:56:02'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F5005400AFC20000000000000000020500000103000000EBBD1B000084',1409331138,56,'2014-08-29 12:56:02','2014-08-29 12:56:02'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400B21A00000000000000000205000001030000013AB21B000185',1409331738,57,'2014-08-29 13:06:05','2014-08-29 13:06:05'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F5005400B21A000000000000000002050000010300000114AA1B000086',1409331738,58,'2014-08-29 13:06:05','2014-08-29 13:06:05'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F5005400B21A0000000000000000020500000103000000EBBD1B000087',1409331738,59,'2014-08-29 13:06:05','2014-08-29 13:06:05'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400B47200000000000000000205000001030000013AB31B000188',1409332338,60,'2014-08-29 13:15:10','2014-08-29 13:15:10'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F5005400B4720000000000000000020500000103000000EBBD1B00008A',1409332338,61,'2014-08-29 13:15:10','2014-08-29 13:15:10'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F5005400B472000000000000000002050000010300000114AB1B000089',1409332338,62,'2014-08-29 13:15:10','2014-08-29 13:15:10'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400B6CA00000000000000000205000001030000013AB21B00018B',1409332938,63,'2014-08-29 13:25:13','2014-08-29 13:25:13'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F5005400B6CA000000000000000002050000010300000114AB1B00008C',1409332938,64,'2014-08-29 13:25:13','2014-08-29 13:25:13'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F5005400B6CA0000000000000000020500000103000000EBBD1B00008D',1409332938,65,'2014-08-29 13:25:13','2014-08-29 13:25:13'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400B92200000000000000000205000001030000013AB21B00018E',1409333538,66,'2014-08-29 13:35:15','2014-08-29 13:35:15'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F5005400B922000000000000000002050000010300000114AB1B00008F',1409333538,67,'2014-08-29 13:35:15','2014-08-29 13:35:15'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F5005400B9220000000000000000020500000103000000EBBD1B000090',1409333538,68,'2014-08-29 13:35:15','2014-08-29 13:35:15'),('grandvalley','grand01',62720,'314',30,'0001','$E051:F5005400BB7A00000000000000000205000001030000013AB21B000191',1409334138,69,'2014-08-29 13:45:18','2014-08-29 13:45:18'),('grandvalley','grand01',62720,'276',0,'0000','$E051:F5005400BB7A000000000000000002050000010300000114AB1B000092',1409334138,70,'2014-08-29 13:45:18','2014-08-29 13:45:18'),('grandvalley','grand01',62720,'235',0,'0000','$E051:F5005400BB7A0000000000000000020500000103000000EBBD1B000093',1409334138,71,'2014-08-29 13:45:18','2014-08-29 13:45:18');
/*!40000 ALTER TABLE `silodata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `organization` int(11) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `is_alert_active` tinyint(1) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('jlam','jonathan.g.lam@gmail.com','$2a$10$S/udRNCaX/Coq4P8Hjwz5ebRHF73lEQATx/ZfrtPo2E8sWn5hy6lu',1,'Jon','Lam',0,1,'2014-08-21 09:48:09','2014-08-29 16:34:48');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-09-08 12:44:43

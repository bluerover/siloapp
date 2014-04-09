# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.16)
# Database: food_safety_app
# Generation Time: 2014-04-09 03:04:22 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table alertdata
# ------------------------------------------------------------

DROP TABLE IF EXISTS `alertdata`;

CREATE TABLE `alertdata` (
  `timestamp` int(11) DEFAULT NULL,
  `rfidTagNum` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `alerthandler_name` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table dashboard
# ------------------------------------------------------------

DROP TABLE IF EXISTS `dashboard`;

CREATE TABLE `dashboard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `organization_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

LOCK TABLES `dashboard` WRITE;
/*!40000 ALTER TABLE `dashboard` DISABLE KEYS */;

INSERT INTO `dashboard` (`id`, `createdAt`, `updatedAt`, `organization_id`, `name`)
VALUES
	(1,'2014-03-30 16:44:20','2014-03-30 16:44:20',1,'Andrew\'s Dashboard');

/*!40000 ALTER TABLE `dashboard` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table dashboard_widget
# ------------------------------------------------------------

DROP TABLE IF EXISTS `dashboard_widget`;

CREATE TABLE `dashboard_widget` (
  `dashboard_id` int(11) DEFAULT NULL,
  `widget_id` int(11) DEFAULT NULL,
  `data_filter` varchar(5000) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `display_name_2` varchar(255) DEFAULT NULL,
  `widget_order` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `options` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

LOCK TABLES `dashboard_widget` WRITE;
/*!40000 ALTER TABLE `dashboard_widget` DISABLE KEYS */;

INSERT INTO `dashboard_widget` (`dashboard_id`, `widget_id`, `data_filter`, `display_name`, `display_name_2`, `widget_order`, `id`, `createdAt`, `updatedAt`, `options`)
VALUES
	(1,1,'rfid-40293','Walk-in Freezer','Air',2,2,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": -18, \"min_temp\": -32, \"max_temp\": -4}'),
	(1,1,'rfid-40294','Walk-in Freezer','Food',3,3,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": -18, \"min_temp\": -32, \"max_temp\": -4}'),
	(1,1,'rfid-40295','Walk-in Fridge','Air',4,4,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40296','Walk-in Fridge','Food',5,5,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40297','Walk-in Beer','Air',6,6,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40298','Walk-in Beer','Food',7,7,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40299','Salad','Air',8,8,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40300','Salad','Food',9,9,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40301','Grill Fridge','Food',11,10,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40302','Grill Fridge','Air',10,11,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40303','Bar (Right)','Food',13,12,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40304','Bar (Right)','Air',12,13,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40305','Service Fridge','Food',15,14,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 12, \"min_temp\": 4, \"max_temp\": 20}'),
	(1,1,'rfid-40306','Service Fridge','Air',14,15,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 12, \"min_temp\": 4, \"max_temp\": 20}'),
	(1,1,'rfid-40307','Bar (Left)','Food',17,16,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 5, \"min_temp\": -3, \"max_temp\": 13}'),
	(1,1,'rfid-40308','Bar (Left)','Air',16,17,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 5, \"min_temp\": -3, \"max_temp\": 13}'),
	(1,1,'rfid-40309','Take Out','Food',19,18,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40310','Take Out','Air',18,19,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40311','Ice Cream','Food',21,20,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": -18, \"min_temp\": -32, \"max_temp\": -4}'),
	(1,1,'rfid-40312','Ice Cream','Air',20,21,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": -18, \"min_temp\": -32, \"max_temp\": -4}'),
	(1,1,'rfid-40313','Bain Marie Fridge','Food',23,22,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40314','Bain Marie Fridge','Air',22,23,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40317','Pasta','Food',25,24,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40318','Pasta','Air',24,25,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40319','Cut','Air',26,26,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40320','Cut','Food',27,27,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40321','Build','Food',29,28,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40322','Build','Air',28,29,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40323','Nacho','Air',30,30,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-40324','Nacho','Food',31,31,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}'),
	(1,1,'rfid-411','Deep Fryer (Left)',NULL,34,34,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 160, \"min_temp\": 100, \"max_temp\": 220, \"inverted_threshold\": true}'),
	(1,1,'rfid-423','Deep Fryer (Right)',NULL,35,35,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 160, \"min_temp\": 100, \"max_temp\": 220, \"inverted_threshold\": true}'),
	(1,1,'rfid-426','Pizza Oven (Top)',NULL,36,36,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\"threshold\": 220, \"min_temp\": 160, \"max_temp\": 280, \"inverted_threshold\": true}'),
	(1,2,'rfid-40308 rfid-40304 rfid-411 rfid-426 rfid-423 rfid-40297 rfid-40310 rfid-40318 rfid-40314 rfid-40293 rfid-40299 rfid-40322 rfid-40295 rfid-40319 rfid-40325 rfid-40312 rfid-40306 rfid-40323 rfid-40302','Store Layout',NULL,1,40,'2014-03-30 14:18:21','2014-03-30 14:18:21','{\n	\"floorplan\": \"/widget_assets/images/boston_pizza.svg\",\n	\"rfids\": {\n		\"40308\": {\n			\"name\": \"Bar (Left)\",\n			\"label_x\": 629,\n			\"label_y\": 132,\n			\"anchor_x\": 626,\n			\"anchor_y\": 138.5,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		},\n		\"40304\": {\n			\"name\": \"Bar (Right)\",\n			\"label_x\": 669,\n			\"label_y\": 164,\n			\"anchor_x\": 660,\n			\"anchor_y\": 161,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		},\n		\"411\": {\n			\"name\": \"Deep Fryer (Left)\",\n			\"label_x\": 75,\n			\"label_y\": 203,\n			\"anchor_x\": 514,\n			\"anchor_y\": 495,\n			\"lines\": [\n				{\n					\"x1\": 514,\n					\"y1\": 495,\n					\"x2\": 214,\n					\"y2\": 195\n				},\n				{\n					\"x1\": 214,\n					\"y1\": 195,\n					\"x2\": 184,\n					\"y2\": 195\n				}\n			]\n		},\n		\"426\": {\n			\"name\": \"Pizza Oven\",\n			\"label_x\": 564,\n			\"label_y\": 492,\n			\"anchor_x\": 554,\n			\"anchor_y\": 492,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		},\n		\"423\": {\n			\"name\": \"Deep Fryer (Right)\",\n			\"label_x\": 110,\n			\"label_y\": 260,\n			\"anchor_x\": 501,\n			\"anchor_y\": 503,\n			\"lines\": [\n				{\n					\"x1\": 501,\n					\"y1\": 503,\n					\"x2\": 251,\n					\"y2\": 253\n				},\n				{\n					\"x1\": 221,\n					\"y1\": 253,\n					\"x2\": 251,\n					\"y2\": 253\n				}\n			]\n		},\n		\"40297\": {\n			\"name\": \"Walk-in Beer\",\n			\"label_x\": 734,\n			\"label_y\": 513,\n			\"anchor_x\": 726,\n			\"anchor_y\": 503,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		},\n		\"40310\": {\n			\"name\": \"Take Out\",\n			\"label_x\": 464,\n			\"label_y\": 378,\n			\"anchor_x\": 464,\n			\"anchor_y\": 388,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		},\n		\"40318\": {\n			\"name\": \"Pasta\",\n			\"label_x\": 520,\n			\"label_y\": 419,\n			\"anchor_x\": 513.5,\n			\"anchor_y\": 419,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		},\n		\"40314\": {\n			\"name\": \"Bain Marie Fridge\",\n			\"label_x\": 75,\n			\"label_y\": 148,\n			\"anchor_x\": 493,\n			\"anchor_y\": 439,\n			\"lines\": [\n				{\n					\"x1\": 493,\n					\"y1\": 439,\n					\"x2\": 193,\n					\"y2\": 139\n				},\n				{\n					\"x1\": 193,\n					\"y1\": 139,\n					\"x2\": 163,\n					\"y2\": 139\n				}\n			]\n		},\n		\"40293\": {\n			\"name\": \"Walk-in Freezer\",\n			\"label_x\": 658,\n			\"label_y\": 573,\n			\"anchor_x\": 646,\n			\"anchor_y\": 563,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		},\n		\"40299\": {\n			\"name\": \"Salad\",\n			\"label_x\": 140,\n			\"label_y\": 311,\n			\"anchor_x\": 430,\n			\"anchor_y\": 481,\n			\"lines\": [\n				{\n					\"x1\": 430,\n					\"y1\": 481,\n					\"x2\": 250,\n					\"y2\": 301\n				},\n				{\n					\"x1\": 250,\n					\"y1\": 301,\n					\"x2\": 220,\n					\"y2\": 301\n				}\n			]\n		},\n		\"40322\": {\n			\"name\": \"Build (Right)\",\n			\"label_x\": 545,\n			\"label_y\": 545,\n			\"anchor_x\": 538,\n			\"anchor_y\": 527,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		},\n		\"40295\": {\n			\"name\": \"Walk-in Fridge\",\n			\"label_x\": 570,\n			\"label_y\": 631,\n			\"anchor_x\": 562,\n			\"anchor_y\": 621,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		},\n		\"40319\": {\n			\"name\": \"Cut\",\n			\"label_x\": 180,\n			\"label_y\": 380,\n			\"anchor_x\": 407,\n			\"anchor_y\": 496,\n			\"lines\": [\n				{\n					\"x1\": 407,\n					\"y1\": 496,\n					\"x2\": 282,\n					\"y2\": 371\n				},\n				{\n					\"x1\": 282,\n					\"y1\": 371,\n					\"x2\": 252,\n					\"y2\": 371\n				}\n			]\n		},\n		\"40325\": {\n			\"name\": \"Build (Left)\",\n			\"label_x\": 475,\n			\"label_y\": 585,\n			\"anchor_x\": 505,\n			\"anchor_y\": 550,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		},\n		\"40312\": {\n			\"name\": \"Ice Cream\",\n			\"label_x\": 165,\n			\"label_y\": 424,\n			\"anchor_x\": 347,\n			\"anchor_y\": 464,\n			\"lines\": [\n				{\n					\"x1\": 347,\n					\"y1\": 464,\n					\"x2\": 297,\n					\"y2\": 414\n				},\n				{\n					\"x1\": 267,\n					\"y1\": 414,\n					\"x2\": 297,\n					\"y2\": 414\n				}\n			]\n		},\n		\"40306\": {\n			\"name\": \"Service Fridge\",\n			\"label_x\": 263,\n			\"label_y\": 510,\n			\"anchor_x\": 333,\n			\"anchor_y\": 474,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		},\n		\"40323\": {\n			\"name\": \"Nacho\",\n			\"label_x\": 320,\n			\"label_y\": 565,\n			\"anchor_x\": 409,\n			\"anchor_y\": 545,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		},\n		\"40302\": {\n			\"name\": \"Grill Fridge\",\n			\"label_x\": 430,\n			\"label_y\": 540,\n			\"anchor_x\": 467,\n			\"anchor_y\": 526,\n			\"lines\": [\n				{\n					\"x1\": 123,\n					\"y1\": 123,\n					\"x2\": 123,\n					\"y2\": 123\n				}\n			]\n		}\n	}\n}');

/*!40000 ALTER TABLE `dashboard_widget` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table handhelddata
# ------------------------------------------------------------

DROP TABLE IF EXISTS `handhelddata`;

CREATE TABLE `handhelddata` (
  `id` int(11) DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `probe_id` varchar(255) DEFAULT NULL,
  `timestamp` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `temperature` float DEFAULT NULL,
  `alarm` int(11) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table organization
# ------------------------------------------------------------

DROP TABLE IF EXISTS `organization`;

CREATE TABLE `organization` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `auth_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

LOCK TABLES `organization` WRITE;
/*!40000 ALTER TABLE `organization` DISABLE KEYS */;

INSERT INTO `organization` (`id`, `createdAt`, `updatedAt`, `name`, `auth_token`)
VALUES
	(1,'2014-03-30 12:26:07','2014-03-30 12:26:07','Boston Pizza','5b0e193f-0f1a-4826-bebd-a7a02e1e03e7'),
	(2,'2014-03-30 17:03:01','2014-03-30 17:03:01','Test Org 2','5b0e193f-0f1a-4826-bebd-a7a02e1e03e8');

/*!40000 ALTER TABLE `organization` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rfidalerthandler
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rfidalerthandler`;

CREATE TABLE `rfidalerthandler` (
  `rfid` int(11) DEFAULT NULL,
  `alerthandler_name` varchar(255) DEFAULT NULL,
  `config` varchar(5000) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

LOCK TABLES `rfidalerthandler` WRITE;
/*!40000 ALTER TABLE `rfidalerthandler` DISABLE KEYS */;

INSERT INTO `rfidalerthandler` (`rfid`, `alerthandler_name`, `config`, `id`, `createdAt`, `updatedAt`)
VALUES
	(411,'TemperatureBelowX','{\"threshold\": 160, \"min_temp\": 160, \"max_temp\": 280}',2,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(413,'TemperatureAboveX','{\"threshold\": 220, \"min_temp\": 160, \"max_temp\": 280}',3,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(423,'TemperatureBelowX','{\"threshold\": 160, \"min_temp\": 160, \"max_temp\": 280}',4,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40293,'TemperatureAboveX','{\"threshold\": -18, \"min_temp\": -32, \"max_temp\": -4}',5,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40294,'TemperatureAboveX','{\"threshold\": -18, \"min_temp\": -32, \"max_temp\": -4}',6,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40295,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',7,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40296,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',8,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40297,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',9,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40298,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',10,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40299,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',11,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40300,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',12,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40301,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',13,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40302,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',14,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40303,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',15,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40304,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',16,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40305,'TemperatureAboveX','{\"threshold\": 12, \"min_temp\": 4, \"max_temp\": 20}',17,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40306,'TemperatureAboveX','{\"threshold\": 12, \"min_temp\": 4, \"max_temp\": 20}',18,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40307,'TemperatureAboveX','{\"threshold\": 5, \"min_temp\": -4, \"max_temp\": 12}',19,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40308,'TemperatureAboveX','{\"threshold\": 5, \"min_temp\": -4, \"max_temp\": 12}',20,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40309,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',21,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40310,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',22,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40311,'TemperatureAboveX','{\"threshold\": -18, \"min_temp\": -32, \"max_temp\": -4}',23,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40312,'TemperatureAboveX','{\"threshold\": -18, \"min_temp\": -32, \"max_temp\": -4}',24,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40313,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',25,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40314,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',26,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40317,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',27,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40318,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',28,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40319,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',29,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40320,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',30,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40321,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',31,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40322,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',32,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40323,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',33,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40324,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',34,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40325,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',35,'2014-04-03 22:55:12','2014-04-03 22:55:16'),
	(40326,'TemperatureAboveX','{\"threshold\": 4, \"min_temp\": -4, \"max_temp\": 12}',36,'2014-04-03 22:55:12','2014-04-03 22:55:16');

/*!40000 ALTER TABLE `rfidalerthandler` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rfiddata
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rfiddata`;

CREATE TABLE `rfiddata` (
  `timestamp` int(11) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `accountID` varchar(255) DEFAULT '',
  `deviceID` varchar(255) DEFAULT NULL,
  `statusCode` int(11) DEFAULT NULL,
  `rfidTagNum` int(11) DEFAULT NULL,
  `rfidTemperature` float DEFAULT NULL,
  `speedKPH` float DEFAULT NULL,
  `zone1Avg` float DEFAULT NULL,
  `zone2Avg` float DEFAULT NULL,
  `zone3Avg` float DEFAULT NULL,
  `zone4Avg` float DEFAULT NULL,
  `zone5Avg` float DEFAULT NULL,
  `zone6Avg` float DEFAULT NULL,
  `zone7Avg` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table temp_dashboardwidget_widget
# ------------------------------------------------------------

DROP TABLE IF EXISTS `temp_dashboardwidget_widget`;

CREATE TABLE `temp_dashboardwidget_widget` (
  `name` varchar(255) DEFAULT NULL,
  `template_filename` varchar(255) DEFAULT NULL,
  `js_filename` varchar(255) DEFAULT NULL,
  `css_filename` varchar(255) DEFAULT NULL,
  `dashboard_id` int(11) DEFAULT NULL,
  `widget_id` int(11) DEFAULT NULL,
  `data_filter` varchar(255) DEFAULT NULL,
  `options` varchar(255) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `display_name_2` varchar(255) DEFAULT NULL,
  `widget_order` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `organization_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`username`, `email`, `password`, `first_name`, `last_name`, `is_admin`, `id`, `createdAt`, `updatedAt`, `organization_id`)
VALUES
	('andrew','andrewihassan@gmail.com','$2a$10$8xT55oCs.mbHjHrEbomYd.KN7Ld0hx4MDu3m1TPQD4bKrP447erXG','Andrew','Hassan',1,2,'2014-03-30 16:36:35','2014-03-30 16:36:35',1),
	('demo','demouser@bluerover.ca','$2a$10$97n/sU25z.41qx4En9EbJuFfLHfeaLcxNea0ed8taJhtYiGHkPaQq','Demo','User',1,4,'2014-04-09 02:57:42','2014-04-09 02:57:42',1);

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table widget
# ------------------------------------------------------------

DROP TABLE IF EXISTS `widget`;

CREATE TABLE `widget` (
  `name` varchar(255) DEFAULT NULL,
  `js_filename` varchar(255) DEFAULT NULL,
  `css_filename` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `template_filename` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

LOCK TABLES `widget` WRITE;
/*!40000 ALTER TABLE `widget` DISABLE KEYS */;

INSERT INTO `widget` (`name`, `js_filename`, `css_filename`, `id`, `createdAt`, `updatedAt`, `template_filename`)
VALUES
	('Knob','knob.js','knob.css',1,'2014-03-30 14:18:00','2014-03-30 14:18:00','knob.ejs'),
	('FloorPlan','floorplan.js','floorplan.css',2,'2014-04-05 16:35:20','2014-04-05 16:35:20','floorplan.ejs');

/*!40000 ALTER TABLE `widget` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

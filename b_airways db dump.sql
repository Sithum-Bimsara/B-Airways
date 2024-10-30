CREATE DATABASE  IF NOT EXISTS `b_airways` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `b_airways`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: b_airways
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `airplane`
--

DROP TABLE IF EXISTS `airplane`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airplane` (
  `Airplane_ID` int NOT NULL AUTO_INCREMENT,
  `Airplane_model_ID` int NOT NULL,
  PRIMARY KEY (`Airplane_ID`),
  KEY `idx_airplane_model_id` (`Airplane_model_ID`),
  CONSTRAINT `airplane_ibfk_1` FOREIGN KEY (`Airplane_model_ID`) REFERENCES `airplane_model` (`Airplane_model_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airplane`
--

LOCK TABLES `airplane` WRITE;
/*!40000 ALTER TABLE `airplane` DISABLE KEYS */;
INSERT INTO `airplane` VALUES (1,1),(2,1),(3,1),(4,2),(5,2),(6,2),(7,2),(8,3);
/*!40000 ALTER TABLE `airplane` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_airplane_insert` AFTER INSERT ON `airplane` FOR EACH ROW BEGIN
    DECLARE econ_seats INT;
    DECLARE bus_seats INT;
    DECLARE plat_seats INT;
    DECLARE seat_num INT;
    DECLARE new_seat_id VARCHAR(10);

    -- Get the number of seats from the airplane_model table
    SELECT No_of_Economic_Seats, No_of_Business_Seats, No_of_Platinum_Seats
    INTO econ_seats, bus_seats, plat_seats
    FROM airplane_model
    WHERE Airplane_model_ID = NEW.Airplane_model_ID;

    -- Insert Economy Class Seats
    SET seat_num = 1;
    WHILE seat_num <= econ_seats DO
        SET new_seat_id = CONCAT('P', LPAD(NEW.Airplane_ID, 3, '0'), '_S', LPAD(seat_num, 3, '0'));
        INSERT INTO seat (Seat_ID, Airplane_ID, Travel_Class) 
        VALUES (new_seat_id, NEW.Airplane_ID, 'Economy');
        SET seat_num = seat_num + 1;
    END WHILE;

    -- Insert Business Class Seats
    WHILE seat_num <= (econ_seats + bus_seats) DO
        SET new_seat_id = CONCAT('P', LPAD(NEW.Airplane_ID, 3, '0'), '_S', LPAD(seat_num, 3, '0'));
        INSERT INTO seat (Seat_ID, Airplane_ID, Travel_Class) 
        VALUES (new_seat_id, NEW.Airplane_ID, 'Business');
        SET seat_num = seat_num + 1;
    END WHILE;

    -- Insert Platinum Class Seats
    WHILE seat_num <= (econ_seats + bus_seats + plat_seats) DO
        SET new_seat_id = CONCAT('P', LPAD(NEW.Airplane_ID, 3, '0'), '_S', LPAD(seat_num, 3, '0'));
        INSERT INTO seat (Seat_ID, Airplane_ID, Travel_Class) 
        VALUES (new_seat_id, NEW.Airplane_ID, 'Platinum');
        SET seat_num = seat_num + 1;
    END WHILE;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `airplane_model`
--

DROP TABLE IF EXISTS `airplane_model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airplane_model` (
  `Airplane_model_ID` int NOT NULL AUTO_INCREMENT,
  `Model_name` varchar(50) NOT NULL,
  `No_of_Economic_Seats` int DEFAULT '0',
  `No_of_Business_Seats` int DEFAULT '0',
  `No_of_Platinum_Seats` int DEFAULT '0',
  PRIMARY KEY (`Airplane_model_ID`),
  UNIQUE KEY `Model_name` (`Model_name`),
  CONSTRAINT `CHK_No_of_Business_Seats` CHECK ((`No_of_Business_Seats` >= 0)),
  CONSTRAINT `CHK_No_of_Economic_Seats` CHECK ((`No_of_Economic_Seats` >= 0)),
  CONSTRAINT `CHK_No_of_Platinum_Seats` CHECK ((`No_of_Platinum_Seats` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airplane_model`
--

LOCK TABLES `airplane_model` WRITE;
/*!40000 ALTER TABLE `airplane_model` DISABLE KEYS */;
INSERT INTO `airplane_model` VALUES (1,'Boeing 737',114,30,16),(2,'Boeing 757',135,21,24),(3,'Airbus A380',399,76,14);
/*!40000 ALTER TABLE `airplane_model` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airport`
--

DROP TABLE IF EXISTS `airport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airport` (
  `Airport_code` char(3) NOT NULL,
  `Airport_name` varchar(100) NOT NULL,
  `Location_ID` int NOT NULL,
  PRIMARY KEY (`Airport_code`),
  UNIQUE KEY `Airport_code` (`Airport_code`),
  KEY `Location_ID` (`Location_ID`),
  CONSTRAINT `airport_ibfk_1` FOREIGN KEY (`Location_ID`) REFERENCES `location` (`Location_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airport`
--

LOCK TABLES `airport` WRITE;
/*!40000 ALTER TABLE `airport` DISABLE KEYS */;
INSERT INTO `airport` VALUES ('BIA','Bandaranaike International Airport',11),('BKK','Suvarnabhumi Airport',20),('BOM','Chhatrapati Shivaji Maharaj International Airport',17),('CGK','Soekarno-Hatta International Airport',7),('DEL','Indira Gandhi International Airport',15),('DMK','Don Mueang International Airport',21),('DPS','Ngurah Rai International Airport',9),('HRI','Mattala Rajapaksa International Airport',13),('MAA','Chennai International Airport',19),('SIN','Singapore Changi Airport',5);
/*!40000 ALTER TABLE `airport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `Booking_ID` varchar(10) NOT NULL,
  `Flight_ID` varchar(10) NOT NULL,
  `User_ID` varchar(36) DEFAULT NULL,
  `Passenger_ID` int NOT NULL,
  `Seat_ID` varchar(10) DEFAULT NULL,
  `Issue_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `Price` float NOT NULL,
  PRIMARY KEY (`Booking_ID`),
  UNIQUE KEY `Flight_ID` (`Flight_ID`,`Seat_ID`),
  KEY `Passenger_ID` (`Passenger_ID`),
  KEY `idx_booking_flight_id` (`Flight_ID`),
  KEY `idx_booking_user_id` (`User_ID`),
  KEY `idx_booking_seat` (`Seat_ID`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`Flight_ID`) REFERENCES `flight` (`Flight_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`Passenger_ID`) REFERENCES `passenger` (`Passenger_ID`),
  CONSTRAINT `booking_ibfk_4` FOREIGN KEY (`Seat_ID`) REFERENCES `seat` (`Seat_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CHK_Price` CHECK ((`Price` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES ('bk_1','FL001',NULL,1,'P001_S001','2023-06-01 10:00:00',450),('bk_10','FL003',NULL,10,'P008_S002','2023-06-03 08:15:00',550),('bk_11','FL003',NULL,1,'P008_S400','2023-06-03 09:00:00',1100),('bk_12','FL003',NULL,2,'P008_S476','2023-06-03 09:30:00',1700),('bk_13','FL004',NULL,3,'P004_S020','2023-06-04 11:00:00',600),('bk_14','FL004',NULL,4,'P004_S021','2023-06-04 11:15:00',600),('bk_15','FL004',NULL,5,'P004_S136','2023-06-04 12:00:00',1200),('bk_16','FL004',NULL,6,'P004_S157','2023-06-04 12:30:00',1800),('bk_17','FL005',NULL,7,'P005_S030','2023-06-05 13:00:00',650),('bk_18','FL005',NULL,8,'P005_S031','2023-06-05 13:15:00',650),('bk_19','FL005',NULL,9,'P005_S140','2023-06-05 14:00:00',1300),('bk_2','FL001',NULL,2,'P001_S002','2023-06-01 10:15:00',450),('bk_20','FL005',NULL,10,'P005_S160','2023-06-05 14:30:00',1900),('bk_21','FL003',NULL,1,'P008_S230','2024-10-27 21:27:19',550),('bk_22','FL003',NULL,2,'P008_S489','2024-10-27 21:27:19',1700),('bk_23','FL001',NULL,1,'P001_S010','2024-10-27 21:30:14',450),('bk_24','FL001',NULL,2,'P001_S140','2024-10-27 21:30:14',900),('bk_25','FL001',NULL,1,'P001_S070','2024-10-27 21:51:59',450),('bk_26','FL001',NULL,2,'P001_S071','2024-10-27 21:51:59',450),('bk_27','FL003',NULL,1,'P008_S046','2024-10-27 21:55:06',550),('bk_28','FL001',NULL,1,'P001_S041','2024-10-27 21:55:41',450),('bk_29','FL001',NULL,1,'P001_S110','2024-10-27 21:56:59',450),('bk_3','FL001',NULL,3,'P001_S115','2023-06-01 11:00:00',900),('bk_30','FL003',NULL,1,'P008_S481','2024-10-27 21:57:54',1700),('bk_31','FL003',NULL,2,'P008_S487','2024-10-27 21:57:54',1700),('bk_32','FL001',NULL,1,'P001_S131','2024-10-27 22:02:36',900),('bk_33','FL001','0267645b-9484-11ef-8ff5-047c16a3f13c',1,'P001_S081','2024-10-27 22:24:07',450),('bk_34','FL001','0267645b-9484-11ef-8ff5-047c16a3f13c',2,'P001_S156','2024-10-27 22:24:07',1500),('bk_35','FL001','0267645b-9484-11ef-8ff5-047c16a3f13c',1,'P001_S060','2024-10-27 22:27:49',450),('bk_36','FL001','0267645b-9484-11ef-8ff5-047c16a3f13c',1,'P001_S014','2024-10-27 22:35:53',450),('bk_37','FL001','0267645b-9484-11ef-8ff5-047c16a3f13c',2,'P001_S063','2024-10-27 22:35:53',450),('bk_38','FL003','0267645b-9484-11ef-8ff5-047c16a3f13c',1,'P008_S009','2024-10-27 22:38:17',550),('bk_39','FL003','0267645b-9484-11ef-8ff5-047c16a3f13c',2,'P008_S411','2024-10-27 22:38:17',1100),('bk_4','FL001',NULL,4,'P001_S145','2023-06-01 11:30:00',1500),('bk_40','FL001','0267645b-9484-11ef-8ff5-047c16a3f13c',1,'P001_S086','2024-10-27 22:39:38',450),('bk_41','FL001','0267645b-9484-11ef-8ff5-047c16a3f13c',1,'P001_S152','2024-10-27 22:47:44',1500),('bk_42','FL001','0267645b-9484-11ef-8ff5-047c16a3f13c',2,'P001_S144','2024-10-27 22:47:44',900),('bk_5','FL002',NULL,5,'P002_S010','2023-06-02 09:00:00',500),('bk_6','FL002',NULL,6,'P002_S011','2023-06-02 09:15:00',500),('bk_7','FL002',NULL,7,'P002_S120','2023-06-02 10:00:00',1000),('bk_8','FL002',NULL,8,'P002_S150','2023-06-02 10:30:00',1600),('bk_9','FL003',NULL,9,'P008_S001','2023-06-03 08:00:00',550);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_membership_type_and_no_of_bookings` AFTER INSERT ON `booking` FOR EACH ROW BEGIN
    DECLARE new_membership_type VARCHAR(50);

    -- Check if the user exists in member_detail
    IF EXISTS (SELECT 1 FROM member_detail WHERE User_ID = NEW.User_ID) THEN
        -- Increment the number of bookings for the user
        UPDATE member_detail
        SET No_of_booking = No_of_booking + 1
        WHERE User_ID = NEW.User_ID;

        -- Select the appropriate membership type based on the number of bookings
        SELECT Membership_Type
        INTO new_membership_type
        FROM loyalty_detail
        WHERE Needed_bookings <= (SELECT No_of_booking FROM member_detail WHERE User_ID = NEW.User_ID)
        ORDER BY Needed_bookings DESC
        LIMIT 1;

        -- Update the membership type in the member_detail table if needed
        IF new_membership_type IS NOT NULL 
        AND (SELECT Membership_Type FROM member_detail WHERE User_ID = NEW.User_ID) != new_membership_type THEN
            UPDATE member_detail
            SET Membership_Type = new_membership_type
            WHERE User_ID = NEW.User_ID;
        END IF;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `flight`
--

DROP TABLE IF EXISTS `flight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight` (
  `Flight_ID` varchar(10) NOT NULL,
  `Airplane_ID` int DEFAULT NULL,
  `Route_ID` varchar(10) DEFAULT NULL,
  `Departure_date` date NOT NULL,
  `Arrival_date` date NOT NULL,
  `Arrival_time` time NOT NULL,
  `Departure_time` time NOT NULL,
  `Status` enum('Scheduled','Delayed','Cancelled') NOT NULL DEFAULT 'Scheduled',
  PRIMARY KEY (`Flight_ID`),
  KEY `idx_flight_status` (`Status`),
  KEY `idx_Departure_flight_dates` (`Departure_date`),
  KEY `idx_Arrival_flight_dates` (`Arrival_date`),
  KEY `idx_flight_airplane_id` (`Airplane_ID`),
  KEY `idx_flight_route_id` (`Route_ID`),
  CONSTRAINT `flight_ibfk_1` FOREIGN KEY (`Airplane_ID`) REFERENCES `airplane` (`Airplane_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `flight_ibfk_2` FOREIGN KEY (`Route_ID`) REFERENCES `route` (`Route_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CHK_Arrival_Date` CHECK ((`Arrival_date` >= `Departure_date`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight`
--

LOCK TABLES `flight` WRITE;
/*!40000 ALTER TABLE `flight` DISABLE KEYS */;
INSERT INTO `flight` VALUES ('FL001',1,'RT003','2024-10-28','2024-10-28','10:00:00','08:00:00','Scheduled'),('FL002',2,'RT002','2024-10-28','2024-10-28','14:30:00','12:00:00','Scheduled'),('FL003',8,'RT003','2024-10-28','2024-10-28','17:00:00','15:00:00','Delayed'),('FL004',4,'RT009','2024-10-28','2024-10-28','20:30:00','18:00:00','Scheduled'),('FL005',5,'RT009','2024-10-28','2024-10-28','11:00:00','09:00:00','Scheduled'),('FL006',1,'RT006','2024-10-29','2024-10-29','10:00:00','08:00:00','Scheduled'),('FL007',2,'RT007','2024-10-29','2024-10-29','14:30:00','12:00:00','Scheduled'),('FL008',3,'RT008','2024-10-29','2024-10-29','17:00:00','15:00:00','Delayed'),('FL009',4,'RT009','2024-10-29','2024-10-29','20:30:00','18:00:00','Scheduled'),('FL010',5,'RT010','2024-10-29','2024-10-29','11:00:00','09:00:00','Cancelled'),('FL011',1,'RT011','2024-10-30','2024-10-30','10:00:00','08:00:00','Scheduled'),('FL012',2,'RT012','2024-10-30','2024-10-30','14:30:00','12:00:00','Scheduled'),('FL013',3,'RT013','2024-10-30','2024-10-30','17:00:00','15:00:00','Delayed'),('FL014',4,'RT014','2024-10-30','2024-10-30','20:30:00','18:00:00','Scheduled'),('FL015',5,'RT015','2024-10-30','2024-10-30','11:00:00','09:00:00','Cancelled'),('FL016',1,'RT016','2024-10-31','2024-10-31','10:00:00','08:00:00','Scheduled'),('FL017',2,'RT017','2024-10-31','2024-10-31','14:30:00','12:00:00','Scheduled'),('FL018',3,'RT018','2024-10-31','2024-10-31','17:00:00','15:00:00','Delayed'),('FL019',4,'RT019','2024-10-31','2024-10-31','20:30:00','18:00:00','Scheduled'),('FL020',5,'RT020','2024-10-27','2024-10-27','11:00:00','09:00:00','Cancelled'),('FL021',1,'RT001','2024-10-27','2024-10-27','10:00:00','08:00:00','Scheduled'),('FL022',2,'RT002','2024-10-27','2024-10-27','14:30:00','12:00:00','Scheduled'),('FL023',3,'RT003','2024-10-27','2024-10-27','17:00:00','15:00:00','Delayed'),('FL024',4,'RT004','2024-10-27','2024-10-27','20:30:00','18:00:00','Scheduled'),('FL025',5,'RT005','2024-10-27','2024-10-27','11:00:00','09:00:00','Cancelled'),('FL026',1,'RT006','2024-10-27','2024-10-27','10:00:00','08:00:00','Scheduled'),('FL027',2,'RT007','2024-10-27','2024-10-27','14:30:00','12:00:00','Scheduled'),('FL028',3,'RT008','2024-10-27','2024-10-27','17:00:00','15:00:00','Delayed'),('FL029',4,'RT009','2024-10-27','2024-10-27','20:30:00','18:00:00','Scheduled'),('FL030',5,'RT010','2024-10-27','2024-10-27','11:00:00','09:00:00','Cancelled');
/*!40000 ALTER TABLE `flight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight_pricing`
--

DROP TABLE IF EXISTS `flight_pricing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight_pricing` (
  `Flight_ID` varchar(10) NOT NULL,
  `Travel_Class` enum('Economy','Business','Platinum') NOT NULL,
  `Price` float NOT NULL,
  PRIMARY KEY (`Flight_ID`,`Travel_Class`),
  KEY `idx_flight_pricing_class` (`Travel_Class`),
  CONSTRAINT `flight_pricing_ibfk_1` FOREIGN KEY (`Flight_ID`) REFERENCES `flight` (`Flight_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight_pricing`
--

LOCK TABLES `flight_pricing` WRITE;
/*!40000 ALTER TABLE `flight_pricing` DISABLE KEYS */;
INSERT INTO `flight_pricing` VALUES ('FL001','Economy',450),('FL001','Business',900),('FL001','Platinum',1500),('FL002','Economy',500),('FL002','Business',1000),('FL002','Platinum',1600),('FL003','Economy',550),('FL003','Business',1100),('FL003','Platinum',1700),('FL004','Economy',600),('FL004','Business',1200),('FL004','Platinum',1800),('FL005','Economy',650),('FL005','Business',1300),('FL005','Platinum',1900),('FL006','Economy',700),('FL006','Business',1400),('FL006','Platinum',2000),('FL007','Economy',750),('FL007','Business',1500),('FL007','Platinum',2100),('FL008','Economy',800),('FL008','Business',1600),('FL008','Platinum',2200),('FL009','Economy',850),('FL009','Business',1700),('FL009','Platinum',2300),('FL010','Economy',900),('FL010','Business',1800),('FL010','Platinum',2400),('FL011','Economy',950),('FL011','Business',1900),('FL011','Platinum',2500),('FL012','Economy',1000),('FL012','Business',2000),('FL012','Platinum',2600),('FL013','Economy',1050),('FL013','Business',2100),('FL013','Platinum',2700),('FL014','Economy',1100),('FL014','Business',2200),('FL014','Platinum',2800),('FL015','Economy',1150),('FL015','Business',2300),('FL015','Platinum',2900),('FL016','Economy',1200),('FL016','Business',2400),('FL016','Platinum',3000),('FL017','Economy',1250),('FL017','Business',2500),('FL017','Platinum',3100),('FL018','Economy',1300),('FL018','Business',2600),('FL018','Platinum',3200),('FL019','Economy',1350),('FL019','Business',2700),('FL019','Platinum',3300),('FL020','Economy',1400),('FL020','Business',2800),('FL020','Platinum',3400),('FL021','Economy',1450),('FL021','Business',2900),('FL021','Platinum',3500),('FL022','Economy',1500),('FL022','Business',3000),('FL022','Platinum',3600),('FL023','Economy',1550),('FL023','Business',3100),('FL023','Platinum',3700),('FL024','Economy',1600),('FL024','Business',3200),('FL024','Platinum',3800),('FL025','Economy',1650),('FL025','Business',3300),('FL025','Platinum',3900),('FL026','Economy',1700),('FL026','Business',3400),('FL026','Platinum',4000),('FL027','Economy',1750),('FL027','Business',3500),('FL027','Platinum',4100),('FL028','Economy',1800),('FL028','Business',3600),('FL028','Platinum',4200),('FL029','Economy',1850),('FL029','Business',3700),('FL029','Platinum',4300),('FL030','Economy',1900),('FL030','Business',3800),('FL030','Platinum',4400);
/*!40000 ALTER TABLE `flight_pricing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `Location_ID` int NOT NULL AUTO_INCREMENT,
  `Location` varchar(100) NOT NULL,
  `Parent_Location_ID` int DEFAULT NULL,
  PRIMARY KEY (`Location_ID`),
  KEY `Parent_Location_ID` (`Parent_Location_ID`),
  CONSTRAINT `location_ibfk_1` FOREIGN KEY (`Parent_Location_ID`) REFERENCES `location` (`Location_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'Indonesia',NULL),(2,'Sri Lanka',NULL),(3,'India',NULL),(4,'New Delhi',NULL),(5,'Singapore',NULL),(6,'Thailand',NULL),(7,'Jakarta',1),(8,'Bali',1),(9,'Denpasar',8),(10,'Western',2),(11,'Colombo',10),(12,'Southern',2),(13,'Hambantota',12),(14,'Delhi',3),(15,'New Delhi',14),(16,'Maharashtra',3),(17,'Mumbai',16),(18,'Tamil Nadu',3),(19,'Chennai',18),(20,'Bangkok',6),(21,'Don Mueang',6);
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loyalty_detail`
--

DROP TABLE IF EXISTS `loyalty_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loyalty_detail` (
  `Membership_Type` enum('Normal','Frequent','Gold') NOT NULL,
  `Needed_bookings` int NOT NULL,
  `Discount` decimal(3,2) NOT NULL,
  PRIMARY KEY (`Membership_Type`),
  CONSTRAINT `CHK_Discount_Valid` CHECK ((`Discount` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loyalty_detail`
--

LOCK TABLES `loyalty_detail` WRITE;
/*!40000 ALTER TABLE `loyalty_detail` DISABLE KEYS */;
INSERT INTO `loyalty_detail` VALUES ('Normal',0,0.00),('Frequent',10,0.05),('Gold',20,0.09);
/*!40000 ALTER TABLE `loyalty_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_detail`
--

DROP TABLE IF EXISTS `member_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_detail` (
  `User_ID` varchar(36) NOT NULL,
  `No_of_booking` int NOT NULL DEFAULT '0',
  `Membership_Type` enum('Normal','Frequent','Gold') NOT NULL DEFAULT 'Normal',
  PRIMARY KEY (`User_ID`),
  KEY `idx_member_membership_type` (`Membership_Type`),
  CONSTRAINT `member_detail_ibfk_1` FOREIGN KEY (`Membership_Type`) REFERENCES `loyalty_detail` (`Membership_Type`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_detail`
--

LOCK TABLES `member_detail` WRITE;
/*!40000 ALTER TABLE `member_detail` DISABLE KEYS */;
INSERT INTO `member_detail` VALUES ('0267645b-9484-11ef-8ff5-047c16a3f13c',10,'Frequent');
/*!40000 ALTER TABLE `member_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passenger`
--

DROP TABLE IF EXISTS `passenger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passenger` (
  `Passenger_ID` int NOT NULL AUTO_INCREMENT,
  `Passport_Number` varchar(9) NOT NULL,
  `Passport_Expire_Date` date NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Date_of_birth` date NOT NULL,
  `Gender` enum('Male','Female','Other') NOT NULL,
  PRIMARY KEY (`Passenger_ID`),
  UNIQUE KEY `Passport_Number` (`Passport_Number`),
  KEY `idx_passenger_dob` (`Date_of_birth`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passenger`
--

LOCK TABLES `passenger` WRITE;
/*!40000 ALTER TABLE `passenger` DISABLE KEYS */;
INSERT INTO `passenger` VALUES (1,'1234','2030-12-01','Akindu','2014-05-20','Male'),(2,'5678','2028-09-15','Sarah','1990-03-12','Female'),(3,'9012','2029-07-22','John','1985-11-30','Male'),(4,'3456','2031-04-18','Emily','1998-08-05','Female'),(5,'7890','2027-11-09','Michael','1976-02-14','Male'),(6,'2345','2032-01-25','Jessica','2001-06-20','Female'),(7,'6789','2029-03-07','David','1988-09-03','Male'),(8,'0123','2030-08-11','Lisa','1995-12-28','Female'),(9,'4567','2028-05-30','Daniel','1982-04-17','Male'),(10,'8901','2031-10-14','Sophia','2005-07-09','Female');
/*!40000 ALTER TABLE `passenger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route`
--

DROP TABLE IF EXISTS `route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route` (
  `Route_ID` varchar(10) NOT NULL,
  `Origin_airport_code` char(3) NOT NULL,
  `Destination_airport_code` char(3) NOT NULL,
  PRIMARY KEY (`Route_ID`),
  KEY `idx_Destination_route_code` (`Destination_airport_code`),
  KEY `idx_Origin_route_code` (`Origin_airport_code`),
  CONSTRAINT `route_ibfk_1` FOREIGN KEY (`Origin_airport_code`) REFERENCES `airport` (`Airport_code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `route_ibfk_2` FOREIGN KEY (`Destination_airport_code`) REFERENCES `airport` (`Airport_code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route`
--

LOCK TABLES `route` WRITE;
/*!40000 ALTER TABLE `route` DISABLE KEYS */;
INSERT INTO `route` VALUES ('RT001','CGK','DPS'),('RT002','DPS','CGK'),('RT003','BIA','BOM'),('RT004','HRI','CGK'),('RT005','DEL','DPS'),('RT006','BOM','MAA'),('RT007','MAA','BOM'),('RT008','CGK','HRI'),('RT009','BOM','BIA'),('RT010','DPS','DEL'),('RT011','CGK','SIN'),('RT012','SIN','CGK'),('RT013','BKK','DMK'),('RT014','DMK','BKK'),('RT015','SIN','BKK'),('RT016','BKK','SIN'),('RT017','DEL','BOM'),('RT018','BOM','DEL'),('RT019','MAA','DEL'),('RT020','DEL','MAA');
/*!40000 ALTER TABLE `route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat`
--

DROP TABLE IF EXISTS `seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat` (
  `Seat_ID` varchar(10) NOT NULL,
  `Airplane_ID` int NOT NULL,
  `Travel_Class` enum('Economy','Business','Platinum') NOT NULL,
  PRIMARY KEY (`Seat_ID`),
  KEY `Airplane_ID` (`Airplane_ID`),
  CONSTRAINT `seat_ibfk_1` FOREIGN KEY (`Airplane_ID`) REFERENCES `airplane` (`Airplane_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat`
--

LOCK TABLES `seat` WRITE;
/*!40000 ALTER TABLE `seat` DISABLE KEYS */;
INSERT INTO `seat` VALUES ('P001_S001',1,'Economy'),('P001_S002',1,'Economy'),('P001_S003',1,'Economy'),('P001_S004',1,'Economy'),('P001_S005',1,'Economy'),('P001_S006',1,'Economy'),('P001_S007',1,'Economy'),('P001_S008',1,'Economy'),('P001_S009',1,'Economy'),('P001_S010',1,'Economy'),('P001_S011',1,'Economy'),('P001_S012',1,'Economy'),('P001_S013',1,'Economy'),('P001_S014',1,'Economy'),('P001_S015',1,'Economy'),('P001_S016',1,'Economy'),('P001_S017',1,'Economy'),('P001_S018',1,'Economy'),('P001_S019',1,'Economy'),('P001_S020',1,'Economy'),('P001_S021',1,'Economy'),('P001_S022',1,'Economy'),('P001_S023',1,'Economy'),('P001_S024',1,'Economy'),('P001_S025',1,'Economy'),('P001_S026',1,'Economy'),('P001_S027',1,'Economy'),('P001_S028',1,'Economy'),('P001_S029',1,'Economy'),('P001_S030',1,'Economy'),('P001_S031',1,'Economy'),('P001_S032',1,'Economy'),('P001_S033',1,'Economy'),('P001_S034',1,'Economy'),('P001_S035',1,'Economy'),('P001_S036',1,'Economy'),('P001_S037',1,'Economy'),('P001_S038',1,'Economy'),('P001_S039',1,'Economy'),('P001_S040',1,'Economy'),('P001_S041',1,'Economy'),('P001_S042',1,'Economy'),('P001_S043',1,'Economy'),('P001_S044',1,'Economy'),('P001_S045',1,'Economy'),('P001_S046',1,'Economy'),('P001_S047',1,'Economy'),('P001_S048',1,'Economy'),('P001_S049',1,'Economy'),('P001_S050',1,'Economy'),('P001_S051',1,'Economy'),('P001_S052',1,'Economy'),('P001_S053',1,'Economy'),('P001_S054',1,'Economy'),('P001_S055',1,'Economy'),('P001_S056',1,'Economy'),('P001_S057',1,'Economy'),('P001_S058',1,'Economy'),('P001_S059',1,'Economy'),('P001_S060',1,'Economy'),('P001_S061',1,'Economy'),('P001_S062',1,'Economy'),('P001_S063',1,'Economy'),('P001_S064',1,'Economy'),('P001_S065',1,'Economy'),('P001_S066',1,'Economy'),('P001_S067',1,'Economy'),('P001_S068',1,'Economy'),('P001_S069',1,'Economy'),('P001_S070',1,'Economy'),('P001_S071',1,'Economy'),('P001_S072',1,'Economy'),('P001_S073',1,'Economy'),('P001_S074',1,'Economy'),('P001_S075',1,'Economy'),('P001_S076',1,'Economy'),('P001_S077',1,'Economy'),('P001_S078',1,'Economy'),('P001_S079',1,'Economy'),('P001_S080',1,'Economy'),('P001_S081',1,'Economy'),('P001_S082',1,'Economy'),('P001_S083',1,'Economy'),('P001_S084',1,'Economy'),('P001_S085',1,'Economy'),('P001_S086',1,'Economy'),('P001_S087',1,'Economy'),('P001_S088',1,'Economy'),('P001_S089',1,'Economy'),('P001_S090',1,'Economy'),('P001_S091',1,'Economy'),('P001_S092',1,'Economy'),('P001_S093',1,'Economy'),('P001_S094',1,'Economy'),('P001_S095',1,'Economy'),('P001_S096',1,'Economy'),('P001_S097',1,'Economy'),('P001_S098',1,'Economy'),('P001_S099',1,'Economy'),('P001_S100',1,'Economy'),('P001_S101',1,'Economy'),('P001_S102',1,'Economy'),('P001_S103',1,'Economy'),('P001_S104',1,'Economy'),('P001_S105',1,'Economy'),('P001_S106',1,'Economy'),('P001_S107',1,'Economy'),('P001_S108',1,'Economy'),('P001_S109',1,'Economy'),('P001_S110',1,'Economy'),('P001_S111',1,'Economy'),('P001_S112',1,'Economy'),('P001_S113',1,'Economy'),('P001_S114',1,'Economy'),('P001_S115',1,'Business'),('P001_S116',1,'Business'),('P001_S117',1,'Business'),('P001_S118',1,'Business'),('P001_S119',1,'Business'),('P001_S120',1,'Business'),('P001_S121',1,'Business'),('P001_S122',1,'Business'),('P001_S123',1,'Business'),('P001_S124',1,'Business'),('P001_S125',1,'Business'),('P001_S126',1,'Business'),('P001_S127',1,'Business'),('P001_S128',1,'Business'),('P001_S129',1,'Business'),('P001_S130',1,'Business'),('P001_S131',1,'Business'),('P001_S132',1,'Business'),('P001_S133',1,'Business'),('P001_S134',1,'Business'),('P001_S135',1,'Business'),('P001_S136',1,'Business'),('P001_S137',1,'Business'),('P001_S138',1,'Business'),('P001_S139',1,'Business'),('P001_S140',1,'Business'),('P001_S141',1,'Business'),('P001_S142',1,'Business'),('P001_S143',1,'Business'),('P001_S144',1,'Business'),('P001_S145',1,'Platinum'),('P001_S146',1,'Platinum'),('P001_S147',1,'Platinum'),('P001_S148',1,'Platinum'),('P001_S149',1,'Platinum'),('P001_S150',1,'Platinum'),('P001_S151',1,'Platinum'),('P001_S152',1,'Platinum'),('P001_S153',1,'Platinum'),('P001_S154',1,'Platinum'),('P001_S155',1,'Platinum'),('P001_S156',1,'Platinum'),('P001_S157',1,'Platinum'),('P001_S158',1,'Platinum'),('P001_S159',1,'Platinum'),('P001_S160',1,'Platinum'),('P002_S001',2,'Economy'),('P002_S002',2,'Economy'),('P002_S003',2,'Economy'),('P002_S004',2,'Economy'),('P002_S005',2,'Economy'),('P002_S006',2,'Economy'),('P002_S007',2,'Economy'),('P002_S008',2,'Economy'),('P002_S009',2,'Economy'),('P002_S010',2,'Economy'),('P002_S011',2,'Economy'),('P002_S012',2,'Economy'),('P002_S013',2,'Economy'),('P002_S014',2,'Economy'),('P002_S015',2,'Economy'),('P002_S016',2,'Economy'),('P002_S017',2,'Economy'),('P002_S018',2,'Economy'),('P002_S019',2,'Economy'),('P002_S020',2,'Economy'),('P002_S021',2,'Economy'),('P002_S022',2,'Economy'),('P002_S023',2,'Economy'),('P002_S024',2,'Economy'),('P002_S025',2,'Economy'),('P002_S026',2,'Economy'),('P002_S027',2,'Economy'),('P002_S028',2,'Economy'),('P002_S029',2,'Economy'),('P002_S030',2,'Economy'),('P002_S031',2,'Economy'),('P002_S032',2,'Economy'),('P002_S033',2,'Economy'),('P002_S034',2,'Economy'),('P002_S035',2,'Economy'),('P002_S036',2,'Economy'),('P002_S037',2,'Economy'),('P002_S038',2,'Economy'),('P002_S039',2,'Economy'),('P002_S040',2,'Economy'),('P002_S041',2,'Economy'),('P002_S042',2,'Economy'),('P002_S043',2,'Economy'),('P002_S044',2,'Economy'),('P002_S045',2,'Economy'),('P002_S046',2,'Economy'),('P002_S047',2,'Economy'),('P002_S048',2,'Economy'),('P002_S049',2,'Economy'),('P002_S050',2,'Economy'),('P002_S051',2,'Economy'),('P002_S052',2,'Economy'),('P002_S053',2,'Economy'),('P002_S054',2,'Economy'),('P002_S055',2,'Economy'),('P002_S056',2,'Economy'),('P002_S057',2,'Economy'),('P002_S058',2,'Economy'),('P002_S059',2,'Economy'),('P002_S060',2,'Economy'),('P002_S061',2,'Economy'),('P002_S062',2,'Economy'),('P002_S063',2,'Economy'),('P002_S064',2,'Economy'),('P002_S065',2,'Economy'),('P002_S066',2,'Economy'),('P002_S067',2,'Economy'),('P002_S068',2,'Economy'),('P002_S069',2,'Economy'),('P002_S070',2,'Economy'),('P002_S071',2,'Economy'),('P002_S072',2,'Economy'),('P002_S073',2,'Economy'),('P002_S074',2,'Economy'),('P002_S075',2,'Economy'),('P002_S076',2,'Economy'),('P002_S077',2,'Economy'),('P002_S078',2,'Economy'),('P002_S079',2,'Economy'),('P002_S080',2,'Economy'),('P002_S081',2,'Economy'),('P002_S082',2,'Economy'),('P002_S083',2,'Economy'),('P002_S084',2,'Economy'),('P002_S085',2,'Economy'),('P002_S086',2,'Economy'),('P002_S087',2,'Economy'),('P002_S088',2,'Economy'),('P002_S089',2,'Economy'),('P002_S090',2,'Economy'),('P002_S091',2,'Economy'),('P002_S092',2,'Economy'),('P002_S093',2,'Economy'),('P002_S094',2,'Economy'),('P002_S095',2,'Economy'),('P002_S096',2,'Economy'),('P002_S097',2,'Economy'),('P002_S098',2,'Economy'),('P002_S099',2,'Economy'),('P002_S100',2,'Economy'),('P002_S101',2,'Economy'),('P002_S102',2,'Economy'),('P002_S103',2,'Economy'),('P002_S104',2,'Economy'),('P002_S105',2,'Economy'),('P002_S106',2,'Economy'),('P002_S107',2,'Economy'),('P002_S108',2,'Economy'),('P002_S109',2,'Economy'),('P002_S110',2,'Economy'),('P002_S111',2,'Economy'),('P002_S112',2,'Economy'),('P002_S113',2,'Economy'),('P002_S114',2,'Economy'),('P002_S115',2,'Business'),('P002_S116',2,'Business'),('P002_S117',2,'Business'),('P002_S118',2,'Business'),('P002_S119',2,'Business'),('P002_S120',2,'Business'),('P002_S121',2,'Business'),('P002_S122',2,'Business'),('P002_S123',2,'Business'),('P002_S124',2,'Business'),('P002_S125',2,'Business'),('P002_S126',2,'Business'),('P002_S127',2,'Business'),('P002_S128',2,'Business'),('P002_S129',2,'Business'),('P002_S130',2,'Business'),('P002_S131',2,'Business'),('P002_S132',2,'Business'),('P002_S133',2,'Business'),('P002_S134',2,'Business'),('P002_S135',2,'Business'),('P002_S136',2,'Business'),('P002_S137',2,'Business'),('P002_S138',2,'Business'),('P002_S139',2,'Business'),('P002_S140',2,'Business'),('P002_S141',2,'Business'),('P002_S142',2,'Business'),('P002_S143',2,'Business'),('P002_S144',2,'Business'),('P002_S145',2,'Platinum'),('P002_S146',2,'Platinum'),('P002_S147',2,'Platinum'),('P002_S148',2,'Platinum'),('P002_S149',2,'Platinum'),('P002_S150',2,'Platinum'),('P002_S151',2,'Platinum'),('P002_S152',2,'Platinum'),('P002_S153',2,'Platinum'),('P002_S154',2,'Platinum'),('P002_S155',2,'Platinum'),('P002_S156',2,'Platinum'),('P002_S157',2,'Platinum'),('P002_S158',2,'Platinum'),('P002_S159',2,'Platinum'),('P002_S160',2,'Platinum'),('P003_S001',3,'Economy'),('P003_S002',3,'Economy'),('P003_S003',3,'Economy'),('P003_S004',3,'Economy'),('P003_S005',3,'Economy'),('P003_S006',3,'Economy'),('P003_S007',3,'Economy'),('P003_S008',3,'Economy'),('P003_S009',3,'Economy'),('P003_S010',3,'Economy'),('P003_S011',3,'Economy'),('P003_S012',3,'Economy'),('P003_S013',3,'Economy'),('P003_S014',3,'Economy'),('P003_S015',3,'Economy'),('P003_S016',3,'Economy'),('P003_S017',3,'Economy'),('P003_S018',3,'Economy'),('P003_S019',3,'Economy'),('P003_S020',3,'Economy'),('P003_S021',3,'Economy'),('P003_S022',3,'Economy'),('P003_S023',3,'Economy'),('P003_S024',3,'Economy'),('P003_S025',3,'Economy'),('P003_S026',3,'Economy'),('P003_S027',3,'Economy'),('P003_S028',3,'Economy'),('P003_S029',3,'Economy'),('P003_S030',3,'Economy'),('P003_S031',3,'Economy'),('P003_S032',3,'Economy'),('P003_S033',3,'Economy'),('P003_S034',3,'Economy'),('P003_S035',3,'Economy'),('P003_S036',3,'Economy'),('P003_S037',3,'Economy'),('P003_S038',3,'Economy'),('P003_S039',3,'Economy'),('P003_S040',3,'Economy'),('P003_S041',3,'Economy'),('P003_S042',3,'Economy'),('P003_S043',3,'Economy'),('P003_S044',3,'Economy'),('P003_S045',3,'Economy'),('P003_S046',3,'Economy'),('P003_S047',3,'Economy'),('P003_S048',3,'Economy'),('P003_S049',3,'Economy'),('P003_S050',3,'Economy'),('P003_S051',3,'Economy'),('P003_S052',3,'Economy'),('P003_S053',3,'Economy'),('P003_S054',3,'Economy'),('P003_S055',3,'Economy'),('P003_S056',3,'Economy'),('P003_S057',3,'Economy'),('P003_S058',3,'Economy'),('P003_S059',3,'Economy'),('P003_S060',3,'Economy'),('P003_S061',3,'Economy'),('P003_S062',3,'Economy'),('P003_S063',3,'Economy'),('P003_S064',3,'Economy'),('P003_S065',3,'Economy'),('P003_S066',3,'Economy'),('P003_S067',3,'Economy'),('P003_S068',3,'Economy'),('P003_S069',3,'Economy'),('P003_S070',3,'Economy'),('P003_S071',3,'Economy'),('P003_S072',3,'Economy'),('P003_S073',3,'Economy'),('P003_S074',3,'Economy'),('P003_S075',3,'Economy'),('P003_S076',3,'Economy'),('P003_S077',3,'Economy'),('P003_S078',3,'Economy'),('P003_S079',3,'Economy'),('P003_S080',3,'Economy'),('P003_S081',3,'Economy'),('P003_S082',3,'Economy'),('P003_S083',3,'Economy'),('P003_S084',3,'Economy'),('P003_S085',3,'Economy'),('P003_S086',3,'Economy'),('P003_S087',3,'Economy'),('P003_S088',3,'Economy'),('P003_S089',3,'Economy'),('P003_S090',3,'Economy'),('P003_S091',3,'Economy'),('P003_S092',3,'Economy'),('P003_S093',3,'Economy'),('P003_S094',3,'Economy'),('P003_S095',3,'Economy'),('P003_S096',3,'Economy'),('P003_S097',3,'Economy'),('P003_S098',3,'Economy'),('P003_S099',3,'Economy'),('P003_S100',3,'Economy'),('P003_S101',3,'Economy'),('P003_S102',3,'Economy'),('P003_S103',3,'Economy'),('P003_S104',3,'Economy'),('P003_S105',3,'Economy'),('P003_S106',3,'Economy'),('P003_S107',3,'Economy'),('P003_S108',3,'Economy'),('P003_S109',3,'Economy'),('P003_S110',3,'Economy'),('P003_S111',3,'Economy'),('P003_S112',3,'Economy'),('P003_S113',3,'Economy'),('P003_S114',3,'Economy'),('P003_S115',3,'Business'),('P003_S116',3,'Business'),('P003_S117',3,'Business'),('P003_S118',3,'Business'),('P003_S119',3,'Business'),('P003_S120',3,'Business'),('P003_S121',3,'Business'),('P003_S122',3,'Business'),('P003_S123',3,'Business'),('P003_S124',3,'Business'),('P003_S125',3,'Business'),('P003_S126',3,'Business'),('P003_S127',3,'Business'),('P003_S128',3,'Business'),('P003_S129',3,'Business'),('P003_S130',3,'Business'),('P003_S131',3,'Business'),('P003_S132',3,'Business'),('P003_S133',3,'Business'),('P003_S134',3,'Business'),('P003_S135',3,'Business'),('P003_S136',3,'Business'),('P003_S137',3,'Business'),('P003_S138',3,'Business'),('P003_S139',3,'Business'),('P003_S140',3,'Business'),('P003_S141',3,'Business'),('P003_S142',3,'Business'),('P003_S143',3,'Business'),('P003_S144',3,'Business'),('P003_S145',3,'Platinum'),('P003_S146',3,'Platinum'),('P003_S147',3,'Platinum'),('P003_S148',3,'Platinum'),('P003_S149',3,'Platinum'),('P003_S150',3,'Platinum'),('P003_S151',3,'Platinum'),('P003_S152',3,'Platinum'),('P003_S153',3,'Platinum'),('P003_S154',3,'Platinum'),('P003_S155',3,'Platinum'),('P003_S156',3,'Platinum'),('P003_S157',3,'Platinum'),('P003_S158',3,'Platinum'),('P003_S159',3,'Platinum'),('P003_S160',3,'Platinum'),('P004_S001',4,'Economy'),('P004_S002',4,'Economy'),('P004_S003',4,'Economy'),('P004_S004',4,'Economy'),('P004_S005',4,'Economy'),('P004_S006',4,'Economy'),('P004_S007',4,'Economy'),('P004_S008',4,'Economy'),('P004_S009',4,'Economy'),('P004_S010',4,'Economy'),('P004_S011',4,'Economy'),('P004_S012',4,'Economy'),('P004_S013',4,'Economy'),('P004_S014',4,'Economy'),('P004_S015',4,'Economy'),('P004_S016',4,'Economy'),('P004_S017',4,'Economy'),('P004_S018',4,'Economy'),('P004_S019',4,'Economy'),('P004_S020',4,'Economy'),('P004_S021',4,'Economy'),('P004_S022',4,'Economy'),('P004_S023',4,'Economy'),('P004_S024',4,'Economy'),('P004_S025',4,'Economy'),('P004_S026',4,'Economy'),('P004_S027',4,'Economy'),('P004_S028',4,'Economy'),('P004_S029',4,'Economy'),('P004_S030',4,'Economy'),('P004_S031',4,'Economy'),('P004_S032',4,'Economy'),('P004_S033',4,'Economy'),('P004_S034',4,'Economy'),('P004_S035',4,'Economy'),('P004_S036',4,'Economy'),('P004_S037',4,'Economy'),('P004_S038',4,'Economy'),('P004_S039',4,'Economy'),('P004_S040',4,'Economy'),('P004_S041',4,'Economy'),('P004_S042',4,'Economy'),('P004_S043',4,'Economy'),('P004_S044',4,'Economy'),('P004_S045',4,'Economy'),('P004_S046',4,'Economy'),('P004_S047',4,'Economy'),('P004_S048',4,'Economy'),('P004_S049',4,'Economy'),('P004_S050',4,'Economy'),('P004_S051',4,'Economy'),('P004_S052',4,'Economy'),('P004_S053',4,'Economy'),('P004_S054',4,'Economy'),('P004_S055',4,'Economy'),('P004_S056',4,'Economy'),('P004_S057',4,'Economy'),('P004_S058',4,'Economy'),('P004_S059',4,'Economy'),('P004_S060',4,'Economy'),('P004_S061',4,'Economy'),('P004_S062',4,'Economy'),('P004_S063',4,'Economy'),('P004_S064',4,'Economy'),('P004_S065',4,'Economy'),('P004_S066',4,'Economy'),('P004_S067',4,'Economy'),('P004_S068',4,'Economy'),('P004_S069',4,'Economy'),('P004_S070',4,'Economy'),('P004_S071',4,'Economy'),('P004_S072',4,'Economy'),('P004_S073',4,'Economy'),('P004_S074',4,'Economy'),('P004_S075',4,'Economy'),('P004_S076',4,'Economy'),('P004_S077',4,'Economy'),('P004_S078',4,'Economy'),('P004_S079',4,'Economy'),('P004_S080',4,'Economy'),('P004_S081',4,'Economy'),('P004_S082',4,'Economy'),('P004_S083',4,'Economy'),('P004_S084',4,'Economy'),('P004_S085',4,'Economy'),('P004_S086',4,'Economy'),('P004_S087',4,'Economy'),('P004_S088',4,'Economy'),('P004_S089',4,'Economy'),('P004_S090',4,'Economy'),('P004_S091',4,'Economy'),('P004_S092',4,'Economy'),('P004_S093',4,'Economy'),('P004_S094',4,'Economy'),('P004_S095',4,'Economy'),('P004_S096',4,'Economy'),('P004_S097',4,'Economy'),('P004_S098',4,'Economy'),('P004_S099',4,'Economy'),('P004_S100',4,'Economy'),('P004_S101',4,'Economy'),('P004_S102',4,'Economy'),('P004_S103',4,'Economy'),('P004_S104',4,'Economy'),('P004_S105',4,'Economy'),('P004_S106',4,'Economy'),('P004_S107',4,'Economy'),('P004_S108',4,'Economy'),('P004_S109',4,'Economy'),('P004_S110',4,'Economy'),('P004_S111',4,'Economy'),('P004_S112',4,'Economy'),('P004_S113',4,'Economy'),('P004_S114',4,'Economy'),('P004_S115',4,'Economy'),('P004_S116',4,'Economy'),('P004_S117',4,'Economy'),('P004_S118',4,'Economy'),('P004_S119',4,'Economy'),('P004_S120',4,'Economy'),('P004_S121',4,'Economy'),('P004_S122',4,'Economy'),('P004_S123',4,'Economy'),('P004_S124',4,'Economy'),('P004_S125',4,'Economy'),('P004_S126',4,'Economy'),('P004_S127',4,'Economy'),('P004_S128',4,'Economy'),('P004_S129',4,'Economy'),('P004_S130',4,'Economy'),('P004_S131',4,'Economy'),('P004_S132',4,'Economy'),('P004_S133',4,'Economy'),('P004_S134',4,'Economy'),('P004_S135',4,'Economy'),('P004_S136',4,'Business'),('P004_S137',4,'Business'),('P004_S138',4,'Business'),('P004_S139',4,'Business'),('P004_S140',4,'Business'),('P004_S141',4,'Business'),('P004_S142',4,'Business'),('P004_S143',4,'Business'),('P004_S144',4,'Business'),('P004_S145',4,'Business'),('P004_S146',4,'Business'),('P004_S147',4,'Business'),('P004_S148',4,'Business'),('P004_S149',4,'Business'),('P004_S150',4,'Business'),('P004_S151',4,'Business'),('P004_S152',4,'Business'),('P004_S153',4,'Business'),('P004_S154',4,'Business'),('P004_S155',4,'Business'),('P004_S156',4,'Business'),('P004_S157',4,'Platinum'),('P004_S158',4,'Platinum'),('P004_S159',4,'Platinum'),('P004_S160',4,'Platinum'),('P004_S161',4,'Platinum'),('P004_S162',4,'Platinum'),('P004_S163',4,'Platinum'),('P004_S164',4,'Platinum'),('P004_S165',4,'Platinum'),('P004_S166',4,'Platinum'),('P004_S167',4,'Platinum'),('P004_S168',4,'Platinum'),('P004_S169',4,'Platinum'),('P004_S170',4,'Platinum'),('P004_S171',4,'Platinum'),('P004_S172',4,'Platinum'),('P004_S173',4,'Platinum'),('P004_S174',4,'Platinum'),('P004_S175',4,'Platinum'),('P004_S176',4,'Platinum'),('P004_S177',4,'Platinum'),('P004_S178',4,'Platinum'),('P004_S179',4,'Platinum'),('P004_S180',4,'Platinum'),('P005_S001',5,'Economy'),('P005_S002',5,'Economy'),('P005_S003',5,'Economy'),('P005_S004',5,'Economy'),('P005_S005',5,'Economy'),('P005_S006',5,'Economy'),('P005_S007',5,'Economy'),('P005_S008',5,'Economy'),('P005_S009',5,'Economy'),('P005_S010',5,'Economy'),('P005_S011',5,'Economy'),('P005_S012',5,'Economy'),('P005_S013',5,'Economy'),('P005_S014',5,'Economy'),('P005_S015',5,'Economy'),('P005_S016',5,'Economy'),('P005_S017',5,'Economy'),('P005_S018',5,'Economy'),('P005_S019',5,'Economy'),('P005_S020',5,'Economy'),('P005_S021',5,'Economy'),('P005_S022',5,'Economy'),('P005_S023',5,'Economy'),('P005_S024',5,'Economy'),('P005_S025',5,'Economy'),('P005_S026',5,'Economy'),('P005_S027',5,'Economy'),('P005_S028',5,'Economy'),('P005_S029',5,'Economy'),('P005_S030',5,'Economy'),('P005_S031',5,'Economy'),('P005_S032',5,'Economy'),('P005_S033',5,'Economy'),('P005_S034',5,'Economy'),('P005_S035',5,'Economy'),('P005_S036',5,'Economy'),('P005_S037',5,'Economy'),('P005_S038',5,'Economy'),('P005_S039',5,'Economy'),('P005_S040',5,'Economy'),('P005_S041',5,'Economy'),('P005_S042',5,'Economy'),('P005_S043',5,'Economy'),('P005_S044',5,'Economy'),('P005_S045',5,'Economy'),('P005_S046',5,'Economy'),('P005_S047',5,'Economy'),('P005_S048',5,'Economy'),('P005_S049',5,'Economy'),('P005_S050',5,'Economy'),('P005_S051',5,'Economy'),('P005_S052',5,'Economy'),('P005_S053',5,'Economy'),('P005_S054',5,'Economy'),('P005_S055',5,'Economy'),('P005_S056',5,'Economy'),('P005_S057',5,'Economy'),('P005_S058',5,'Economy'),('P005_S059',5,'Economy'),('P005_S060',5,'Economy'),('P005_S061',5,'Economy'),('P005_S062',5,'Economy'),('P005_S063',5,'Economy'),('P005_S064',5,'Economy'),('P005_S065',5,'Economy'),('P005_S066',5,'Economy'),('P005_S067',5,'Economy'),('P005_S068',5,'Economy'),('P005_S069',5,'Economy'),('P005_S070',5,'Economy'),('P005_S071',5,'Economy'),('P005_S072',5,'Economy'),('P005_S073',5,'Economy'),('P005_S074',5,'Economy'),('P005_S075',5,'Economy'),('P005_S076',5,'Economy'),('P005_S077',5,'Economy'),('P005_S078',5,'Economy'),('P005_S079',5,'Economy'),('P005_S080',5,'Economy'),('P005_S081',5,'Economy'),('P005_S082',5,'Economy'),('P005_S083',5,'Economy'),('P005_S084',5,'Economy'),('P005_S085',5,'Economy'),('P005_S086',5,'Economy'),('P005_S087',5,'Economy'),('P005_S088',5,'Economy'),('P005_S089',5,'Economy'),('P005_S090',5,'Economy'),('P005_S091',5,'Economy'),('P005_S092',5,'Economy'),('P005_S093',5,'Economy'),('P005_S094',5,'Economy'),('P005_S095',5,'Economy'),('P005_S096',5,'Economy'),('P005_S097',5,'Economy'),('P005_S098',5,'Economy'),('P005_S099',5,'Economy'),('P005_S100',5,'Economy'),('P005_S101',5,'Economy'),('P005_S102',5,'Economy'),('P005_S103',5,'Economy'),('P005_S104',5,'Economy'),('P005_S105',5,'Economy'),('P005_S106',5,'Economy'),('P005_S107',5,'Economy'),('P005_S108',5,'Economy'),('P005_S109',5,'Economy'),('P005_S110',5,'Economy'),('P005_S111',5,'Economy'),('P005_S112',5,'Economy'),('P005_S113',5,'Economy'),('P005_S114',5,'Economy'),('P005_S115',5,'Economy'),('P005_S116',5,'Economy'),('P005_S117',5,'Economy'),('P005_S118',5,'Economy'),('P005_S119',5,'Economy'),('P005_S120',5,'Economy'),('P005_S121',5,'Economy'),('P005_S122',5,'Economy'),('P005_S123',5,'Economy'),('P005_S124',5,'Economy'),('P005_S125',5,'Economy'),('P005_S126',5,'Economy'),('P005_S127',5,'Economy'),('P005_S128',5,'Economy'),('P005_S129',5,'Economy'),('P005_S130',5,'Economy'),('P005_S131',5,'Economy'),('P005_S132',5,'Economy'),('P005_S133',5,'Economy'),('P005_S134',5,'Economy'),('P005_S135',5,'Economy'),('P005_S136',5,'Business'),('P005_S137',5,'Business'),('P005_S138',5,'Business'),('P005_S139',5,'Business'),('P005_S140',5,'Business'),('P005_S141',5,'Business'),('P005_S142',5,'Business'),('P005_S143',5,'Business'),('P005_S144',5,'Business'),('P005_S145',5,'Business'),('P005_S146',5,'Business'),('P005_S147',5,'Business'),('P005_S148',5,'Business'),('P005_S149',5,'Business'),('P005_S150',5,'Business'),('P005_S151',5,'Business'),('P005_S152',5,'Business'),('P005_S153',5,'Business'),('P005_S154',5,'Business'),('P005_S155',5,'Business'),('P005_S156',5,'Business'),('P005_S157',5,'Platinum'),('P005_S158',5,'Platinum'),('P005_S159',5,'Platinum'),('P005_S160',5,'Platinum'),('P005_S161',5,'Platinum'),('P005_S162',5,'Platinum'),('P005_S163',5,'Platinum'),('P005_S164',5,'Platinum'),('P005_S165',5,'Platinum'),('P005_S166',5,'Platinum'),('P005_S167',5,'Platinum'),('P005_S168',5,'Platinum'),('P005_S169',5,'Platinum'),('P005_S170',5,'Platinum'),('P005_S171',5,'Platinum'),('P005_S172',5,'Platinum'),('P005_S173',5,'Platinum'),('P005_S174',5,'Platinum'),('P005_S175',5,'Platinum'),('P005_S176',5,'Platinum'),('P005_S177',5,'Platinum'),('P005_S178',5,'Platinum'),('P005_S179',5,'Platinum'),('P005_S180',5,'Platinum'),('P006_S001',6,'Economy'),('P006_S002',6,'Economy'),('P006_S003',6,'Economy'),('P006_S004',6,'Economy'),('P006_S005',6,'Economy'),('P006_S006',6,'Economy'),('P006_S007',6,'Economy'),('P006_S008',6,'Economy'),('P006_S009',6,'Economy'),('P006_S010',6,'Economy'),('P006_S011',6,'Economy'),('P006_S012',6,'Economy'),('P006_S013',6,'Economy'),('P006_S014',6,'Economy'),('P006_S015',6,'Economy'),('P006_S016',6,'Economy'),('P006_S017',6,'Economy'),('P006_S018',6,'Economy'),('P006_S019',6,'Economy'),('P006_S020',6,'Economy'),('P006_S021',6,'Economy'),('P006_S022',6,'Economy'),('P006_S023',6,'Economy'),('P006_S024',6,'Economy'),('P006_S025',6,'Economy'),('P006_S026',6,'Economy'),('P006_S027',6,'Economy'),('P006_S028',6,'Economy'),('P006_S029',6,'Economy'),('P006_S030',6,'Economy'),('P006_S031',6,'Economy'),('P006_S032',6,'Economy'),('P006_S033',6,'Economy'),('P006_S034',6,'Economy'),('P006_S035',6,'Economy'),('P006_S036',6,'Economy'),('P006_S037',6,'Economy'),('P006_S038',6,'Economy'),('P006_S039',6,'Economy'),('P006_S040',6,'Economy'),('P006_S041',6,'Economy'),('P006_S042',6,'Economy'),('P006_S043',6,'Economy'),('P006_S044',6,'Economy'),('P006_S045',6,'Economy'),('P006_S046',6,'Economy'),('P006_S047',6,'Economy'),('P006_S048',6,'Economy'),('P006_S049',6,'Economy'),('P006_S050',6,'Economy'),('P006_S051',6,'Economy'),('P006_S052',6,'Economy'),('P006_S053',6,'Economy'),('P006_S054',6,'Economy'),('P006_S055',6,'Economy'),('P006_S056',6,'Economy'),('P006_S057',6,'Economy'),('P006_S058',6,'Economy'),('P006_S059',6,'Economy'),('P006_S060',6,'Economy'),('P006_S061',6,'Economy'),('P006_S062',6,'Economy'),('P006_S063',6,'Economy'),('P006_S064',6,'Economy'),('P006_S065',6,'Economy'),('P006_S066',6,'Economy'),('P006_S067',6,'Economy'),('P006_S068',6,'Economy'),('P006_S069',6,'Economy'),('P006_S070',6,'Economy'),('P006_S071',6,'Economy'),('P006_S072',6,'Economy'),('P006_S073',6,'Economy'),('P006_S074',6,'Economy'),('P006_S075',6,'Economy'),('P006_S076',6,'Economy'),('P006_S077',6,'Economy'),('P006_S078',6,'Economy'),('P006_S079',6,'Economy'),('P006_S080',6,'Economy'),('P006_S081',6,'Economy'),('P006_S082',6,'Economy'),('P006_S083',6,'Economy'),('P006_S084',6,'Economy'),('P006_S085',6,'Economy'),('P006_S086',6,'Economy'),('P006_S087',6,'Economy'),('P006_S088',6,'Economy'),('P006_S089',6,'Economy'),('P006_S090',6,'Economy'),('P006_S091',6,'Economy'),('P006_S092',6,'Economy'),('P006_S093',6,'Economy'),('P006_S094',6,'Economy'),('P006_S095',6,'Economy'),('P006_S096',6,'Economy'),('P006_S097',6,'Economy'),('P006_S098',6,'Economy'),('P006_S099',6,'Economy'),('P006_S100',6,'Economy'),('P006_S101',6,'Economy'),('P006_S102',6,'Economy'),('P006_S103',6,'Economy'),('P006_S104',6,'Economy'),('P006_S105',6,'Economy'),('P006_S106',6,'Economy'),('P006_S107',6,'Economy'),('P006_S108',6,'Economy'),('P006_S109',6,'Economy'),('P006_S110',6,'Economy'),('P006_S111',6,'Economy'),('P006_S112',6,'Economy'),('P006_S113',6,'Economy'),('P006_S114',6,'Economy'),('P006_S115',6,'Economy'),('P006_S116',6,'Economy'),('P006_S117',6,'Economy'),('P006_S118',6,'Economy'),('P006_S119',6,'Economy'),('P006_S120',6,'Economy'),('P006_S121',6,'Economy'),('P006_S122',6,'Economy'),('P006_S123',6,'Economy'),('P006_S124',6,'Economy'),('P006_S125',6,'Economy'),('P006_S126',6,'Economy'),('P006_S127',6,'Economy'),('P006_S128',6,'Economy'),('P006_S129',6,'Economy'),('P006_S130',6,'Economy'),('P006_S131',6,'Economy'),('P006_S132',6,'Economy'),('P006_S133',6,'Economy'),('P006_S134',6,'Economy'),('P006_S135',6,'Economy'),('P006_S136',6,'Business'),('P006_S137',6,'Business'),('P006_S138',6,'Business'),('P006_S139',6,'Business'),('P006_S140',6,'Business'),('P006_S141',6,'Business'),('P006_S142',6,'Business'),('P006_S143',6,'Business'),('P006_S144',6,'Business'),('P006_S145',6,'Business'),('P006_S146',6,'Business'),('P006_S147',6,'Business'),('P006_S148',6,'Business'),('P006_S149',6,'Business'),('P006_S150',6,'Business'),('P006_S151',6,'Business'),('P006_S152',6,'Business'),('P006_S153',6,'Business'),('P006_S154',6,'Business'),('P006_S155',6,'Business'),('P006_S156',6,'Business'),('P006_S157',6,'Platinum'),('P006_S158',6,'Platinum'),('P006_S159',6,'Platinum'),('P006_S160',6,'Platinum'),('P006_S161',6,'Platinum'),('P006_S162',6,'Platinum'),('P006_S163',6,'Platinum'),('P006_S164',6,'Platinum'),('P006_S165',6,'Platinum'),('P006_S166',6,'Platinum'),('P006_S167',6,'Platinum'),('P006_S168',6,'Platinum'),('P006_S169',6,'Platinum'),('P006_S170',6,'Platinum'),('P006_S171',6,'Platinum'),('P006_S172',6,'Platinum'),('P006_S173',6,'Platinum'),('P006_S174',6,'Platinum'),('P006_S175',6,'Platinum'),('P006_S176',6,'Platinum'),('P006_S177',6,'Platinum'),('P006_S178',6,'Platinum'),('P006_S179',6,'Platinum'),('P006_S180',6,'Platinum'),('P007_S001',7,'Economy'),('P007_S002',7,'Economy'),('P007_S003',7,'Economy'),('P007_S004',7,'Economy'),('P007_S005',7,'Economy'),('P007_S006',7,'Economy'),('P007_S007',7,'Economy'),('P007_S008',7,'Economy'),('P007_S009',7,'Economy'),('P007_S010',7,'Economy'),('P007_S011',7,'Economy'),('P007_S012',7,'Economy'),('P007_S013',7,'Economy'),('P007_S014',7,'Economy'),('P007_S015',7,'Economy'),('P007_S016',7,'Economy'),('P007_S017',7,'Economy'),('P007_S018',7,'Economy'),('P007_S019',7,'Economy'),('P007_S020',7,'Economy'),('P007_S021',7,'Economy'),('P007_S022',7,'Economy'),('P007_S023',7,'Economy'),('P007_S024',7,'Economy'),('P007_S025',7,'Economy'),('P007_S026',7,'Economy'),('P007_S027',7,'Economy'),('P007_S028',7,'Economy'),('P007_S029',7,'Economy'),('P007_S030',7,'Economy'),('P007_S031',7,'Economy'),('P007_S032',7,'Economy'),('P007_S033',7,'Economy'),('P007_S034',7,'Economy'),('P007_S035',7,'Economy'),('P007_S036',7,'Economy'),('P007_S037',7,'Economy'),('P007_S038',7,'Economy'),('P007_S039',7,'Economy'),('P007_S040',7,'Economy'),('P007_S041',7,'Economy'),('P007_S042',7,'Economy'),('P007_S043',7,'Economy'),('P007_S044',7,'Economy'),('P007_S045',7,'Economy'),('P007_S046',7,'Economy'),('P007_S047',7,'Economy'),('P007_S048',7,'Economy'),('P007_S049',7,'Economy'),('P007_S050',7,'Economy'),('P007_S051',7,'Economy'),('P007_S052',7,'Economy'),('P007_S053',7,'Economy'),('P007_S054',7,'Economy'),('P007_S055',7,'Economy'),('P007_S056',7,'Economy'),('P007_S057',7,'Economy'),('P007_S058',7,'Economy'),('P007_S059',7,'Economy'),('P007_S060',7,'Economy'),('P007_S061',7,'Economy'),('P007_S062',7,'Economy'),('P007_S063',7,'Economy'),('P007_S064',7,'Economy'),('P007_S065',7,'Economy'),('P007_S066',7,'Economy'),('P007_S067',7,'Economy'),('P007_S068',7,'Economy'),('P007_S069',7,'Economy'),('P007_S070',7,'Economy'),('P007_S071',7,'Economy'),('P007_S072',7,'Economy'),('P007_S073',7,'Economy'),('P007_S074',7,'Economy'),('P007_S075',7,'Economy'),('P007_S076',7,'Economy'),('P007_S077',7,'Economy'),('P007_S078',7,'Economy'),('P007_S079',7,'Economy'),('P007_S080',7,'Economy'),('P007_S081',7,'Economy'),('P007_S082',7,'Economy'),('P007_S083',7,'Economy'),('P007_S084',7,'Economy'),('P007_S085',7,'Economy'),('P007_S086',7,'Economy'),('P007_S087',7,'Economy'),('P007_S088',7,'Economy'),('P007_S089',7,'Economy'),('P007_S090',7,'Economy'),('P007_S091',7,'Economy'),('P007_S092',7,'Economy'),('P007_S093',7,'Economy'),('P007_S094',7,'Economy'),('P007_S095',7,'Economy'),('P007_S096',7,'Economy'),('P007_S097',7,'Economy'),('P007_S098',7,'Economy'),('P007_S099',7,'Economy'),('P007_S100',7,'Economy'),('P007_S101',7,'Economy'),('P007_S102',7,'Economy'),('P007_S103',7,'Economy'),('P007_S104',7,'Economy'),('P007_S105',7,'Economy'),('P007_S106',7,'Economy'),('P007_S107',7,'Economy'),('P007_S108',7,'Economy'),('P007_S109',7,'Economy'),('P007_S110',7,'Economy'),('P007_S111',7,'Economy'),('P007_S112',7,'Economy'),('P007_S113',7,'Economy'),('P007_S114',7,'Economy'),('P007_S115',7,'Economy'),('P007_S116',7,'Economy'),('P007_S117',7,'Economy'),('P007_S118',7,'Economy'),('P007_S119',7,'Economy'),('P007_S120',7,'Economy'),('P007_S121',7,'Economy'),('P007_S122',7,'Economy'),('P007_S123',7,'Economy'),('P007_S124',7,'Economy'),('P007_S125',7,'Economy'),('P007_S126',7,'Economy'),('P007_S127',7,'Economy'),('P007_S128',7,'Economy'),('P007_S129',7,'Economy'),('P007_S130',7,'Economy'),('P007_S131',7,'Economy'),('P007_S132',7,'Economy'),('P007_S133',7,'Economy'),('P007_S134',7,'Economy'),('P007_S135',7,'Economy'),('P007_S136',7,'Business'),('P007_S137',7,'Business'),('P007_S138',7,'Business'),('P007_S139',7,'Business'),('P007_S140',7,'Business'),('P007_S141',7,'Business'),('P007_S142',7,'Business'),('P007_S143',7,'Business'),('P007_S144',7,'Business'),('P007_S145',7,'Business'),('P007_S146',7,'Business'),('P007_S147',7,'Business'),('P007_S148',7,'Business'),('P007_S149',7,'Business'),('P007_S150',7,'Business'),('P007_S151',7,'Business'),('P007_S152',7,'Business'),('P007_S153',7,'Business'),('P007_S154',7,'Business'),('P007_S155',7,'Business'),('P007_S156',7,'Business'),('P007_S157',7,'Platinum'),('P007_S158',7,'Platinum'),('P007_S159',7,'Platinum'),('P007_S160',7,'Platinum'),('P007_S161',7,'Platinum'),('P007_S162',7,'Platinum'),('P007_S163',7,'Platinum'),('P007_S164',7,'Platinum'),('P007_S165',7,'Platinum'),('P007_S166',7,'Platinum'),('P007_S167',7,'Platinum'),('P007_S168',7,'Platinum'),('P007_S169',7,'Platinum'),('P007_S170',7,'Platinum'),('P007_S171',7,'Platinum'),('P007_S172',7,'Platinum'),('P007_S173',7,'Platinum'),('P007_S174',7,'Platinum'),('P007_S175',7,'Platinum'),('P007_S176',7,'Platinum'),('P007_S177',7,'Platinum'),('P007_S178',7,'Platinum'),('P007_S179',7,'Platinum'),('P007_S180',7,'Platinum'),('P008_S001',8,'Economy'),('P008_S002',8,'Economy'),('P008_S003',8,'Economy'),('P008_S004',8,'Economy'),('P008_S005',8,'Economy'),('P008_S006',8,'Economy'),('P008_S007',8,'Economy'),('P008_S008',8,'Economy'),('P008_S009',8,'Economy'),('P008_S010',8,'Economy'),('P008_S011',8,'Economy'),('P008_S012',8,'Economy'),('P008_S013',8,'Economy'),('P008_S014',8,'Economy'),('P008_S015',8,'Economy'),('P008_S016',8,'Economy'),('P008_S017',8,'Economy'),('P008_S018',8,'Economy'),('P008_S019',8,'Economy'),('P008_S020',8,'Economy'),('P008_S021',8,'Economy'),('P008_S022',8,'Economy'),('P008_S023',8,'Economy'),('P008_S024',8,'Economy'),('P008_S025',8,'Economy'),('P008_S026',8,'Economy'),('P008_S027',8,'Economy'),('P008_S028',8,'Economy'),('P008_S029',8,'Economy'),('P008_S030',8,'Economy'),('P008_S031',8,'Economy'),('P008_S032',8,'Economy'),('P008_S033',8,'Economy'),('P008_S034',8,'Economy'),('P008_S035',8,'Economy'),('P008_S036',8,'Economy'),('P008_S037',8,'Economy'),('P008_S038',8,'Economy'),('P008_S039',8,'Economy'),('P008_S040',8,'Economy'),('P008_S041',8,'Economy'),('P008_S042',8,'Economy'),('P008_S043',8,'Economy'),('P008_S044',8,'Economy'),('P008_S045',8,'Economy'),('P008_S046',8,'Economy'),('P008_S047',8,'Economy'),('P008_S048',8,'Economy'),('P008_S049',8,'Economy'),('P008_S050',8,'Economy'),('P008_S051',8,'Economy'),('P008_S052',8,'Economy'),('P008_S053',8,'Economy'),('P008_S054',8,'Economy'),('P008_S055',8,'Economy'),('P008_S056',8,'Economy'),('P008_S057',8,'Economy'),('P008_S058',8,'Economy'),('P008_S059',8,'Economy'),('P008_S060',8,'Economy'),('P008_S061',8,'Economy'),('P008_S062',8,'Economy'),('P008_S063',8,'Economy'),('P008_S064',8,'Economy'),('P008_S065',8,'Economy'),('P008_S066',8,'Economy'),('P008_S067',8,'Economy'),('P008_S068',8,'Economy'),('P008_S069',8,'Economy'),('P008_S070',8,'Economy'),('P008_S071',8,'Economy'),('P008_S072',8,'Economy'),('P008_S073',8,'Economy'),('P008_S074',8,'Economy'),('P008_S075',8,'Economy'),('P008_S076',8,'Economy'),('P008_S077',8,'Economy'),('P008_S078',8,'Economy'),('P008_S079',8,'Economy'),('P008_S080',8,'Economy'),('P008_S081',8,'Economy'),('P008_S082',8,'Economy'),('P008_S083',8,'Economy'),('P008_S084',8,'Economy'),('P008_S085',8,'Economy'),('P008_S086',8,'Economy'),('P008_S087',8,'Economy'),('P008_S088',8,'Economy'),('P008_S089',8,'Economy'),('P008_S090',8,'Economy'),('P008_S091',8,'Economy'),('P008_S092',8,'Economy'),('P008_S093',8,'Economy'),('P008_S094',8,'Economy'),('P008_S095',8,'Economy'),('P008_S096',8,'Economy'),('P008_S097',8,'Economy'),('P008_S098',8,'Economy'),('P008_S099',8,'Economy'),('P008_S100',8,'Economy'),('P008_S101',8,'Economy'),('P008_S102',8,'Economy'),('P008_S103',8,'Economy'),('P008_S104',8,'Economy'),('P008_S105',8,'Economy'),('P008_S106',8,'Economy'),('P008_S107',8,'Economy'),('P008_S108',8,'Economy'),('P008_S109',8,'Economy'),('P008_S110',8,'Economy'),('P008_S111',8,'Economy'),('P008_S112',8,'Economy'),('P008_S113',8,'Economy'),('P008_S114',8,'Economy'),('P008_S115',8,'Economy'),('P008_S116',8,'Economy'),('P008_S117',8,'Economy'),('P008_S118',8,'Economy'),('P008_S119',8,'Economy'),('P008_S120',8,'Economy'),('P008_S121',8,'Economy'),('P008_S122',8,'Economy'),('P008_S123',8,'Economy'),('P008_S124',8,'Economy'),('P008_S125',8,'Economy'),('P008_S126',8,'Economy'),('P008_S127',8,'Economy'),('P008_S128',8,'Economy'),('P008_S129',8,'Economy'),('P008_S130',8,'Economy'),('P008_S131',8,'Economy'),('P008_S132',8,'Economy'),('P008_S133',8,'Economy'),('P008_S134',8,'Economy'),('P008_S135',8,'Economy'),('P008_S136',8,'Economy'),('P008_S137',8,'Economy'),('P008_S138',8,'Economy'),('P008_S139',8,'Economy'),('P008_S140',8,'Economy'),('P008_S141',8,'Economy'),('P008_S142',8,'Economy'),('P008_S143',8,'Economy'),('P008_S144',8,'Economy'),('P008_S145',8,'Economy'),('P008_S146',8,'Economy'),('P008_S147',8,'Economy'),('P008_S148',8,'Economy'),('P008_S149',8,'Economy'),('P008_S150',8,'Economy'),('P008_S151',8,'Economy'),('P008_S152',8,'Economy'),('P008_S153',8,'Economy'),('P008_S154',8,'Economy'),('P008_S155',8,'Economy'),('P008_S156',8,'Economy'),('P008_S157',8,'Economy'),('P008_S158',8,'Economy'),('P008_S159',8,'Economy'),('P008_S160',8,'Economy'),('P008_S161',8,'Economy'),('P008_S162',8,'Economy'),('P008_S163',8,'Economy'),('P008_S164',8,'Economy'),('P008_S165',8,'Economy'),('P008_S166',8,'Economy'),('P008_S167',8,'Economy'),('P008_S168',8,'Economy'),('P008_S169',8,'Economy'),('P008_S170',8,'Economy'),('P008_S171',8,'Economy'),('P008_S172',8,'Economy'),('P008_S173',8,'Economy'),('P008_S174',8,'Economy'),('P008_S175',8,'Economy'),('P008_S176',8,'Economy'),('P008_S177',8,'Economy'),('P008_S178',8,'Economy'),('P008_S179',8,'Economy'),('P008_S180',8,'Economy'),('P008_S181',8,'Economy'),('P008_S182',8,'Economy'),('P008_S183',8,'Economy'),('P008_S184',8,'Economy'),('P008_S185',8,'Economy'),('P008_S186',8,'Economy'),('P008_S187',8,'Economy'),('P008_S188',8,'Economy'),('P008_S189',8,'Economy'),('P008_S190',8,'Economy'),('P008_S191',8,'Economy'),('P008_S192',8,'Economy'),('P008_S193',8,'Economy'),('P008_S194',8,'Economy'),('P008_S195',8,'Economy'),('P008_S196',8,'Economy'),('P008_S197',8,'Economy'),('P008_S198',8,'Economy'),('P008_S199',8,'Economy'),('P008_S200',8,'Economy'),('P008_S201',8,'Economy'),('P008_S202',8,'Economy'),('P008_S203',8,'Economy'),('P008_S204',8,'Economy'),('P008_S205',8,'Economy'),('P008_S206',8,'Economy'),('P008_S207',8,'Economy'),('P008_S208',8,'Economy'),('P008_S209',8,'Economy'),('P008_S210',8,'Economy'),('P008_S211',8,'Economy'),('P008_S212',8,'Economy'),('P008_S213',8,'Economy'),('P008_S214',8,'Economy'),('P008_S215',8,'Economy'),('P008_S216',8,'Economy'),('P008_S217',8,'Economy'),('P008_S218',8,'Economy'),('P008_S219',8,'Economy'),('P008_S220',8,'Economy'),('P008_S221',8,'Economy'),('P008_S222',8,'Economy'),('P008_S223',8,'Economy'),('P008_S224',8,'Economy'),('P008_S225',8,'Economy'),('P008_S226',8,'Economy'),('P008_S227',8,'Economy'),('P008_S228',8,'Economy'),('P008_S229',8,'Economy'),('P008_S230',8,'Economy'),('P008_S231',8,'Economy'),('P008_S232',8,'Economy'),('P008_S233',8,'Economy'),('P008_S234',8,'Economy'),('P008_S235',8,'Economy'),('P008_S236',8,'Economy'),('P008_S237',8,'Economy'),('P008_S238',8,'Economy'),('P008_S239',8,'Economy'),('P008_S240',8,'Economy'),('P008_S241',8,'Economy'),('P008_S242',8,'Economy'),('P008_S243',8,'Economy'),('P008_S244',8,'Economy'),('P008_S245',8,'Economy'),('P008_S246',8,'Economy'),('P008_S247',8,'Economy'),('P008_S248',8,'Economy'),('P008_S249',8,'Economy'),('P008_S250',8,'Economy'),('P008_S251',8,'Economy'),('P008_S252',8,'Economy'),('P008_S253',8,'Economy'),('P008_S254',8,'Economy'),('P008_S255',8,'Economy'),('P008_S256',8,'Economy'),('P008_S257',8,'Economy'),('P008_S258',8,'Economy'),('P008_S259',8,'Economy'),('P008_S260',8,'Economy'),('P008_S261',8,'Economy'),('P008_S262',8,'Economy'),('P008_S263',8,'Economy'),('P008_S264',8,'Economy'),('P008_S265',8,'Economy'),('P008_S266',8,'Economy'),('P008_S267',8,'Economy'),('P008_S268',8,'Economy'),('P008_S269',8,'Economy'),('P008_S270',8,'Economy'),('P008_S271',8,'Economy'),('P008_S272',8,'Economy'),('P008_S273',8,'Economy'),('P008_S274',8,'Economy'),('P008_S275',8,'Economy'),('P008_S276',8,'Economy'),('P008_S277',8,'Economy'),('P008_S278',8,'Economy'),('P008_S279',8,'Economy'),('P008_S280',8,'Economy'),('P008_S281',8,'Economy'),('P008_S282',8,'Economy'),('P008_S283',8,'Economy'),('P008_S284',8,'Economy'),('P008_S285',8,'Economy'),('P008_S286',8,'Economy'),('P008_S287',8,'Economy'),('P008_S288',8,'Economy'),('P008_S289',8,'Economy'),('P008_S290',8,'Economy'),('P008_S291',8,'Economy'),('P008_S292',8,'Economy'),('P008_S293',8,'Economy'),('P008_S294',8,'Economy'),('P008_S295',8,'Economy'),('P008_S296',8,'Economy'),('P008_S297',8,'Economy'),('P008_S298',8,'Economy'),('P008_S299',8,'Economy'),('P008_S300',8,'Economy'),('P008_S301',8,'Economy'),('P008_S302',8,'Economy'),('P008_S303',8,'Economy'),('P008_S304',8,'Economy'),('P008_S305',8,'Economy'),('P008_S306',8,'Economy'),('P008_S307',8,'Economy'),('P008_S308',8,'Economy'),('P008_S309',8,'Economy'),('P008_S310',8,'Economy'),('P008_S311',8,'Economy'),('P008_S312',8,'Economy'),('P008_S313',8,'Economy'),('P008_S314',8,'Economy'),('P008_S315',8,'Economy'),('P008_S316',8,'Economy'),('P008_S317',8,'Economy'),('P008_S318',8,'Economy'),('P008_S319',8,'Economy'),('P008_S320',8,'Economy'),('P008_S321',8,'Economy'),('P008_S322',8,'Economy'),('P008_S323',8,'Economy'),('P008_S324',8,'Economy'),('P008_S325',8,'Economy'),('P008_S326',8,'Economy'),('P008_S327',8,'Economy'),('P008_S328',8,'Economy'),('P008_S329',8,'Economy'),('P008_S330',8,'Economy'),('P008_S331',8,'Economy'),('P008_S332',8,'Economy'),('P008_S333',8,'Economy'),('P008_S334',8,'Economy'),('P008_S335',8,'Economy'),('P008_S336',8,'Economy'),('P008_S337',8,'Economy'),('P008_S338',8,'Economy'),('P008_S339',8,'Economy'),('P008_S340',8,'Economy'),('P008_S341',8,'Economy'),('P008_S342',8,'Economy'),('P008_S343',8,'Economy'),('P008_S344',8,'Economy'),('P008_S345',8,'Economy'),('P008_S346',8,'Economy'),('P008_S347',8,'Economy'),('P008_S348',8,'Economy'),('P008_S349',8,'Economy'),('P008_S350',8,'Economy'),('P008_S351',8,'Economy'),('P008_S352',8,'Economy'),('P008_S353',8,'Economy'),('P008_S354',8,'Economy'),('P008_S355',8,'Economy'),('P008_S356',8,'Economy'),('P008_S357',8,'Economy'),('P008_S358',8,'Economy'),('P008_S359',8,'Economy'),('P008_S360',8,'Economy'),('P008_S361',8,'Economy'),('P008_S362',8,'Economy'),('P008_S363',8,'Economy'),('P008_S364',8,'Economy'),('P008_S365',8,'Economy'),('P008_S366',8,'Economy'),('P008_S367',8,'Economy'),('P008_S368',8,'Economy'),('P008_S369',8,'Economy'),('P008_S370',8,'Economy'),('P008_S371',8,'Economy'),('P008_S372',8,'Economy'),('P008_S373',8,'Economy'),('P008_S374',8,'Economy'),('P008_S375',8,'Economy'),('P008_S376',8,'Economy'),('P008_S377',8,'Economy'),('P008_S378',8,'Economy'),('P008_S379',8,'Economy'),('P008_S380',8,'Economy'),('P008_S381',8,'Economy'),('P008_S382',8,'Economy'),('P008_S383',8,'Economy'),('P008_S384',8,'Economy'),('P008_S385',8,'Economy'),('P008_S386',8,'Economy'),('P008_S387',8,'Economy'),('P008_S388',8,'Economy'),('P008_S389',8,'Economy'),('P008_S390',8,'Economy'),('P008_S391',8,'Economy'),('P008_S392',8,'Economy'),('P008_S393',8,'Economy'),('P008_S394',8,'Economy'),('P008_S395',8,'Economy'),('P008_S396',8,'Economy'),('P008_S397',8,'Economy'),('P008_S398',8,'Economy'),('P008_S399',8,'Economy'),('P008_S400',8,'Business'),('P008_S401',8,'Business'),('P008_S402',8,'Business'),('P008_S403',8,'Business'),('P008_S404',8,'Business'),('P008_S405',8,'Business'),('P008_S406',8,'Business'),('P008_S407',8,'Business'),('P008_S408',8,'Business'),('P008_S409',8,'Business'),('P008_S410',8,'Business'),('P008_S411',8,'Business'),('P008_S412',8,'Business'),('P008_S413',8,'Business'),('P008_S414',8,'Business'),('P008_S415',8,'Business'),('P008_S416',8,'Business'),('P008_S417',8,'Business'),('P008_S418',8,'Business'),('P008_S419',8,'Business'),('P008_S420',8,'Business'),('P008_S421',8,'Business'),('P008_S422',8,'Business'),('P008_S423',8,'Business'),('P008_S424',8,'Business'),('P008_S425',8,'Business'),('P008_S426',8,'Business'),('P008_S427',8,'Business'),('P008_S428',8,'Business'),('P008_S429',8,'Business'),('P008_S430',8,'Business'),('P008_S431',8,'Business'),('P008_S432',8,'Business'),('P008_S433',8,'Business'),('P008_S434',8,'Business'),('P008_S435',8,'Business'),('P008_S436',8,'Business'),('P008_S437',8,'Business'),('P008_S438',8,'Business'),('P008_S439',8,'Business'),('P008_S440',8,'Business'),('P008_S441',8,'Business'),('P008_S442',8,'Business'),('P008_S443',8,'Business'),('P008_S444',8,'Business'),('P008_S445',8,'Business'),('P008_S446',8,'Business'),('P008_S447',8,'Business'),('P008_S448',8,'Business'),('P008_S449',8,'Business'),('P008_S450',8,'Business'),('P008_S451',8,'Business'),('P008_S452',8,'Business'),('P008_S453',8,'Business'),('P008_S454',8,'Business'),('P008_S455',8,'Business'),('P008_S456',8,'Business'),('P008_S457',8,'Business'),('P008_S458',8,'Business'),('P008_S459',8,'Business'),('P008_S460',8,'Business'),('P008_S461',8,'Business'),('P008_S462',8,'Business'),('P008_S463',8,'Business'),('P008_S464',8,'Business'),('P008_S465',8,'Business'),('P008_S466',8,'Business'),('P008_S467',8,'Business'),('P008_S468',8,'Business'),('P008_S469',8,'Business'),('P008_S470',8,'Business'),('P008_S471',8,'Business'),('P008_S472',8,'Business'),('P008_S473',8,'Business'),('P008_S474',8,'Business'),('P008_S475',8,'Business'),('P008_S476',8,'Platinum'),('P008_S477',8,'Platinum'),('P008_S478',8,'Platinum'),('P008_S479',8,'Platinum'),('P008_S480',8,'Platinum'),('P008_S481',8,'Platinum'),('P008_S482',8,'Platinum'),('P008_S483',8,'Platinum'),('P008_S484',8,'Platinum'),('P008_S485',8,'Platinum'),('P008_S486',8,'Platinum'),('P008_S487',8,'Platinum'),('P008_S488',8,'Platinum'),('P008_S489',8,'Platinum');
/*!40000 ALTER TABLE `seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `User_ID` varchar(36) NOT NULL DEFAULT (uuid()),
  `User_name` varchar(50) NOT NULL,
  `First_name` varchar(50) NOT NULL,
  `Last_name` varchar(50) NOT NULL,
  `Date_of_birth` date NOT NULL,
  `Country` varchar(50) NOT NULL,
  `NIC_code` varchar(20) NOT NULL,
  `Gender` enum('Male','Female','Other') NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Role` enum('Admin','Member') NOT NULL,
  `Password` varchar(255) NOT NULL,
  PRIMARY KEY (`User_ID`),
  UNIQUE KEY `User_name` (`User_name`),
  UNIQUE KEY `Email` (`Email`),
  KEY `idx_user_email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('0267645b-9484-11ef-8ff5-047c16a3f13c','AkinduH','Akindu','Himan','2024-10-03','Sri Lanka','20022470923','Male','akinduhiman2@gmail.com','Member','$2b$10$ZzPDqW1Gq263/z/qX7WayuEmCSh34fi.nWkhFoCAZ.7xAIbeafyE.'),('f79cd31b-9478-11ef-8ff5-047c16a3f13c','admin','admin','admin','2024-10-01','Sri Lanka','20022470923','Male','admin@gmail.com','Admin','$2b$10$zFM/CtHqkECfSMAog2PcluQUDOOHEMzUYCHWGy39D7bul17cYqRHu');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_user_insert` AFTER INSERT ON `user` FOR EACH ROW BEGIN
    -- Check if the role is 'Member'
    IF NEW.Role = 'Member' THEN
        -- Insert into Member_detail with default attributes
        INSERT INTO Member_detail (User_ID, No_of_booking, Membership_Type)
        VALUES (NEW.User_ID, 0, 'Normal');
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping events for database 'b_airways'
--

--
-- Dumping routines for database 'b_airways'
--
/*!50003 DROP FUNCTION IF EXISTS `GetFullAge` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `GetFullAge`(p_Date_of_birth DATE) RETURNS varchar(50) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE years INT;
    DECLARE months INT;
    DECLARE days INT;

    -- Calculate the years, months, and days difference
    SET years = TIMESTAMPDIFF(YEAR, p_Date_of_birth, CURDATE());
    SET months = TIMESTAMPDIFF(MONTH, p_Date_of_birth, CURDATE()) % 12;
    SET days = DATEDIFF(CURDATE(), DATE_ADD(DATE_ADD(p_Date_of_birth, INTERVAL years YEAR), INTERVAL months MONTH));

    -- Return the result as 'X years, Y months, Z days'
    RETURN CONCAT(years, ' years, ', months, ' months, ', days, ' days');
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `GetRevenueByAircraftModel` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `GetRevenueByAircraftModel`(
    Aircraft_type INT
) RETURNS float
    DETERMINISTIC
BEGIN
    DECLARE totalRevenue FLOAT DEFAULT 0;

    SELECT SUM(b.Price)
    INTO totalRevenue
    FROM booking b
    JOIN flight f ON f.Flight_ID = b.Flight_ID    
    JOIN airplane a ON a.Airplane_ID = f.Airplane_ID
    JOIN airplane_model am ON am.Airplane_model_ID = a.Airplane_model_ID
    WHERE am.Airplane_model_ID = Aircraft_type;

    RETURN totalRevenue;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddFlight` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddFlight`(
    IN p_Airplane_ID INT,
    IN p_Route_ID VARCHAR(10),
    IN p_Departure_date DATE,
    IN p_Arrival_date DATE,
    IN p_Departure_time TIME,
    IN p_Arrival_time TIME,
    IN p_Economy_Price FLOAT,
    IN p_Business_Price FLOAT,
    IN p_Platinum_Price FLOAT
)
BEGIN
    DECLARE new_Flight_ID VARCHAR(10);

    -- Generate the next Flight_ID based on the highest existing Flight_ID
    SELECT CONCAT('FL', LPAD(COALESCE(MAX(CAST(SUBSTRING(Flight_ID, 3, 3) AS UNSIGNED)), 0) + 1, 3, '0'))
    INTO new_Flight_ID
    FROM flight;

    -- Insert into the flight table
    INSERT INTO flight (Flight_ID, Airplane_ID, Route_ID, Departure_date, Arrival_date, Departure_time, Arrival_time)
    VALUES (new_Flight_ID, p_Airplane_ID, p_Route_ID, p_Departure_date, p_Arrival_date, p_Departure_time, p_Arrival_time);

    -- Insert pricing 
    INSERT INTO flight_pricing (Flight_ID, Travel_Class, Price) 
    VALUES 
    (new_Flight_ID, 'Economy', p_Economy_Price),
    (new_Flight_ID, 'Business', p_Business_Price),
    (new_Flight_ID, 'Platinum', p_Platinum_Price);
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddPassenger` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddPassenger`(
    IN p_Passport_Number VARCHAR(9),
    IN p_Passport_Expire_Date DATE,
    IN p_Name VARCHAR(100),
    IN p_Date_of_birth DATE,
    IN p_Gender ENUM('Male', 'Female', 'Other')
)
BEGIN
    DECLARE existing_passenger_id INT;
    -- Check if passenger already exists
    SELECT Passenger_ID INTO existing_passenger_id
    FROM passenger
    WHERE Passport_Number = p_Passport_Number
    LIMIT 1;
    IF existing_passenger_id IS NOT NULL THEN
        -- Update existing passenger with new data
        UPDATE passenger
        SET Passport_Expire_Date = p_Passport_Expire_Date,
            Name = p_Name,
            Date_of_birth = p_Date_of_birth,
            Gender = p_Gender
        WHERE Passenger_ID = existing_passenger_id;
        -- Return existing passenger ID
        SELECT existing_passenger_id AS Passenger_ID;
    ELSE
        -- Insert new passenger and return new ID
        INSERT INTO passenger
        (Passport_Number, Passport_Expire_Date, Name, Date_of_birth, Gender)
        VALUES
        (p_Passport_Number, p_Passport_Expire_Date, p_Name, p_Date_of_birth, p_Gender);
        SELECT LAST_INSERT_ID() AS Passenger_ID;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateBooking` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateBooking`(
    IN p_Flight_ID VARCHAR(10),
    IN p_User_ID VARCHAR(36),
    IN p_Passenger_ID INT,
    IN p_Seat_Number VARCHAR(3),
    IN p_Price FLOAT
)
BEGIN
    DECLARE v_Booking_ID VARCHAR(10);
    DECLARE v_Last_Booking_Num INT;
    DECLARE v_Airplane_ID INT;
    DECLARE v_Seat_ID VARCHAR(10);
    DECLARE exit handler for sqlexception
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Convert empty string to NULL for User_ID
    IF p_User_ID = '' THEN
        SET p_User_ID = NULL;
    END IF;

    -- Get the Airplane_ID for the given Flight_ID
    SELECT Airplane_ID INTO v_Airplane_ID
    FROM Flight
    WHERE Flight_ID = p_Flight_ID;

    -- Convert seat number to seat ID
    SET v_Seat_ID = CONCAT('P', LPAD(v_Airplane_ID, 3, '0'), '_S', p_Seat_Number);

    -- Check if the seat is already booked for this flight
    IF EXISTS (SELECT 1 FROM Booking WHERE Flight_ID = p_Flight_ID AND Seat_ID = v_Seat_ID) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This seat is already booked.';
    END IF;

    -- Check if there is any booking already
    SELECT MAX(CAST(SUBSTRING(Booking_ID, 4) AS UNSIGNED))
    INTO v_Last_Booking_Num
    FROM Booking
    FOR UPDATE;

    -- Set the booking ID
    IF v_Last_Booking_Num IS NULL THEN
        SET v_Booking_ID = 'bk_1';
    ELSE
        SET v_Booking_ID = CONCAT('bk_', v_Last_Booking_Num + 1);
    END IF;

    -- Insert the new booking
    INSERT INTO Booking (Booking_ID, Flight_ID, User_ID, Passenger_ID, Seat_ID, Issue_date, Price)
    VALUES (v_Booking_ID, p_Flight_ID, p_User_ID, p_Passenger_ID, v_Seat_ID, NOW(), p_Price);

    COMMIT;

    -- Return the created booking ID
    SELECT v_Booking_ID AS Booking_ID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateMemberUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateMemberUser`(
    IN p_User_name VARCHAR(50),
    IN p_First_name VARCHAR(50),
    IN p_Last_name VARCHAR(50),
    IN p_Date_of_birth DATE,
    IN p_Country VARCHAR(50),
    IN p_NIC_code VARCHAR(20),
    IN p_Gender ENUM('Male', 'Female', 'Other'),
    IN p_Email VARCHAR(30),
    IN p_Password VARCHAR(255)
)
BEGIN
    -- Insert into the user table with role set as 'Member'
    INSERT INTO User (User_name, First_name, Last_name, Date_of_birth, Country, NIC_code, Gender, Email, Role, Password)
    VALUES (p_User_name, p_First_name, p_Last_name, p_Date_of_birth, p_Country, p_NIC_code, p_Gender, p_Email, 'Member', p_Password);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllPastFlightsAndPassengerCountByOriginAndDestination` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllPastFlightsAndPassengerCountByOriginAndDestination`(
    IN origin_airport_name VARCHAR(100),
    IN destination_airport_name VARCHAR(100)
)
BEGIN
    SELECT 
        f.Flight_ID,
        f.Status,
        a1.Airport_name AS OriginAirportName,
        a2.Airport_name AS DestinationAirportName,
        COUNT(DISTINCT p.Passenger_ID) AS PassengerCount
    FROM flight f
    JOIN route r ON f.Route_ID = r.Route_ID
    JOIN airport a1 ON r.Origin_airport_code = a1.Airport_code
    JOIN airport a2 ON r.Destination_airport_code = a2.Airport_code
    LEFT JOIN booking b ON f.Flight_ID = b.Flight_ID
    LEFT JOIN passenger p ON b.Passenger_ID = p.Passenger_ID
    WHERE a1.Airport_name = origin_airport_name
    AND a2.Airport_name = destination_airport_name
    AND f.Departure_date < CURDATE()
    GROUP BY 
        f.Flight_ID, f.Status, a1.Airport_name, a2.Airport_name;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAvailableFlights` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAvailableFlights`(
     IN p_Route_ID VARCHAR(10),
     IN p_Departure_date DATE
)
BEGIN
    SELECT Flight_ID, Airplane_ID, Route_ID, Departure_date, Arrival_date, 
           Arrival_time, Departure_time, Status
    FROM Flight
    WHERE Route_ID = p_Route_ID AND Departure_date = p_Departure_date;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAvailableSeats` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAvailableSeats`(IN p_Flight_ID VARCHAR(10))
BEGIN
    DECLARE v_Airplane_ID INT;
    DECLARE v_Airplane_model_ID INT;
    DECLARE v_Total_Seats INT;
    DECLARE v_Booked_Seats INT;
    DECLARE v_Available_Seats INT;

    -- Get the Airplane_ID and Airplane_model_ID for the given Flight_ID
    SELECT f.Airplane_ID, a.Airplane_model_ID 
    INTO v_Airplane_ID, v_Airplane_model_ID
    FROM Flight f
    JOIN Airplane a ON f.Airplane_ID = a.Airplane_ID
    WHERE f.Flight_ID = p_Flight_ID;

    -- Get the total number of seats for the airplane model
    SELECT (No_of_Economic_Seats + No_of_Business_Seats + No_of_Platinum_Seats)
    INTO v_Total_Seats
    FROM Airplane_model
    WHERE Airplane_model_ID = v_Airplane_model_ID;

    -- Get the number of booked seats for the flight
    SELECT COUNT(*)
    INTO v_Booked_Seats
    FROM Booking
    WHERE Flight_ID = p_Flight_ID;

    -- Calculate available seats
    SET v_Available_Seats = v_Total_Seats - v_Booked_Seats;

    -- Return the results
    SELECT 
        v_Available_Seats AS Available_Seats;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBookedSeats` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBookedSeats`(
    IN p_Flight_ID VARCHAR(10)
)
BEGIN
    DECLARE v_Airplane_model_ID INT;

    -- Get the Airplane_model_ID for the given Flight_ID
    SELECT am.Airplane_model_ID INTO v_Airplane_model_ID
    FROM Flight f
    JOIN Airplane a ON f.Airplane_ID = a.Airplane_ID
    JOIN Airplane_model am ON a.Airplane_model_ID = am.Airplane_model_ID
    WHERE f.Flight_ID = p_Flight_ID;

    -- Check if there are any bookings for this flight
    IF EXISTS (SELECT 1 FROM Booking WHERE Flight_ID = p_Flight_ID) THEN
        -- Return the Airplane_model_ID and booked seat numbers
        SELECT 
            v_Airplane_model_ID AS Airplane_model_ID,
            GROUP_CONCAT(SUBSTRING_INDEX(s.Seat_ID, '_S', -1)) AS Booked_Seat_Numbers
        FROM 
            Seat s
        JOIN
            Airplane a ON s.Airplane_ID = a.Airplane_ID
        JOIN 
            Booking b ON s.Seat_ID = b.Seat_ID AND b.Flight_ID = p_Flight_ID
        WHERE 
            a.Airplane_model_ID = v_Airplane_model_ID
        GROUP BY
            v_Airplane_model_ID;
    ELSE
        -- If no bookings, return Airplane_model_ID and 0 for booked seats
        SELECT 
            v_Airplane_model_ID AS Airplane_model_ID,
            '0' AS Booked_Seat_Numbers;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBookingsByDateRangePassengerType` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBookingsByDateRangePassengerType`(
    IN startDate DATE, 
    IN endDate DATE
)
BEGIN
    SELECT 
        s.Travel_Class AS PassengerType,
        COUNT(b.Booking_ID) AS NumberOfBookings
    FROM 
        booking b
    JOIN 
        seat s ON b.Seat_ID = s.Seat_ID
    WHERE 
        DATE(b.Issue_date) BETWEEN startDate AND endDate 
    GROUP BY 
        s.Travel_Class;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetPassengerCountByDateRangeAndDestinationName` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPassengerCountByDateRangeAndDestinationName`(
    IN dest_airport_name VARCHAR(100),
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    SELECT COUNT(DISTINCT p.Passenger_ID) AS PassengerCount
    FROM booking b
    JOIN passenger p ON b.Passenger_ID = p.Passenger_ID
    JOIN flight f ON f.Flight_ID = b.Flight_ID
    JOIN route r ON r.Route_ID = f.Route_ID
    JOIN airport a ON r.Destination_airport_code = a.Airport_code
    WHERE a.Airport_name = dest_airport_name
     AND f.Arrival_date BETWEEN start_date AND end_date;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetPassengersByAgeCategory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPassengersByAgeCategory`(IN flightID VARCHAR(10))
BEGIN
    SELECT 
        p.Name,
        p.Passport_Number,
        TIMESTAMPDIFF(YEAR, p.Date_of_birth, CURDATE()) AS Age,
        p.Gender,
        CASE
            WHEN TIMESTAMPDIFF(YEAR, p.Date_of_birth, CURDATE()) < 18 THEN 'Below 18'
            ELSE '18 and above'
        END AS AgeCategory
    FROM 
        booking b
    JOIN 
        passenger p ON b.Passenger_ID = p.Passenger_ID
    WHERE 
        b.Flight_ID = flightID
    ORDER BY 
        AgeCategory, p.Name;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetRouteID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetRouteID`(
    IN p_Origin_airport_code CHAR(3),
    IN p_Destination_airport_code CHAR(3)
)
BEGIN
    SELECT Route_ID
    FROM route
    WHERE Origin_airport_code = p_Origin_airport_code
      AND Destination_airport_code = p_Destination_airport_code;
END ;;
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

-- Dump completed on 2024-10-28 19:21:46
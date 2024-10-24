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
    DECLARE last_seat_id INT DEFAULT 0;
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

    -- Get the last Seat_ID in the seat table
    SELECT IFNULL(MAX(CAST(SUBSTRING(Seat_ID, 3) AS UNSIGNED)), 0) INTO last_seat_id
    FROM seat;

    -- Insert Economy Class Seats
    SET seat_num = 1;
    WHILE seat_num <= econ_seats DO
        SET new_seat_id = CONCAT('ST', LPAD(last_seat_id + seat_num, 5, '0'));
        INSERT INTO seat (Seat_ID, Airplane_ID, Travel_Class) 
        VALUES (new_seat_id, NEW.Airplane_ID, 'Economy');
        SET seat_num = seat_num + 1;
    END WHILE;

    -- Insert Business Class Seats
    SET seat_num = 1;
    WHILE seat_num <= bus_seats DO
        SET new_seat_id = CONCAT('ST', LPAD(last_seat_id + econ_seats + seat_num, 5, '0'));
        INSERT INTO seat (Seat_ID, Airplane_ID, Travel_Class) 
        VALUES (new_seat_id, NEW.Airplane_ID, 'Business');
        SET seat_num = seat_num + 1;
    END WHILE;

    -- Insert Platinum Class Seats
    SET seat_num = 1;
    WHILE seat_num <= plat_seats DO
        SET new_seat_id = CONCAT('ST', LPAD(last_seat_id + econ_seats + bus_seats + seat_num, 5, '0'));
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
INSERT INTO `flight` VALUES ('FL001',1,'RT001','2024-10-28','2024-10-28','10:00:00','08:00:00','Scheduled'),('FL002',2,'RT002','2024-10-28','2024-10-28','14:30:00','12:00:00','Scheduled'),('FL003',3,'RT003','2024-10-28','2024-10-28','17:00:00','15:00:00','Delayed'),('FL004',4,'RT004','2024-10-28','2024-10-28','20:30:00','18:00:00','Scheduled'),('FL005',5,'RT005','2024-10-28','2024-10-28','11:00:00','09:00:00','Cancelled'),('FL006',1,'RT006','2024-10-29','2024-10-29','10:00:00','08:00:00','Scheduled'),('FL007',2,'RT007','2024-10-29','2024-10-29','14:30:00','12:00:00','Scheduled'),('FL008',3,'RT008','2024-10-29','2024-10-29','17:00:00','15:00:00','Delayed'),('FL009',4,'RT009','2024-10-29','2024-10-29','20:30:00','18:00:00','Scheduled'),('FL010',5,'RT010','2024-10-29','2024-10-29','11:00:00','09:00:00','Cancelled'),('FL011',1,'RT011','2024-10-30','2024-10-30','10:00:00','08:00:00','Scheduled'),('FL012',2,'RT012','2024-10-30','2024-10-30','14:30:00','12:00:00','Scheduled'),('FL013',3,'RT013','2024-10-30','2024-10-30','17:00:00','15:00:00','Delayed'),('FL014',4,'RT014','2024-10-30','2024-10-30','20:30:00','18:00:00','Scheduled'),('FL015',5,'RT015','2024-10-30','2024-10-30','11:00:00','09:00:00','Cancelled'),('FL016',1,'RT016','2024-10-31','2024-10-31','10:00:00','08:00:00','Scheduled'),('FL017',2,'RT017','2024-10-31','2024-10-31','14:30:00','12:00:00','Scheduled'),('FL018',3,'RT018','2024-10-31','2024-10-31','17:00:00','15:00:00','Delayed'),('FL019',4,'RT019','2024-10-31','2024-10-31','20:30:00','18:00:00','Scheduled'),('FL020',5,'RT020','2024-10-31','2024-10-31','11:00:00','09:00:00','Cancelled'),('FL021',1,'RT001','2024-11-01','2024-11-01','10:00:00','08:00:00','Scheduled'),('FL022',2,'RT002','2024-11-01','2024-11-01','14:30:00','12:00:00','Scheduled'),('FL023',3,'RT003','2024-11-01','2024-11-01','17:00:00','15:00:00','Delayed'),('FL024',4,'RT004','2024-11-01','2024-11-01','20:30:00','18:00:00','Scheduled'),('FL025',5,'RT005','2024-11-01','2024-11-01','11:00:00','09:00:00','Cancelled'),('FL026',1,'RT006','2024-11-02','2024-11-02','10:00:00','08:00:00','Scheduled'),('FL027',2,'RT007','2024-11-02','2024-11-02','14:30:00','12:00:00','Scheduled'),('FL028',3,'RT008','2024-11-02','2024-11-02','17:00:00','15:00:00','Delayed'),('FL029',4,'RT009','2024-11-02','2024-11-02','20:30:00','18:00:00','Scheduled'),('FL030',5,'RT010','2024-11-02','2024-11-02','11:00:00','09:00:00','Cancelled');
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
INSERT INTO `member_detail` VALUES ('565b6af4-921b-11ef-8ff5-047c16a3f13c',0,'Normal'),('760f80ef-921b-11ef-8ff5-047c16a3f13c',0,'Normal');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passenger`
--

LOCK TABLES `passenger` WRITE;
/*!40000 ALTER TABLE `passenger` DISABLE KEYS */;
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
INSERT INTO `seat` VALUES ('ST00001',1,'Economy'),('ST00002',1,'Economy'),('ST00003',1,'Economy'),('ST00004',1,'Economy'),('ST00005',1,'Economy'),('ST00006',1,'Economy'),('ST00007',1,'Economy'),('ST00008',1,'Economy'),('ST00009',1,'Economy'),('ST00010',1,'Economy'),('ST00011',1,'Economy'),('ST00012',1,'Economy'),('ST00013',1,'Economy'),('ST00014',1,'Economy'),('ST00015',1,'Economy'),('ST00016',1,'Economy'),('ST00017',1,'Economy'),('ST00018',1,'Economy'),('ST00019',1,'Economy'),('ST00020',1,'Economy'),('ST00021',1,'Economy'),('ST00022',1,'Economy'),('ST00023',1,'Economy'),('ST00024',1,'Economy'),('ST00025',1,'Economy'),('ST00026',1,'Economy'),('ST00027',1,'Economy'),('ST00028',1,'Economy'),('ST00029',1,'Economy'),('ST00030',1,'Economy'),('ST00031',1,'Economy'),('ST00032',1,'Economy'),('ST00033',1,'Economy'),('ST00034',1,'Economy'),('ST00035',1,'Economy'),('ST00036',1,'Economy'),('ST00037',1,'Economy'),('ST00038',1,'Economy'),('ST00039',1,'Economy'),('ST00040',1,'Economy'),('ST00041',1,'Economy'),('ST00042',1,'Economy'),('ST00043',1,'Economy'),('ST00044',1,'Economy'),('ST00045',1,'Economy'),('ST00046',1,'Economy'),('ST00047',1,'Economy'),('ST00048',1,'Economy'),('ST00049',1,'Economy'),('ST00050',1,'Economy'),('ST00051',1,'Economy'),('ST00052',1,'Economy'),('ST00053',1,'Economy'),('ST00054',1,'Economy'),('ST00055',1,'Economy'),('ST00056',1,'Economy'),('ST00057',1,'Economy'),('ST00058',1,'Economy'),('ST00059',1,'Economy'),('ST00060',1,'Economy'),('ST00061',1,'Economy'),('ST00062',1,'Economy'),('ST00063',1,'Economy'),('ST00064',1,'Economy'),('ST00065',1,'Economy'),('ST00066',1,'Economy'),('ST00067',1,'Economy'),('ST00068',1,'Economy'),('ST00069',1,'Economy'),('ST00070',1,'Economy'),('ST00071',1,'Economy'),('ST00072',1,'Economy'),('ST00073',1,'Economy'),('ST00074',1,'Economy'),('ST00075',1,'Economy'),('ST00076',1,'Economy'),('ST00077',1,'Economy'),('ST00078',1,'Economy'),('ST00079',1,'Economy'),('ST00080',1,'Economy'),('ST00081',1,'Economy'),('ST00082',1,'Economy'),('ST00083',1,'Economy'),('ST00084',1,'Economy'),('ST00085',1,'Economy'),('ST00086',1,'Economy'),('ST00087',1,'Economy'),('ST00088',1,'Economy'),('ST00089',1,'Economy'),('ST00090',1,'Economy'),('ST00091',1,'Economy'),('ST00092',1,'Economy'),('ST00093',1,'Economy'),('ST00094',1,'Economy'),('ST00095',1,'Economy'),('ST00096',1,'Economy'),('ST00097',1,'Economy'),('ST00098',1,'Economy'),('ST00099',1,'Economy'),('ST00100',1,'Economy'),('ST00101',1,'Economy'),('ST00102',1,'Economy'),('ST00103',1,'Economy'),('ST00104',1,'Economy'),('ST00105',1,'Economy'),('ST00106',1,'Economy'),('ST00107',1,'Economy'),('ST00108',1,'Economy'),('ST00109',1,'Economy'),('ST00110',1,'Economy'),('ST00111',1,'Economy'),('ST00112',1,'Economy'),('ST00113',1,'Economy'),('ST00114',1,'Economy'),('ST00115',1,'Business'),('ST00116',1,'Business'),('ST00117',1,'Business'),('ST00118',1,'Business'),('ST00119',1,'Business'),('ST00120',1,'Business'),('ST00121',1,'Business'),('ST00122',1,'Business'),('ST00123',1,'Business'),('ST00124',1,'Business'),('ST00125',1,'Business'),('ST00126',1,'Business'),('ST00127',1,'Business'),('ST00128',1,'Business'),('ST00129',1,'Business'),('ST00130',1,'Business'),('ST00131',1,'Business'),('ST00132',1,'Business'),('ST00133',1,'Business'),('ST00134',1,'Business'),('ST00135',1,'Business'),('ST00136',1,'Business'),('ST00137',1,'Business'),('ST00138',1,'Business'),('ST00139',1,'Business'),('ST00140',1,'Business'),('ST00141',1,'Business'),('ST00142',1,'Business'),('ST00143',1,'Business'),('ST00144',1,'Business'),('ST00145',1,'Platinum'),('ST00146',1,'Platinum'),('ST00147',1,'Platinum'),('ST00148',1,'Platinum'),('ST00149',1,'Platinum'),('ST00150',1,'Platinum'),('ST00151',1,'Platinum'),('ST00152',1,'Platinum'),('ST00153',1,'Platinum'),('ST00154',1,'Platinum'),('ST00155',1,'Platinum'),('ST00156',1,'Platinum'),('ST00157',1,'Platinum'),('ST00158',1,'Platinum'),('ST00159',1,'Platinum'),('ST00160',1,'Platinum'),('ST00161',2,'Economy'),('ST00162',2,'Economy'),('ST00163',2,'Economy'),('ST00164',2,'Economy'),('ST00165',2,'Economy'),('ST00166',2,'Economy'),('ST00167',2,'Economy'),('ST00168',2,'Economy'),('ST00169',2,'Economy'),('ST00170',2,'Economy'),('ST00171',2,'Economy'),('ST00172',2,'Economy'),('ST00173',2,'Economy'),('ST00174',2,'Economy'),('ST00175',2,'Economy'),('ST00176',2,'Economy'),('ST00177',2,'Economy'),('ST00178',2,'Economy'),('ST00179',2,'Economy'),('ST00180',2,'Economy'),('ST00181',2,'Economy'),('ST00182',2,'Economy'),('ST00183',2,'Economy'),('ST00184',2,'Economy'),('ST00185',2,'Economy'),('ST00186',2,'Economy'),('ST00187',2,'Economy'),('ST00188',2,'Economy'),('ST00189',2,'Economy'),('ST00190',2,'Economy'),('ST00191',2,'Economy'),('ST00192',2,'Economy'),('ST00193',2,'Economy'),('ST00194',2,'Economy'),('ST00195',2,'Economy'),('ST00196',2,'Economy'),('ST00197',2,'Economy'),('ST00198',2,'Economy'),('ST00199',2,'Economy'),('ST00200',2,'Economy'),('ST00201',2,'Economy'),('ST00202',2,'Economy'),('ST00203',2,'Economy'),('ST00204',2,'Economy'),('ST00205',2,'Economy'),('ST00206',2,'Economy'),('ST00207',2,'Economy'),('ST00208',2,'Economy'),('ST00209',2,'Economy'),('ST00210',2,'Economy'),('ST00211',2,'Economy'),('ST00212',2,'Economy'),('ST00213',2,'Economy'),('ST00214',2,'Economy'),('ST00215',2,'Economy'),('ST00216',2,'Economy'),('ST00217',2,'Economy'),('ST00218',2,'Economy'),('ST00219',2,'Economy'),('ST00220',2,'Economy'),('ST00221',2,'Economy'),('ST00222',2,'Economy'),('ST00223',2,'Economy'),('ST00224',2,'Economy'),('ST00225',2,'Economy'),('ST00226',2,'Economy'),('ST00227',2,'Economy'),('ST00228',2,'Economy'),('ST00229',2,'Economy'),('ST00230',2,'Economy'),('ST00231',2,'Economy'),('ST00232',2,'Economy'),('ST00233',2,'Economy'),('ST00234',2,'Economy'),('ST00235',2,'Economy'),('ST00236',2,'Economy'),('ST00237',2,'Economy'),('ST00238',2,'Economy'),('ST00239',2,'Economy'),('ST00240',2,'Economy'),('ST00241',2,'Economy'),('ST00242',2,'Economy'),('ST00243',2,'Economy'),('ST00244',2,'Economy'),('ST00245',2,'Economy'),('ST00246',2,'Economy'),('ST00247',2,'Economy'),('ST00248',2,'Economy'),('ST00249',2,'Economy'),('ST00250',2,'Economy'),('ST00251',2,'Economy'),('ST00252',2,'Economy'),('ST00253',2,'Economy'),('ST00254',2,'Economy'),('ST00255',2,'Economy'),('ST00256',2,'Economy'),('ST00257',2,'Economy'),('ST00258',2,'Economy'),('ST00259',2,'Economy'),('ST00260',2,'Economy'),('ST00261',2,'Economy'),('ST00262',2,'Economy'),('ST00263',2,'Economy'),('ST00264',2,'Economy'),('ST00265',2,'Economy'),('ST00266',2,'Economy'),('ST00267',2,'Economy'),('ST00268',2,'Economy'),('ST00269',2,'Economy'),('ST00270',2,'Economy'),('ST00271',2,'Economy'),('ST00272',2,'Economy'),('ST00273',2,'Economy'),('ST00274',2,'Economy'),('ST00275',2,'Business'),('ST00276',2,'Business'),('ST00277',2,'Business'),('ST00278',2,'Business'),('ST00279',2,'Business'),('ST00280',2,'Business'),('ST00281',2,'Business'),('ST00282',2,'Business'),('ST00283',2,'Business'),('ST00284',2,'Business'),('ST00285',2,'Business'),('ST00286',2,'Business'),('ST00287',2,'Business'),('ST00288',2,'Business'),('ST00289',2,'Business'),('ST00290',2,'Business'),('ST00291',2,'Business'),('ST00292',2,'Business'),('ST00293',2,'Business'),('ST00294',2,'Business'),('ST00295',2,'Business'),('ST00296',2,'Business'),('ST00297',2,'Business'),('ST00298',2,'Business'),('ST00299',2,'Business'),('ST00300',2,'Business'),('ST00301',2,'Business'),('ST00302',2,'Business'),('ST00303',2,'Business'),('ST00304',2,'Business'),('ST00305',2,'Platinum'),('ST00306',2,'Platinum'),('ST00307',2,'Platinum'),('ST00308',2,'Platinum'),('ST00309',2,'Platinum'),('ST00310',2,'Platinum'),('ST00311',2,'Platinum'),('ST00312',2,'Platinum'),('ST00313',2,'Platinum'),('ST00314',2,'Platinum'),('ST00315',2,'Platinum'),('ST00316',2,'Platinum'),('ST00317',2,'Platinum'),('ST00318',2,'Platinum'),('ST00319',2,'Platinum'),('ST00320',2,'Platinum'),('ST00321',3,'Economy'),('ST00322',3,'Economy'),('ST00323',3,'Economy'),('ST00324',3,'Economy'),('ST00325',3,'Economy'),('ST00326',3,'Economy'),('ST00327',3,'Economy'),('ST00328',3,'Economy'),('ST00329',3,'Economy'),('ST00330',3,'Economy'),('ST00331',3,'Economy'),('ST00332',3,'Economy'),('ST00333',3,'Economy'),('ST00334',3,'Economy'),('ST00335',3,'Economy'),('ST00336',3,'Economy'),('ST00337',3,'Economy'),('ST00338',3,'Economy'),('ST00339',3,'Economy'),('ST00340',3,'Economy'),('ST00341',3,'Economy'),('ST00342',3,'Economy'),('ST00343',3,'Economy'),('ST00344',3,'Economy'),('ST00345',3,'Economy'),('ST00346',3,'Economy'),('ST00347',3,'Economy'),('ST00348',3,'Economy'),('ST00349',3,'Economy'),('ST00350',3,'Economy'),('ST00351',3,'Economy'),('ST00352',3,'Economy'),('ST00353',3,'Economy'),('ST00354',3,'Economy'),('ST00355',3,'Economy'),('ST00356',3,'Economy'),('ST00357',3,'Economy'),('ST00358',3,'Economy'),('ST00359',3,'Economy'),('ST00360',3,'Economy'),('ST00361',3,'Economy'),('ST00362',3,'Economy'),('ST00363',3,'Economy'),('ST00364',3,'Economy'),('ST00365',3,'Economy'),('ST00366',3,'Economy'),('ST00367',3,'Economy'),('ST00368',3,'Economy'),('ST00369',3,'Economy'),('ST00370',3,'Economy'),('ST00371',3,'Economy'),('ST00372',3,'Economy'),('ST00373',3,'Economy'),('ST00374',3,'Economy'),('ST00375',3,'Economy'),('ST00376',3,'Economy'),('ST00377',3,'Economy'),('ST00378',3,'Economy'),('ST00379',3,'Economy'),('ST00380',3,'Economy'),('ST00381',3,'Economy'),('ST00382',3,'Economy'),('ST00383',3,'Economy'),('ST00384',3,'Economy'),('ST00385',3,'Economy'),('ST00386',3,'Economy'),('ST00387',3,'Economy'),('ST00388',3,'Economy'),('ST00389',3,'Economy'),('ST00390',3,'Economy'),('ST00391',3,'Economy'),('ST00392',3,'Economy'),('ST00393',3,'Economy'),('ST00394',3,'Economy'),('ST00395',3,'Economy'),('ST00396',3,'Economy'),('ST00397',3,'Economy'),('ST00398',3,'Economy'),('ST00399',3,'Economy'),('ST00400',3,'Economy'),('ST00401',3,'Economy'),('ST00402',3,'Economy'),('ST00403',3,'Economy'),('ST00404',3,'Economy'),('ST00405',3,'Economy'),('ST00406',3,'Economy'),('ST00407',3,'Economy'),('ST00408',3,'Economy'),('ST00409',3,'Economy'),('ST00410',3,'Economy'),('ST00411',3,'Economy'),('ST00412',3,'Economy'),('ST00413',3,'Economy'),('ST00414',3,'Economy'),('ST00415',3,'Economy'),('ST00416',3,'Economy'),('ST00417',3,'Economy'),('ST00418',3,'Economy'),('ST00419',3,'Economy'),('ST00420',3,'Economy'),('ST00421',3,'Economy'),('ST00422',3,'Economy'),('ST00423',3,'Economy'),('ST00424',3,'Economy'),('ST00425',3,'Economy'),('ST00426',3,'Economy'),('ST00427',3,'Economy'),('ST00428',3,'Economy'),('ST00429',3,'Economy'),('ST00430',3,'Economy'),('ST00431',3,'Economy'),('ST00432',3,'Economy'),('ST00433',3,'Economy'),('ST00434',3,'Economy'),('ST00435',3,'Business'),('ST00436',3,'Business'),('ST00437',3,'Business'),('ST00438',3,'Business'),('ST00439',3,'Business'),('ST00440',3,'Business'),('ST00441',3,'Business'),('ST00442',3,'Business'),('ST00443',3,'Business'),('ST00444',3,'Business'),('ST00445',3,'Business'),('ST00446',3,'Business'),('ST00447',3,'Business'),('ST00448',3,'Business'),('ST00449',3,'Business'),('ST00450',3,'Business'),('ST00451',3,'Business'),('ST00452',3,'Business'),('ST00453',3,'Business'),('ST00454',3,'Business'),('ST00455',3,'Business'),('ST00456',3,'Business'),('ST00457',3,'Business'),('ST00458',3,'Business'),('ST00459',3,'Business'),('ST00460',3,'Business'),('ST00461',3,'Business'),('ST00462',3,'Business'),('ST00463',3,'Business'),('ST00464',3,'Business'),('ST00465',3,'Platinum'),('ST00466',3,'Platinum'),('ST00467',3,'Platinum'),('ST00468',3,'Platinum'),('ST00469',3,'Platinum'),('ST00470',3,'Platinum'),('ST00471',3,'Platinum'),('ST00472',3,'Platinum'),('ST00473',3,'Platinum'),('ST00474',3,'Platinum'),('ST00475',3,'Platinum'),('ST00476',3,'Platinum'),('ST00477',3,'Platinum'),('ST00478',3,'Platinum'),('ST00479',3,'Platinum'),('ST00480',3,'Platinum'),('ST00481',4,'Economy'),('ST00482',4,'Economy'),('ST00483',4,'Economy'),('ST00484',4,'Economy'),('ST00485',4,'Economy'),('ST00486',4,'Economy'),('ST00487',4,'Economy'),('ST00488',4,'Economy'),('ST00489',4,'Economy'),('ST00490',4,'Economy'),('ST00491',4,'Economy'),('ST00492',4,'Economy'),('ST00493',4,'Economy'),('ST00494',4,'Economy'),('ST00495',4,'Economy'),('ST00496',4,'Economy'),('ST00497',4,'Economy'),('ST00498',4,'Economy'),('ST00499',4,'Economy'),('ST00500',4,'Economy'),('ST00501',4,'Economy'),('ST00502',4,'Economy'),('ST00503',4,'Economy'),('ST00504',4,'Economy'),('ST00505',4,'Economy'),('ST00506',4,'Economy'),('ST00507',4,'Economy'),('ST00508',4,'Economy'),('ST00509',4,'Economy'),('ST00510',4,'Economy'),('ST00511',4,'Economy'),('ST00512',4,'Economy'),('ST00513',4,'Economy'),('ST00514',4,'Economy'),('ST00515',4,'Economy'),('ST00516',4,'Economy'),('ST00517',4,'Economy'),('ST00518',4,'Economy'),('ST00519',4,'Economy'),('ST00520',4,'Economy'),('ST00521',4,'Economy'),('ST00522',4,'Economy'),('ST00523',4,'Economy'),('ST00524',4,'Economy'),('ST00525',4,'Economy'),('ST00526',4,'Economy'),('ST00527',4,'Economy'),('ST00528',4,'Economy'),('ST00529',4,'Economy'),('ST00530',4,'Economy'),('ST00531',4,'Economy'),('ST00532',4,'Economy'),('ST00533',4,'Economy'),('ST00534',4,'Economy'),('ST00535',4,'Economy'),('ST00536',4,'Economy'),('ST00537',4,'Economy'),('ST00538',4,'Economy'),('ST00539',4,'Economy'),('ST00540',4,'Economy'),('ST00541',4,'Economy'),('ST00542',4,'Economy'),('ST00543',4,'Economy'),('ST00544',4,'Economy'),('ST00545',4,'Economy'),('ST00546',4,'Economy'),('ST00547',4,'Economy'),('ST00548',4,'Economy'),('ST00549',4,'Economy'),('ST00550',4,'Economy'),('ST00551',4,'Economy'),('ST00552',4,'Economy'),('ST00553',4,'Economy'),('ST00554',4,'Economy'),('ST00555',4,'Economy'),('ST00556',4,'Economy'),('ST00557',4,'Economy'),('ST00558',4,'Economy'),('ST00559',4,'Economy'),('ST00560',4,'Economy'),('ST00561',4,'Economy'),('ST00562',4,'Economy'),('ST00563',4,'Economy'),('ST00564',4,'Economy'),('ST00565',4,'Economy'),('ST00566',4,'Economy'),('ST00567',4,'Economy'),('ST00568',4,'Economy'),('ST00569',4,'Economy'),('ST00570',4,'Economy'),('ST00571',4,'Economy'),('ST00572',4,'Economy'),('ST00573',4,'Economy'),('ST00574',4,'Economy'),('ST00575',4,'Economy'),('ST00576',4,'Economy'),('ST00577',4,'Economy'),('ST00578',4,'Economy'),('ST00579',4,'Economy'),('ST00580',4,'Economy'),('ST00581',4,'Economy'),('ST00582',4,'Economy'),('ST00583',4,'Economy'),('ST00584',4,'Economy'),('ST00585',4,'Economy'),('ST00586',4,'Economy'),('ST00587',4,'Economy'),('ST00588',4,'Economy'),('ST00589',4,'Economy'),('ST00590',4,'Economy'),('ST00591',4,'Economy'),('ST00592',4,'Economy'),('ST00593',4,'Economy'),('ST00594',4,'Economy'),('ST00595',4,'Economy'),('ST00596',4,'Economy'),('ST00597',4,'Economy'),('ST00598',4,'Economy'),('ST00599',4,'Economy'),('ST00600',4,'Economy'),('ST00601',4,'Economy'),('ST00602',4,'Economy'),('ST00603',4,'Economy'),('ST00604',4,'Economy'),('ST00605',4,'Economy'),('ST00606',4,'Economy'),('ST00607',4,'Economy'),('ST00608',4,'Economy'),('ST00609',4,'Economy'),('ST00610',4,'Economy'),('ST00611',4,'Economy'),('ST00612',4,'Economy'),('ST00613',4,'Economy'),('ST00614',4,'Economy'),('ST00615',4,'Economy'),('ST00616',4,'Business'),('ST00617',4,'Business'),('ST00618',4,'Business'),('ST00619',4,'Business'),('ST00620',4,'Business'),('ST00621',4,'Business'),('ST00622',4,'Business'),('ST00623',4,'Business'),('ST00624',4,'Business'),('ST00625',4,'Business'),('ST00626',4,'Business'),('ST00627',4,'Business'),('ST00628',4,'Business'),('ST00629',4,'Business'),('ST00630',4,'Business'),('ST00631',4,'Business'),('ST00632',4,'Business'),('ST00633',4,'Business'),('ST00634',4,'Business'),('ST00635',4,'Business'),('ST00636',4,'Business'),('ST00637',4,'Platinum'),('ST00638',4,'Platinum'),('ST00639',4,'Platinum'),('ST00640',4,'Platinum'),('ST00641',4,'Platinum'),('ST00642',4,'Platinum'),('ST00643',4,'Platinum'),('ST00644',4,'Platinum'),('ST00645',4,'Platinum'),('ST00646',4,'Platinum'),('ST00647',4,'Platinum'),('ST00648',4,'Platinum'),('ST00649',4,'Platinum'),('ST00650',4,'Platinum'),('ST00651',4,'Platinum'),('ST00652',4,'Platinum'),('ST00653',4,'Platinum'),('ST00654',4,'Platinum'),('ST00655',4,'Platinum'),('ST00656',4,'Platinum'),('ST00657',4,'Platinum'),('ST00658',4,'Platinum'),('ST00659',4,'Platinum'),('ST00660',4,'Platinum'),('ST00661',5,'Economy'),('ST00662',5,'Economy'),('ST00663',5,'Economy'),('ST00664',5,'Economy'),('ST00665',5,'Economy'),('ST00666',5,'Economy'),('ST00667',5,'Economy'),('ST00668',5,'Economy'),('ST00669',5,'Economy'),('ST00670',5,'Economy'),('ST00671',5,'Economy'),('ST00672',5,'Economy'),('ST00673',5,'Economy'),('ST00674',5,'Economy'),('ST00675',5,'Economy'),('ST00676',5,'Economy'),('ST00677',5,'Economy'),('ST00678',5,'Economy'),('ST00679',5,'Economy'),('ST00680',5,'Economy'),('ST00681',5,'Economy'),('ST00682',5,'Economy'),('ST00683',5,'Economy'),('ST00684',5,'Economy'),('ST00685',5,'Economy'),('ST00686',5,'Economy'),('ST00687',5,'Economy'),('ST00688',5,'Economy'),('ST00689',5,'Economy'),('ST00690',5,'Economy'),('ST00691',5,'Economy'),('ST00692',5,'Economy'),('ST00693',5,'Economy'),('ST00694',5,'Economy'),('ST00695',5,'Economy'),('ST00696',5,'Economy'),('ST00697',5,'Economy'),('ST00698',5,'Economy'),('ST00699',5,'Economy'),('ST00700',5,'Economy'),('ST00701',5,'Economy'),('ST00702',5,'Economy'),('ST00703',5,'Economy'),('ST00704',5,'Economy'),('ST00705',5,'Economy'),('ST00706',5,'Economy'),('ST00707',5,'Economy'),('ST00708',5,'Economy'),('ST00709',5,'Economy'),('ST00710',5,'Economy'),('ST00711',5,'Economy'),('ST00712',5,'Economy'),('ST00713',5,'Economy'),('ST00714',5,'Economy'),('ST00715',5,'Economy'),('ST00716',5,'Economy'),('ST00717',5,'Economy'),('ST00718',5,'Economy'),('ST00719',5,'Economy'),('ST00720',5,'Economy'),('ST00721',5,'Economy'),('ST00722',5,'Economy'),('ST00723',5,'Economy'),('ST00724',5,'Economy'),('ST00725',5,'Economy'),('ST00726',5,'Economy'),('ST00727',5,'Economy'),('ST00728',5,'Economy'),('ST00729',5,'Economy'),('ST00730',5,'Economy'),('ST00731',5,'Economy'),('ST00732',5,'Economy'),('ST00733',5,'Economy'),('ST00734',5,'Economy'),('ST00735',5,'Economy'),('ST00736',5,'Economy'),('ST00737',5,'Economy'),('ST00738',5,'Economy'),('ST00739',5,'Economy'),('ST00740',5,'Economy'),('ST00741',5,'Economy'),('ST00742',5,'Economy'),('ST00743',5,'Economy'),('ST00744',5,'Economy'),('ST00745',5,'Economy'),('ST00746',5,'Economy'),('ST00747',5,'Economy'),('ST00748',5,'Economy'),('ST00749',5,'Economy'),('ST00750',5,'Economy'),('ST00751',5,'Economy'),('ST00752',5,'Economy'),('ST00753',5,'Economy'),('ST00754',5,'Economy'),('ST00755',5,'Economy'),('ST00756',5,'Economy'),('ST00757',5,'Economy'),('ST00758',5,'Economy'),('ST00759',5,'Economy'),('ST00760',5,'Economy'),('ST00761',5,'Economy'),('ST00762',5,'Economy'),('ST00763',5,'Economy'),('ST00764',5,'Economy'),('ST00765',5,'Economy'),('ST00766',5,'Economy'),('ST00767',5,'Economy'),('ST00768',5,'Economy'),('ST00769',5,'Economy'),('ST00770',5,'Economy'),('ST00771',5,'Economy'),('ST00772',5,'Economy'),('ST00773',5,'Economy'),('ST00774',5,'Economy'),('ST00775',5,'Economy'),('ST00776',5,'Economy'),('ST00777',5,'Economy'),('ST00778',5,'Economy'),('ST00779',5,'Economy'),('ST00780',5,'Economy'),('ST00781',5,'Economy'),('ST00782',5,'Economy'),('ST00783',5,'Economy'),('ST00784',5,'Economy'),('ST00785',5,'Economy'),('ST00786',5,'Economy'),('ST00787',5,'Economy'),('ST00788',5,'Economy'),('ST00789',5,'Economy'),('ST00790',5,'Economy'),('ST00791',5,'Economy'),('ST00792',5,'Economy'),('ST00793',5,'Economy'),('ST00794',5,'Economy'),('ST00795',5,'Economy'),('ST00796',5,'Business'),('ST00797',5,'Business'),('ST00798',5,'Business'),('ST00799',5,'Business'),('ST00800',5,'Business'),('ST00801',5,'Business'),('ST00802',5,'Business'),('ST00803',5,'Business'),('ST00804',5,'Business'),('ST00805',5,'Business'),('ST00806',5,'Business'),('ST00807',5,'Business'),('ST00808',5,'Business'),('ST00809',5,'Business'),('ST00810',5,'Business'),('ST00811',5,'Business'),('ST00812',5,'Business'),('ST00813',5,'Business'),('ST00814',5,'Business'),('ST00815',5,'Business'),('ST00816',5,'Business'),('ST00817',5,'Platinum'),('ST00818',5,'Platinum'),('ST00819',5,'Platinum'),('ST00820',5,'Platinum'),('ST00821',5,'Platinum'),('ST00822',5,'Platinum'),('ST00823',5,'Platinum'),('ST00824',5,'Platinum'),('ST00825',5,'Platinum'),('ST00826',5,'Platinum'),('ST00827',5,'Platinum'),('ST00828',5,'Platinum'),('ST00829',5,'Platinum'),('ST00830',5,'Platinum'),('ST00831',5,'Platinum'),('ST00832',5,'Platinum'),('ST00833',5,'Platinum'),('ST00834',5,'Platinum'),('ST00835',5,'Platinum'),('ST00836',5,'Platinum'),('ST00837',5,'Platinum'),('ST00838',5,'Platinum'),('ST00839',5,'Platinum'),('ST00840',5,'Platinum'),('ST00841',6,'Economy'),('ST00842',6,'Economy'),('ST00843',6,'Economy'),('ST00844',6,'Economy'),('ST00845',6,'Economy'),('ST00846',6,'Economy'),('ST00847',6,'Economy'),('ST00848',6,'Economy'),('ST00849',6,'Economy'),('ST00850',6,'Economy'),('ST00851',6,'Economy'),('ST00852',6,'Economy'),('ST00853',6,'Economy'),('ST00854',6,'Economy'),('ST00855',6,'Economy'),('ST00856',6,'Economy'),('ST00857',6,'Economy'),('ST00858',6,'Economy'),('ST00859',6,'Economy'),('ST00860',6,'Economy'),('ST00861',6,'Economy'),('ST00862',6,'Economy'),('ST00863',6,'Economy'),('ST00864',6,'Economy'),('ST00865',6,'Economy'),('ST00866',6,'Economy'),('ST00867',6,'Economy'),('ST00868',6,'Economy'),('ST00869',6,'Economy'),('ST00870',6,'Economy'),('ST00871',6,'Economy'),('ST00872',6,'Economy'),('ST00873',6,'Economy'),('ST00874',6,'Economy'),('ST00875',6,'Economy'),('ST00876',6,'Economy'),('ST00877',6,'Economy'),('ST00878',6,'Economy'),('ST00879',6,'Economy'),('ST00880',6,'Economy'),('ST00881',6,'Economy'),('ST00882',6,'Economy'),('ST00883',6,'Economy'),('ST00884',6,'Economy'),('ST00885',6,'Economy'),('ST00886',6,'Economy'),('ST00887',6,'Economy'),('ST00888',6,'Economy'),('ST00889',6,'Economy'),('ST00890',6,'Economy'),('ST00891',6,'Economy'),('ST00892',6,'Economy'),('ST00893',6,'Economy'),('ST00894',6,'Economy'),('ST00895',6,'Economy'),('ST00896',6,'Economy'),('ST00897',6,'Economy'),('ST00898',6,'Economy'),('ST00899',6,'Economy'),('ST00900',6,'Economy'),('ST00901',6,'Economy'),('ST00902',6,'Economy'),('ST00903',6,'Economy'),('ST00904',6,'Economy'),('ST00905',6,'Economy'),('ST00906',6,'Economy'),('ST00907',6,'Economy'),('ST00908',6,'Economy'),('ST00909',6,'Economy'),('ST00910',6,'Economy'),('ST00911',6,'Economy'),('ST00912',6,'Economy'),('ST00913',6,'Economy'),('ST00914',6,'Economy'),('ST00915',6,'Economy'),('ST00916',6,'Economy'),('ST00917',6,'Economy'),('ST00918',6,'Economy'),('ST00919',6,'Economy'),('ST00920',6,'Economy'),('ST00921',6,'Economy'),('ST00922',6,'Economy'),('ST00923',6,'Economy'),('ST00924',6,'Economy'),('ST00925',6,'Economy'),('ST00926',6,'Economy'),('ST00927',6,'Economy'),('ST00928',6,'Economy'),('ST00929',6,'Economy'),('ST00930',6,'Economy'),('ST00931',6,'Economy'),('ST00932',6,'Economy'),('ST00933',6,'Economy'),('ST00934',6,'Economy'),('ST00935',6,'Economy'),('ST00936',6,'Economy'),('ST00937',6,'Economy'),('ST00938',6,'Economy'),('ST00939',6,'Economy'),('ST00940',6,'Economy'),('ST00941',6,'Economy'),('ST00942',6,'Economy'),('ST00943',6,'Economy'),('ST00944',6,'Economy'),('ST00945',6,'Economy'),('ST00946',6,'Economy'),('ST00947',6,'Economy'),('ST00948',6,'Economy'),('ST00949',6,'Economy'),('ST00950',6,'Economy'),('ST00951',6,'Economy'),('ST00952',6,'Economy'),('ST00953',6,'Economy'),('ST00954',6,'Economy'),('ST00955',6,'Economy'),('ST00956',6,'Economy'),('ST00957',6,'Economy'),('ST00958',6,'Economy'),('ST00959',6,'Economy'),('ST00960',6,'Economy'),('ST00961',6,'Economy'),('ST00962',6,'Economy'),('ST00963',6,'Economy'),('ST00964',6,'Economy'),('ST00965',6,'Economy'),('ST00966',6,'Economy'),('ST00967',6,'Economy'),('ST00968',6,'Economy'),('ST00969',6,'Economy'),('ST00970',6,'Economy'),('ST00971',6,'Economy'),('ST00972',6,'Economy'),('ST00973',6,'Economy'),('ST00974',6,'Economy'),('ST00975',6,'Economy'),('ST00976',6,'Business'),('ST00977',6,'Business'),('ST00978',6,'Business'),('ST00979',6,'Business'),('ST00980',6,'Business'),('ST00981',6,'Business'),('ST00982',6,'Business'),('ST00983',6,'Business'),('ST00984',6,'Business'),('ST00985',6,'Business'),('ST00986',6,'Business'),('ST00987',6,'Business'),('ST00988',6,'Business'),('ST00989',6,'Business'),('ST00990',6,'Business'),('ST00991',6,'Business'),('ST00992',6,'Business'),('ST00993',6,'Business'),('ST00994',6,'Business'),('ST00995',6,'Business'),('ST00996',6,'Business'),('ST00997',6,'Platinum'),('ST00998',6,'Platinum'),('ST00999',6,'Platinum'),('ST01000',6,'Platinum'),('ST01001',6,'Platinum'),('ST01002',6,'Platinum'),('ST01003',6,'Platinum'),('ST01004',6,'Platinum'),('ST01005',6,'Platinum'),('ST01006',6,'Platinum'),('ST01007',6,'Platinum'),('ST01008',6,'Platinum'),('ST01009',6,'Platinum'),('ST01010',6,'Platinum'),('ST01011',6,'Platinum'),('ST01012',6,'Platinum'),('ST01013',6,'Platinum'),('ST01014',6,'Platinum'),('ST01015',6,'Platinum'),('ST01016',6,'Platinum'),('ST01017',6,'Platinum'),('ST01018',6,'Platinum'),('ST01019',6,'Platinum'),('ST01020',6,'Platinum'),('ST01021',7,'Economy'),('ST01022',7,'Economy'),('ST01023',7,'Economy'),('ST01024',7,'Economy'),('ST01025',7,'Economy'),('ST01026',7,'Economy'),('ST01027',7,'Economy'),('ST01028',7,'Economy'),('ST01029',7,'Economy'),('ST01030',7,'Economy'),('ST01031',7,'Economy'),('ST01032',7,'Economy'),('ST01033',7,'Economy'),('ST01034',7,'Economy'),('ST01035',7,'Economy'),('ST01036',7,'Economy'),('ST01037',7,'Economy'),('ST01038',7,'Economy'),('ST01039',7,'Economy'),('ST01040',7,'Economy'),('ST01041',7,'Economy'),('ST01042',7,'Economy'),('ST01043',7,'Economy'),('ST01044',7,'Economy'),('ST01045',7,'Economy'),('ST01046',7,'Economy'),('ST01047',7,'Economy'),('ST01048',7,'Economy'),('ST01049',7,'Economy'),('ST01050',7,'Economy'),('ST01051',7,'Economy'),('ST01052',7,'Economy'),('ST01053',7,'Economy'),('ST01054',7,'Economy'),('ST01055',7,'Economy'),('ST01056',7,'Economy'),('ST01057',7,'Economy'),('ST01058',7,'Economy'),('ST01059',7,'Economy'),('ST01060',7,'Economy'),('ST01061',7,'Economy'),('ST01062',7,'Economy'),('ST01063',7,'Economy'),('ST01064',7,'Economy'),('ST01065',7,'Economy'),('ST01066',7,'Economy'),('ST01067',7,'Economy'),('ST01068',7,'Economy'),('ST01069',7,'Economy'),('ST01070',7,'Economy'),('ST01071',7,'Economy'),('ST01072',7,'Economy'),('ST01073',7,'Economy'),('ST01074',7,'Economy'),('ST01075',7,'Economy'),('ST01076',7,'Economy'),('ST01077',7,'Economy'),('ST01078',7,'Economy'),('ST01079',7,'Economy'),('ST01080',7,'Economy'),('ST01081',7,'Economy'),('ST01082',7,'Economy'),('ST01083',7,'Economy'),('ST01084',7,'Economy'),('ST01085',7,'Economy'),('ST01086',7,'Economy'),('ST01087',7,'Economy'),('ST01088',7,'Economy'),('ST01089',7,'Economy'),('ST01090',7,'Economy'),('ST01091',7,'Economy'),('ST01092',7,'Economy'),('ST01093',7,'Economy'),('ST01094',7,'Economy'),('ST01095',7,'Economy'),('ST01096',7,'Economy'),('ST01097',7,'Economy'),('ST01098',7,'Economy'),('ST01099',7,'Economy'),('ST01100',7,'Economy'),('ST01101',7,'Economy'),('ST01102',7,'Economy'),('ST01103',7,'Economy'),('ST01104',7,'Economy'),('ST01105',7,'Economy'),('ST01106',7,'Economy'),('ST01107',7,'Economy'),('ST01108',7,'Economy'),('ST01109',7,'Economy'),('ST01110',7,'Economy'),('ST01111',7,'Economy'),('ST01112',7,'Economy'),('ST01113',7,'Economy'),('ST01114',7,'Economy'),('ST01115',7,'Economy'),('ST01116',7,'Economy'),('ST01117',7,'Economy'),('ST01118',7,'Economy'),('ST01119',7,'Economy'),('ST01120',7,'Economy'),('ST01121',7,'Economy'),('ST01122',7,'Economy'),('ST01123',7,'Economy'),('ST01124',7,'Economy'),('ST01125',7,'Economy'),('ST01126',7,'Economy'),('ST01127',7,'Economy'),('ST01128',7,'Economy'),('ST01129',7,'Economy'),('ST01130',7,'Economy'),('ST01131',7,'Economy'),('ST01132',7,'Economy'),('ST01133',7,'Economy'),('ST01134',7,'Economy'),('ST01135',7,'Economy'),('ST01136',7,'Economy'),('ST01137',7,'Economy'),('ST01138',7,'Economy'),('ST01139',7,'Economy'),('ST01140',7,'Economy'),('ST01141',7,'Economy'),('ST01142',7,'Economy'),('ST01143',7,'Economy'),('ST01144',7,'Economy'),('ST01145',7,'Economy'),('ST01146',7,'Economy'),('ST01147',7,'Economy'),('ST01148',7,'Economy'),('ST01149',7,'Economy'),('ST01150',7,'Economy'),('ST01151',7,'Economy'),('ST01152',7,'Economy'),('ST01153',7,'Economy'),('ST01154',7,'Economy'),('ST01155',7,'Economy'),('ST01156',7,'Business'),('ST01157',7,'Business'),('ST01158',7,'Business'),('ST01159',7,'Business'),('ST01160',7,'Business'),('ST01161',7,'Business'),('ST01162',7,'Business'),('ST01163',7,'Business'),('ST01164',7,'Business'),('ST01165',7,'Business'),('ST01166',7,'Business'),('ST01167',7,'Business'),('ST01168',7,'Business'),('ST01169',7,'Business'),('ST01170',7,'Business'),('ST01171',7,'Business'),('ST01172',7,'Business'),('ST01173',7,'Business'),('ST01174',7,'Business'),('ST01175',7,'Business'),('ST01176',7,'Business'),('ST01177',7,'Platinum'),('ST01178',7,'Platinum'),('ST01179',7,'Platinum'),('ST01180',7,'Platinum'),('ST01181',7,'Platinum'),('ST01182',7,'Platinum'),('ST01183',7,'Platinum'),('ST01184',7,'Platinum'),('ST01185',7,'Platinum'),('ST01186',7,'Platinum'),('ST01187',7,'Platinum'),('ST01188',7,'Platinum'),('ST01189',7,'Platinum'),('ST01190',7,'Platinum'),('ST01191',7,'Platinum'),('ST01192',7,'Platinum'),('ST01193',7,'Platinum'),('ST01194',7,'Platinum'),('ST01195',7,'Platinum'),('ST01196',7,'Platinum'),('ST01197',7,'Platinum'),('ST01198',7,'Platinum'),('ST01199',7,'Platinum'),('ST01200',7,'Platinum'),('ST01201',8,'Economy'),('ST01202',8,'Economy'),('ST01203',8,'Economy'),('ST01204',8,'Economy'),('ST01205',8,'Economy'),('ST01206',8,'Economy'),('ST01207',8,'Economy'),('ST01208',8,'Economy'),('ST01209',8,'Economy'),('ST01210',8,'Economy'),('ST01211',8,'Economy'),('ST01212',8,'Economy'),('ST01213',8,'Economy'),('ST01214',8,'Economy'),('ST01215',8,'Economy'),('ST01216',8,'Economy'),('ST01217',8,'Economy'),('ST01218',8,'Economy'),('ST01219',8,'Economy'),('ST01220',8,'Economy'),('ST01221',8,'Economy'),('ST01222',8,'Economy'),('ST01223',8,'Economy'),('ST01224',8,'Economy'),('ST01225',8,'Economy'),('ST01226',8,'Economy'),('ST01227',8,'Economy'),('ST01228',8,'Economy'),('ST01229',8,'Economy'),('ST01230',8,'Economy'),('ST01231',8,'Economy'),('ST01232',8,'Economy'),('ST01233',8,'Economy'),('ST01234',8,'Economy'),('ST01235',8,'Economy'),('ST01236',8,'Economy'),('ST01237',8,'Economy'),('ST01238',8,'Economy'),('ST01239',8,'Economy'),('ST01240',8,'Economy'),('ST01241',8,'Economy'),('ST01242',8,'Economy'),('ST01243',8,'Economy'),('ST01244',8,'Economy'),('ST01245',8,'Economy'),('ST01246',8,'Economy'),('ST01247',8,'Economy'),('ST01248',8,'Economy'),('ST01249',8,'Economy'),('ST01250',8,'Economy'),('ST01251',8,'Economy'),('ST01252',8,'Economy'),('ST01253',8,'Economy'),('ST01254',8,'Economy'),('ST01255',8,'Economy'),('ST01256',8,'Economy'),('ST01257',8,'Economy'),('ST01258',8,'Economy'),('ST01259',8,'Economy'),('ST01260',8,'Economy'),('ST01261',8,'Economy'),('ST01262',8,'Economy'),('ST01263',8,'Economy'),('ST01264',8,'Economy'),('ST01265',8,'Economy'),('ST01266',8,'Economy'),('ST01267',8,'Economy'),('ST01268',8,'Economy'),('ST01269',8,'Economy'),('ST01270',8,'Economy'),('ST01271',8,'Economy'),('ST01272',8,'Economy'),('ST01273',8,'Economy'),('ST01274',8,'Economy'),('ST01275',8,'Economy'),('ST01276',8,'Economy'),('ST01277',8,'Economy'),('ST01278',8,'Economy'),('ST01279',8,'Economy'),('ST01280',8,'Economy'),('ST01281',8,'Economy'),('ST01282',8,'Economy'),('ST01283',8,'Economy'),('ST01284',8,'Economy'),('ST01285',8,'Economy'),('ST01286',8,'Economy'),('ST01287',8,'Economy'),('ST01288',8,'Economy'),('ST01289',8,'Economy'),('ST01290',8,'Economy'),('ST01291',8,'Economy'),('ST01292',8,'Economy'),('ST01293',8,'Economy'),('ST01294',8,'Economy'),('ST01295',8,'Economy'),('ST01296',8,'Economy'),('ST01297',8,'Economy'),('ST01298',8,'Economy'),('ST01299',8,'Economy'),('ST01300',8,'Economy'),('ST01301',8,'Economy'),('ST01302',8,'Economy'),('ST01303',8,'Economy'),('ST01304',8,'Economy'),('ST01305',8,'Economy'),('ST01306',8,'Economy'),('ST01307',8,'Economy'),('ST01308',8,'Economy'),('ST01309',8,'Economy'),('ST01310',8,'Economy'),('ST01311',8,'Economy'),('ST01312',8,'Economy'),('ST01313',8,'Economy'),('ST01314',8,'Economy'),('ST01315',8,'Economy'),('ST01316',8,'Economy'),('ST01317',8,'Economy'),('ST01318',8,'Economy'),('ST01319',8,'Economy'),('ST01320',8,'Economy'),('ST01321',8,'Economy'),('ST01322',8,'Economy'),('ST01323',8,'Economy'),('ST01324',8,'Economy'),('ST01325',8,'Economy'),('ST01326',8,'Economy'),('ST01327',8,'Economy'),('ST01328',8,'Economy'),('ST01329',8,'Economy'),('ST01330',8,'Economy'),('ST01331',8,'Economy'),('ST01332',8,'Economy'),('ST01333',8,'Economy'),('ST01334',8,'Economy'),('ST01335',8,'Economy'),('ST01336',8,'Economy'),('ST01337',8,'Economy'),('ST01338',8,'Economy'),('ST01339',8,'Economy'),('ST01340',8,'Economy'),('ST01341',8,'Economy'),('ST01342',8,'Economy'),('ST01343',8,'Economy'),('ST01344',8,'Economy'),('ST01345',8,'Economy'),('ST01346',8,'Economy'),('ST01347',8,'Economy'),('ST01348',8,'Economy'),('ST01349',8,'Economy'),('ST01350',8,'Economy'),('ST01351',8,'Economy'),('ST01352',8,'Economy'),('ST01353',8,'Economy'),('ST01354',8,'Economy'),('ST01355',8,'Economy'),('ST01356',8,'Economy'),('ST01357',8,'Economy'),('ST01358',8,'Economy'),('ST01359',8,'Economy'),('ST01360',8,'Economy'),('ST01361',8,'Economy'),('ST01362',8,'Economy'),('ST01363',8,'Economy'),('ST01364',8,'Economy'),('ST01365',8,'Economy'),('ST01366',8,'Economy'),('ST01367',8,'Economy'),('ST01368',8,'Economy'),('ST01369',8,'Economy'),('ST01370',8,'Economy'),('ST01371',8,'Economy'),('ST01372',8,'Economy'),('ST01373',8,'Economy'),('ST01374',8,'Economy'),('ST01375',8,'Economy'),('ST01376',8,'Economy'),('ST01377',8,'Economy'),('ST01378',8,'Economy'),('ST01379',8,'Economy'),('ST01380',8,'Economy'),('ST01381',8,'Economy'),('ST01382',8,'Economy'),('ST01383',8,'Economy'),('ST01384',8,'Economy'),('ST01385',8,'Economy'),('ST01386',8,'Economy'),('ST01387',8,'Economy'),('ST01388',8,'Economy'),('ST01389',8,'Economy'),('ST01390',8,'Economy'),('ST01391',8,'Economy'),('ST01392',8,'Economy'),('ST01393',8,'Economy'),('ST01394',8,'Economy'),('ST01395',8,'Economy'),('ST01396',8,'Economy'),('ST01397',8,'Economy'),('ST01398',8,'Economy'),('ST01399',8,'Economy'),('ST01400',8,'Economy'),('ST01401',8,'Economy'),('ST01402',8,'Economy'),('ST01403',8,'Economy'),('ST01404',8,'Economy'),('ST01405',8,'Economy'),('ST01406',8,'Economy'),('ST01407',8,'Economy'),('ST01408',8,'Economy'),('ST01409',8,'Economy'),('ST01410',8,'Economy'),('ST01411',8,'Economy'),('ST01412',8,'Economy'),('ST01413',8,'Economy'),('ST01414',8,'Economy'),('ST01415',8,'Economy'),('ST01416',8,'Economy'),('ST01417',8,'Economy'),('ST01418',8,'Economy'),('ST01419',8,'Economy'),('ST01420',8,'Economy'),('ST01421',8,'Economy'),('ST01422',8,'Economy'),('ST01423',8,'Economy'),('ST01424',8,'Economy'),('ST01425',8,'Economy'),('ST01426',8,'Economy'),('ST01427',8,'Economy'),('ST01428',8,'Economy'),('ST01429',8,'Economy'),('ST01430',8,'Economy'),('ST01431',8,'Economy'),('ST01432',8,'Economy'),('ST01433',8,'Economy'),('ST01434',8,'Economy'),('ST01435',8,'Economy'),('ST01436',8,'Economy'),('ST01437',8,'Economy'),('ST01438',8,'Economy'),('ST01439',8,'Economy'),('ST01440',8,'Economy'),('ST01441',8,'Economy'),('ST01442',8,'Economy'),('ST01443',8,'Economy'),('ST01444',8,'Economy'),('ST01445',8,'Economy'),('ST01446',8,'Economy'),('ST01447',8,'Economy'),('ST01448',8,'Economy'),('ST01449',8,'Economy'),('ST01450',8,'Economy'),('ST01451',8,'Economy'),('ST01452',8,'Economy'),('ST01453',8,'Economy'),('ST01454',8,'Economy'),('ST01455',8,'Economy'),('ST01456',8,'Economy'),('ST01457',8,'Economy'),('ST01458',8,'Economy'),('ST01459',8,'Economy'),('ST01460',8,'Economy'),('ST01461',8,'Economy'),('ST01462',8,'Economy'),('ST01463',8,'Economy'),('ST01464',8,'Economy'),('ST01465',8,'Economy'),('ST01466',8,'Economy'),('ST01467',8,'Economy'),('ST01468',8,'Economy'),('ST01469',8,'Economy'),('ST01470',8,'Economy'),('ST01471',8,'Economy'),('ST01472',8,'Economy'),('ST01473',8,'Economy'),('ST01474',8,'Economy'),('ST01475',8,'Economy'),('ST01476',8,'Economy'),('ST01477',8,'Economy'),('ST01478',8,'Economy'),('ST01479',8,'Economy'),('ST01480',8,'Economy'),('ST01481',8,'Economy'),('ST01482',8,'Economy'),('ST01483',8,'Economy'),('ST01484',8,'Economy'),('ST01485',8,'Economy'),('ST01486',8,'Economy'),('ST01487',8,'Economy'),('ST01488',8,'Economy'),('ST01489',8,'Economy'),('ST01490',8,'Economy'),('ST01491',8,'Economy'),('ST01492',8,'Economy'),('ST01493',8,'Economy'),('ST01494',8,'Economy'),('ST01495',8,'Economy'),('ST01496',8,'Economy'),('ST01497',8,'Economy'),('ST01498',8,'Economy'),('ST01499',8,'Economy'),('ST01500',8,'Economy'),('ST01501',8,'Economy'),('ST01502',8,'Economy'),('ST01503',8,'Economy'),('ST01504',8,'Economy'),('ST01505',8,'Economy'),('ST01506',8,'Economy'),('ST01507',8,'Economy'),('ST01508',8,'Economy'),('ST01509',8,'Economy'),('ST01510',8,'Economy'),('ST01511',8,'Economy'),('ST01512',8,'Economy'),('ST01513',8,'Economy'),('ST01514',8,'Economy'),('ST01515',8,'Economy'),('ST01516',8,'Economy'),('ST01517',8,'Economy'),('ST01518',8,'Economy'),('ST01519',8,'Economy'),('ST01520',8,'Economy'),('ST01521',8,'Economy'),('ST01522',8,'Economy'),('ST01523',8,'Economy'),('ST01524',8,'Economy'),('ST01525',8,'Economy'),('ST01526',8,'Economy'),('ST01527',8,'Economy'),('ST01528',8,'Economy'),('ST01529',8,'Economy'),('ST01530',8,'Economy'),('ST01531',8,'Economy'),('ST01532',8,'Economy'),('ST01533',8,'Economy'),('ST01534',8,'Economy'),('ST01535',8,'Economy'),('ST01536',8,'Economy'),('ST01537',8,'Economy'),('ST01538',8,'Economy'),('ST01539',8,'Economy'),('ST01540',8,'Economy'),('ST01541',8,'Economy'),('ST01542',8,'Economy'),('ST01543',8,'Economy'),('ST01544',8,'Economy'),('ST01545',8,'Economy'),('ST01546',8,'Economy'),('ST01547',8,'Economy'),('ST01548',8,'Economy'),('ST01549',8,'Economy'),('ST01550',8,'Economy'),('ST01551',8,'Economy'),('ST01552',8,'Economy'),('ST01553',8,'Economy'),('ST01554',8,'Economy'),('ST01555',8,'Economy'),('ST01556',8,'Economy'),('ST01557',8,'Economy'),('ST01558',8,'Economy'),('ST01559',8,'Economy'),('ST01560',8,'Economy'),('ST01561',8,'Economy'),('ST01562',8,'Economy'),('ST01563',8,'Economy'),('ST01564',8,'Economy'),('ST01565',8,'Economy'),('ST01566',8,'Economy'),('ST01567',8,'Economy'),('ST01568',8,'Economy'),('ST01569',8,'Economy'),('ST01570',8,'Economy'),('ST01571',8,'Economy'),('ST01572',8,'Economy'),('ST01573',8,'Economy'),('ST01574',8,'Economy'),('ST01575',8,'Economy'),('ST01576',8,'Economy'),('ST01577',8,'Economy'),('ST01578',8,'Economy'),('ST01579',8,'Economy'),('ST01580',8,'Economy'),('ST01581',8,'Economy'),('ST01582',8,'Economy'),('ST01583',8,'Economy'),('ST01584',8,'Economy'),('ST01585',8,'Economy'),('ST01586',8,'Economy'),('ST01587',8,'Economy'),('ST01588',8,'Economy'),('ST01589',8,'Economy'),('ST01590',8,'Economy'),('ST01591',8,'Economy'),('ST01592',8,'Economy'),('ST01593',8,'Economy'),('ST01594',8,'Economy'),('ST01595',8,'Economy'),('ST01596',8,'Economy'),('ST01597',8,'Economy'),('ST01598',8,'Economy'),('ST01599',8,'Economy'),('ST01600',8,'Business'),('ST01601',8,'Business'),('ST01602',8,'Business'),('ST01603',8,'Business'),('ST01604',8,'Business'),('ST01605',8,'Business'),('ST01606',8,'Business'),('ST01607',8,'Business'),('ST01608',8,'Business'),('ST01609',8,'Business'),('ST01610',8,'Business'),('ST01611',8,'Business'),('ST01612',8,'Business'),('ST01613',8,'Business'),('ST01614',8,'Business'),('ST01615',8,'Business'),('ST01616',8,'Business'),('ST01617',8,'Business'),('ST01618',8,'Business'),('ST01619',8,'Business'),('ST01620',8,'Business'),('ST01621',8,'Business'),('ST01622',8,'Business'),('ST01623',8,'Business'),('ST01624',8,'Business'),('ST01625',8,'Business'),('ST01626',8,'Business'),('ST01627',8,'Business'),('ST01628',8,'Business'),('ST01629',8,'Business'),('ST01630',8,'Business'),('ST01631',8,'Business'),('ST01632',8,'Business'),('ST01633',8,'Business'),('ST01634',8,'Business'),('ST01635',8,'Business'),('ST01636',8,'Business'),('ST01637',8,'Business'),('ST01638',8,'Business'),('ST01639',8,'Business'),('ST01640',8,'Business'),('ST01641',8,'Business'),('ST01642',8,'Business'),('ST01643',8,'Business'),('ST01644',8,'Business'),('ST01645',8,'Business'),('ST01646',8,'Business'),('ST01647',8,'Business'),('ST01648',8,'Business'),('ST01649',8,'Business'),('ST01650',8,'Business'),('ST01651',8,'Business'),('ST01652',8,'Business'),('ST01653',8,'Business'),('ST01654',8,'Business'),('ST01655',8,'Business'),('ST01656',8,'Business'),('ST01657',8,'Business'),('ST01658',8,'Business'),('ST01659',8,'Business'),('ST01660',8,'Business'),('ST01661',8,'Business'),('ST01662',8,'Business'),('ST01663',8,'Business'),('ST01664',8,'Business'),('ST01665',8,'Business'),('ST01666',8,'Business'),('ST01667',8,'Business'),('ST01668',8,'Business'),('ST01669',8,'Business'),('ST01670',8,'Business'),('ST01671',8,'Business'),('ST01672',8,'Business'),('ST01673',8,'Business'),('ST01674',8,'Business'),('ST01675',8,'Business'),('ST01676',8,'Platinum'),('ST01677',8,'Platinum'),('ST01678',8,'Platinum'),('ST01679',8,'Platinum'),('ST01680',8,'Platinum'),('ST01681',8,'Platinum'),('ST01682',8,'Platinum'),('ST01683',8,'Platinum'),('ST01684',8,'Platinum'),('ST01685',8,'Platinum'),('ST01686',8,'Platinum'),('ST01687',8,'Platinum'),('ST01688',8,'Platinum'),('ST01689',8,'Platinum');
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
INSERT INTO `user` VALUES ('565b6af4-921b-11ef-8ff5-047c16a3f13c','AkinduH','Akindu','Himan','2002-09-03','Sri Lanka','20022470923','Male','akinduhiman2@gmail.com','Member','$2b$10$HkxUOMSzie8OswYAIvh7n.un8KLdfFfxweukdWnW1Sfa/2N9n29im'),('760f80ef-921b-11ef-8ff5-047c16a3f13c','admin','admin','admin','2024-10-09','Sri Lanka','123456789','Male','admin@gmail.com','Admin','$2b$10$I3tnRljt2pBpP2IEEHV6uuyoM2a46Jf8VFokfzTk3Bkp2lCnEy8wm');
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
    INSERT INTO passenger (Passport_Number, Passport_Expire_Date, Name, Date_of_birth, Gender)
    VALUES (p_Passport_Number, p_Passport_Expire_Date, p_Name, p_Date_of_birth, p_Gender);
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
    IN p_Seat_ID VARCHAR(10),
    IN p_Price FLOAT
)
BEGIN
    DECLARE v_Booking_ID VARCHAR(10);
    DECLARE v_Last_Booking_Num INT;

    -- Convert empty string to NULL for User_ID
    IF p_User_ID = '' THEN
        SET p_User_ID = NULL;
    END IF;

    -- Check if there is any booking already
    SELECT MAX(CAST(SUBSTRING(Booking_ID, 4) AS UNSIGNED))
    INTO v_Last_Booking_Num
    FROM Booking;

    -- Set the booking ID
    IF v_Last_Booking_Num IS NULL THEN
        SET v_Booking_ID = 'bk_1';
    ELSE
        SET v_Booking_ID = CONCAT('bk_', v_Last_Booking_Num + 1);
    END IF;

    -- Insert the new booking
    INSERT INTO Booking (Booking_ID, Flight_ID, User_ID, Passenger_ID, Seat_ID, Issue_date, Price)
    VALUES (v_Booking_ID, p_Flight_ID, p_User_ID, p_Passenger_ID, p_Seat_ID, NOW(), p_Price);
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

-- Dump completed on 2024-10-24 20:59:29

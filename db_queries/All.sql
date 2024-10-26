CREATE TABLE User (
  User_ID VARCHAR(36) DEFAULT (UUID()),
  User_name VARCHAR(50) UNIQUE NOT NULL,
  First_name VARCHAR(50) NOT NULL,
  Last_name VARCHAR(50) NOT NULL,
  Date_of_birth DATE NOT NULL,
  Country VARCHAR(50) NOT NULL,
  NIC_code VARCHAR(20) NOT NULL,
  Gender ENUM('Male', 'Female', 'Other') NOT NULL,
  Email VARCHAR(30) UNIQUE NOT NULL,
  Role ENUM('Admin', 'Member') NOT NULL,
  Password VARCHAR(255) NOT NULL,
  PRIMARY KEY (User_ID)
);

CREATE TABLE Location (
  Location_ID INT AUTO_INCREMENT,
  Location VARCHAR(100) NOT NULL,
  Parent_Location_ID INT,
  PRIMARY KEY (Location_ID),
  FOREIGN KEY (Parent_Location_ID) REFERENCES Location(Location_ID)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
);

CREATE TABLE Airport (
  Airport_code CHAR(3) UNIQUE NOT NULL,
  Airport_name VARCHAR(100) NOT NULL,
  Location_ID INT NOT NULL,
  PRIMARY KEY (Airport_code),
  FOREIGN KEY (Location_ID) REFERENCES Location(Location_ID)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
);

CREATE TABLE Airplane_model (
  Airplane_model_ID INT AUTO_INCREMENT,
  Model_name VARCHAR(50) UNIQUE NOT NULL,
  No_of_Economic_Seats INT DEFAULT 0,
  No_of_Business_Seats INT DEFAULT 0,
  No_of_Platinum_Seats INT DEFAULT 0,
  PRIMARY KEY (Airplane_model_ID),
  CONSTRAINT CHK_No_of_Economic_Seats CHECK (No_of_Economic_Seats >= 0),
  CONSTRAINT CHK_No_of_Business_Seats CHECK (No_of_Business_Seats >= 0),
  CONSTRAINT CHK_No_of_Platinum_Seats CHECK (No_of_Platinum_Seats >= 0)
);

CREATE TABLE Airplane (
  Airplane_ID INT AUTO_INCREMENT,
  Airplane_model_ID INT NOT NULL,
  PRIMARY KEY (Airplane_ID),
  FOREIGN KEY (Airplane_model_ID) REFERENCES Airplane_model(Airplane_model_ID)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
);

CREATE TABLE Seat (
  Seat_ID VARCHAR(10),
  Airplane_ID INT NOT NULL,
  Travel_Class ENUM('Economy', 'Business', 'Platinum') NOT NULL,
  PRIMARY KEY (Seat_ID),
  FOREIGN KEY (Airplane_ID) REFERENCES Airplane(Airplane_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE Route (
  Route_ID VARCHAR(10),
  Origin_airport_code CHAR(3) NOT NULL,
  Destination_airport_code CHAR(3) NOT NULL,
  PRIMARY KEY (Route_ID),
  FOREIGN KEY (Origin_airport_code) REFERENCES Airport(Airport_code)
  ON DELETE RESTRICT
  ON UPDATE CASCADE,
  FOREIGN KEY (Destination_airport_code) REFERENCES Airport(Airport_code)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
);

CREATE TABLE Flight (
  Flight_ID VARCHAR(10),
  Airplane_ID INT,
  Route_ID VARCHAR(10),
  Departure_date DATE NOT NULL,
  Arrival_date DATE NOT NULL,
  Arrival_time TIME NOT NULL,
  Departure_time TIME NOT NULL,
  Status ENUM('Scheduled', 'Delayed', 'Cancelled') NOT NULL DEFAULT 'Scheduled',
  PRIMARY KEY (Flight_ID),
  FOREIGN KEY (Airplane_ID) REFERENCES Airplane(Airplane_ID)
  ON DELETE SET NULL
  ON UPDATE CASCADE,
  FOREIGN KEY (Route_ID) REFERENCES Route(Route_ID)
  ON DELETE SET NULL
  ON UPDATE CASCADE,
  CONSTRAINT CHK_Arrival_Date CHECK (Arrival_date >= Departure_date)
);

CREATE TABLE Flight_Pricing (
  Flight_ID VARCHAR(10) NOT NULL,
  Travel_Class ENUM('Economy', 'Business', 'Platinum') NOT NULL,
  Price FLOAT NOT NULL,
  PRIMARY KEY (Flight_ID, Travel_Class),
  FOREIGN KEY (Flight_ID) REFERENCES Flight(Flight_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE Passenger (
  Passenger_ID INT AUTO_INCREMENT,
  Passport_Number VARCHAR(9) UNIQUE NOT NULL,
  Passport_Expire_Date DATE NOT NULL,
  Name VARCHAR(100) NOT NULL,
  Date_of_birth DATE NOT NULL,
  Gender ENUM('Male', 'Female', 'Other') NOT NULL,
  PRIMARY KEY (Passenger_ID)
);

CREATE TABLE Loyalty_detail (
  Membership_Type ENUM('Normal', 'Frequent', 'Gold'),
  Needed_bookings INT NOT NULL,
  Discount DECIMAL(3,2) NOT NULL,
  PRIMARY KEY (Membership_Type),
  CONSTRAINT CHK_Discount_Valid CHECK (Discount >= 0)
);

CREATE TABLE Member_detail (
  User_ID VARCHAR(36),
  No_of_booking INT NOT NULL DEFAULT 0,
  Membership_Type ENUM('Normal', 'Frequent', 'Gold') NOT NULL DEFAULT 'Normal',
  PRIMARY KEY (User_ID),
  FOREIGN KEY (Membership_Type) REFERENCES Loyalty_detail(Membership_Type)
  ON DELETE RESTRICT
  ON UPDATE CASCADE  
);

CREATE TABLE Booking (
  Booking_ID VARCHAR(10),
  Flight_ID VARCHAR(10) NOT NULL,
  User_ID VARCHAR(36),
  Passenger_ID INT NOT NULL,
  Seat_ID VARCHAR(10),
  Issue_date DATETIME DEFAULT NOW(),
  Price FLOAT NOT NULL,
  PRIMARY KEY (Booking_ID),
  FOREIGN KEY (Flight_ID) REFERENCES Flight(Flight_ID)
  ON DELETE RESTRICT
  ON UPDATE CASCADE,
  FOREIGN KEY (User_ID) REFERENCES User(User_ID)
  ON DELETE RESTRICT
  ON UPDATE CASCADE,
  FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID),
  FOREIGN KEY (Seat_ID) REFERENCES Seat(Seat_ID)
  ON DELETE SET NULL
  ON UPDATE CASCADE,
  CONSTRAINT CHK_Price CHECK (Price > 0),
  UNIQUE (Flight_ID, Seat_ID)
);


CREATE INDEX idx_user_email ON User (Email);
CREATE INDEX idx_member_membership_type ON Member_detail (Membership_Type);
CREATE INDEX idx_flight_status ON Flight (Status);
CREATE INDEX idx_Departure_flight_dates ON Flight (Departure_date);
CREATE INDEX idx_Arrival_flight_dates ON Flight (Arrival_date);
CREATE INDEX idx_flight_pricing_class ON Flight_Pricing (Travel_Class);
CREATE INDEX idx_flight_airplane_id ON Flight (Airplane_ID);
CREATE INDEX idx_flight_route_id ON Flight (Route_ID);
CREATE INDEX idx_booking_flight_id ON Booking (Flight_ID);
CREATE INDEX idx_booking_user_id ON Booking (User_ID);
CREATE INDEX idx_booking_seat ON Booking (Seat_ID);
CREATE INDEX idx_passenger_dob ON Passenger (Date_of_birth);
CREATE INDEX idx_airplane_model_id ON Airplane (Airplane_model_ID);
CREATE INDEX idx_Destination_route_code ON Route (Destination_airport_code);
CREATE INDEX idx_Origin_route_code ON Route (Origin_airport_code);


-- To add a passenger or retrieve existing passenger ID
DELIMITER //
CREATE PROCEDURE `AddPassenger`(
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
END //
DELIMITER ;

-- To get booked seats
DELIMITER //

CREATE PROCEDURE `GetBookedSeats`(
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
END //

DELIMITER ;

-- To create a booking
DELIMITER //
CREATE PROCEDURE `CreateBooking`(
    IN p_Flight_ID VARCHAR(10),
    IN p_User_ID VARCHAR(36),
    IN p_Passenger_ID INT,
    IN p_Seat_ID VARCHAR(10),
    IN p_Price FLOAT
)
BEGIN
    DECLARE v_Booking_ID VARCHAR(10);
    DECLARE v_Last_Booking_Num INT;
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

    -- Check if the seat is already booked for this flight
    IF EXISTS (SELECT 1 FROM Booking WHERE Flight_ID = p_Flight_ID AND Seat_ID = p_Seat_ID) THEN
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
    VALUES (v_Booking_ID, p_Flight_ID, p_User_ID, p_Passenger_ID, p_Seat_ID, NOW(), p_Price);

    COMMIT;
END //
DELIMITER ;

-- Create a user of type member
DELIMITER //
CREATE PROCEDURE `CreateMemberUser`(
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
END //
DELIMITER ;

-- To get available flights
DELIMITER //
CREATE PROCEDURE `GetAvailableFlights`(
     IN p_Route_ID VARCHAR(10),
     IN p_Departure_date DATE
)
BEGIN
    SELECT Flight_ID, Airplane_ID, Route_ID, Departure_date, Arrival_date, 
           Arrival_time, Departure_time, Status
    FROM Flight
    WHERE Route_ID = p_Route_ID AND Departure_date = p_Departure_date;
END //
DELIMITER ;

-- To get the route id based on airport codes
DELIMITER //
CREATE PROCEDURE `GetRouteID`(
    IN p_Origin_airport_code CHAR(3),
    IN p_Destination_airport_code CHAR(3)
)
BEGIN
    SELECT Route_ID
    FROM route
    WHERE Origin_airport_code = p_Origin_airport_code
      AND Destination_airport_code = p_Destination_airport_code;
END //
DELIMITER ;

-- To add a flight while updating flight table and flight pricing table
DELIMITER //
CREATE PROCEDURE `AddFlight`(
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
    
END //
DELIMITER ;

-- Functions

-- To get full age
DELIMITER //
CREATE FUNCTION `GetFullAge`(p_Date_of_birth DATE) 
RETURNS VARCHAR(50)
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
END //
DELIMITER ;
-- Stored Proce dures and Functions to produce the reports which can be done only by the management

-- Functions

-- Total revenue generated by each Aircraft type
DELIMITER //
CREATE FUNCTION `GetRevenueByAircraftModel`(
    Aircraft_type INT
) RETURNS FLOAT
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
END //
DELIMITER ;

-- Stored Procedures

-- Given a flight no, all passengers travelling in it (next immediate flight) below age 18, above age 18
DELIMITER //
CREATE PROCEDURE `GetPassengersByAgeCategory`(IN flightID VARCHAR(10))
BEGIN
    SELECT 
        p.Passenger_ID,
        p.Name,
        p.Date_of_birth,
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
END //
DELIMITER ;

-- Given a date range, number of passengers travelling to a given destination 
DELIMITER //
CREATE PROCEDURE `GetPassengerCountByDateRangeAndDestinationName`(
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
END //
DELIMITER ;

-- Given a date range, number of bookings by each passenger type 
DELIMITER //
CREATE PROCEDURE `GetBookingsByDateRangePassengerType`(
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
END //
DELIMITER ;

-- Given origin and destination, all past flights, states, passenger counts data
DELIMITER //
CREATE PROCEDURE `GetAllPastFlightsAndPassengerCountByOriginAndDestination`(
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
END //
DELIMITER ;



-- Triggers

-- After user is entered then add a row to him in member detail table
DELIMITER //
CREATE TRIGGER `after_user_insert` AFTER INSERT ON `user`
FOR EACH ROW
BEGIN
    -- Check if the role is 'Member'
    IF NEW.Role = 'Member' THEN
        -- Insert into Member_detail with default attributes
        INSERT INTO Member_detail (User_ID, No_of_booking, Membership_Type)
        VALUES (NEW.User_ID, 0, 'Normal');
    END IF;
END //
DELIMITER ;

-- To update the number of booking and membership type for each booking
DELIMITER //
CREATE TRIGGER `update_membership_type_and_no_of_bookings` AFTER INSERT ON `booking`
FOR EACH ROW
BEGIN
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
END //
DELIMITER ;

-- After adding an airplane add relevant seats according to airplane model table data to seat table  
DELIMITER //
CREATE TRIGGER `after_airplane_insert` AFTER INSERT ON `airplane`
FOR EACH ROW
BEGIN
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
END //
DELIMITER ;



-- Insert Loyalty Details
INSERT INTO Loyalty_detail (Membership_Type, Needed_bookings, Discount)
VALUES
('Normal', 0, 0.00),
('Frequent', 10, 0.05),
('Gold', 20, 0.09);

-- -- Insert Users
-- INSERT INTO User (User_name, First_name, Last_name, Date_of_birth, Country, NIC_code, Gender, Email, Role, Password)
-- VALUES 
-- ('admin', 'admin', 'admin', '2024-10-05', 'Sri Lanka', '2003256374', 'Male', 'admin@gmail.com', 'Admin', 'admin');

-- Insert Locations
INSERT INTO Location (Location, Parent_Location_ID)
VALUES
('Indonesia', NULL), -- 1
('Sri Lanka', NULL), -- 2
('India', NULL), -- 3
('New Delhi', NULL), -- 4
('Singapore', NULL), -- 5
('Thailand', NULL), -- 6
('Jakarta', 1), -- 7
('Bali', 1), -- 8
('Denpasar', 8), -- 9
('Western', 2), -- 10
('Colombo', 10), -- 11
('Southern', 2), -- 12
('Hambantota', 12), -- 13
('Delhi', 3), -- 14
('New Delhi', 14), -- 15
('Maharashtra', 3), -- 16
('Mumbai', 16), -- 17
('Tamil Nadu', 3), -- 18
('Chennai', 18), -- 19
('Bangkok', 6), -- 20
('Don Mueang', 6); -- 21

-- Insert Airports
INSERT INTO Airport (Airport_code, Airport_name, Location_ID)
VALUES
('CGK', 'Soekarno-Hatta International Airport', 7),
('DPS', 'Ngurah Rai International Airport', 9),
('BIA', 'Bandaranaike International Airport', 11),
('HRI', 'Mattala Rajapaksa International Airport', 13),
('DEL', 'Indira Gandhi International Airport', 15),
('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 17),
('MAA', 'Chennai International Airport', 19),
('BKK', 'Suvarnabhumi Airport', 20),
('DMK', 'Don Mueang International Airport', 21),
('SIN', 'Singapore Changi Airport', 5);

-- Insert Airplane Models
INSERT INTO Airplane_model (Model_name, No_of_Economic_Seats, No_of_Business_Seats, No_of_Platinum_Seats)
VALUES
('Boeing 737', 114, 30, 16),
('Boeing 757', 135, 21, 24),
('Airbus A380', 399, 76, 14);

-- Insert Airplanes
INSERT INTO Airplane (Airplane_model_ID)
VALUES
(1);

INSERT INTO Airplane (Airplane_model_ID)
VALUES
(1);

INSERT INTO Airplane (Airplane_model_ID)
VALUES
(1);

INSERT INTO Airplane (Airplane_model_ID)
VALUES
(2);

INSERT INTO Airplane (Airplane_model_ID)
VALUES
(2);

INSERT INTO Airplane (Airplane_model_ID)
VALUES
(2);

INSERT INTO Airplane (Airplane_model_ID)
VALUES
(2);

INSERT INTO Airplane (Airplane_model_ID)
VALUES
(3);

-- -- Insert Seats
-- INSERT INTO Seat (Seat_ID, Airplane_ID, Travel_Class)
-- VALUES
-- ('ST001', 1, 'Economy'),
-- ('ST002', 2, 'Business'),
-- ('ST003', 3, 'Platinum'),
-- ('ST004', 4, 'Economy'),
-- ('ST005', 5, 'Business');

-- Insert Routes
INSERT INTO Route (Route_ID, Origin_airport_code, Destination_airport_code)
VALUES
('RT001', 'CGK', 'DPS'),
('RT002', 'DPS', 'CGK'),
('RT003', 'BIA', 'BOM'),
('RT004', 'HRI', 'CGK'),
('RT005', 'DEL', 'DPS'),
('RT006', 'BOM', 'MAA'),
('RT007', 'MAA', 'BOM'),
('RT008', 'CGK', 'HRI'),
('RT009', 'BOM', 'BIA'),
('RT010', 'DPS', 'DEL'),
('RT011', 'CGK', 'SIN'),
('RT012', 'SIN', 'CGK'),
('RT013', 'BKK', 'DMK'),
('RT014', 'DMK', 'BKK'),
('RT015', 'SIN', 'BKK'),
('RT016', 'BKK', 'SIN'),
('RT017', 'DEL', 'BOM'),
('RT018', 'BOM', 'DEL'),
('RT019', 'MAA', 'DEL'),
('RT020', 'DEL', 'MAA');

-- Insert Flights
INSERT INTO Flight (Flight_ID, Airplane_ID, Route_ID, Departure_date, Arrival_date, Departure_time, Arrival_time, Status)
VALUES
('FL001', 1, 'RT001', '2024-10-28', '2024-10-28', '08:00:00', '10:00:00', 'Scheduled'),
('FL002', 2, 'RT002', '2024-10-28', '2024-10-28', '12:00:00', '14:30:00', 'Scheduled'),
('FL003', 3, 'RT003', '2024-10-28', '2024-10-28', '15:00:00', '17:00:00', 'Delayed'),
('FL004', 4, 'RT004', '2024-10-28', '2024-10-28', '18:00:00', '20:30:00', 'Scheduled'),
('FL005', 5, 'RT005', '2024-10-28', '2024-10-28', '09:00:00', '11:00:00', 'Cancelled'),
('FL006', 1, 'RT006', '2024-10-29', '2024-10-29', '08:00:00', '10:00:00', 'Scheduled'),
('FL007', 2, 'RT007', '2024-10-29', '2024-10-29', '12:00:00', '14:30:00', 'Scheduled'),
('FL008', 3, 'RT008', '2024-10-29', '2024-10-29', '15:00:00', '17:00:00', 'Delayed'),
('FL009', 4, 'RT009', '2024-10-29', '2024-10-29', '18:00:00', '20:30:00', 'Scheduled'),
('FL010', 5, 'RT010', '2024-10-29', '2024-10-29', '09:00:00', '11:00:00', 'Cancelled'),
('FL011', 1, 'RT011', '2024-10-30', '2024-10-30', '08:00:00', '10:00:00', 'Scheduled'),
('FL012', 2, 'RT012', '2024-10-30', '2024-10-30', '12:00:00', '14:30:00', 'Scheduled'),
('FL013', 3, 'RT013', '2024-10-30', '2024-10-30', '15:00:00', '17:00:00', 'Delayed'),
('FL014', 4, 'RT014', '2024-10-30', '2024-10-30', '18:00:00', '20:30:00', 'Scheduled'),
('FL015', 5, 'RT015', '2024-10-30', '2024-10-30', '09:00:00', '11:00:00', 'Cancelled'),
('FL016', 1, 'RT016', '2024-10-31', '2024-10-31', '08:00:00', '10:00:00', 'Scheduled'),
('FL017', 2, 'RT017', '2024-10-31', '2024-10-31', '12:00:00', '14:30:00', 'Scheduled'),
('FL018', 3, 'RT018', '2024-10-31', '2024-10-31', '15:00:00', '17:00:00', 'Delayed'),
('FL019', 4, 'RT019', '2024-10-31', '2024-10-31', '18:00:00', '20:30:00', 'Scheduled'),
('FL020', 5, 'RT020', '2024-10-31', '2024-10-31', '09:00:00', '11:00:00', 'Cancelled'),
('FL021', 1, 'RT001', '2024-11-01', '2024-11-01', '08:00:00', '10:00:00', 'Scheduled'),
('FL022', 2, 'RT002', '2024-11-01', '2024-11-01', '12:00:00', '14:30:00', 'Scheduled'),
('FL023', 3, 'RT003', '2024-11-01', '2024-11-01', '15:00:00', '17:00:00', 'Delayed'),
('FL024', 4, 'RT004', '2024-11-01', '2024-11-01', '18:00:00', '20:30:00', 'Scheduled'),
('FL025', 5, 'RT005', '2024-11-01', '2024-11-01', '09:00:00', '11:00:00', 'Cancelled'),
('FL026', 1, 'RT006', '2024-11-02', '2024-11-02', '08:00:00', '10:00:00', 'Scheduled'),
('FL027', 2, 'RT007', '2024-11-02', '2024-11-02', '12:00:00', '14:30:00', 'Scheduled'),
('FL028', 3, 'RT008', '2024-11-02', '2024-11-02', '15:00:00', '17:00:00', 'Delayed'),
('FL029', 4, 'RT009', '2024-11-02', '2024-11-02', '18:00:00', '20:30:00', 'Scheduled'),
('FL030', 5, 'RT010', '2024-11-02', '2024-11-02', '09:00:00', '11:00:00', 'Cancelled');

-- Insert Flight Pricing
INSERT INTO Flight_Pricing (Flight_ID, Travel_Class, Price)
VALUES
('FL001', 'Economy', 450.00),
('FL001', 'Business', 900.00),
('FL001', 'Platinum', 1500.00),
('FL002', 'Economy', 500.00),
('FL002', 'Business', 1000.00),
('FL002', 'Platinum', 1600.00),
('FL003', 'Economy', 550.00),
('FL003', 'Business', 1100.00),
('FL003', 'Platinum', 1700.00),
('FL004', 'Economy', 600.00),
('FL004', 'Business', 1200.00),
('FL004', 'Platinum', 1800.00),
('FL005', 'Economy', 650.00),
('FL005', 'Business', 1300.00),
('FL005', 'Platinum', 1900.00),
('FL006', 'Economy', 700.00),
('FL006', 'Business', 1400.00),
('FL006', 'Platinum', 2000.00),
('FL007', 'Economy', 750.00),
('FL007', 'Business', 1500.00),
('FL007', 'Platinum', 2100.00),
('FL008', 'Economy', 800.00),
('FL008', 'Business', 1600.00),
('FL008', 'Platinum', 2200.00),
('FL009', 'Economy', 850.00),
('FL009', 'Business', 1700.00),
('FL009', 'Platinum', 2300.00),
('FL010', 'Economy', 900.00),
('FL010', 'Business', 1800.00),
('FL010', 'Platinum', 2400.00),
('FL011', 'Economy', 950.00),
('FL011', 'Business', 1900.00),
('FL011', 'Platinum', 2500.00),
('FL012', 'Economy', 1000.00),
('FL012', 'Business', 2000.00),
('FL012', 'Platinum', 2600.00),
('FL013', 'Economy', 1050.00),
('FL013', 'Business', 2100.00),
('FL013', 'Platinum', 2700.00),
('FL014', 'Economy', 1100.00),
('FL014', 'Business', 2200.00),
('FL014', 'Platinum', 2800.00),
('FL015', 'Economy', 1150.00),
('FL015', 'Business', 2300.00),
('FL015', 'Platinum', 2900.00),
('FL016', 'Economy', 1200.00),
('FL016', 'Business', 2400.00),
('FL016', 'Platinum', 3000.00),
('FL017', 'Economy', 1250.00),
('FL017', 'Business', 2500.00),
('FL017', 'Platinum', 3100.00),
('FL018', 'Economy', 1300.00),
('FL018', 'Business', 2600.00),
('FL018', 'Platinum', 3200.00),
('FL019', 'Economy', 1350.00),
('FL019', 'Business', 2700.00),
('FL019', 'Platinum', 3300.00),
('FL020', 'Economy', 1400.00),
('FL020', 'Business', 2800.00),
('FL020', 'Platinum', 3400.00),
('FL021', 'Economy', 1450.00),
('FL021', 'Business', 2900.00),
('FL021', 'Platinum', 3500.00),
('FL022', 'Economy', 1500.00),
('FL022', 'Business', 3000.00),
('FL022', 'Platinum', 3600.00),
('FL023', 'Economy', 1550.00),
('FL023', 'Business', 3100.00),
('FL023', 'Platinum', 3700.00),
('FL024', 'Economy', 1600.00),
('FL024', 'Business', 3200.00),
('FL024', 'Platinum', 3800.00),
('FL025', 'Economy', 1650.00),
('FL025', 'Business', 3300.00),
('FL025', 'Platinum', 3900.00),
('FL026', 'Economy', 1700.00),
('FL026', 'Business', 3400.00),
('FL026', 'Platinum', 4000.00),
('FL027', 'Economy', 1750.00),
('FL027', 'Business', 3500.00),
('FL027', 'Platinum', 4100.00),
('FL028', 'Economy', 1800.00),
('FL028', 'Business', 3600.00),
('FL028', 'Platinum', 4200.00),
('FL029', 'Economy', 1850.00),
('FL029', 'Business', 3700.00),
('FL029', 'Platinum', 4300.00),
('FL030', 'Economy', 1900.00),
('FL030', 'Business', 3800.00),
('FL030', 'Platinum', 4400.00);

-- Insert Passengers
INSERT INTO Passenger (Passenger_ID, Passport_Number, Passport_Expire_Date, Name, Date_of_birth, Gender)
VALUES
(1, '1234', '2030-12-01', 'Akindu', '2014-05-20', 'Male');


-- Insert sample bookings
INSERT INTO Booking (Booking_ID, Flight_ID, Passenger_ID, Seat_ID, Issue_date, Price)
VALUES
('bk_1', 'FL003', 1, 'P003_S001', '2023-06-01 10:00:00', 1500.00),
('bk_2', 'FL003', 1, 'P003_S005', '2023-06-01 10:15:00', 1500.00),
('bk_3', 'FL003', 1, 'P003_S045', '2023-06-01 11:00:00', 1500.00),
('bk_4', 'FL003', 1, 'P003_S100', '2023-06-01 11:30:00', 1500.00),
('bk_5', 'FL003', 1, 'P003_S145', '2023-06-01 12:00:00', 1500.00);

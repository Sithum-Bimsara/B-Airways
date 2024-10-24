-- To add a passenger
DELIMITER //
CREATE PROCEDURE `AddPassenger`(
    IN p_Passport_Number VARCHAR(9),
    IN p_Passport_Expire_Date DATE,
    IN p_Name VARCHAR(100),
    IN p_Date_of_birth DATE,
    IN p_Gender ENUM('Male', 'Female', 'Other')
)
BEGIN
    INSERT INTO passenger (Passport_Number, Passport_Expire_Date, Name, Date_of_birth, Gender)
    VALUES (p_Passport_Number, p_Passport_Expire_Date, p_Name, p_Date_of_birth, p_Gender);
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

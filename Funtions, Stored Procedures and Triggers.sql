//To add a pessenger
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
END

//To create a booking
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
END

//Create a user in type of member
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
END


//To get availble flights
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAvailableFlights`(
     IN p_Route_ID VARCHAR(10),
     IN p_Departure_date VARCHAR(10)
)
BEGIN
    SELECT Flight_ID, Airplane_ID, Route_ID, Departure_date, Arrival_date, 
           Arrival_time, Departure_time, Status
    FROM Flight
    WHERE Route_ID = p_Route_ID AND Departure_date = p_Departure_date;
END

//To get the route id based on airport codes
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetRouteID`(
    IN p_Origin_airport_code CHAR(3),
    IN p_Destination_airport_code CHAR(3)
)
BEGIN
    SELECT Route_ID
    FROM route
    WHERE Origin_airport_code = p_Origin_airport_code
      AND Destination_airport_code = p_Destination_airport_code;
END


//To add a flight while updating flight table and flight pricing table
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddFlight`(
    IN p_Airplane_ID INT,
    IN p_Route_ID VARCHAR(10),
    IN p_Departure_date DATE,
    IN p_Arrival_date DATE,
    IN p_Departure_time TIME,
    IN p_Arrival_time TIME,
    IN p_Status ENUM('Scheduled', 'Delayed', 'Cancel'),
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
    INSERT INTO flight (Flight_ID, Airplane_ID, Route_ID, Departure_date, Arrival_date, Departure_time, Arrival_time, Status)
    VALUES (new_Flight_ID, p_Airplane_ID, p_Route_ID, p_Departure_date, p_Arrival_date, p_Departure_time, p_Arrival_time, p_Status);

    -- Insert pricing 
    INSERT INTO flight_pricing (Flight_ID, Travel_Class, Price) 
    VALUES 
    (new_Flight_ID, 'Economy', p_Economy_Price),
    (new_Flight_ID, 'Business', p_Business_Price),
    (new_Flight_ID, 'Platinum', p_Platinum_Price);
    
END



//Functions


//To get full age
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
END






//Triggers

//After user is entered then add a row to him in memeber detail table
CREATE DEFINER=`root`@`localhost` TRIGGER `after_user_insert` AFTER INSERT ON `user` FOR EACH ROW BEGIN
    -- Check if the role is 'Member'
    IF NEW.Role = 'Member' THEN
        -- Insert into Member_detail with default attributes
        INSERT INTO Member_detail (User_ID, No_of_booking, Membership_Type)
        VALUES (NEW.User_ID, 0, 'Normal');
    END IF;
END

//To update the number of booking and membership type for each booking
CREATE DEFINER=`root`@`localhost` TRIGGER `update_membership_type_and_no_of_bookings` AFTER INSERT ON `booking` FOR EACH ROW BEGIN
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
END


//After adding a airplane add relevet seats according to airplane model table data to seat table  
CREATE DEFINER=`root`@`localhost` TRIGGER `after_airplane_insert` AFTER INSERT ON `airplane` FOR EACH ROW BEGIN
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
        SET new_seat_id = CONCAT('ST', LPAD(last_seat_id + seat_num, 3, '0'));
        INSERT INTO seat (Seat_ID, Airplane_ID, Travel_Class) 
        VALUES (new_seat_id, NEW.Airplane_ID, 'Economy');
        SET seat_num = seat_num + 1;
    END WHILE;

    -- Insert Business Class Seats
    SET seat_num = 1;
    WHILE seat_num <= bus_seats DO
        SET new_seat_id = CONCAT('ST', LPAD(last_seat_id + econ_seats + seat_num, 3, '0'));
        INSERT INTO seat (Seat_ID, Airplane_ID, Travel_Class) 
        VALUES (new_seat_id, NEW.Airplane_ID, 'Business');
        SET seat_num = seat_num + 1;
    END WHILE;

    -- Insert Platinum Class Seats
    SET seat_num = 1;
    WHILE seat_num <= plat_seats DO
        SET new_seat_id = CONCAT('ST', LPAD(last_seat_id + econ_seats + bus_seats + seat_num, 3, '0'));
        INSERT INTO seat (Seat_ID, Airplane_ID, Travel_Class) 
        VALUES (new_seat_id, NEW.Airplane_ID, 'Platinum');
        SET seat_num = seat_num + 1;
    END WHILE;

END
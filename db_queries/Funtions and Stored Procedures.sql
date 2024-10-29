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

-- Procedure to get available seats for a given flight
DELIMITER //
CREATE PROCEDURE `GetAvailableSeats`(IN p_Flight_ID VARCHAR(10))
BEGIN
    DECLARE v_Airplane_ID INT;
    DECLARE v_Airplane_model_ID INT;
    DECLARE v_Economy_Total INT;
    DECLARE v_Business_Total INT;
    DECLARE v_Platinum_Total INT;
    DECLARE v_Economy_Booked INT;
    DECLARE v_Business_Booked INT;
    DECLARE v_Platinum_Booked INT;

    -- Get the Airplane_ID and Airplane_model_ID for the given Flight_ID
    SELECT f.Airplane_ID, a.Airplane_model_ID 
    INTO v_Airplane_ID, v_Airplane_model_ID
    FROM Flight f
    JOIN Airplane a ON f.Airplane_ID = a.Airplane_ID
    WHERE f.Flight_ID = p_Flight_ID;

    -- Get the total seats by class for the airplane model
    SELECT 
        No_of_Economic_Seats,
        No_of_Business_Seats,
        No_of_Platinum_Seats
    INTO 
        v_Economy_Total,
        v_Business_Total,
        v_Platinum_Total
    FROM Airplane_model
    WHERE Airplane_model_ID = v_Airplane_model_ID;

    -- Get booked seats by class
    SELECT 
        COUNT(CASE WHEN s.Travel_Class = 'Economy' THEN 1 END),
        COUNT(CASE WHEN s.Travel_Class = 'Business' THEN 1 END),
        COUNT(CASE WHEN s.Travel_Class = 'Platinum' THEN 1 END)
    INTO
        v_Economy_Booked,
        v_Business_Booked,
        v_Platinum_Booked
    FROM Booking b
    JOIN Seat s ON b.Seat_ID = s.Seat_ID
    WHERE b.Flight_ID = p_Flight_ID
    GROUP BY b.Flight_ID;

    -- Return available seats by class
    SELECT 
        (v_Economy_Total - COALESCE(v_Economy_Booked, 0)) AS Economy_Available,
        (v_Business_Total - COALESCE(v_Business_Booked, 0)) AS Business_Available,
        (v_Platinum_Total - COALESCE(v_Platinum_Booked, 0)) AS Platinum_Available;
END //
DELIMITER ;


-- Given a flight no, all passengers travelling in it (next immediate flight) below age 18, above age 18
DELIMITER //
CREATE PROCEDURE `GetPassengersByAgeCategory`(IN flightID VARCHAR(10))
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
END //
DELIMITER ;

-- Given a date range, number of passengers travelling to a given destination 
DELIMITER //
CREATE PROCEDURE `GetPassengerCountByDateRangeAndDestinationName`(
    IN dest_airport_code CHAR(3),
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    SELECT COUNT(DISTINCT p.Passenger_ID) AS PassengerCount
    FROM booking b
    JOIN passenger p ON b.Passenger_ID = p.Passenger_ID
    JOIN flight f ON f.Flight_ID = b.Flight_ID
    JOIN route r ON r.Route_ID = f.Route_ID
    WHERE r.Destination_airport_code = dest_airport_code
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
    IN origin_airport_code CHAR(3),
    IN destination_airport_code CHAR(3)
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
    WHERE r.Origin_airport_code = origin_airport_code
    AND r.Destination_airport_code = destination_airport_code
    AND f.Departure_date < CURDATE()
    GROUP BY 
        f.Flight_ID, f.Status, a1.Airport_name, a2.Airport_name;
END //
DELIMITER ;

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
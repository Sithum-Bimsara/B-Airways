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
END //
DELIMITER ;
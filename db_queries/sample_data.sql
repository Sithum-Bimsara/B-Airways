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
('FL001', 1, 'RT003', '2024-10-28', '2024-10-28', '08:00:00', '10:00:00', 'Scheduled'),
('FL002', 2, 'RT002', '2024-10-28', '2024-10-28', '12:00:00', '14:30:00', 'Scheduled'),
('FL003', 8, 'RT003', '2024-10-28', '2024-10-28', '15:00:00', '17:00:00', 'Delayed'),
('FL004', 4, 'RT009', '2024-10-28', '2024-10-28', '18:00:00', '20:30:00', 'Scheduled'),
('FL005', 5, 'RT009', '2024-10-28', '2024-10-28', '09:00:00', '11:00:00', 'Scheduled'),
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

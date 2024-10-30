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
  status ENUM('pending', 'booked') NOT NULL DEFAULT 'pending',
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
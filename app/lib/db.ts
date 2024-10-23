import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2/promise'; 

export const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function getFlightData() {
  const [rows] = await connection.query('SELECT * FROM flights');
  return rows;
}
export async function getAirplaneData() {
    const [rows] = await connection.query('SELECT * FROM airplane');
    return rows;
  }
  export async function getAirplaneModelData() {
    const [rows] = await connection.query('SELECT * FROM airplane_model');
    return rows;
  }
  export async function getAirportsData() {
    const [rows] = await connection.query('SELECT * FROM airports');
    return rows;
  }
  export async function getBookingsData() {
    const [rows] = await connection.query('SELECT * FROM bookings');
    return rows;
  }
  export async function getSeatsData() {
    const [rows] = await connection.query('SELECT * FROM seats');
    return rows;
  }
  export async function getUsersData() {
    const [rows] = await connection.query('SELECT * FROM users');
    return rows;
  }
  
export async function getbookingsforeachflightData() {
  const [rows] = await connection.query('SELECT * FROM bookingsforeachflight');
  return rows;
}
export async function getSeatBookingCountsData() {
  const [rows] = await connection.query('SELECT * FROM seatBookingCountsflight');
  return rows;
} // flight_details_with_seat_availability
export async function getflightdetailswithseatavailabilityData() {
  const [rows] = await connection.query('SELECT * FROM flightdetailswithseatavailability');
  return rows;
} 
export async function getUserByUserName(User_name: string) {
  const [rows] = await connection.query('SELECT * FROM users WHERE User_name = ?', [User_name]);
  return rows;
}
export async function get_starting_seat_ids_with_airplane_model_data() {
  const [rows] = await connection.query('SELECT * FROM starting_seat_ids_with_airplane_model_data');
  return rows;
}
// Define the interface for the expected row structure
interface AirplaneModelRow extends RowDataPacket {
  Airplane_model_ID: number;
}

// Assuming AirplaneModelRow has a structure like this
interface AirplaneModelRow {
  Airplane_model_ID: number;
}

export async function getAirplaneModelIdByAirplaneId(Airplane_ID: number): Promise<number | null> {
  try {
    const [rows] = await connection.query<AirplaneModelRow[]>(`
      SELECT Airplane_model_ID 
      FROM airplane 
      WHERE Airplane_ID = ?
    `, [Airplane_ID]);

    // Return the Airplane_model_ID or null if not found
    return rows.length > 0 ? rows[0].Airplane_model_ID : null;
  } catch (error) {
    console.error('Error fetching Airplane_model_ID from database:', error);
    return null; // Return null in case of any error
  }
}

interface AirplaneModelDataRow extends RowDataPacket {
  Airplane_model_ID: number;
  No_of_Economic_Seats: number;
  No_of_Business_Seats: number;
  No_of_Platinum_Seats: number;
  Starting_Index_Of_Economic_Seats: number;
  Starting_Index_Of_Business_Seats: number;
  Starting_Index_Of_Platinum_Seats: number;
}

interface AirplaneModelDataRow {
  Airplane_model_ID: number;
  No_of_Economic_Seats: number;
  No_of_Business_Seats: number;
  No_of_Platinum_Seats: number;
  Starting_Index_Of_Economic_Seats: number;
  Starting_Index_Of_Business_Seats: number;
  Starting_Index_Of_Platinum_Seats: number;
}

export async function getAirplaneModelDataAirplaneModelId(Airplane_model_ID: number): Promise<AirplaneModelDataRow | null> {
  try {
    const [rows] = await connection.query<AirplaneModelDataRow[]>(`
      SELECT * 
      FROM starting_seat_ids_with_airplane_model_data 
      WHERE Airplane_model_ID = ?
    `, [Airplane_model_ID]);

    // Return the entire row of data or null if not found
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching Airplane model data from database:', error);
    return null; // Return null in case of any error
  }
}

// Define the interface for the flight data
interface FlightDataRow extends RowDataPacket {
  Flight_ID: string;
  Airplane_ID: number;
  Origin_airport_id: string;
  Destination_airport_id: string;
  Departure_date: Date;
  Arrival_date: Date;
  Arrival_time: string;
  Departure_time: string;
  Status: 'Scheduled' | 'Delayed' | 'Cancelled';
}

// Function to get flights data by origin, destination airport IDs, and departure date
export async function getFlightsbyAirportIDsAndDate(
  originAirportID: string,
  destinationAirportID: string,
  //departureDate: string
): Promise<FlightDataRow[] | null> {
  try {
    // Query all rows from the flights table based on the origin airport, destination airport, and departure date
    const [rows] = await connection.query<FlightDataRow[]>(`
      SELECT Flight_ID, Airplane_ID, Origin_airport_id, Destination_airport_id, 
             Departure_date, Arrival_date, Arrival_time, Departure_time, Status
      FROM flights
      WHERE Origin_airport_id = ? 
        AND Destination_airport_id = ? 
    `, [originAirportID, destinationAirportID]); //, departureDate]);

    console.log('Query result:', rows); // Log query result

    // Return the array of flights data or an empty array if no data found
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error('Error fetching flights data from the database:', error);
    return null; // Return null in case of any error
  }
}




// Define the interface for the bookings data, excluding Issue_date
interface BookingsDataRow extends RowDataPacket {
  Booking_ID: string;
  Flight_ID: string;
  User_ID: number;
  Passenger_ID: number;
  Seat_ID: number;
  Travel_Class: 'Economy' | 'Business' | 'Platinum';
  Price: number;
}

// Function to get bookings data by flight ID without Issue_date
export async function getBookingsDataByFlightID(Flight_ID: string): Promise<BookingsDataRow[] | null> {
  try {
    // Query all rows from the bookings table based on the Flight_ID, excluding Issue_date
    const [rows] = await connection.query<BookingsDataRow[]>(`
      SELECT Booking_ID, Flight_ID, User_ID, Passenger_ID, Seat_ID, Travel_Class, Price
      FROM bookings 
      WHERE Flight_ID = ?
    `, [Flight_ID]);
    console.log('Query result:', rows); // Add this line to see what the query returns

    // Return the array of bookings data or an empty array if no data found
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error('Error fetching bookings data from database:', error);
    return null; // Return null in case of any error
  }
}

// Define the interface for the user data we want to fetch
interface UserDataRow extends RowDataPacket {
  User_name: string;
  Email: string;
  Password: string; // Hashed password
}

// Function to get usernames and passwords of all users
export async function getUserNamesAndPasswordsOfUsers(): Promise<UserDataRow[] | null> {
  try {
    // Query to fetch User_name, Email, and Password from the users table
    const [rows] = await connection.query<UserDataRow[]>(`
      SELECT User_name, Email, Password
      FROM users
    `);

    console.log('Fetched user data:', rows); // Log the fetched data for debugging

    // Return the array of user data or an empty array if no data found
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error('Error fetching user data from database:', error);
    return null; // Return null in case of any error
  }
}


// Define the interface for the user data we want to fetch
interface UserDataRow extends RowDataPacket {
  User_name: string;
  Email: string;
  User_ID: number;
}

// Function to get usernames, emails, and user IDs of all users
export async function getUserNamesAndEmails(): Promise<UserDataRow[] | null> {
  try {
    // Query to fetch User_name, Email, and User_ID from the users table
    const [rows] = await connection.query<UserDataRow[]>(`
      SELECT User_name, Email, User_ID
      FROM users
    `);

    console.log('Fetched user data:', rows); // Log the fetched data for debugging

    // Return the array of user data or an empty array if no data is found
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error('Error fetching user data from database:', error);
    return null; // Return null in case of any error
  }
}


// Define the interface for the bookings data, excluding Issue_date
interface FlightswithbookedseatsandtotalseatsRow extends RowDataPacket {
  total_bookings: number;
  total_seats: number;
}

// Function to get bookings data by flight ID without Issue_date
export async function getFlightswithbookedseatsandtotalseats(Flight_ID: string): Promise<FlightswithbookedseatsandtotalseatsRow[] | null> {
  try {
    // Query all rows from the bookings table based on the Flight_ID, excluding Issue_date
    const [rows] = await connection.query<FlightswithbookedseatsandtotalseatsRow[]>(`
      SELECT total_bookings,total_seats
      FROM flightswithbookedseatsandtotalseatsRow 
      WHERE Flight_ID = ?
    `, [Flight_ID]);
    console.log('Query result:', rows); // Add this line to see what the query returns

    // Return the array of bookings data or an empty array if no data found
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error('Error fetching seats data from database:', error);
    return null; // Return null in case of any error
  }
}






export async function updateFlightData(
    flightId: string,
    newData: {
      Airplane_ID: number;
      Origin_airport_id: string;
      Destination_airport_id: string;
      Departure_date: string;
      Arrival_date: string;
      Arrival_time: string;
      Departure_time: string;
      Status: string;
    }
  ) {
    const { 
      Airplane_ID, 
      Origin_airport_id, 
      Destination_airport_id, 
      Departure_date, 
      Arrival_date, 
      Arrival_time, 
      Departure_time, 
      Status 
    } = newData;
  
    await connection.query(
      'UPDATE flights SET Airplane_ID = ?, Origin_airport_id = ?, Destination_airport_id = ?, Departure_date = ?, Arrival_date = ?, Arrival_time = ?, Departure_time = ?, Status = ? WHERE Flight_ID = ?',
      [Airplane_ID, Origin_airport_id, Destination_airport_id, Departure_date, Arrival_date, Arrival_time, Departure_time, Status, flightId]
    );
  }
  export async function updateAirplaneData(
    airplaneId: number,
    newData: {
      Airplane_model_ID: number;
    }
  ) {
    const { Airplane_model_ID } = newData;
  
    await connection.query(
      'UPDATE airplane SET Airplane_model_ID = ? WHERE Airplane_ID = ?',
      [Airplane_model_ID, airplaneId]
    );
  }
  export async function updateAirplaneModelData(
    airplaneModelid: number,
    newData: {
      Model_name: string;
      No_of_Economic_Seats: number;
      No_of_Business_Seats: number;
      No_of_Platinum_Seats: number;
    }
  ) {
    const { Model_name, No_of_Economic_Seats, No_of_Business_Seats, No_of_Platinum_Seats } = newData;
    
    await connection.query(
      'UPDATE airplane_model SET Model_name = ?, No_of_Economic_Seats = ?, No_of_Business_Seats = ?, No_of_Platinum_Seats = ? WHERE Airplane_model_ID = ?',
      [Model_name, No_of_Economic_Seats, No_of_Business_Seats, No_of_Platinum_Seats, airplaneModelid]
    );
  }
  export async function updateAirportData(
    airportid: string,
    newData: {
      Airport_code: string;
      Airport_name: string;
      City: string;
      State: string;
      Country: string;
    }
  ) {
    const { Airport_code, Airport_name, City, State, Country } = newData;
    
    await connection.query(
      'UPDATE airports SET Airport_code = ?, Airport_name = ?, City = ?, State = ?, Country = ? WHERE Airport_ID = ?',
      [Airport_code, Airport_name, City, State, Country, airportid]
    );
  }

  // export async function updateBookingsData(
  //   Booking_ID: string, 
  //   newData: { 
  //   Flight_ID: string; 
  //   User_ID: number; 
  //   Passenger_ID: number; 
  //   Seat_ID: number; 
  //   Travel_Class: 'Economy' | 'Business' | 'Platinum'; 
  //   Issue_date: Date; 
  //   Price: number; 
  // }) {
  //   const { 
  //     Flight_ID, 
  //     User_ID, 
  //     Passenger_ID, 
  //     Seat_ID, 
  //     Travel_Class, 
  //     Issue_date, 
  //     Price 
  //   } = newData;
    
  //   await connection.query(
  //     'INSERT INTO bookings (Booking_ID, Flight_ID, User_ID, Passenger_ID, Seat_ID, Travel_Class, Issue_date, Price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  //     [Booking_ID, Flight_ID, User_ID, Passenger_ID, Seat_ID, Travel_Class, Issue_date, Price]
  //   );
  // }

  export async function updateBookingsData(
    Booking_ID: string,  // Ensure Booking_ID is correctly passed
    newData: { 
      Flight_ID: string; 
      User_ID: number; 
      Passenger_ID: number; 
      Seat_ID: number; 
      Travel_Class: 'Economy' | 'Business' | 'Platinum'; 
      Issue_date: Date; 
      Price: number; 
    }) {
    const { 
      Flight_ID, 
      User_ID, 
      Passenger_ID, 
      Seat_ID, 
      Travel_Class, 
      Issue_date, 
      Price 
    } = newData;
  
    // Ensure Booking_ID is not null and passed correctly
    if (!Booking_ID) {
      throw new Error('Booking_ID cannot be null');
    }
    
    await connection.query(
      'INSERT INTO bookings (Booking_ID, Flight_ID, User_ID, Passenger_ID, Seat_ID, Travel_Class, Issue_date, Price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [Booking_ID, Flight_ID, User_ID, Passenger_ID, Seat_ID, Travel_Class, Issue_date, Price]
    );
  }
  

  export async function createUser(
    User_ID: string, 
    newData: { 
      User_type: string; 
      User_name: string; 
      First_name: string; 
      Last_name: string; 
      date_of_birth: Date;
      Country: string; 
      NIC_code: string; 
      Gender: 'Male' | 'Female' | 'Other';
      Email: string;
      Membership_Type : 'Guest'| 'Normal' | 'Frequent' | 'Gold';
      No_of_booking: number;
      Password: string;
  }) {
    const { 
      User_type, 
      User_name,
      First_name,
      Last_name,
      date_of_birth,
      Country,
      NIC_code,
      Gender,
      Email,
      Membership_Type,
      No_of_booking,
      Password
    } = newData;
    
    await connection.query(
      'INSERT INTO users (User_ID, User_type, User_name, First_name, Last_name, date_of_birth, Country, NIC_code, Gender, Email, Membership_Type , No_of_booking, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [User_ID, User_type, User_name, First_name, Last_name, date_of_birth, Country, NIC_code, Gender, Email, Membership_Type, No_of_booking , Password]
    );
  }
  export async function updateSeatsData(seatid: number, newData: { 
    Airplane_ID: number; 
    Class: number; 
    Availability: 'Available' | 'Unavailable'; 
  }) {
    const { 
      Airplane_ID, 
      Class, 
      Availability 
    } = newData;
    
    await connection.query(
      'UPDATE seats SET Airplane_ID = ?, Class = ?, Availability = ? WHERE Seat_ID = ?', 
      [Airplane_ID, Class, Availability, seatid]
    );
  }
  
  export async function updateUserData(
    Userid: number,
    newData: {
      User_type: string;
      User_name: string;
      First_name: string;
      Last_name: string;
      date_of_birth: string; // Assuming the date is in 'YYYY-MM-DD' format
      Country: string;
      NIC_code: string;
      Gender: 'Male' | 'Female' | 'Other';
      Email: string;
      Membership_Type: 'Guest' | 'Normal' | 'Premium';
      No_of_booking: number;
      Password: string;
    }
  ) {
    const {
      User_type,User_name,First_name,Last_name,date_of_birth,Country,NIC_code,Gender,Email,Membership_Type,No_of_booking,Password,
    } = newData;
  
    await connection.query(
      `UPDATE users 
       SET User_type = ?, User_name = ?, First_name = ?, Last_name = ?, date_of_birth = ?, Country = ?, NIC_code = ?, Gender = ?, Email = ?, Membership_Type = ?, No_of_booking = ?, Password = ? 
       WHERE User_ID = ?`,
      [
        User_type,User_name,First_name,Last_name,date_of_birth,Country,NIC_code,Gender,Email, Membership_Type, No_of_booking,Password,Userid,
      ]
    );
  }

  export async function getTotalPassengerCount(): Promise<number> {
    const [rows] = await connection.query('SELECT COUNT(*) AS passengerCount FROM passengers');
    const passengerCount = (rows as any)[0]?.passengerCount || 0;
    return passengerCount;
  }
  export async function getTotalUsersCount(): Promise<number> {
    const [rows] = await connection.query('SELECT COUNT(*) AS userCount FROM users');
    const userCount = (rows as any)[0]?.userCount || 0;
    return userCount;
  }
  export async function getLastPassengerID(): Promise<string | null> {
    const [rows]: [any[], any] = await connection.query('SELECT Passenger_ID FROM passengers ORDER BY Passenger_ID DESC LIMIT 1');
    return rows.length > 0 ? rows[0].Passenger_ID : null;
  }
  export async function getLastUserID(): Promise<string | null> {
    const [rows]: [any[], any] = await connection.query('SELECT User_ID FROM users ORDER BY User_ID DESC LIMIT 1');
    return rows.length > 0 ? rows[0].User_ID : null;
  }
  
  export async function createPassenger( 
    Passenger_ID: number,
    newData: {
      Name: string;
      Age: Number;
      Gender: 'Male' | 'Female' | 'Other';
      Flight_ID: string;
    }) {
      const {
        Name,
        Age,
        Gender,
        Flight_ID
      } = newData
    
    await connection.query(
      'INSERT INTO passengers (Passenger_ID,Name,Age,Gender,Flight_ID) VALUES (?,?,?,?,?)',
      [Passenger_ID,Name,Age,Gender,Flight_ID]
    );
  }

  
  
// export async function updateFlxightsData(id: number, newData: { name: string; quantity_in_stock: number; }) {
//   const { name, quantity_in_stock } = newData;
//   await connection.query('UPDATE products SET name = ?, quantity_in_stock = ? WHERE product_id = ?', [name, quantity_in_stock, id]);
// }
  

  
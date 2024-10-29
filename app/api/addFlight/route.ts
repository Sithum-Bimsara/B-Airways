import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      Airplane_ID,
      Route_ID,
      Departure_date,
      Arrival_date,
      Departure_time,
      Arrival_time,
      Economy_Price,
      Business_Price,
      Platinum_Price
    } = data;

    // Validate required fields
    if (
      !Airplane_ID ||
      !Route_ID ||
      !Departure_date ||
      !Arrival_date ||
      !Departure_time ||
      !Arrival_time ||
      !Economy_Price ||
      !Business_Price ||
      !Platinum_Price
    ) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Call the AddFlight stored procedure
    const query = 'CALL AddFlight(?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      Airplane_ID,
      Route_ID,
      Departure_date,
      Arrival_date,
      Departure_time,
      Arrival_time,
      Economy_Price,
      Business_Price,
      Platinum_Price
    ];

    const [results]: any = await connection.query(query, values);

    // Assuming the stored procedure does not return a new Flight_ID
    return NextResponse.json({ message: 'Flight added successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Error adding flight:', error);
    return NextResponse.json({ 
      message: error.sqlMessage || 'Error adding flight.'
    }, { status: 500 });
  }
}
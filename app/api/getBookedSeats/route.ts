import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request: Request) {
  try {
    const { flightId } = await request.json();

    if (!flightId) {
      return NextResponse.json({ message: 'Flight ID is required.' }, { status: 400 });
    }

    // Call the stored procedure
    const query = `CALL GetBookedSeats(?);`;
    const values = [flightId];

    const [results]: any = await connection.query(query, values);

    // Check if results[0] exists and has at least one row
    if (!results[0] || results[0].length === 0) {
      return NextResponse.json({ message: `No data found for the given Flight ID: ${flightId}` }, { status: 404 });
    }

    const modelId = results[0][0].Airplane_model_ID;
    let bookedSeats = [];

    if (results[0][0].Booked_Seat_Numbers !== '0') {
      bookedSeats = results[0][0].Booked_Seat_Numbers.split(',');
    }

    console.log('Data received:', { modelId, bookedSeats });
    return NextResponse.json({ modelId, bookedSeats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    return NextResponse.json({ message: 'Error fetching booked seats.' }, { status: 500 });
  }
}
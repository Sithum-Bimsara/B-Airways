import { NextResponse } from 'next/server';
import { connection } from '../../../database/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const Flight_ID = url.searchParams.get('Flight_ID');

  if (!Flight_ID) {
    return NextResponse.json(
      { message: 'Flight_ID is required.' },
      { status: 400 }
    );
  }

  try {
    const [flightData] = await connection.query(
      'SELECT Status, Departure_time FROM Flight WHERE Flight_ID = ?',
      [Flight_ID]
    );

    if ((flightData as any[]).length === 0) {
      return NextResponse.json({ message: 'Flight not found.' }, { status: 404 });
    }

    const flight = flightData[0];
    return NextResponse.json({
      Status: flight.Status,
      Departure_time: flight.Departure_time
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching flight details:', error);
    return NextResponse.json(
      { message: 'Error fetching flight details.' },
      { status: 500 }
    );
  }
} 
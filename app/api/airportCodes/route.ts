import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function GET() {
  try {
    const [originCodes] = await connection.query('SELECT DISTINCT Origin_airport_code FROM route');
    const [destinationCodes] = await connection.query('SELECT DISTINCT Destination_airport_code FROM route');

    return NextResponse.json({
      originCodes: (originCodes as any[]).map((row) => row.Origin_airport_code),
      destinationCodes: (destinationCodes as any[]).map((row) => row.Destination_airport_code)
    });
  } catch (error) {
    console.error('Error fetching airport codes:', error);
    return NextResponse.json({ error: 'Error fetching airport codes' }, { status: 500 });
  }
}
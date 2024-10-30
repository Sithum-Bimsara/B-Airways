import { NextRequest, NextResponse } from 'next/server';
import { connection } from '../../../database/db';

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.searchParams.get('origin');
    const destination = request.nextUrl.searchParams.get('destination');

    if (!origin || !destination) {
      return NextResponse.json({ message: 'Origin and destination are required.' }, { status: 400 });
    }

    const [results]: any = await connection.query('CALL GetAllPastFlightsAndPassengerCountByOriginAndDestination(?, ?)', [
      origin,
      destination
    ]);

    console.log('Past flights results:', results);

    return NextResponse.json({ pastFlights: results[0] });
  } catch (error: any) {
    console.error('Error fetching past flights:', error);
    return NextResponse.json({ message: 'Error fetching past flights.' }, { status: 500 });
  }
}
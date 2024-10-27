import { NextRequest, NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function GET(request: NextRequest) {
  try {
    const destination = request.nextUrl.searchParams.get('destination');
    const fromDate = request.nextUrl.searchParams.get('fromDate');
    const toDate = request.nextUrl.searchParams.get('toDate');

    if (!destination || !fromDate || !toDate) {
      return NextResponse.json({ message: 'Destination, fromDate, and toDate are required.' }, { status: 400 });
    }

    const [results]: any = await connection.query('CALL GetPassengerCountByDateRangeAndDestinationName(?, ?, ?)', [
      destination,
      fromDate,
      toDate
    ]);

    const passengerCount = results[0][0]?.PassengerCount || 0;

    console.log('Query results:', passengerCount);

    return NextResponse.json({ count: passengerCount });
  } catch (error: any) {
    console.error('Error fetching passenger count:', error);
    return NextResponse.json({ message: 'Error fetching passenger count.' }, { status: 500 });
  }
}
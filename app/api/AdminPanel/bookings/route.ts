import { NextRequest, NextResponse } from 'next/server';
import { connection } from '../../../database/db';

export async function GET(request: NextRequest) {
  try {
    const fromDate = request.nextUrl.searchParams.get('fromDate');
    const toDate = request.nextUrl.searchParams.get('toDate');

    if (!fromDate || !toDate) {
      return NextResponse.json({ message: 'fromDate and toDate are required.' }, { status: 400 });
    }

    const [results]: any = await connection.query('CALL GetBookingsByDateRangePassengerType(?, ?)', [
      fromDate,
      toDate
    ]);

    console.log('Booking counts results:', results[0]);

    return NextResponse.json({ bookingCounts: results[0] });
  } catch (error: any) {
    console.error('Error fetching booking counts:', error);
    return NextResponse.json({ message: 'Error fetching booking counts.' }, { status: 500 });
  }
}
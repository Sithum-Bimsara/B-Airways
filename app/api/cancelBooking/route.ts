import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ message: 'Booking ID is required.' }, { status: 400 });
    }

    // Delete the booking record
    const [result] = await connection.execute(
      'DELETE FROM booking WHERE Booking_ID = ?',
      [bookingId]
    );

    return NextResponse.json({ message: 'Booking cancelled successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ message: 'Failed to cancel booking' }, { status: 500 });
  }
} 
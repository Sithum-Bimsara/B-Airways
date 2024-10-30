import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request) {
  try {
    const { bookingIds } = await request.json();

    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid booking IDs provided' },
        { status: 400 }
      );
    }

    // Update booking status to 'booked' for all provided booking IDs
    const placeholders = bookingIds.map(() => '?').join(',');
    const query = `
      UPDATE Booking 
      SET status = 'booked' 
      WHERE Booking_ID IN (${placeholders})
    `;

    await connection.query(query, bookingIds);

    return NextResponse.json({ 
      message: 'Booking status updated successfully',
      updatedBookings: bookingIds 
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
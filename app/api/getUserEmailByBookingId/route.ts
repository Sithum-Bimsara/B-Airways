import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { message: 'Booking ID is required.' },
        { status: 400 }
      );
    }

    // Query to get the user's email based on BookingID
    const [result] = await connection.query(
      `
      SELECT u.Email 
      FROM Booking b
      JOIN User u ON b.User_ID = u.User_ID
      WHERE b.Booking_ID = ?
      LIMIT 1;
      `,
      [bookingId]
    );

    if (!result[0]) {
      return NextResponse.json(
        { message: 'No user found for the provided Booking ID.' },
        { status: 404 }
      );
    }

    const userEmail = result[0].Email;

    return NextResponse.json({ email: userEmail }, { status: 200 });
  } catch (error: any) {
    console.error('Error retrieving user email:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve user email.' },
      { status: 500 }
    );
  }
}
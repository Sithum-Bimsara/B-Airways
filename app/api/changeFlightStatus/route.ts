import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request: Request) {
  try {
    const { Flight_ID, newStatus } = await request.json();

    // Validate required fields
    if (!Flight_ID || !newStatus) {
      return NextResponse.json(
        { message: 'Flight_ID and newStatus are required.' },
        { status: 400 }
      );
    }

    // Validate newStatus
    const validStatuses = ['Scheduled', 'Delayed', 'Cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}.` },
        { status: 400 }
      );
    }

    // Check if the flight exists
    const [flightExists] = await connection.query(
      'SELECT * FROM Flight WHERE Flight_ID = ?',
      [Flight_ID]
    );

    if ((flightExists as any[]).length === 0) {
      return NextResponse.json({ message: 'Flight not found.' }, { status: 404 });
    }

    // Update the flight status
    const [updateResult] = await connection.query(
      'UPDATE Flight SET Status = ? WHERE Flight_ID = ?',
      [newStatus, Flight_ID]
    );

    return NextResponse.json(
      { message: 'Flight status updated successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating flight status:', error);
    return NextResponse.json(
      { message: 'Error updating flight status.' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request: Request) {
  try {
    const { flightId, userId, passengerData } = await request.json();

    if (!flightId || !passengerData || !Array.isArray(passengerData)) {
      return NextResponse.json({ message: 'Invalid request data.' }, { status: 400 });
    }

    // Process each passenger booking
    const bookingResults = [];
    const successfulBookings = [];
    const failedBookings = [];

    for (const passenger of passengerData) {
      try {
        // Call the CreateBooking stored procedure for each passenger
        const [results]: any = await connection.execute(
          'CALL CreateBooking(?, ?, ?, ?, ?)',
          [
            flightId,
            userId || '',
            passenger.Passenger_ID,
            passenger.Seat,
            passenger.price
          ]
        );

        // Get the booking ID from the procedure result
        const bookingId = results[0][0].Booking_ID;
        
        successfulBookings.push({
          ...passenger,
          bookingId
        });
        
        bookingResults.push({
          passengerId: passenger.Passenger_ID,
          success: true,
          message: 'Booking created successfully',
          bookingId
        });
      } catch (error: any) {
        const errorMessage = error.message.includes('already booked') 
          ? `Seat ${passenger.Seat} is already taken`
          : 'Booking failed';

        failedBookings.push({
          ...passenger,
          errorMessage
        });
        
        bookingResults.push({
          passengerId: passenger.Passenger_ID,
          success: false,
          error: errorMessage
        });
      }
    }

    // If there are any failed bookings, return partial success response
    if (failedBookings.length > 0) {
      return NextResponse.json({ 
        message: 'Some bookings failed', 
        results: bookingResults,
        successfulBookings,
        failedBookings,
        partialSuccess: true
      }, { status: 207 }); // Using 207 Multi-Status for partial success
    }

    return NextResponse.json({ 
      message: 'All bookings created successfully', 
      results: bookingResults,
      successfulBookings
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing bookings:', error);
    return NextResponse.json({ message: 'Error processing bookings.' }, { status: 500 });
  }
}
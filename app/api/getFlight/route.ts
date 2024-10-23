import { NextResponse } from 'next/server';
import { connection } from '../../../app/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const route = searchParams.get('route');
    const date = searchParams.get('date');

    if (!route || !date) {
      return NextResponse.json({ error: 'Route and date are required' }, { status: 400 });
    }

    const [result] = await connection.query('CALL GetAvailableFlights(?, ?)', [route, date]);

    // Assuming the stored procedure returns the flight data in the expected format
    const flights = result[0];

    return NextResponse.json({
      flights: flights.map((flight: any) => ({
        flightId: flight.Flight_ID,
        airplaneId: flight.Airplane_ID,
        routeId: flight.Route_ID,
        departureDate: flight.Departure_date,
        arrivalDate: flight.Arrival_date,
        arrivalTime: flight.Arrival_time,
        departureTime: flight.Departure_time,
        status: flight.Status
      }))
    });
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json({ error: 'Error fetching flights' }, { status: 500 });
  }
}
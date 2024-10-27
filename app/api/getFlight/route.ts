import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const route = searchParams.get('route');
    const date = searchParams.get('date');

    if (!route || !date) {
      return NextResponse.json({ error: 'Route and date are required' }, { status: 400 });
    }

    const [flightResult] = await connection.query('CALL GetAvailableFlights(?, ?)', [route, date]);

    // Assuming the stored procedure returns the flight data in the expected format
    const flights = flightResult[0];

    const flightsWithPricingAndSeats = await Promise.all(flights.map(async (flight: any) => {
      const [pricingResult] = await connection.query('SELECT Travel_Class, Price FROM Flight_Pricing WHERE Flight_ID = ?', [flight.Flight_ID]);
      const pricing = (pricingResult as any[]).reduce((acc: any, price: any) => {
        acc[price.Travel_Class.toLowerCase()] = price.Price;
        return acc;
      }, {});

      // Get available seats for the flight
      const [availableSeatsResult] = await connection.query('CALL GetAvailableSeats(?)', [flight.Flight_ID]);
      const availableSeats = availableSeatsResult[0][0].Available_Seats;
      // Convert UTC dates to Sri Lanka timezone (UTC+5:30)
      const departureInSL = new Date(flight.Departure_date.getTime() + (5.5 * 60 * 60 * 1000));
      const arrivalInSL = new Date(flight.Arrival_date.getTime() + (5.5 * 60 * 60 * 1000));

      // Extract only the date part from the datetime in SL timezone
      const departureDate = departureInSL.toISOString().split('T')[0];
      const arrivalDate = arrivalInSL.toISOString().split('T')[0];

      return {
        flightId: flight.Flight_ID,
        airplaneId: flight.Airplane_ID,
        routeId: flight.Route_ID,
        departureDate: departureDate,
        arrivalDate: arrivalDate,
        arrivalTime: flight.Arrival_time,
        departureTime: flight.Departure_time,
        status: flight.Status,
        pricing: pricing,
        availableSeats: availableSeats
      };
    }));
    
    console.log('Flight data:', JSON.stringify(flightsWithPricingAndSeats, null, 2));
    return NextResponse.json({ flights: flightsWithPricingAndSeats });
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json({ error: 'Error fetching flights' }, { status: 500 });
  }
}
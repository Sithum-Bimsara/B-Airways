import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const flightId = searchParams.get('flightId');

    if (!flightId) {
      return NextResponse.json({ error: 'Flight ID is required' }, { status: 400 });
    }

    // Fetch flight details including origin and destination airports
    const [flightDetailsResult] = await connection.query(`
      SELECT 
        a_origin.Airport_code AS Origin_Airport, 
        a_dest.Airport_code AS Destination_Airport,
        f.Departure_date,
        f.Arrival_date
      FROM Flight f
      JOIN Route r ON f.Route_ID = r.Route_ID
      JOIN Airport a_origin ON r.Origin_airport_code = a_origin.Airport_code
      JOIN Airport a_dest ON r.Destination_airport_code = a_dest.Airport_code
      WHERE f.Flight_ID = ?
    `, [flightId]);

    if (!flightDetailsResult || !Array.isArray(flightDetailsResult) || flightDetailsResult.length === 0) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    const flightDetails = flightDetailsResult[0] as any;

    // Convert UTC dates to Sri Lanka timezone (UTC+5:30)
    const departureInSL = new Date(flightDetails.Departure_date.getTime() + (5.5 * 60 * 60 * 1000));
    const arrivalInSL = new Date(flightDetails.Arrival_date.getTime() + (5.5 * 60 * 60 * 1000));

    const flightData = {
      originAirport: flightDetails.Origin_Airport,
      destinationAirport: flightDetails.Destination_Airport,
      departureDate: departureInSL.toISOString().split('T')[0],
      arrivalDate: arrivalInSL.toISOString().split('T')[0],
    };
    
    console.log('Flight data:', JSON.stringify(flightData, null, 2));
    return NextResponse.json({ flight: flightData });
  } catch (error) {
    console.error('Error fetching flight details:', error);
    return NextResponse.json({ error: 'Error fetching flight details' }, { status: 500 });
  }
}
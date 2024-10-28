import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function GET() {
  try {
    const [originCodes] = await connection.query(`
      SELECT DISTINCT r.Origin_airport_code, a.Airport_name as origin_name 
      FROM route r
      JOIN airport a ON r.Origin_airport_code = a.Airport_code
    `);

    const [destinationCodes] = await connection.query(`
      SELECT DISTINCT r.Destination_airport_code, a.Airport_name as destination_name
      FROM route r 
      JOIN airport a ON r.Destination_airport_code = a.Airport_code
    `);

    return NextResponse.json({
      originCodes: (originCodes as any[]).map((row) => ({
        code: row.Origin_airport_code,
        name: row.origin_name
      })),
      destinationCodes: (destinationCodes as any[]).map((row) => ({
        code: row.Destination_airport_code,
        name: row.destination_name
      }))
    });
  } catch (error) {
    console.error('Error fetching airport codes:', error);
    return NextResponse.json({ error: 'Error fetching airport codes' }, { status: 500 });
  }
}
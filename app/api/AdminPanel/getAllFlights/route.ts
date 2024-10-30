import { NextResponse } from 'next/server';
import { connection } from '../../../database/db';

export async function GET() {
  try {
    const [flights] = await connection.query(`
      SELECT Flight_ID
      FROM flight
      ORDER BY Flight_ID ASC
    `);

    return NextResponse.json({ flights }, { status: 200 });
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json({ message: 'Error fetching flights.' }, { status: 500 });
  }
}
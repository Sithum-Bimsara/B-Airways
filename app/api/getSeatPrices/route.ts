import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request: Request) {
  try {
    const { flightId } = await request.json();

    // Replace with your actual query to fetch prices
    const [rows] = await connection.execute(
      'SELECT Travel_Class, Price FROM Flight_Pricing WHERE Flight_ID = ?',
      [flightId]
    );
    const prices: { [key: string]: number } = {};
    if (Array.isArray(rows)) {
      rows.forEach((row: any) => {
        prices[row.Travel_Class] = row.Price;
      });
    }

    return NextResponse.json({ prices }, { status: 200 });
  } catch (error) {
    console.error('Error fetching seat prices:', error);
    return NextResponse.json({ message: 'Error fetching seat prices.' }, { status: 500 });
  }
}
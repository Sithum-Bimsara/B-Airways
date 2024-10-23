import { NextResponse } from 'next/server';
import { connection } from '../../../app/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');

    if (!origin || !destination) {
      return NextResponse.json({ error: 'Origin and destination are required' }, { status: 400 });
    }

    const [result] = await connection.query('CALL GetRouteID(?, ?)', [origin, destination]);

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching route:', error);
    return NextResponse.json({ error: 'Error fetching route' }, { status: 500 });
  }
}
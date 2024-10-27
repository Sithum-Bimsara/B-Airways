import { NextRequest, NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function GET(request: NextRequest) {
  try {
    const flightNo = request.nextUrl.searchParams.get('flightNo');

    if (!flightNo) {
      return NextResponse.json({ message: 'Flight number is required.' }, { status: 400 });
    }

    const [results]: any = await connection.query('CALL GetPassengersByAgeCategory(?)', [flightNo]);

    console.log('Results from GetPassengersByAgeCategory:', results);

    const below18: any[] = [];
    const above18: any[] = [];

    results[0].forEach((p: any) => {
      const passenger = {
        id: p.Passport_Number,
        name: p.Name,
        age: p.Age,
        gender: p.Gender,
        ageCategory: p.AgeCategory
      };
      if (p.AgeCategory === 'Below 18') {
        below18.push(passenger);
      } else {
        above18.push(passenger);
      }
    });

    return NextResponse.json({ below18, above18 });
  } catch (error: any) {
    console.error('Error fetching passengers by age category:', error);
    return NextResponse.json({ message: 'Error fetching passenger details.' }, { status: 500 });
  }
}
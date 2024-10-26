import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { Passport_Number } = data;

    if (!Passport_Number) {
      return NextResponse.json({ message: 'Passport Number is required.' }, { status: 400 });
    }

    // Prepare the SQL query
    const query = `SELECT Passport_Expire_Date, Name, Date_of_birth, Gender FROM Passenger WHERE Passport_Number = ?;`;
    const values = [Passport_Number];

    const [results]: any = await connection.query(query, values);

    if (results.length === 0) {
      return NextResponse.json({ message: 'Passenger not found.' }, { status: 404 });
    }

    const passengerData = results[0];

    // Convert dates to UTC and adjust for timezone offset
    passengerData.Passport_Expire_Date = new Date(passengerData.Passport_Expire_Date.getTime() - (passengerData.Passport_Expire_Date.getTimezoneOffset() * 60000)).toISOString();
    passengerData.Date_of_birth = new Date(passengerData.Date_of_birth.getTime() - (passengerData.Date_of_birth.getTimezoneOffset() * 60000)).toISOString();

    console.log('Received data:', passengerData);
    return NextResponse.json(passengerData, { status: 200 });
  } catch (error) {
    console.error('Error fetching passenger data:', error);
    return NextResponse.json({ message: 'Error fetching passenger data.' }, { status: 500 });
  }
}
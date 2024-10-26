import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { Passport_Number, Passport_Expire_Date, Name, Date_of_birth, Gender } = data;

    if (!Passport_Number || !Passport_Expire_Date || !Name || !Date_of_birth || !Gender) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Prepare the CALL statement
    const query = `CALL AddPassenger(?, ?, ?, ?, ?);`;
    const values = [Passport_Number, Passport_Expire_Date, Name, Date_of_birth, Gender];

    const [results]: any = await connection.query(query, values);

    // The Passenger_ID will be in the first result set
    const Passenger_ID = results[0][0].Passenger_ID;

    return NextResponse.json({ Passenger_ID }, { status: 200 });
  } catch (error) {
    console.error('Error adding passenger:', error);
    return NextResponse.json({ message: 'Error adding passenger.' }, { status: 500 });
  }
}
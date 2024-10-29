import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request: Request) {
  try {
    const { modelId } = await request.json();

    if (!modelId) {
      return NextResponse.json({ message: 'Model ID is required.' }, { status: 400 });
    }

    // Fetch seat counts from the Airplane_model table
    const query = `
      SELECT 
        No_of_Economic_Seats, 
        No_of_Business_Seats, 
        No_of_Platinum_Seats 
      FROM Airplane_model 
      WHERE Airplane_model_ID = ?
    `;
    const values = [modelId];

    const [rows]: any = await connection.query(query, values);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: `No data found for Model ID: ${modelId}` }, { status: 404 });
    }

    const { No_of_Economic_Seats, No_of_Business_Seats, No_of_Platinum_Seats } = rows[0];

    return NextResponse.json({
      Economy: No_of_Economic_Seats,
      Business: No_of_Business_Seats,
      Platinum: No_of_Platinum_Seats
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching model seats:', error);
    return NextResponse.json({ message: 'Error fetching model seats.' }, { status: 500 });
  }
} 
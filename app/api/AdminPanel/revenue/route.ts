import { NextRequest, NextResponse } from 'next/server';
import { connection } from '../../../database/db';

export async function GET(request: NextRequest) {
  try {
    // Fetch all aircraft models
    const [airplaneModels]: any = await connection.query('SELECT Airplane_model_ID, Model_name FROM Airplane_model');

    const revenueData: { model: string; revenue: number }[] = [];

    // Iterate through each model and fetch revenue
    for (const model of airplaneModels) {
      const [revenueResults]: any = await connection.query('SELECT GetRevenueByAircraftModel(?) AS revenue', [
        model.Airplane_model_ID
      ]);
      const revenue = revenueResults[0].revenue || 0;
      revenueData.push({ model: model.Model_name, revenue });
    }

    console.log('Revenue data:', revenueData);

    return NextResponse.json(revenueData);
  } catch (error: any) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json({ message: 'Error fetching revenue data.' }, { status: 500 });
  }
}
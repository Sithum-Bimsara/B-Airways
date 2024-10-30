import { NextRequest, NextResponse } from 'next/server';
import { connection } from '../../../database/db';

export async function GET(request: NextRequest) {
  try {
    // Fetch revenue data directly from the view
    const [revenueData]: any = await connection.query(
      'SELECT Model_name as model, TotalRevenue as revenue FROM AircraftModelRevenueView'
    );

    console.log('Revenue data:', revenueData);

    return NextResponse.json(revenueData);
  } catch (error: any) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json({ message: 'Error fetching revenue data.' }, { status: 500 });
  }
}
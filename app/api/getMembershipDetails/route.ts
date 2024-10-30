import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }

    // Fetch membership details from view
    const [rows] = await connection.execute(
      'SELECT Membership_Type, Discount FROM MemberDiscountView WHERE User_ID = ?',
      [userId]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: 'No membership found for the user.' }, { status: 404 });
    }

    const membershipType = (rows[0] as { Membership_Type: string }).Membership_Type;
    const discount = parseFloat((rows[0] as { Discount: string }).Discount);

    return NextResponse.json({ membershipType, discount }, { status: 200 });
  } catch (error) {
    console.error('Error fetching membership details:', error);
    return NextResponse.json({ message: 'Error fetching membership details.' }, { status: 500 });
  }
}
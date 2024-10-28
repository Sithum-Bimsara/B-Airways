import { NextResponse } from 'next/server';
import { connection } from '../../database/db';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }

    // Fetch Membership_Type from Member_detail
    const [memberRows] = await connection.execute(
      'SELECT Membership_Type FROM Member_detail WHERE User_ID = ?',
      [userId]
    );

    if (!Array.isArray(memberRows) || memberRows.length === 0) {
      return NextResponse.json({ message: 'No membership found for the user.' }, { status: 404 });
    }

    const membershipType = (memberRows[0] as { Membership_Type: string }).Membership_Type;

    // Fetch Discount from Loyalty_detail
    const [loyaltyRows] = await connection.execute(
      'SELECT Discount FROM Loyalty_detail WHERE Membership_Type = ?',
      [membershipType]
    );

    if (!Array.isArray(loyaltyRows) || loyaltyRows.length === 0) {
      return NextResponse.json({ message: 'No discount information found for the membership type.' }, { status: 404 });
    }

    const discount = parseFloat((loyaltyRows[0] as { Discount: string }).Discount);

    return NextResponse.json({ membershipType, discount }, { status: 200 });
  } catch (error) {
    console.error('Error fetching membership details:', error);
    return NextResponse.json({ message: 'Error fetching membership details.' }, { status: 500 });
  }
}
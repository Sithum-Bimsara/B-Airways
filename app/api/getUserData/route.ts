import { NextResponse } from 'next/server';
import { connection } from '../../database/db';
import { verifyToken } from '../../lib/auth';


export async function POST(request: Request) {
  try {
    // Get the token from the request headers
    const cookie = request.headers.get('cookie');
    if (!cookie) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }

    // Extract the token from the cookie
    const token = cookie
      .split(';')
      .find(c => c.trim().startsWith('auth='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }
    // Verify the token and get the user ID
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: 'Invalid token.' }, { status: 401 });
    }



    const [result] = await connection.query(
        `SELECT User_ID, User_name, First_name, Last_name, Date_of_birth, Country, NIC_code, Gender, Email, Role 
         FROM user WHERE User_ID = ?`,
        [decoded.userId]
      );
  
    // Type assertion to cast the result as any[]
    const userData = result as any[];

    // Check if user data was found
    if (userData.length === 0) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Extract the user details
    const user = userData[0];
    
    return NextResponse.json({
      userId: user.User_ID,
      username: user.User_name,
      firstName: user.First_name,
      lastName: user.Last_name,
      dateOfBirth: user.Date_of_birth,
      country: user.Country,
      nicCode: user.NIC_code,
      gender: user.Gender,
      email: user.Email,
      role: user.Role,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { connection } from '../../database/db';
import bcrypt from 'bcrypt';
import { verifyToken } from '../../lib/auth';

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get('cookie');
    if (!cookie) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }

    const token = cookie
      .split(';')
      .find(c => c.trim().startsWith('auth='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token.' }, { status: 401 });
    }

    const data = await request.json();
    const { currentPassword, newPassword } = data;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Retrieve user from database
    const [rows]: any = await connection.execute(
      `SELECT * FROM User WHERE User_ID = ?`,
      [decoded.userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    const user = rows[0];

    // Compare current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.Password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Current password is incorrect.' }, { status: 401 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    await connection.execute(
      `UPDATE User SET Password = ? WHERE User_ID = ?`,
      [hashedPassword, decoded.userId]
    );

    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Error changing password:', error);
    return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
  }
}
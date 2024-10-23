import { NextResponse } from 'next/server';
import { connection } from '../../lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { identifier, password } = data;

    // Validate required fields
    if (!identifier || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Retrieve user by username or email
    const [rows]: any = await connection.execute(
      `SELECT * FROM User WHERE User_name = ? OR Email = ?`,
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    const user = rows[0];

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password.' }, { status: 401 });
    }

    // Authentication successful
    return NextResponse.json({ message: 'Authentication successful.', username: user.User_name }, { status: 200 });
  } catch (error: any) {
    console.error('Error during sign in:', error);
    return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
  }
}
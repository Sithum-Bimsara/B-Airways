import { NextResponse } from 'next/server';
import { connection } from '../../lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      userName,
      firstName,
      lastName,
      dateOfBirth,
      country,
      nicCode,
      gender,
      email,
      password,
    } = data;

    // Validate required fields
    if (
      !userName ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !country ||
      !nicCode ||
      !gender ||
      !email ||
      !password
    ) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Check if user already exists
    const [existingUser]: any = await connection.execute(
      `SELECT * FROM User WHERE User_name = ? OR Email = ?`,
      [userName, email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'User already exists.' }, { status: 409 });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the database
    const [result] = await connection.execute(
      `INSERT INTO User 
      (User_name, First_name, Last_name, Date_of_birth, Country, NIC_code, Gender, Email, Role, Password) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userName,
        firstName,
        lastName,
        dateOfBirth,
        country,
        nicCode,
        gender,
        email,
        'Member',
        hashedPassword,
      ]
    );

    return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
  } catch (error: any) {
    console.error('Error inserting user:', error);
    return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
  }
}
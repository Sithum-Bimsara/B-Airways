import { NextResponse } from 'next/server';
import { removeCookie } from '../../lib/auth';

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ message: 'Signed out successfully.' }, { status: 200 });
    const cookie = removeCookie();
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (error: any) {
    console.error('Error during sign out:', error);
    return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
  }
}